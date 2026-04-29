"use client";

import type { DashboardCategorySlice, DashboardMonthlyPoint } from "@fintrack/shared";
import { formatCurrency } from "@/lib/format";

export function IncomeExpenseChart({ data }: { data: DashboardMonthlyPoint[] }) {
  const max = Math.max(1, ...data.flatMap((point) => [point.income, point.expense]));

  return (
    <div className="grid gap-4">
      {data.map((point) => (
        <div key={point.month} className="grid gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{point.month}</span>
            <span>
              {formatCurrency(point.income)} / {formatCurrency(point.expense)}
            </span>
          </div>
          <div className="grid gap-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-soft" style={{ width: `${Math.max(4, (point.income / max) * 100)}%` }} />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-rose-soft" style={{ width: `${Math.max(4, (point.expense / max) * 100)}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryChart({ data }: { data: DashboardCategorySlice[] }) {
  const max = Math.max(1, ...data.map((item) => item.amount));

  return (
    <div className="grid gap-4">
      {data.map((item) => (
        <div key={item.categoryId} className="grid gap-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.categoryName}
            </span>
            <span className="text-slate-400">{formatCurrency(item.amount)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${Math.max(5, (item.amount / max) * 100)}%`, backgroundColor: item.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
