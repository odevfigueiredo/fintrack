import type { ReactNode } from "react";
import Animated, { FadeInDown, FadeOut, LinearTransition } from "react-native-reanimated";

import { ScrollView } from "@/tw";

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
