"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { MovementType, MovementReason } from "@prisma/client";

const movementSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  type: z.nativeEnum(MovementType),
  reason: z.nativeEnum(MovementReason),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().max(200).optional().or(z.literal("")),
});

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}


export async function recordMovement(formData: FormData) {
  const userId = await getUserId();

  const parsed = movementSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    reason: formData.get("reason"),
    quantity: formData.get("quantity"),
    note: formData.get("note") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { productId, type, reason, quantity, note } = parsed.data;

  try {
    const result = await db.$transaction(async (tx) => {
      // Verify product belongs to this user
      const product = await tx.product.findFirst({
        where: { id: productId, userId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Compute the new stock value
      let newStock: number;
      if (type === "IN") {
        newStock = product.stock + quantity;
      } else if (type === "OUT") {
        newStock = product.stock - quantity;
        if (newStock < 0) {
          throw new Error(
            `Not enough stock. Available: ${product.stock}, requested: ${quantity}.`
          );
        }
      } else {
        // ADJUSTMENT: quantity is the new absolute stock value
        newStock = quantity;
      }

      // 1. Insert the movement
      await tx.stockMovement.create({
        data: {
          productId,
          type,
          reason,
          quantity,
          note: note || null,
          userId,
        },
      });

      // 2. Update the product's stock
      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      return { newStock };
    });

    revalidatePath("/stock");
    revalidatePath(`/products/view/${productId}`);
    revalidatePath("/products");

    return { success: true, newStock: result.newStock };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Could not record movement.";
    return { error: message };
  }
}

export async function getMovements(filters?: {
  q?: string;
  type?: string;
}) {
  const userId = await getUserId();

  const movements = await db.stockMovement.findMany({
    where: { userId },
    include: {
      product: {
        select: { id: true, name: true, sku: true, unit: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Optional in-memory filter (list is capped at 200 so this is fine)
  let filtered = movements;
  if (filters?.q) {
    const q = filters.q.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.product.name.toLowerCase().includes(q) ||
        m.product.sku.toLowerCase().includes(q)
    );
  }
  if (filters?.type && filters.type !== "all") {
    filtered = filtered.filter((m) => m.type === filters.type);
  }

  return filtered;
}

export async function getMovementsForProduct(productId: string) {
  const userId = await getUserId();
  return db.stockMovement.findMany({
    where: { productId, userId },
    include: {
      customer: { select: { id: true, name: true } },  
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
