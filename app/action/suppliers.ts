"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().min(1, "Email is required").email("Enter a valid email").max(120),
  phone: z.string().min(5, "Phone is required").max(30),
  address: z.string().min(5, "Address is required").max(200),
  contactPerson: z.string().max(60).optional().or(z.literal("")),
  leadTimeDays: z.coerce.number().int().min(0, "Lead time cannot be negative").max(365),
});

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

function parseForm(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    contactPerson: formData.get("contactPerson") ?? "",
    leadTimeDays: formData.get("leadTimeDays") ?? "7",
  };
}

function normalize(data: z.infer<typeof supplierSchema>) {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    contactPerson: data.contactPerson || null,
    leadTimeDays: data.leadTimeDays,
  };
}

export async function createSupplier(formData: FormData) {
  const userId = await getUserId();
  const parsed = supplierSchema.safeParse(parseForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.supplier.create({
      data: { ...normalize(parsed.data), userId },
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a supplier with this name." };
    }
    return { error: "Something went wrong." };
  }

  revalidatePath("/suppliers");
  return { success: true };
}

export async function getSuppliers() {
  const userId = await getUserId();
  return db.supplier.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSupplierById(id: string) {
  const userId = await getUserId();
  return db.supplier.findFirst({ where: { id, userId } });
}

export async function updateSupplier(id: string, formData: FormData) {
  const userId = await getUserId();
  const parsed = supplierSchema.safeParse(parseForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.supplier.update({
      where: { id, userId },
      data: normalize(parsed.data),
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a supplier with this name." };
    }
    return { error: "Could not update supplier." };
  }

  revalidatePath("/suppliers");
  return { success: true };
}

export async function toggleSupplierActive(id: string, isActive: boolean) {
  const userId = await getUserId();

  try {
    await db.supplier.update({
      where: { id, userId },
      data: { isActive },
    });
  } catch {
    return { error: "Could not update status." };
  }

  revalidatePath("/suppliers");
  return { success: true };
}

export async function deleteSupplier(id: string) {
  const userId = await getUserId();

  try {
    await db.supplier.delete({ where: { id, userId } });
  } catch {
    return { error: "Could not delete supplier." };
  }

  revalidatePath("/suppliers");
  return { success: true };
}