import Link from "next/link";
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  PieChart,
  Receipt,
  AlertOctagon,
  CalendarDays
} from "lucide-react";
import { reportsApi } from "@/lib/api/reports";

export const dynamic = "force-dynamic";

const ranges = [
  { value: "today", label: "Today" },
  { value: "week", label: "7 Days" },
  { value: "month", label: "30 Days" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = params.range || "month";
  
  const data = await reportsApi.getData(range);
  const potentialProfit = data.totalRetailValue - data.totalCostValue;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-7">
      
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Reports & Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Financial overview and inventory trends.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {ranges.map((r) => (
            <Link
              key={r.value}
              href={`/reports?range=${r.value}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                range === r.value 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Cost Value */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <IndianRupee size={19} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Inventory Cost</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            ₹{data.totalCostValue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Retail + Profit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={19} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Retail Potential</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            ₹{data.totalRetailValue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-600">
            +₹{potentialProfit.toLocaleString("en-IN")} Profit
          </p>
        </div>

        {/* Tax Potential */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Receipt size={19} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Tax Liability (GST)</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            ₹{data.totalTaxPotential.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>

        {/* Period Movements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ArrowDownToLine size={19} />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpFromLine size={19} />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-slate-500">Stock In</p>
              <p className="text-lg font-bold text-slate-900">+{data.totalIn}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Stock Out</p>
              <p className="text-lg font-bold text-slate-900">-{data.totalOut}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Movement Trend Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Movement Trend</h3>
            <p className="mt-1 text-xs text-slate-400">Last 7 active days (Green = IN, Red = OUT)</p>
          </div>
          <CalendarDays size={18} className="text-slate-400" />
        </div>
        
        {data.trendData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-slate-400">
            No movements recorded in this period.
          </div>
        ) : (
          <div className="flex items-end gap-4 h-40">
            {data.trendData.map((d, i) => {
              // Prevent divide by zero if all values are 0
              const maxIn = Math.max(...data.trendData.map(t => t.in)) || 1;
              const maxOut = Math.max(...data.trendData.map(t => t.out)) || 1;
              const maxVal = Math.max(maxIn, maxOut);

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                  <div className="flex items-end gap-1 w-full justify-center h-full relative">
                    
                    {/* IN Bar */}
                    <div 
                      className="w-4 bg-emerald-400 rounded-t-sm transition-all group-hover:bg-emerald-500" 
                      style={{ height: `${(d.in / maxVal) * 100}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none transition-opacity">
                        IN: {d.in}
                      </div>
                    </div>

                    {/* OUT Bar */}
                    <div 
                      className="w-4 bg-rose-400 rounded-t-sm transition-all group-hover:bg-rose-500" 
                      style={{ height: `${(d.out / maxVal) * 100}%` }}
                    >
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none transition-opacity">
                        OUT: {d.out}
                      </div>
                    </div>

                  </div>
                  <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{d.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Value by Category</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <PieChart size={18} />
          </div>
        </div>

        {data.categoryData.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No category data available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Units</th>
                  <th className="px-6 py-3">Cost Value</th>
                  <th className="px-6 py-3 w-1/3">Share of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.categoryData.map((cat) => {
                  const percentage = data.totalCostValue === 0 
                    ? 0 
                    : Math.round((cat.costValue / data.totalCostValue) * 100);

                  return (
                    <tr key={cat.name} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {cat.units} units
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        ₹{cat.costValue.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 w-10 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slow Moving Inventory */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Slow-Moving Inventory</h3>
            <p className="mt-1 text-xs text-slate-400">Products with stock but zero sales in the last 60 days.</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertOctagon size={18} />
          </div>
        </div>

        {data.deadStock.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Great! No dead stock found. Everything is moving.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Stock Left</th>
                  <th className="px-6 py-3 text-rose-600">Capital Tied Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.deadStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-rose-600">
                      ₹{item.tiedUpValue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}