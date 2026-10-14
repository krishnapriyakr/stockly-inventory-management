import Link from "next/link";
import { CheckCircle2, FolderOpen, Truck, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { suppliersApi } from "@/lib/api/suppliers";
import { SuppliersSearch } from "./supplier-search";
import { SupplierRowActions } from "./supplier-actions";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; status?: string };

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = params.status ?? "all";

  const allSuppliers = await suppliersApi.list();

  const activeCount = allSuppliers.filter((s) => s.isActive).length;
  const inactiveCount = allSuppliers.length - activeCount;

  const filtered = allSuppliers.filter((s) => {
    const matchesSearch = q
      ? s.name.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesStatus =
      status === "all" ||
      (status === "active" && s.isActive) ||
      (status === "inactive" && !s.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the vendors you order products from.
          </p>
        </div>

        <Link
          href="/suppliers/add"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add Supplier
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Truck size={19} />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              All
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Total suppliers
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {allSuppliers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              Active
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Active suppliers
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FolderOpen size={19} />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              Inactive
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Inactive suppliers
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SuppliersSearch q={q} status={status} />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Truck size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              {q || status !== "all"
                ? "No matching suppliers"
                : "No suppliers yet"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {q || status !== "all"
                ? "Try a different search or filter."
                : "Add your first supplier to track where your products come from."}
            </p>
            {!q && status === "all" && (
              <Link
                href="/suppliers/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={16} />
                Add supplier
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50/70">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Lead time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Truck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {s.name}
                          </p>
                          {s.contactPerson && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {s.contactPerson}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500">
                        {s.email && <p>{s.email}</p>}
                        {s.phone && <p className="mt-0.5">{s.phone}</p>}
                        {!s.email && !s.phone && (
                          <span className="text-slate-300">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {s.leadTimeDays} {s.leadTimeDays === 1 ? "day" : "days"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <SupplierRowActions
                        id={s.id}
                        name={s.name}
                        isActive={s.isActive}
                      />
                    </td>

                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <Link
                        href={`/suppliers/view/${s.id}`}
                        aria-label={`View ${s.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                        <Eye size={16} />
                        </Link>

                        <Link
                        href={`/suppliers/edit/${s.id}`}
                        aria-label={`Edit ${s.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                        <Pencil size={16} />
                        </Link>

                        <form
                        action={async () => {
                            "use server";
                            const { suppliersApi } = await import("@/lib/api/suppliers");
                            await suppliersApi.remove(s.id);
                        }}
                        >
                        <button
                            type="submit"
                            aria-label={`Delete ${s.name}`}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                        </form>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        Reliable suppliers, smoother restocking.
      </p>
    </div>
  );
}