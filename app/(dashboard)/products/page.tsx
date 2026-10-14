import Link from "next/link";
import { AlertTriangle, Boxes, CheckCircle2, Package, Plus } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { ProductsSearch } from "./product-search";
import { ProductRowActions } from "./product-actions";

export const dynamic = "force-dynamic";

type SearchParams = { name?: string; sku?: string; status?: string };

function stockTone(stock: number, reorderLevel: number) {
  if (stock === 0) return "bg-rose-50 text-rose-700";
  if (stock <= reorderLevel) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const nameQ = (params.name ?? "").trim();
  const skuQ = (params.sku ?? "").trim();
  const status = params.status ?? "all";

  const allProducts = await productsApi.list();

  const activeCount = allProducts.filter((p) => p.isActive).length;
  const lowStockCount = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= p.reorderLevel
  ).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  const filtered = allProducts.filter((p) => {
  const matchesName = nameQ
    ? p.name.toLowerCase().includes(nameQ.toLowerCase())
    : true;

  const matchesSku = skuQ
    ? p.sku.toLowerCase().includes(skuQ.toLowerCase())
    : true;

  const matchesStatus =
    status === "all" ||
    (status === "active" && p.isActive) ||
    (status === "inactive" && !p.isActive);

  return matchesName && matchesSku && matchesStatus;
});

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your inventory catalog.
          </p>
        </div>

        <Link
          href="/products/add"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<Package size={19} />}
          iconClass="bg-indigo-50 text-indigo-600"
          label="Total products"
          value={allProducts.length}
          badge="All"
          badgeClass="bg-slate-100 text-slate-500"
        />
        <SummaryCard
          icon={<CheckCircle2 size={19} />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Active"
          value={activeCount}
          badge="Live"
          badgeClass="bg-emerald-50 text-emerald-700"
        />
        <SummaryCard
          icon={<AlertTriangle size={19} />}
          iconClass="bg-amber-50 text-amber-600"
          label="Low stock"
          value={lowStockCount}
          badge="Watch"
          badgeClass="bg-amber-50 text-amber-700"
        />
        <SummaryCard
          icon={<Boxes size={19} />}
          iconClass="bg-rose-50 text-rose-600"
          label="Out of stock"
          value={outOfStockCount}
          badge="Urgent"
          badgeClass="bg-rose-50 text-rose-700"
        />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
       <ProductsSearch name={nameQ} sku={skuQ} status={status} />
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Package size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
            {nameQ || skuQ || status !== "all" ? "No matching products" : "No products yet"}            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {nameQ || skuQ || status !== "all"
                 ? "Try a different search or filter."
                 : "Add your first product to start tracking stock."}
            </p>
            {!nameQ && !skuQ && status === "all" && (
                <Link href="/products/add" >
                    <Plus size={16} />
                    Add product
                </Link>
                )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50/70">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Selling price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Package size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {p.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            SKU: {p.sku}
                            {p.brand ? ` · ${p.brand}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {p.category.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.supplier.name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockTone(
                          p.stock,
                          p.reorderLevel
                        )}`}
                      >
                        {p.stock} {p.unit}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      ₹{Number(p.sellingPrice).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <ProductRowActions
                        id={p.id}
                        name={p.name}
                        isActive={p.isActive}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/view/${p.id}`}
                          aria-label={`View ${p.name}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>

                        <Link
                          href={`/products/edit/${p.id}`}
                          aria-label={`Edit ${p.name}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </Link>

                        <form
                          action={async () => {
                            "use server";
                            const { productsApi } = await import(
                              "@/lib/api/products"
                            );
                            await productsApi.remove(p.id);
                          }}
                        >
                          <button
                            type="submit"
                            aria-label={`Delete ${p.name}`}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
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
        Every product, in its place.
      </p>
    </div>
  );
}

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: number;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}