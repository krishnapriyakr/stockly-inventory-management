"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Users,
  ArrowLeftRight,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Boxes,
  ChevronRight,
  Lightbulb,
  Menu,
  X,
  CircleHelp,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Stock Movements", href: "/stock", icon: ArrowLeftRight },
  { label: "Reorder Suggestions", href: "/reorder", icon: Lightbulb },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => signOut({ callbackUrl: "/sign-in" });

  const NavigationContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      
      {/* Brand - Fixed at Top */}
      <div className="flex h-[84px] shrink-0 items-center border-b border-slate-100 px-5">
        <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
            <Boxes size={22} strokeWidth={2} className="text-white" />
          </div>
          <div>
            <p className="text-[19px] font-bold tracking-tight text-slate-900">
              Stock<span className="text-indigo-600">ly</span>
            </p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inventory
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={closeMenu}
          className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {active && (
                  <ChevronRight size={15} className="shrink-0 text-indigo-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Preferences Section */}
        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Preferences
        </p>

        <div className="space-y-1">
          <Link
            href="/settings"
            onClick={closeMenu}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
              pathname === "/settings"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${pathname === "/settings" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
              <Settings size={17} strokeWidth={1.9} />
            </div>
            Settings
          </Link>

          <Link
            href="/help"
            onClick={closeMenu}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <CircleHelp size={17} strokeWidth={1.9} />
            </div>
            Help & Support
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-rose-100 group-hover:text-rose-600">
              <LogOut size={17} strokeWidth={1.9} />
            </div>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top navigation */}
      <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <Boxes size={19} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Stock<span className="text-indigo-600">ly</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 md:flex">
        <NavigationContent />
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={closeMenu}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[285px] max-w-[85vw] shadow-2xl">
            <NavigationContent />
          </aside>
        </div>
      )}
    </>
  );
}