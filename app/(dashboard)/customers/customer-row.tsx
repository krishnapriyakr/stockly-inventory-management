"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import { useTransition } from "react";
import { customersApi } from "@/lib/api/customers";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
};

export function CustomerRow({ customer }: { customer: Customer }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/60">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
          <User size={16} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {customer.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {customer.email ?? customer.phone ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={`/customers/view/${customer.id}`}
          aria-label={`View ${customer.name}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Eye size={16} />
        </Link>
        <Link
          href={`/customers/edit/${customer.id}`}
          aria-label={`Edit ${customer.name}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Pencil size={16} />
        </Link>
        <button
          disabled={isPending}
          onClick={() => {
            if (!confirm(`Delete "${customer.name}"?`)) return;
            startTransition(async () => {
              await customersApi.remove(customer.id);
            });
          }}
          aria-label={`Delete ${customer.name}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}