import Link from "next/link";
import { Layers3, Plus } from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";
import { CategoryRow } from "./category-row";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await categoriesApi.list();
  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {categories.length} total · {activeCount} active
          </p>
        </div>

        <Link
          href="/categories/add"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Layers3 size={24} className="text-indigo-600" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            No categories yet
          </p>
          <p className="mt-1 max-w-xs text-xs text-slate-400">
            Create your first category — like Electronics, Accessories, or
            Office Supplies.
          </p>
          <Link
            href="/categories/add"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={14} />
            Create category
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}