import { auth } from "@/auth";
import { Settings, User, Shield, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <User size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Profile Details</h2>
            <p className="text-xs text-slate-500">Your basic account information.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
              <p className="mt-1 text-sm font-medium text-slate-900">{session?.user?.name || "User"}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <p className="mt-1 text-sm font-medium text-slate-900">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
         <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Shield size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500">Manage your password and login.</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500">
            You are signed in using {session?.user?.image ? "Google OAuth" : "Email and Password"}. 
            Password changes are managed through your authentication provider.
          </p>
        </div>
      </div>
    </div>
  );
}