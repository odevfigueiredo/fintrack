"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AuthResponse, registerSchema } from "@fintrack/shared";
import { apiFetch, setSession } from "@/lib/api";
import { Button, Card, ErrorBanner, Input } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password")
    });

    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      return;
    }

    try {
      const result = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify(parsed.data)
      });
      setSession(result.accessToken, result.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-primary text-ink-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-white">Criar conta</h1>
            <p className="text-sm text-slate-400">Comece a organizar seu dinheiro</p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <ErrorBanner message={error} />
          <Input label="Nome" name="name" autoComplete="name" required />
          <Input label="E-mail" name="email" type="email" autoComplete="email" required />
          <Input label="Senha" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <Button loading={loading} type="submit" className="mt-2">
            Cadastrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Ja tem conta?{" "}
          <Link href="/login" className="text-cyan-primary hover:text-cyan-200">
            Entrar
          </Link>
        </p>
      </Card>
    </main>
  );
}
