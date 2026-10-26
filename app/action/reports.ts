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

  // Get all products with categories
  const products = await db.product.findMany({
    where: { userId, isActive: true },
    include: {
      category: { select: { name: true } },
    },
  });

  // Get movements from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const movements = await db.stockMovement.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  // 1. Calculate Totals
  let totalCostValue = 0;
  let totalRetailValue = 0;
  let totalUnits = 0;

  // 2. Group by Category
  const categoryMap: Record<string, { costValue: number; retailValue: number; units: number }> = {};

  for (const p of products) {
    const costValue = p.stock * Number(p.costPrice);
    const retailValue = p.stock * Number(p.sellingPrice);

    totalCostValue += costValue;
    totalRetailValue += retailValue;
    totalUnits += p.stock;

    const catName = p.category.name;
    if (!categoryMap[catName]) {
      categoryMap[catName] = { costValue: 0, retailValue: 0, units: 0 };
    }
    categoryMap[catName].costValue += costValue;
    categoryMap[catName].retailValue += retailValue;
    categoryMap[catName].units += p.stock;
  }

  // 3. Movement Totals (Last 30 Days)
  const totalIn = movements
    .filter((m) => m.type === "IN")
    .reduce((sum, m) => sum + m.quantity, 0);
  
  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((sum, m) => sum + m.quantity, 0);

  // Convert category map to sorted array
  const categoryData = Object.entries(categoryMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.costValue - a.costValue);

  return {
    totalCostValue,
    totalRetailValue,
    totalUnits,
    totalIn,
    totalOut,
    categoryData,
  };
}