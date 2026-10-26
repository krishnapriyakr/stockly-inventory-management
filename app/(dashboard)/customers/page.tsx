import Link from "next/link";
import { Plus, User, Users, Eye, Pencil, Trash2 } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { CustomersSearch } from "./customer-search";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();

  const allCustomers = await customersApi.list();

  const filtered = allCustomers.filter((c) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(query))
    );
  });

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the people and businesses you sell to.
          </p>
        </div>

        <Link
          href="/customers/add"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add Customer
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={19} />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              All
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Total customers
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {allCustomers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <User size={19} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              Matches
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Showing (filtered)
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {filtered.length}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CustomersSearch q={q} />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <User size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              {q ? "No matching customers" : "No customers yet"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {q
                ? "Try a different search."
                : "Add your first customer to track who buys your products."}
            </p>
            {!q && (
              <Link
                href="/customers/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={16} />
                Add customer
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50/70">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {c.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500">
                        {c.email && <p>{c.email}</p>}
                        {c.phone && <p className="mt-0.5">{c.phone}</p>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-xs text-slate-500">
                        {c.address || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/customers/view/${c.id}`}
                          aria-label={`View ${c.name}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          href={`/customers/edit/${c.id}`}
                          aria-label={`Edit ${c.name}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>

                        <form
                          action={async () => {
                            "use server";
                            const { customersApi } = await import(
                              "@/lib/api/customers"
                            );
                            await customersApi.remove(c.id);
                          }}
                        >
                          <button
                            type="submit"
                            aria-label={`Delete ${c.name}`}
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
        Know your customers, grow your business.
      </p>
    </div>
  );
}