"use client";

import { useTransition } from "react";
import { suppliersApi } from "@/lib/api/suppliers";

export function SupplierRowActions({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await suppliersApi.toggleActive(id, !isActive);
        });
      }}
      aria-label={`Toggle ${name} status`}
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
        isActive
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}