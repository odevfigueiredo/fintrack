import { useEffect } from "react";
import type { Href } from "expo-router";
import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type HotbarIconName = "home" | "transactions" | "add" | "goals" | "settings";

type HotbarItemConfig = {
  href: Href;
  label: string;
  icon: HotbarIconName;
  matches: string[];
  primary?: boolean;
};

const items: HotbarItemConfig[] = [
  { href: "/(app)/home", label: "Inicio", icon: "home", matches: ["/home"] },
  { href: "/(app)/transactions", label: "Trans.", icon: "transactions", matches: ["/transactions", "/edit-transaction"] },
  { href: "/(app)/new-transaction", label: "Novo", icon: "add", matches: ["/new-transaction"], primary: true },
  { href: "/(app)/goals", label: "Metas", icon: "goals", matches: ["/goals"] },
  { href: "/(app)/settings", label: "Ajustes", icon: "settings", matches: ["/settings", "/profile", "/categories"] }
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function isActive(pathname: string, item: HotbarItemConfig) {
  return item.matches.some((match) => pathname.endsWith(match) || pathname.includes(match));
}

function IconShape({ name, active, primary }: { name: HotbarIconName; active: boolean; primary?: boolean }) {
  const color = primary ? "#07090D" : active ? "#22D3EE" : "#9AA8B8";
  const muted = primary ? "rgba(7, 9, 13, 0.42)" : active ? "rgba(34, 211, 238, 0.42)" : "rgba(154, 168, 184, 0.42)";

  if (name === "home") {
    return (
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3, height: 20 }}>
        {[9, 15, 12].map((height, index) => (
          <View key={index} style={{ width: 4, height, borderRadius: 2, backgroundColor: index === 1 ? color : muted }} />
        ))}
      </View>
    );
  }

  if (name === "transactions") {
    return (
      <View style={{ width: 18, height: 20, borderWidth: 1.5, borderColor: color, borderRadius: 4, padding: 3, gap: 3 }}>
        <View style={{ height: 2, borderRadius: 1, backgroundColor: color }} />
        <View style={{ height: 2, width: 8, borderRadius: 1, backgroundColor: muted }} />
        <View style={{ height: 2, width: 10, borderRadius: 1, backgroundColor: muted }} />
      </View>
    );
  }

  if (name === "add") {
    return (
      <View style={{ width: 21, height: 21, alignItems: "center", justifyContent: "center" }}>
        <View style={{ position: "absolute", width: 21, height: 3, borderRadius: 2, backgroundColor: color }} />
        <View style={{ position: "absolute", width: 3, height: 21, borderRadius: 2, backgroundColor: color }} />
      </View>
    );
  }

  if (name === "goals") {
    return (
      <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
        <View style={{ position: "absolute", width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: muted }} />
        <View style={{ position: "absolute", width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: color }} />
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
      </View>
    );
  }

  return (
    <View style={{ width: 22, height: 22, justifyContent: "space-between" }}>
      {[4, 11, 17].map((left, index) => (
        <View key={index} style={{ height: 3, borderRadius: 2, backgroundColor: index === 1 ? color : muted }}>
          <View style={{ position: "absolute", left, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        </View>
      ))}
    </View>
  );
}

function HotbarItem({ item, active }: { item: HotbarItemConfig; active: boolean }) {
  const router = useRouter();
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, { damping: 16, stiffness: 190 });
  }, [active, progress]);

  const itemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, item.primary ? -8 : -3]) },
      { scale: interpolate(progress.value, [0, 1], [1, item.primary ? 1.06 : 1.03]) }
    ]
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    backgroundColor: item.primary
      ? interpolateColor(progress.value, [0, 1], ["#22D3EE", "#34D399"])
      : interpolateColor(progress.value, [0, 1], ["rgba(255,255,255,0)", "rgba(34,211,238,0.13)"]),
    borderColor: item.primary
      ? interpolateColor(progress.value, [0, 1], ["rgba(34,211,238,0.55)", "rgba(52,211,153,0.75)"])
      : interpolateColor(progress.value, [0, 1], ["rgba(255,255,255,0)", "rgba(34,211,238,0.32)"])
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ["#94A3B8", item.primary ? "#34D399" : "#E5EDF4"])
  }));

  function navigate() {
    if (!active) {
      router.replace(item.href);
    }
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={navigate}
      style={[
        {
          width: item.primary ? 62 : 58,
          height: 64,
          alignItems: "center",
          justifyContent: "center",
          gap: 4
        },
        itemStyle
      ]}
    >
      <Animated.View
        style={[
          {
            width: item.primary ? 54 : 44,
            height: item.primary ? 54 : 38,
            borderRadius: item.primary ? 20 : 15,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            boxShadow: item.primary ? "0 12px 28px rgba(34, 211, 238, 0.28)" : "none"
          },
          bubbleStyle
        ]}
      >
        <IconShape name={item.icon} active={active} primary={item.primary} />
      </Animated.View>
      <Animated.Text style={[{ fontSize: 10, fontWeight: "700", letterSpacing: 0 }, labelStyle]}>{item.label}</Animated.Text>
    </AnimatedPressable>
  );
}

export function BottomHotbar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const translate = useSharedValue(20);

  useEffect(() => {
    translate.value = withSpring(0, { damping: 18, stiffness: 160 });
  }, [translate]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translate.value }]
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: Math.max(10, insets.bottom + 8)
        },
        containerStyle
      ]}
    >
      <View
        style={{
          minHeight: 82,
          borderRadius: 28,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(148, 163, 184, 0.18)",
          backgroundColor: "rgba(8, 13, 20, 0.94)",
          paddingHorizontal: 10,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 18px 46px rgba(0, 0, 0, 0.42)"
        }}
      >
        {items.map((item) => (
          <HotbarItem key={item.label} item={item} active={isActive(pathname, item)} />
        ))}
      </View>
      <Text style={{ marginTop: 6, textAlign: "center", fontSize: 10, color: "rgba(148, 163, 184, 0.72)" }}>
        FinTrack
      </Text>
    </Animated.View>
  );
}
