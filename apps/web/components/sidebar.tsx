"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FolderKanban, Goal, LogOut, ReceiptText, Settings } from "lucide-react";
import { clearSession } from "@/lib/api";
import { Button } from "./ui";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/transactions", label: "Transacoes", icon: ReceiptText },
  { href: "/categories", label: "Categorias", icon: FolderKanban },
  { href: "/goals", label: "Metas", icon: Goal },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <aside className="flex w-full flex-col border-b border-white/10 bg-ink-950/90 p-4 lg:min-h-dvh lg:w-72 lg:border-b-0 lg:border-r">
      <div className="mb-4 lg:mb-8">
        <p className="text-xl font-semibold tracking-normal text-white">FinTrack</p>
        <p className="mt-1 text-sm text-slate-400">Controle financeiro pessoal</p>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                active ? "bg-cyan-primary text-ink-950" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 lg:mt-auto lg:pt-6">
        <Button variant="secondary" className="w-full" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
