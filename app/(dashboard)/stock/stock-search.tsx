"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function StockSearch({ q, type }: { q: string; type: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);

  function updateParams(next: { q?: string; type?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.type !== undefined) {
      if (next.type && next.type !== "all") params.set("type", next.type);
      else params.delete("type");
    }
    router.push(`/stock?${params.toString()}`);
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
          placeholder="Search by product name or SKU..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-100"
        />
      </form>

      <select
        value={type}
        onChange={(e) => updateParams({ type: e.target.value })}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-50"
      >
        <option value="all">All types</option>
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
        <option value="ADJUSTMENT">ADJUSTMENT</option>
      </select>
    </div>
  );
}