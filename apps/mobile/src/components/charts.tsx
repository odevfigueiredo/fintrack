import type { DashboardCategorySlice, DashboardMonthlyPoint } from "@fintrack/shared";
import Animated, { FadeInLeft, FadeInUp, LinearTransition } from "react-native-reanimated";
import { Text, View } from "@/tw";
import { formatCurrency } from "@/lib/format";

export function IncomeExpenseChart({ data }: { data: DashboardMonthlyPoint[] }) {
  const max = Math.max(1, ...data.flatMap((point) => [point.income, point.expense]));

  return (
    <View className="gap-4">
      {data.map((point, index) => (
        <Animated.View
          key={point.month}
          entering={FadeInUp.delay(index * 55).duration(320)}
          layout={LinearTransition.springify().damping(18)}
          style={{ gap: 8 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-slate-400">{point.month}</Text>
            <Text className="text-xs text-slate-400">
              {formatCurrency(point.income)} / {formatCurrency(point.expense)}
            </Text>
          </View>
          <View className="gap-1">
            <View className="h-2 overflow-hidden rounded-full bg-white/10">
              <Animated.View
                entering={FadeInLeft.delay(120 + index * 60).duration(520)}
                style={{
                  height: "100%",
                  width: `${Math.max(4, (point.income / max) * 100)}%`,
                  borderRadius: 999,
                  backgroundColor: "#34D399"
                }}
              />
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-white/10">
              <Animated.View
                entering={FadeInLeft.delay(170 + index * 60).duration(520)}
                style={{
                  height: "100%",
                  width: `${Math.max(4, (point.expense / max) * 100)}%`,
                  borderRadius: 999,
                  backgroundColor: "#FB7185"
                }}
              />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

export function CategoryChart({ data }: { data: DashboardCategorySlice[] }) {
  const max = Math.max(1, ...data.map((item) => item.amount));

  return (
    <View className="gap-4">
      {data.map((item, index) => (
        <Animated.View
          key={item.categoryId}
          entering={FadeInUp.delay(index * 55).duration(320)}
          layout={LinearTransition.springify().damping(18)}
          style={{ gap: 8 }}
        >
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-xs text-slate-300">{item.categoryName}</Text>
            <Text className="text-xs text-slate-400">{formatCurrency(item.amount)}</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/10">
            <Animated.View
              entering={FadeInLeft.delay(110 + index * 70).duration(520)}
              style={{
                height: "100%",
                width: `${Math.max(5, (item.amount / max) * 100)}%`,
                borderRadius: 999,
                backgroundColor: item.color
              }}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}
