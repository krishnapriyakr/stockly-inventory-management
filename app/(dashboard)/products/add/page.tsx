"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Info, Package } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { dropdownsApi } from "@/lib/api/dropdowns";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);
  
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ value: string; label: string }[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const [cats, sups, unitList] = await Promise.all([
        dropdownsApi.categories(),
        dropdownsApi.suppliers(),
        productsApi.units(),
      ]);
      setCategories(cats);
      setSuppliers(sups);
      setUnits(unitList);
      setLoaded(true);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-6 sm:p-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Package size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Create a product
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add a new product to your inventory catalog.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="font-semibold text-slate-900">Product details</h2>
          </div>

          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await productsApi.create(formData);
                if (result?.error) setError(result.error);
                else router.push("/products");
              });
            }}
            className="space-y-6 p-5 sm:p-7"
          >
            <div className="grid grid-cols-1 gap-4 text-black sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Name <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  maxLength={120}
                  required
                  autoFocus
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SKU <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  maxLength={50}
                  required
                  placeholder="e.g. WIRE-MOUSE-001"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Barcode
                  <span className="ml-2 font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  name="barcode"
                  type="text"
                  maxLength={50}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                  <span className="ml-2 font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  name="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  maxLength={60}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category <span className="ml-1 text-rose-500">*</span>
                </label>
                <select
                  name="categoryId"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">Select category…</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Supplier <span className="ml-1 text-rose-500">*</span>
                </label>
                <select
                  name="supplierId"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">Select supplier…</option>
                  {suppliers?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Unit <span className="ml-1 text-rose-500">*</span>
                </label>
                <select
                  name="unit"
                  defaultValue="pcs"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  {units.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cost price (₹) <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="costPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue="0"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Selling price (₹) <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="sellingPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tax rate (%)
                </label>
                <input
                  name="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  defaultValue="0"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reorder level <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="reorderLevel"
                  type="number"
                  min={0}
                  defaultValue="10"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                  <span className="ml-2 font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  maxLength={500}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
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
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Check size={17} />
                {isPending ? "Creating…" : "Create product"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Live preview
              </h3>
            </div>
            <div className="p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Package size={23} />
              </div>
              <h4 className="mt-4 break-words text-lg font-semibold text-slate-900">
                {name.trim() || "Product name"}
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                SKU: {sku.trim() || "—"}
                {brand.trim() ? ` · ${brand.trim()}` : ""}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                ₹{sellingPrice.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Stock is set via Stock Movements
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Info size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Categories and suppliers must exist first
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If the dropdown is empty, add at least one category and one
              supplier before creating a product.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}