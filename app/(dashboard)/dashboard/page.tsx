import Link from "next/link";
import {
  Package,
  Warehouse,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  IndianRupee,
} from "lucide-react";
import { dashboardApi } from "@/lib/api/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await dashboardApi.getStats();

  const availabilityPercentage =
    stats.totalProducts === 0
      ? 0
      : Math.round((stats.inStock / stats.totalProducts) * 100);

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex h-[88px] items-center justify-between px-6 sm:px-8">
            <div>
              <p className="text-xs font-medium text-slate-400">Overview</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
            </div>

            <Link
              href="/products/add"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md"
            >
              <Plus size={17} strokeWidth={2} />
              Add Product
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Welcome */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Welcome back 👋
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your inventory today.
            </p>
          </div>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total Products */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Package size={21} strokeWidth={1.8} className="text-indigo-600" />
                </div>
                <Link href="/products" className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600">
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Total Products</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  {stats.totalProducts}
                </p>
                <p className="mb-0.5 text-xs text-slate-400">
                  {stats.totalCategories} categories
                </p>
              </div>
            </div>

            {/* Total Stock Value */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <IndianRupee size={21} strokeWidth={1.8} className="text-emerald-600" />
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Inventory Value</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  ₹{stats.totalStockValue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Stock Available */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
                  <Warehouse size={21} strokeWidth={1.8} className="text-violet-600" />
                </div>
                <Link href="/stock" className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-violet-600">
                  Ledger <ArrowUpRight size={12} />
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Total Items</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  {stats.totalStock.toLocaleString("en-IN")}
                </p>
                <p className="mb-0.5 text-xs text-slate-400">units</p>
              </div>
            </div>

            {/* Low Stock */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <AlertTriangle size={21} strokeWidth={1.8} className="text-orange-500" />
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Low Stock</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  {stats.lowStock}
                </p>
                <Link href="/alerts" className="mb-0.5 text-xs font-semibold text-orange-500 hover:underline">
                  Needs attention
                </Link>
              </div>
            </div>
          </section>

          {/* Lower content */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
            {/* Recent Movements */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Stock Movements
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Latest changes to your inventory
                  </p>
                </div>

                <Link
                  href="/stock"
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  View all
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Product</th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Qty</th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.recentMovements.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                          No stock movements recorded yet.
                        </td>
                      </tr>
                    ) : (
                      stats.recentMovements.map((m) => (
                        <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                                <Package size={16} className="text-indigo-600" />
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {m.product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                m.type === "IN"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : m.type === "OUT"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {m.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-700">
                            {m.type === "OUT" ? "-" : "+"}{m.quantity}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(m.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Inventory Health */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Inventory Health
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Current stock overview
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <Warehouse size={18} className="text-indigo-600" />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Healthy stock level
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {availabilityPercentage}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${availabilityPercentage}%` }}
                  />
                </div>
              </div>

              {/* Health items */}
              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-slate-600">In stock</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {stats.inStock}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span className="text-sm text-slate-600">Low stock</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {stats.lowStock}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600">Out of stock</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {stats.outOfStock}
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-7 rounded-xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold text-indigo-700">
                  {stats.lowStock > 0 || stats.outOfStock > 0
                    ? "Action needed"
                    : "Everything looks good"}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-indigo-600/70">
                  {stats.lowStock > 0 || stats.outOfStock > 0
                    ? `You have ${stats.lowStock} low-stock and ${stats.outOfStock} out-of-stock products to review.`
                    : "Your inventory is healthy. Keep monitoring the low-stock products."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}