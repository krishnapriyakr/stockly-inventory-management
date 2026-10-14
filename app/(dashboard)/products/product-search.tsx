"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ProductsSearch({
  name,
  sku,
  status,
}: {
  name: string;
  sku: string;
  status: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameInput, setNameInput] = useState(name);
  const [skuInput, setSkuInput] = useState(sku);

  function updateParams(next: { name?: string; sku?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.name !== undefined) {
      if (next.name) params.set("name", next.name);
      else params.delete("name");
    }

    if (next.sku !== undefined) {
      if (next.sku) params.set("sku", next.sku);
      else params.delete("sku");
    }

    if (next.status !== undefined) {
      if (next.status && next.status !== "all") params.set("status", next.status);
      else params.delete("status");
    }

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
      {/* Name */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ name: nameInput });
        }}
        className="relative flex-1"
      >
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={() => updateParams({ name: nameInput })}
          placeholder="Search by name..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </form>

      {/* SKU */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ sku: skuInput });
        }}
        className="relative flex-1"
      >
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={skuInput}
          onChange={(e) => setSkuInput(e.target.value)}
          onBlur={() => updateParams({ sku: skuInput })}
          placeholder="Search by SKU..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </form>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => updateParams({ status: e.target.value })}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-44"
      >
        <option value="all">All statuses</option>
        <option value="active">Active only</option>
        <option value="inactive">Inactive only</option>
      </select>
    </div>
  );
}