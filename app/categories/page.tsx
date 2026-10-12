import Link from "next/link";
import { Plus, Tags, Trash2 } from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await categoriesApi.list();

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex items-center justify-between">
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

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Tags size={32} className="text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            No categories yet
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {categories.map((cat:any) => (
              <li
                key={cat.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <Tags size={16} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {cat?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/categories/edit/${cat.id}`}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    Edit
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await categoriesApi.remove(cat.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}