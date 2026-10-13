import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { suppliersApi } from "@/lib/api/suppliers";

export const dynamic = "force-dynamic";

export default async function SupplierViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await suppliersApi.getById(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7 p-6 sm:p-8">
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to suppliers
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {supplier.name}
            </h1>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  supplier.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    supplier.isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {supplier.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/suppliers/edit/${supplier.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
        >
          <Pencil size={15} />
          Edit supplier
        </Link>
      </div>

      {/* Info cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={<Mail size={18} />} label="Email" value={supplier.email} />
        <InfoCard icon={<Phone size={18} />} label="Phone" value={supplier.phone} />
        <InfoCard
          icon={<User size={18} />}
          label="Contact person"
          value={supplier.contactPerson ?? "—"}
        />
        <InfoCard
          icon={<Clock size={18} />}
          label="Lead time"
          value={`${supplier.leadTimeDays} ${
            supplier.leadTimeDays === 1 ? "day" : "days"
          }`}
        />
      </section>

      {/* Address */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <MapPin size={14} />
          Address
        </div>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
          {supplier.address}
        </p>
      </section>

      {/* Placeholder for future */}
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">
          Products from this supplier
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Coming when the Products module is built.
        </p>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-3 break-words text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}