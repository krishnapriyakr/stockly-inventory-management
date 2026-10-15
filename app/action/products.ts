"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  sku: z.string().min(1, "SKU is required").max(50),
  barcode: z.string().max(50).optional().or(z.literal("")),
  brand: z.string().max(60).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  unit: z.string().min(1, "Unit is required").max(20),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative"),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
  taxRate: z.coerce.number().min(0).max(100),
  // NOTE: no `stock` field here. Stock changes only through Stock Movements.
  reorderLevel: z.coerce.number().int().min(0),
});

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

function parseForm(formData: FormData) {
  return {
    name: formData.get("name"),
    sku: formData.get("sku"),
    barcode: formData.get("barcode") ?? "",
    brand: formData.get("brand") ?? "",
    description: formData.get("description") ?? "",
    categoryId: formData.get("categoryId"),
    supplierId: formData.get("supplierId"),
    unit: formData.get("unit") ?? "pcs",
    costPrice: formData.get("costPrice") ?? "0",
    sellingPrice: formData.get("sellingPrice") ?? "0",
    taxRate: formData.get("taxRate") ?? "0",
    reorderLevel: formData.get("reorderLevel") ?? "10",
  };
}

function normalize(data: z.infer<typeof productSchema>) {
  return {
    name: data.name,
    sku: data.sku,
    barcode: data.barcode || null,
    brand: data.brand || null,
    description: data.description || null,
    categoryId: data.categoryId,
    supplierId: data.supplierId,
    unit: data.unit,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    taxRate: data.taxRate,
    reorderLevel: data.reorderLevel,
    // stock is intentionally absent — Prisma default 0 on create,
    // and update never touches it.
  };
}

export async function createProduct(formData: FormData) {
  const userId = await getUserId();
  const parsed = productSchema.safeParse(parseForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const [category, supplier] = await Promise.all([
      db.category.findFirst({
        where: { id: parsed.data.categoryId, userId },
      }),
      db.supplier.findFirst({
        where: { id: parsed.data.supplierId, userId },
      }),
    ]);

    if (!category) return { error: "Selected category not found." };
    if (!supplier) return { error: "Selected supplier not found." };

    await db.product.create({
      data: { ...normalize(parsed.data), userId },
      // stock defaults to 0 — every unit arrives via a Stock Movement
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a product with this SKU." };
    }
    return { error: "Something went wrong." };
  }

  revalidatePath("/products");
  return { success: true };
}

export async function getProducts() {
  const userId = await getUserId();
  const products = await db.product.findMany({
    where: { userId },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    ...p,
    costPrice: Number(p.costPrice),
    sellingPrice: Number(p.sellingPrice),
    taxRate: Number(p.taxRate),
  }));
}

export async function getProductById(id: string) {
  const userId = await getUserId();
  const product = await db.product.findFirst({
    where: { id, userId },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  if (!product) return null;

  return {
    ...product,
    costPrice: Number(product.costPrice),
    sellingPrice: Number(product.sellingPrice),
    taxRate: Number(product.taxRate),
  };
}

export async function updateProduct(id: string, formData: FormData) {
  const userId = await getUserId();
  const parsed = productSchema.safeParse(parseForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const [category, supplier] = await Promise.all([
      db.category.findFirst({
        where: { id: parsed.data.categoryId, userId },
      }),
      db.supplier.findFirst({
        where: { id: parsed.data.supplierId, userId },
      }),
    ]);

    if (!category) return { error: "Selected category not found." };
    if (!supplier) return { error: "Selected supplier not found." };

    await db.product.update({
      where: { id, userId },
      data: normalize(parsed.data),
      // stock is never modified here
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a product with this SKU." };
    }
    return { error: "Could not update product." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/view/${id}`);
  return { success: true };
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const userId = await getUserId();

  try {
    await db.product.update({
      where: { id, userId },
      data: { isActive },
    });
  } catch {
    return { error: "Could not update status." };
  }

  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const userId = await getUserId();

  try {
    await db.product.delete({ where: { id, userId } });
  } catch {
    return { error: "Could not delete product." };
  }

  revalidatePath("/products");
  return { success: true };
}