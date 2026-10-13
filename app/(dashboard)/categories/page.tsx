import Link from "next/link";
import {
  CheckCircle2,
  FolderOpen,
  Layers3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";
import { CategoriesSearch } from "./search";
import { CategoryRowActions } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; status?: string };

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = params.status ?? "all";

  const allCategories = await categoriesApi.list();

  const activeCount = allCategories.filter((c) => c.isActive).length;
  const inactiveCount = allCategories.length - activeCount;

  const filtered = allCategories.filter((cat) => {
    const matchesSearch = q ? cat.name.toLowerCase().includes(q.toLowerCase()) : true;
    const matchesStatus =
      status === "all" ||
      (status === "active" && cat.isActive) ||
      (status === "inactive" && !cat.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize your products into groups.
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

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Layers3 size={19} />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              All
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Total categories
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {allCategories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              Active
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Active categories
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FolderOpen size={19} />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              Inactive
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Inactive categories
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Search + status on one row, half width each */}
        <CategoriesSearch q={q} status={status} />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FolderOpen size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              {q || status !== "all" ? "No matching categories" : "No categories yet"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {q || status !== "all"
                ? "Try a different search or filter."
                : "Create your first category to get started."}
            </p>
            {!q && status === "all" && (
              <Link
                href="/categories/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={16} />
                Create category
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-slate-50/70">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <FolderOpen size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="mt-0.5 max-w-sm truncate text-xs text-slate-500">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <CategoryRowActions
                        id={cat.id}
                        name={cat.name}
                        isActive={cat.isActive}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/categories/edit/${cat.id}`}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        >
                           <Pencil size={16} />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await categoriesApi.remove(cat.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        Organize your stock. Keep your business moving.
      </p>
    </div>
  );
}