import { 
  IndianRupee, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  PieChart 
} from "lucide-react";
import { reportsApi } from "@/lib/api/reports";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await reportsApi.getData();

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A high-level view of your inventory value and recent movements.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Cost Value */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <IndianRupee size={19} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Inventory Cost Value</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            ₹{data.totalCostValue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Retail Value */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={19} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Retail Potential</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            ₹{data.totalRetailValue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Stock In (30d) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ArrowDownToLine size={19} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Stock In (30 Days)</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            +{data.totalIn.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Stock Out (30d) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpFromLine size={19} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Stock Out (30 Days)</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            -{data.totalOut.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Value by Category</h3>
            <p className="mt-1 text-xs text-slate-400">Distribution of inventory cost value</p>
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
    </div>
  );
}