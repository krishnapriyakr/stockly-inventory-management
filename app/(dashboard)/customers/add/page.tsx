"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, User } from "lucide-react";
import { customersApi } from "@/lib/api/customers";

export default function AddCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-3xl space-y-7 p-6 sm:p-8">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Add Customer
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Only the name is required. Contact info is optional.
          </p>
        </div>
      </div>

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await customersApi.create(formData);
            if (result?.error) setError(result.error);
            else router.push("/customers");
          });
        }}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            required
            autoFocus
            maxLength={80}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-black outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-black outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-black outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Address{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            name="address"
            rows={3}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/customers"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Check size={17} />
            {isPending ? "Creating…" : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}