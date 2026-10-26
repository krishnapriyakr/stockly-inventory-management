import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, Pencil, User } from "lucide-react";
import { customersApi } from "@/lib/api/customers";

export const dynamic = "force-dynamic";

export default async function CustomerViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await customersApi.getById(id);

  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-7 p-6 sm:p-8">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {customer.name}
          </h1>
        </div>

        <Link
          href={`/customers/edit/${customer.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <Pencil size={15} />
          Edit
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={<Mail size={18} />}
          label="Email"
          value={customer.email ?? "—"}
        />
        <InfoCard
          icon={<Phone size={18} />}
          label="Phone"
          value={customer.phone ?? "—"}
        />
      </section>

      {customer.address && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin size={14} />
            Address
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
            {customer.address}
          </p>
        </section>
      )}
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