"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getReportsData() {
  const userId = await getUserId();

  // Get all active products
  const products = await db.product.findMany({
    where: { userId, isActive: true },
    include: { category: { select: { name: true } } },
  });

  // Get all movements in the last 60 days (to check for dead stock)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentMovements = await db.stockMovement.findMany({
    where: {
      userId,
      createdAt: { gte: sixtyDaysAgo },
    },
  });

  // 1. Calculate Totals & Taxes
  let totalCostValue = 0;
  let totalRetailValue = 0;
  let totalTaxPotential = 0;
  let totalUnits = 0;

  const categoryMap: Record<string, { costValue: number; retailValue: number; units: number }> = {};

  for (const p of products) {
    const costValue = p.stock * Number(p.costPrice);
    const retailValue = p.stock * Number(p.sellingPrice);
    
    // Tax is calculated on the selling price
    const taxAmount = retailValue * (Number(p.taxRate) / 100);

    totalCostValue += costValue;
    totalRetailValue += retailValue;
    totalTaxPotential += taxAmount;
    totalUnits += p.stock;

    const catName = p.category.name;
    if (!categoryMap[catName]) {
      categoryMap[catName] = { costValue: 0, retailValue: 0, units: 0 };
    }
    categoryMap[catName].costValue += costValue;
    categoryMap[catName].retailValue += retailValue;
    categoryMap[catName].units += p.stock;
  }

  // 2. Movement Totals (Last 30 Days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const last30DaysMovements = recentMovements.filter(m => m.createdAt >= thirtyDaysAgo);
  
  const totalIn = last30DaysMovements.filter((m) => m.type === "IN").reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = last30DaysMovements.filter((m) => m.type === "OUT").reduce((sum, m) => sum + m.quantity, 0);

  // 3. Dead Stock (Products with stock > 0 but NO sales in 60 days)
  const productIdsWithRecentSales = new Set(
    recentMovements
      .filter((m) => m.type === "OUT" && m.reason === "SALE")
      .map((m) => m.productId)
  );

  const deadStock = products
    .filter((p) => p.stock > 0 && !productIdsWithRecentSales.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      unit: p.unit,
      tiedUpValue: p.stock * Number(p.costPrice),
    }))
    .sort((a, b) => b.tiedUpValue - a.tiedUpValue); // Highest value first

  const categoryData = Object.entries(categoryMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.costValue - a.costValue);

  return {
    totalCostValue,
    totalRetailValue,
    totalTaxPotential,
    totalUnits,
    totalIn,
    totalOut,
    categoryData,
    deadStock,
  };
}