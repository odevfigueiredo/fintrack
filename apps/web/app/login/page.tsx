"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { AuthResponse, loginSchema } from "@fintrack/shared";
import { apiFetch, setSession } from "@/lib/api";
import { Button, Card, ErrorBanner, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password")
    });

    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      return;
    }

    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify(parsed.data)
      });
      setSession(result.accessToken, result.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-primary text-ink-950">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-white">FinTrack</h1>
            <p className="text-sm text-slate-400">Acesse seu dashboard financeiro</p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <ErrorBanner message={error} />
          <Input label="E-mail" name="email" type="email" autoComplete="email" required />
          <Input label="Senha" name="password" type="password" autoComplete="current-password" required />
          <Button loading={loading} type="submit" className="mt-2">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-cyan-primary hover:text-cyan-200">
            Criar conta
          </Link>
        </p>
      </Card>
    </main>
  );
}
