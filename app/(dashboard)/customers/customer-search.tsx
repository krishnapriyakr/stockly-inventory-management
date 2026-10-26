"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CustomersSearch({ q }: { q: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);

  function updateParams(nextQ: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQ) params.set("q", nextQ);
    else params.delete("q");
    router.push(`/customers?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams(search);
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
          onBlur={() => updateParams(search)}
          placeholder="Search by name, email, or phone..."
          className="h-11 sm:w-150 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </form>
    </div>
  );
}