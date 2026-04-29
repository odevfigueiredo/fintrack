import type { ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import { Text, TextInput, Pressable, View } from "@/tw";
import { formatCurrency } from "@/lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-lg border border-white/10 bg-white/[0.05] p-4 ${className}`}>{children}</View>;
}

export function Button({
  children,
  onPress,
  loading,
  variant = "primary",
  className = ""
}: {
  children: ReactNode;
  onPress?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const variants = {
    primary: "bg-cyan-primary",
    secondary: "border border-white/10 bg-white/[0.07]",
    danger: "border border-rose-400/40 bg-rose-500/10"
  };
  const text = variant === "primary" ? "text-ink-950" : variant === "danger" ? "text-rose-100" : "text-slate-100";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-md px-4 ${variants[variant]} ${className}`}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? "#07090d" : "#e5edf4"} /> : null}
      <Text className={`text-sm font-semibold ${text}`}>{children}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default"
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad";
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-slate-300">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className="min-h-12 rounded-md border border-white/10 bg-ink-950/70 px-3 text-base text-slate-100"
      />
    </View>
  );
}

export function Segmented({
  value,
  onChange
}: {
  value: "income" | "expense";
  onChange: (value: "income" | "expense") => void;
}) {
  return (
    <View className="flex-row rounded-md border border-white/10 bg-ink-950/70 p-1">
      {(["expense", "income"] as const).map((item) => (
        <Pressable
          key={item}
          onPress={() => onChange(item)}
          className={`flex-1 rounded-md px-3 py-3 ${value === item ? "bg-cyan-primary" : ""}`}
        >
          <Text className={`text-center text-sm font-semibold ${value === item ? "text-ink-950" : "text-slate-300"}`}>
            {item === "income" ? "Receita" : "Despesa"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ErrorText({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return <Text className="rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{message}</Text>;
}

export function StatCard({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "positive" | "negative" }) {
  const color = tone === "positive" ? "text-emerald-soft" : tone === "negative" ? "text-rose-soft" : "text-cyan-primary";

  return (
    <Card className="flex-1">
      <Text className="text-sm text-slate-400">{label}</Text>
      <Text className={`mt-2 text-2xl font-semibold ${color}`}>{formatCurrency(value)}</Text>
    </Card>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <Text className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">{children}</Text>;
}
