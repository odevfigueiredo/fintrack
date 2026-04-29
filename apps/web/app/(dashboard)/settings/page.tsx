"use client";

import { useEffect, useState } from "react";
import type { ApiUser } from "@fintrack/shared";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { apiFetch, clearSession, getStoredUser } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser<ApiUser>());
    void apiFetch<ApiUser>("/auth/me")
      .then(setUser)
      .catch(() => null);
  }, []);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Sessao, perfil e informacoes do ambiente.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-primary text-ink-950">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-normal text-white">Perfil</h2>
              <p className="text-sm text-slate-400">Dados autenticados pela API</p>
            </div>
          </div>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Nome</dt>
              <dd className="mt-1 text-slate-100">{user?.name ?? "Nao carregado"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">E-mail</dt>
              <dd className="mt-1 text-slate-100">{user?.email ?? "Nao carregado"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.08] text-cyan-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-normal text-white">Sessao</h2>
              <p className="text-sm text-slate-400">JWT salvo no navegador</p>
            </div>
          </div>
          <Button variant="danger" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Card>
      </section>
    </div>
  );
}
