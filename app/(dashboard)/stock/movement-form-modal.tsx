"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { stockMovementsApi } from "@/lib/api/stock-movements";
import { dropdownsApi } from "@/lib/api/dropdowns";

type ProductOption = { id: string; name: string; sku: string };
type CustomerOption = { id: string; name: string; phone: string | null };

const reasonsByType: Record<string, { value: string; label: string }[]> = {
  IN: [
    { value: "PURCHASE", label: "Purchase from supplier" },
    { value: "RETURN_FROM_CUSTOMER", label: "Return from customer" },
    { value: "FOUND", label: "Found in stock" },
  ],
  OUT: [
    { value: "DAMAGE", label: "Damaged" },
    { value: "SALE", label: "Sale to customer" },
    { value: "LOSS", label: "Lost / missing" },
    { value: "WRITE_OFF", label: "Write-off / Removed" },
  ],
  ADJUSTMENT: [
    { value: "AUDIT_CORRECTION", label: "Audit correction" },
  ],
};

export function RecordMovementButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [type, setType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN");
  const [reason, setReason] = useState("PURCHASE");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [prodList, custList] = await Promise.all([
        dropdownsApi.products(),
        dropdownsApi.customers(),
      ]);
      setProducts(prodList);
      setCustomers(custList);
    })();
  }, [open]);

  function close() {
    setOpen(false);
    setError(null);
    setType("IN");
    setReason("PURCHASE");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
      >
        <Plus size={16} />
        Record Movement
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white text-black p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Record movement
              </h2>
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form
              action={(formData) => {
                startTransition(async () => {
                  const result = await stockMovementsApi.record(formData);
                  if (result?.error) setError(result.error);
                  else {
                    close();
                    router.refresh();
                  }
                });
              }}
              className="space-y-4"
            >
              {/* Product */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Product <span className="text-rose-500">*</span>
                </label>
                <select
                  name="productId"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">Select product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Movement type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["IN", "OUT", "ADJUSTMENT"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setType(t);
                        setReason(reasonsByType[t][0].value);
                      }}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        type === t
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="type" value={type} />
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  {reasonsByType[type].map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer (Conditional) */}
              {type === "OUT" && reason === "SALE" && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Customer <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <select
                    name="customerId"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="">Walk-in customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {type === "ADJUSTMENT" ? "New stock value" : "Quantity"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  name="quantity"
                  type="number"
                  min={type === "ADJUSTMENT" ? 0 : 1}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
                {type === "ADJUSTMENT" && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Sets the stock to this number (not adds/subtracts).
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Note <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  name="note"
                  type="text"
                  maxLength={200}
                  placeholder="e.g. PO #1234"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isPending ? "Recording…" : "Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}