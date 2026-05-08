import { Image } from "react-native";

import brandIcon from "../../assets/icon.png";
import { Text, View } from "@/tw";

type BrandLogoProps = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

export function BrandLogo({ title = "FinTrack", subtitle, compact = false }: BrandLogoProps) {
  const size = compact ? 44 : 56;
  const radius = compact ? 10 : 14;

  return (
    <View className="flex-row items-center gap-3">
      <Image
        source={brandIcon}
        resizeMode="cover"
        accessibilityLabel="FinTrack"
        style={{ width: size, height: size, borderRadius: radius }}
      />
      <View className="flex-1">
        <Text className={compact ? "text-2xl font-semibold text-white" : "text-3xl font-semibold text-white"}>{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-slate-400">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
