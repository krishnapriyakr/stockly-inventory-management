import Link from "next/link";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { productsApi } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const products = await productsApi.list();

  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.reorderLevel
  );

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Inventory Alerts
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Products that need your attention right now.
        </p>
      </div>

      {/* Out of Stock Section */}
      {outOfStock.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle size={16} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Out of Stock</h2>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
              {outOfStock.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outOfStock.map((p) => (
              <Link
                key={p.id}
                href={`/products/view/${p.id}`}
                className="flex items-center justify-between rounded-2xl border border-rose-200 bg-white p-4 shadow-sm transition hover:border-rose-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-rose-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Low Stock Section */}
      {lowStock.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <AlertTriangle size={16} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Low Stock</h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
              {lowStock.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href={`/products/view/${p.id}`}
                className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      Only {p.stock} {p.unit} left (Reorder at {p.reorderLevel})
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-amber-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {outOfStock.length === 0 && lowStock.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Package size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            All stock levels are healthy
          </p>
          <p className="mt-1 text-xs text-slate-400">
            No products are low or out of stock right now.
          </p>
        </div>
      )}
    </div>
  );
}