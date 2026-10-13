"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const cat = await categoriesApi.getById(id);
      if (cat) {
        setName(cat.name);
        setDescription(cat.description ?? "");
      }
      setLoaded(true);
    }
    load();
  }, [id]);

  if (!loaded) {
    return <div className="p-6 sm:p-8 text-sm text-slate-400">Loading…</div>;
  }

  return (
    <div className="p-6 sm:p-8">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Categories
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-slate-950">
        Edit Category
      </h1>

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await categoriesApi.update(id, formData);
            if (result?.error) setError(result.error);
            else router.push("/categories");
          });
        }}
        className="mt-6 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="text-xs font-semibold text-slate-700">Name</label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white"
        />

        <label className="mt-4 block text-xs font-semibold text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What goes in this category?"
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white"
        />

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}