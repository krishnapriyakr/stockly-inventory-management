"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}


export async function getCategoryOptions() {
  const userId = await getUserId();
  return db.category.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}


export async function getSupplierOptions() {
  const userId = await getUserId();
  return db.supplier.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}


export async function getProductOptions() {
  const userId = await getUserId();
  return db.product.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCustomerOptions() {
  const userId = await getUserId();
  return db.customer.findMany({
    where: { userId },
    select: { id: true, name: true, phone: true },
    orderBy: { name: "asc" },
  });
}