"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SuppliersSearch({
  q,
  status,
}: {
  q: string;
  status: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);

  function updateParams(next: { q?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.status !== undefined) {
      if (next.status && next.status !== "all")
        params.set("status", next.status);
      else params.delete("status");
    }
    router.push(`/suppliers?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: search });
        }}
        className="relative flex-1"
      >
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => updateParams({ q: search })}
          placeholder="Search suppliers by name..."
          className="h-11 sm:w-150 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </form>

      <select
        value={status}
        onChange={(e) => updateParams({ status: e.target.value })}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-150"
      >
        <option value="all">All statuses</option>
        <option value="active">Active only</option>
        <option value="inactive">Inactive only</option>
      </select>
    </div>
  );
}