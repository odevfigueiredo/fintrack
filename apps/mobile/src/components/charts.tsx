import type { DashboardCategorySlice, DashboardMonthlyPoint } from "@fintrack/shared";
import { Text, View } from "@/tw";
import { formatCurrency } from "@/lib/format";

export function IncomeExpenseChart({ data }: { data: DashboardMonthlyPoint[] }) {
  const max = Math.max(1, ...data.flatMap((point) => [point.income, point.expense]));

  return (
    <View className="gap-4">
      {data.map((point) => (
        <View key={point.month} className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-slate-400">{point.month}</Text>
            <Text className="text-xs text-slate-400">
              {formatCurrency(point.income)} / {formatCurrency(point.expense)}
            </Text>
          </View>
          <View className="gap-1">
            <View className="h-2 overflow-hidden rounded-full bg-white/10">
              <View className="h-full rounded-full bg-emerald-soft" style={{ width: `${Math.max(4, (point.income / max) * 100)}%` }} />
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-white/10">
              <View className="h-full rounded-full bg-rose-soft" style={{ width: `${Math.max(4, (point.expense / max) * 100)}%` }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function CategoryChart({ data }: { data: DashboardCategorySlice[] }) {
  const max = Math.max(1, ...data.map((item) => item.amount));

  return (
    <View className="gap-4">
      {data.map((item) => (
        <View key={item.categoryId} className="gap-2">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-xs text-slate-300">{item.categoryName}</Text>
            <Text className="text-xs text-slate-400">{formatCurrency(item.amount)}</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/10">
            <View className="h-full rounded-full" style={{ width: `${Math.max(5, (item.amount / max) * 100)}%`, backgroundColor: item.color }} />
          </View>
        </View>
      ))}
    </View>
  );
}
