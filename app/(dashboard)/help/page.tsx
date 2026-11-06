import Link from "next/link";
import { CircleHelp, ArrowLeft, BookOpen, Layers, RefreshCw, AlertTriangle } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      icon: <Layers className="text-indigo-600" size={20} />,
      title: "How does stock work?",
      description: "You cannot edit stock directly on a product. To add or remove stock, go to 'Stock Movements' and record a Purchase (IN), Sale (OUT), or an Adjustment (Audit)."
    },
    {
      icon: <RefreshCw className="text-emerald-600" size={20} />,
      title: "What are Reorder Suggestions?",
      description: "Stockly calculates how fast you sell a product based on your recent OUT movements. It then checks your supplier's lead time and tells you exactly how much to order before you run out."
    },
    {
      icon: <AlertTriangle className="text-amber-600" size={20} />,
      title: "Why is a product marked 'Low Stock'?",
      description: "When a product's current stock falls below the 'Reorder Level' you set for it, the system flags it on the Alerts page and the Dashboard so you know it's time to buy more."
    },
    {
      icon: <BookOpen className="text-violet-600" size={20} />,
      title: "What is an Adjustment?",
      description: "If you do a physical count of your warehouse and find a mistake (e.g., you actually have 10 units instead of 8), you use an Adjustment. It doesn't add or subtract; it sets the exact number."
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-7">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <CircleHelp size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Help & Support
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Learn how Stockly works and get the most out of your inventory system.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4">
              {faq.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-900">{faq.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {faq.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 mt-8">
        <h3 className="text-sm font-bold text-indigo-900">Still need help?</h3>
        <p className="mt-2 text-sm leading-6 text-indigo-700/80">
          This is a demo inventory workspace. If you have questions about setting up your own Stockly instance, or want to report a bug, please reach out to the developer.
        </p>
      </div>
    </div>
  );
}