import Link from "next/link";
import { AlertCircle, ArrowRight, Truck, RefreshCw } from "lucide-react";
import { reorderApi } from "@/lib/api/reorder";

export const dynamic = "force-dynamic";

export default async function ReorderPage() {
  const suggestions = await reorderApi.getSuggestions();

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Reorder Suggestions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Smart predictions based on your sales velocity and supplier lead times.
          </p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <RefreshCw size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            You're all caught up!
          </p>
          <p className="mt-1 max-w-xs text-xs text-slate-400">
            No urgent reorders right now. Your stock levels are healthy compared to your sales velocity.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">SKU: {item.sku}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="font-semibold text-slate-900">{item.stock} {item.unit}</span> left
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      Selling <span className="font-semibold text-slate-900">{item.dailyVelocity} / day</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      {item.daysOfStockLeft} days of stock left
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="flex flex-col sm:items-end justify-center rounded-xl bg-slate-50 p-4 border border-slate-100 min-w-[220px]">
                <p className="text-xs text-slate-500 mb-1">
                  Order from <span className="font-semibold text-slate-700">{item.supplierName}</span>
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  Lead time: {item.leadTimeDays} days
                </p>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-slate-700">Suggested:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {item.suggestedOrderQty} {item.unit}
                  </span>
                </div>
                <Link
                  href={`/stock`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Truck size={14} />
                  Record Purchase
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}