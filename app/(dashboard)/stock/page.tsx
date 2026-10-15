import { ArrowDown, ArrowUp, History, Scale } from "lucide-react";
import { stockMovementsApi } from "@/lib/api/stock-movements";
import { StockSearch } from "./stock-search";
import { RecordMovementButton } from "./movement-form-modal";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; type?: string };

const reasonLabels: Record<string, string> = {
  PURCHASE: "Purchase",
  RETURN_FROM_CUSTOMER: "Return from customer",
  FOUND: "Found",
  SALE: "Sale",
  DAMAGE: "Damage",
  LOSS: "Loss",
  TRANSFER_OUT: "Transfer out",
  AUDIT_CORRECTION: "Audit correction",
};

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const type = params.type ?? "all";

  const movements = await stockMovementsApi.list({ q, type });

  const totalIn = movements
    .filter((m) => m.type === "IN")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Stock Movements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Every change to your inventory, logged and traceable.
          </p>
        </div>

        <RecordMovementButton />
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<History size={19} />}
          iconClass="bg-indigo-50 text-indigo-600"
          label="Total movements"
          value={movements.length.toString()}
        />
        <SummaryCard
          icon={<ArrowDown size={19} />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Total in"
          value={`+${totalIn}`}
        />
        <SummaryCard
          icon={<ArrowUp size={19} />}
          iconClass="bg-rose-50 text-rose-600"
          label="Total out"
          value={`-${totalOut}`}
        />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <StockSearch q={q} type={type} />

        {movements.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Scale size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              {q || type !== "all" ? "No matching movements" : "No movements yet"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {q || type !== "all"
                ? "Try a different search or filter."
                : "Record your first stock movement to start tracking."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/70">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {m.product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {m.product.sku}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={m.type} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reasonLabels[m.reason] ?? m.reason}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {m.type === "OUT" ? "-" : "+"}
                      {m.quantity} {m.product.unit}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {m.note ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    IN: "bg-emerald-50 text-emerald-700",
    OUT: "bg-rose-50 text-rose-700",
    ADJUSTMENT: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        map[type] ?? "bg-slate-100 text-slate-500"
      }`}
    >
      {type}
    </span>
  );
}

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}