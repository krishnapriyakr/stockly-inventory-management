import {
  Package,
  Warehouse,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

const stats = [
  {
    title: "Total Products",
    value: "248",
    change: "+8.2%",
    description: "from last month",
    icon: Package,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Stock Available",
    value: "186",
    change: "+5.4%",
    description: "from last month",
    icon: Warehouse,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Orders",
    value: "64",
    change: "+12.6%",
    description: "from last month",
    icon: ShoppingCart,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    title: "Low Stock",
    value: "12",
    change: "Needs attention",
    description: "",
    icon: AlertTriangle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const recentProducts = [
  {
    name: "Wireless Keyboard",
    category: "Accessories",
    stock: 42,
    status: "In Stock",
  },
  {
    name: "USB-C Hub",
    category: "Accessories",
    stock: 18,
    status: "In Stock",
  },
  {
    name: "Mechanical Mouse",
    category: "Peripherals",
    stock: 7,
    status: "Low Stock",
  },
  {
    name: "27-inch Monitor",
    category: "Monitors",
    stock: 24,
    status: "In Stock",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex h-[88px] items-center justify-between px-6 sm:px-8">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Overview
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md"
            >
              <Plus size={17} strokeWidth={2} />
              Add Product
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Welcome */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Good morning 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your inventory today.
            </p>
          </div>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                        className={stat.iconColor}
                      />
                    </div>

                    {stat.title !== "Low Stock" && (
                      <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                        <TrendingUp size={12} />
                        {stat.change}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <p className="text-2xl font-bold tracking-tight text-slate-950">
                      {stat.value}
                    </p>

                    {stat.description && (
                      <p className="mb-0.5 text-xs text-slate-400">
                        {stat.description}
                      </p>
                    )}
                  </div>

                  {stat.title === "Low Stock" && (
                    <p className="mt-1 text-xs font-medium text-orange-500">
                      {stat.change}
                    </p>
                  )}
                </div>
              );
            })}
          </section>

          {/* Lower content */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
            {/* Recent Products */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Products
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Recently added inventory items
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  View all
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Product
                      </th>

                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Category
                      </th>

                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Stock
                      </th>

                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentProducts.map((product) => (
                      <tr
                        key={product.name}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                              <Package
                                size={16}
                                className="text-indigo-600"
                                strokeWidth={1.8}
                              />
                            </div>

                            <span className="text-sm font-semibold text-slate-700">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {product.stock} units
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              product.status === "Low Stock"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick overview */}
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
                  <Warehouse
                    size={18}
                    className="text-indigo-600"
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Stock availability
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    82%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[82%] rounded-full bg-indigo-600" />
                </div>
              </div>

              {/* Health items */}
              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-slate-600">
                      In stock
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    186
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span className="text-sm text-slate-600">
                      Low stock
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    12
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600">
                      Out of stock
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    5
                  </span>
                </div>
              </div>

              <div className="mt-7 rounded-xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold text-indigo-700">
                  Everything looks good
                </p>

                <p className="mt-1 text-[11px] leading-5 text-indigo-600/70">
                  Your inventory is healthy. Keep monitoring the low-stock
                  products.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}