"use client";

import Link from "next/link";
import { Layers3, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { categoriesApi } from "@/lib/api/categories";

type Props = {
  category: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
  };
};

export function CategoryRow({ category }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/60">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <Layers3 size={16} className="text-indigo-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">
            {category.name}
          </p>

          {category.description && (
            <p className="mt-0.5 max-w-md text-xs text-slate-400">
              {category.description}
            </p>
          )}

          <button
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await categoriesApi.toggleActive(
                  category.id,
                  !category.isActive
                );
              });
            }}
            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all ${
              category.isActive
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            } disabled:opacity-50`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={`/categories/edit/${category.id}`}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          Edit
        </Link>

        <button
          disabled={isPending}
          onClick={() => {
            if (!confirm(`Delete "${category.name}"?`)) return;
            startTransition(async () => {
              await categoriesApi.remove(category.id);
            });
          }}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}