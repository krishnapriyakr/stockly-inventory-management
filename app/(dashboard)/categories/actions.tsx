"use client";

import { useTransition } from "react";
import { categoriesApi } from "@/lib/api/categories";

export function CategoryRowActions({
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
          await categoriesApi.toggleActive(id, !isActive);
        });
      }}
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