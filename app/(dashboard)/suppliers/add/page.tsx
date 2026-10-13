"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Info, Package, Truck } from "lucide-react";
import { suppliersApi } from "@/lib/api/suppliers";

export default function AddSupplierPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-6 sm:p-8">
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to suppliers
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Truck size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Create a supplier
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add a vendor you order products from. Complete contact details help
            with returns and disputes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="font-semibold text-slate-900">Supplier details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fields marked with <span className="text-rose-500">*</span> are required.
            </p>
          </div>

          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await suppliersApi.create(formData);
                if (result?.error) setError(result.error);
                else router.push("/suppliers");
              });
            }}
            className="space-y-6 p-5 sm:p-7"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Supplier name <span className="ml-1 text-rose-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Acme Distributors"
                maxLength={80}
                required
                autoFocus
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orders@acme.com"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone <span className="ml-1 text-rose-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  maxLength={15}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Contact person
                <span className="ml-2 font-normal text-slate-400">(optional)</span>
              </label>
              <input
                name="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Priya Sharma"
                maxLength={60}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Address <span className="ml-1 text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, state, PIN..."
                maxLength={200}
                required
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
              <p className="mt-2 text-xs text-slate-400">
                Required for return shipments and invoices.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Lead time (days) <span className="ml-1 text-rose-500">*</span>
              </label>
              <input
                name="leadTimeDays"
                type="number"
                min={0}
                max={365}
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-50"
              />
              <p className="mt-2 text-xs text-slate-400">
                How many days between placing an order and receiving it.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/suppliers"
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
                {isPending ? "Creating…" : "Create supplier"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Live preview
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Preview your supplier card.
              </p>
            </div>
            <div className="p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Package size={23} />
              </div>
              <h4 className="mt-4 break-words text-lg font-semibold text-slate-900">
                {name.trim() || "Supplier name"}
              </h4>
              {contactPerson.trim() && (
                <p className="mt-1 text-xs text-slate-500">
                  {contactPerson.trim()}
                </p>
              )}
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                {email && <p className="truncate">{email}</p>}
                {phone && <p>{phone}</p>}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
                <p className="mt-3 text-xs text-slate-500">
                  Lead time:{" "}
                  <span className="font-semibold text-slate-700">
                    {leadTimeDays} {leadTimeDays === 1 ? "day" : "days"}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Info size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Why complete contact info matters
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              When a shipment arrives damaged or short, you need the supplier's
              phone, email, and address immediately. Requiring them here means
              you never have to chase down missing details mid-crisis.
            </p>
          </section> */}
        </aside>
      </div>
    </div>
  );
}