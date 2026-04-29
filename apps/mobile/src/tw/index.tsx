import React from "react";
import { useCssElement } from "react-native-css";
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView
} from "react-native";

export type ViewProps = React.ComponentProps<typeof RNView> & { className?: string };
export type TextProps = React.ComponentProps<typeof RNText> & { className?: string };
export type PressableProps = React.ComponentProps<typeof RNPressable> & { className?: string };
export type TextInputProps = React.ComponentProps<typeof RNTextInput> & { className?: string };

export function View(props: ViewProps) {
  return useCssElement(RNView, props, { className: "style" });
}

export function Text(props: TextProps) {
  return useCssElement(RNText, props, { className: "style" });
}

export function Pressable(props: PressableProps) {
  return useCssElement(RNPressable, props, { className: "style" });
}

export function TextInput(props: TextInputProps) {
  return useCssElement(RNTextInput, props, { className: "style" });
}

export function ScrollView(
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) {
  return useCssElement(RNScrollView, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle"
  });
}
