import { 
  IndianRupee, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  PieChart,
  Receipt,
  AlertOctagon
} from "lucide-react";
import { reportsApi } from "@/lib/api/reports";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await reportsApi.getData();
  const potentialProfit = data.totalRetailValue - data.totalCostValue;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Reports & Insights
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your financials and identify slow-moving stock.
        </p>
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
            +₹{potentialProfit.toLocaleString("en-IN")} Est. Profit
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

        {/* 30 Day Movements */}
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
              <p className="text-sm font-medium text-slate-500">In (30d)</p>
              <p className="text-lg font-bold text-slate-900">+{data.totalIn}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Out (30d)</p>
              <p className="text-lg font-bold text-slate-900">-{data.totalOut}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown (Keep as is) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Value by Category</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <PieChart size={18} />
          </div>
        </div>
        {/* ... (keep your existing category table here) ... */}
      </div>

      {/* NEW: Dead Stock / Slow Moving Inventory */}
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