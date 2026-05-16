import type { ReactNode } from "react";
import Animated, { FadeInDown, FadeOut, LinearTransition } from "react-native-reanimated";

import { ScrollView, Text, View } from "@/tw";

type ScreenScrollProps = {
  children: ReactNode;
  className?: string;
  contentContainerClassName?: string;
};

export function ScreenScroll({ children, className = "", contentContainerClassName = "" }: ScreenScrollProps) {
  return (
    <ScrollView
      className={`flex-1 bg-ink-950 ${className}`}
      contentContainerClassName={`p-5 pb-32 ${contentContainerClassName}`}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Animated.View
        entering={FadeInDown.duration(340).springify().damping(18)}
        exiting={FadeOut.duration(140)}
        layout={LinearTransition.springify().damping(18)}
        style={{ gap: 20 }}
      >
        {children}
      </Animated.View>
    </ScrollView>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  badge
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <View className="gap-3">
      {badge ? (
        <View className="self-start rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
          <Text className="text-xs font-semibold uppercase text-cyan-100">{badge}</Text>
        </View>
      ) : null}
      <View>
        <Text className="text-2xl font-semibold text-white">{title}</Text>
        {subtitle ? <Text className="mt-2 text-sm leading-5 text-slate-400">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
