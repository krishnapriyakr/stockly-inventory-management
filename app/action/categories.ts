"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional().or(z.literal("")),
});

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createCategory(formData: FormData) {
  const userId = await getUserId();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.category.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        userId,
      },
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a category with this name." };
    }
    return { error: "Something went wrong." };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function getCategories() {
  const userId = await getUserId();
  return db.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string) {
  const userId = await getUserId();
  return db.category.findFirst({ where: { id, userId } });
}

export async function updateCategory(id: string, formData: FormData) {
  const userId = await getUserId();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.category.update({
      where: { id, userId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    });
  } catch {
    return { error: "Could not update category." };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const userId = await getUserId();

  try {
    await db.category.update({
      where: { id, userId },
      data: { isActive },
    });
  } catch {
    return { error: "Could not update status." };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const userId = await getUserId();

  try {
    await db.category.delete({ where: { id, userId } });
  } catch {
    return { error: "Could not delete category." };
  }

  revalidatePath("/categories");
  return { success: true };
}