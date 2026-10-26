"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getDashboardStats() {
  const userId = await getUserId();

  const [products, categoriesCount, suppliersCount, recentMovements] =
    await Promise.all([
      db.product.findMany({ where: { userId } }),
      db.category.count({ where: { userId } }),
      db.supplier.count({ where: { userId } }),
      db.stockMovement.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          product: { select: { name: true } },
        },
      }),
    ]);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * Number(p.costPrice),
    0
  );

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.reorderLevel
  ).length;

  const outOfStock = products.filter((p) => p.stock === 0).length;

  const inStock = products.filter((p) => p.stock > p.reorderLevel).length;

  return {
    totalProducts: products.length,
    totalCategories: categoriesCount,
    totalSuppliers: suppliersCount,
    totalStock,
    totalStockValue,
    lowStock,
    outOfStock,
    inStock,
    recentMovements,
  };
}