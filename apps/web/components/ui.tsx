"use client";

import type { ComponentProps, ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-white/10 bg-white/[0.045] p-5 ${className}`}>{children}</section>;
}

export function Button({
  children,
  loading,
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { loading?: boolean; variant?: "primary" | "secondary" | "danger" }) {
  const variants = {
    primary: "bg-cyan-primary text-ink-950 hover:bg-cyan-300",
    secondary: "border border-white/10 bg-white/[0.06] text-slate-100 hover:bg-white/[0.1]",
    danger: "border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        {...props}
        className={`focus-ring min-h-11 rounded-md border border-white/10 bg-ink-950/70 px-3 text-slate-100 placeholder:text-slate-500 ${className}`}
      />
    </label>
  );
}

export function Select({ label, children, className = "", ...props }: ComponentProps<"select"> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <select {...props} className={`focus-ring min-h-11 rounded-md border border-white/10 bg-ink-950/70 px-3 text-slate-100 ${className}`}>
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = "", ...props }: ComponentProps<"textarea"> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <textarea
        {...props}
        className={`focus-ring min-h-24 rounded-md border border-white/10 bg-ink-950/70 px-3 py-2 text-slate-100 placeholder:text-slate-500 ${className}`}
      />
    </label>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: number;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass = tone === "positive" ? "text-emerald-soft" : tone === "negative" ? "text-rose-soft" : "text-cyan-primary";

  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold tracking-normal ${toneClass}`}>{formatCurrency(value)}</p>
    </Card>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">{children}</div>;
}
