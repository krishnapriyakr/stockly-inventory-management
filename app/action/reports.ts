"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStartDate } from "@/lib/utils";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getReportsData(range: string = "all") {
  const userId = await getUserId();
  const startDate = getStartDate(range);

  // 1. Get Products (Snapshot of current state)
  const products = await db.product.findMany({
    where: { userId, isActive: true },
    include: { category: { select: { name: true } } },
  });

  // 2. Get Movements (Filtered by date range)
  const whereClause = startDate 
    ? { userId, createdAt: { gte: startDate } } 
    : { userId };

  const movements = await db.stockMovement.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
  });

  // 3. Financial Totals (Current Snapshot)
  let totalCostValue = 0;
  let totalRetailValue = 0;
  let totalTaxPotential = 0;

  const categoryMap: Record<string, { costValue: number; retailValue: number; units: number }> = {};

  for (const p of products) {
    const costValue = p.stock * Number(p.costPrice);
    const retailValue = p.stock * Number(p.sellingPrice);
    const taxAmount = retailValue * (Number(p.taxRate) / 100);

    totalCostValue += costValue;
    totalRetailValue += retailValue;
    totalTaxPotential += taxAmount;

    const catName = p.category.name;
    if (!categoryMap[catName]) categoryMap[catName] = { costValue: 0, retailValue: 0, units: 0 };
    categoryMap[catName].costValue += costValue;
    categoryMap[catName].retailValue += retailValue;
    categoryMap[catName].units += p.stock;
  }

  // 4. Movement Totals (Filtered)
  const totalIn = movements.filter((m) => m.type === "IN").reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements.filter((m) => m.type === "OUT").reduce((sum, m) => sum + m.quantity, 0);

  // 5. Group Movements by Date for Chart
  const trendMap: Record<string, { in: number; out: number }> = {};
  for (const m of movements) {
    const dateStr = m.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (!trendMap[dateStr]) trendMap[dateStr] = { in: 0, out: 0 };
    if (m.type === "IN") trendMap[dateStr].in += m.quantity;
    if (m.type === "OUT") trendMap[dateStr].out += m.quantity;
  }

  const trendData = Object.entries(trendMap).map(([date, data]) => ({
    date,
    in: data.in,
    out: data.out,
  })).slice(-7); // Only show last 7 active days for the chart

  // 6. Dead Stock (60 Days fixed rule)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const recentSales = await db.stockMovement.findMany({
    where: { userId, type: "OUT", reason: "SALE", createdAt: { gte: sixtyDaysAgo } },
    select: { productId: true }
  });
  const soldProductIds = new Set(recentSales.map(m => m.productId));
  
  const deadStock = products
    .filter((p) => p.stock > 0 && !soldProductIds.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      unit: p.unit,
      tiedUpValue: p.stock * Number(p.costPrice),
    }))
    .sort((a, b) => b.tiedUpValue - a.tiedUpValue);

  return {
    totalCostValue,
    totalRetailValue,
    totalTaxPotential,
    totalIn,
    totalOut,
    categoryData: Object.entries(categoryMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.costValue - a.costValue),
    trendData,
    deadStock,
  };
}