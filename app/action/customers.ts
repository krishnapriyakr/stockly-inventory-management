"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
});

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

function parseForm(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
  };
}

function normalize(data: z.infer<typeof customerSchema>) {
  return {
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
  };
}

export async function createCustomer(formData: FormData) {
  const userId = await getUserId();
  const parsed = customerSchema.safeParse(parseForm(formData));

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.customer.create({
      data: { ...normalize(parsed.data), userId },
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "You already have a customer with this name." };
    }
    return { error: "Something went wrong." };
  }

  revalidatePath("/customers");
  return { success: true };
}

export async function getCustomers() {
  const userId = await getUserId();
  return db.customer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerById(id: string) {
  const userId = await getUserId();
  return db.customer.findFirst({ where: { id, userId } });
}

export async function updateCustomer(id: string, formData: FormData) {
  const userId = await getUserId();
  const parsed = customerSchema.safeParse(parseForm(formData));

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.customer.update({
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
      return { error: "You already have a customer with this name." };
    }
    return { error: "Could not update customer." };
  }

  revalidatePath("/customers");
  return { success: true };
}

export async function deleteCustomer(id: string) {
  const userId = await getUserId();

  try {
    await db.customer.delete({ where: { id, userId } });
  } catch {
    return { error: "Could not delete customer." };
  }

  revalidatePath("/customers");
  return { success: true };
}