"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  FolderPlus,
  Info,
  Package,
  Shapes,
} from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-6 sm:p-8">
      {/* Back link */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to categories
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <FolderPlus size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Create a category
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Give your category a clear name and description so you can organize
            your products more efficiently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Form card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="font-semibold text-slate-900">Category details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the basic information for this category.
            </p>
          </div>

          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await categoriesApi.create(formData);
                if (result?.error) setError(result.error);
                else router.push("/categories");
              });
            }}
            className="space-y-6 p-5 sm:p-7"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category name <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Electronics"
                maxLength={60}
                required
                autoFocus
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Choose a short, recognizable name.
                </p>
                <span className="shrink-0 text-xs text-slate-400">
                  {name.length}/60
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
                <span className="ml-2 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the products that belong in this category..."
                rows={4}
                maxLength={200}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {description.length}/200
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/categories"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
              >
                <Check size={17} />
                {isPending ? "Creating…" : "Create category"}
              </button>
            </div>
          </form>
        </section>

        {/* Sidebar: preview + tip */}
        <aside className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Shapes size={17} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Live preview
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Preview your category details.
              </p>
            </div>

            <div className="p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Package size={23} />
              </div>

              <h4 className="mt-4 break-words text-lg font-semibold text-slate-900">
                {name.trim() || "Category name"}
              </h4>

              <p className="mt-2 min-h-[40px] break-words text-sm leading-5 text-slate-500">
                {description.trim() ||
                  "Your category description will appear here."}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </section>

          {/* <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Info size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              A little tip
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use clear category names such as Electronics, Furniture, or
              Office Supplies. This makes your inventory easier to browse and
              maintain.
            </p>
          </section> */}
        </aside>
      </div>
    </div>
  );
}