"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getReorderSuggestions() {
  const userId = await getUserId();

  // 1. Get all active products with their supplier (lead time) and movements
  const products = await db.product.findMany({
    where: { userId, isActive: true },
    include: {
      supplier: { select: { name: true, leadTimeDays: true } },
      movements: {
        where: {
          type: "OUT",
          reason: "SALE",
          // Only look at the last 30 days of sales to calculate velocity
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { quantity: true },
      },
    },
  });

  const suggestions = [];

  for (const p of products) {
    // 2. Calculate how many units sold in the last 30 days
    const totalSold = p.movements.reduce((sum, m) => sum + m.quantity, 0);
    const dailyVelocity = totalSold / 30;

    // 3. How many days of stock do we have left?
    const daysOfStockLeft = dailyVelocity > 0 ? p.stock / dailyVelocity : Infinity;

    // 4. When should we order? (Stock left minus supplier lead time)
    const shouldReorder = daysOfStockLeft <= p.supplier.leadTimeDays;

    // 5. How much should we order? (A healthy buffer is Lead Time + 14 days of sales)
    // We subtract current stock to avoid over-ordering
    const targetStock = Math.ceil(dailyVelocity * (p.supplier.leadTimeDays + 14));
    const suggestedOrderQty = Math.max(0, targetStock - p.stock);

    // Only show products that need reordering
    if (shouldReorder && suggestedOrderQty > 0) {
      suggestions.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        unit: p.unit,
        supplierName: p.supplier.name,
        leadTimeDays: p.supplier.leadTimeDays,
        dailyVelocity: Number(dailyVelocity.toFixed(2)),
        daysOfStockLeft: daysOfStockLeft === Infinity ? "∞" : Math.floor(daysOfStockLeft),
        suggestedOrderQty,
      });
    }
  }

  // Sort by most urgent first
  return suggestions.sort((a, b) => Number(a.daysOfStockLeft) - Number(b.daysOfStockLeft));
}