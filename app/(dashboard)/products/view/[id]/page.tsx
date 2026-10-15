// app/(dashboard)/products/view/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Boxes, Building2, Clock, Hash, Package, Pencil, Percent, Tag,
} from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { stockMovementsApi } from "@/lib/api/stock-movements";

export const dynamic = "force-dynamic";

function stockTone(stock: number, reorderLevel: number) {
  if (stock === 0) return "bg-rose-50 text-rose-700";
  if (stock <= reorderLevel) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await productsApi.getById(id);

  if (!product) notFound();

const movements = await stockMovementsApi.forProduct(id);
  return (
    <div className="mx-auto max-w-4xl space-y-7 p-6 sm:p-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              SKU: {product?.sku}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockTone(product.stock, product.reorderLevel)}`}>
                {product.stock} {product.unit} in stock
              </span>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/products/edit/${product.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Pencil size={15} />
          Edit product
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={<Tag size={18} />} label="Category" value={product.category.name} />
        <InfoCard icon={<Building2 size={18} />} label="Supplier" value={product.supplier.name} />
        <InfoCard icon={<Hash size={18} />} label="Barcode" value={product.barcode ?? "—"} />
        <InfoCard icon={<Boxes size={18} />} label="Unit" value={product.unit} />
        <InfoCard icon={<Package size={18} />} label="Cost price" value={`₹${Number(product.costPrice).toFixed(2)}`} />
        <InfoCard icon={<Package size={18} />} label="Selling price" value={`₹${Number(product.sellingPrice).toFixed(2)}`} />
        <InfoCard icon={<Percent size={18} />} label="Tax rate" value={`${Number(product.taxRate).toFixed(2)}%`} />
        <InfoCard icon={<Clock size={18} />} label="Reorder level" value={`${product.reorderLevel} ${product.unit}`} />
      </section>

      {product.description && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
            {product.description}
          </p>
        </section>
      )}

      {/* Movement timeline */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-bold text-slate-900">Movement timeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            Every change to this product's stock.
          </p>
        </div>

          {movements.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No movements recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {movements.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {m.type === "OUT" ? "-" : "+"}
                      {m.quantity} · {m.reason.replaceAll("_", " ").toLowerCase()}
                    </p>
                    {m.note && (
                      <p className="mt-0.5 text-[11px] text-slate-400">{m.note}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-3 break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}