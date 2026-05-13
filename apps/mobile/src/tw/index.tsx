import React from "react";
import {
  Pressable as CssPressable,
  ScrollView as CssScrollView,
  Text as CssText,
  TextInput as CssTextInput,
  View as CssView
} from "react-native-css/components";
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
  return <CssView {...props} />;
}

export function Text(props: TextProps) {
  return <CssText {...props} />;
}

export function Pressable(props: PressableProps) {
  return <CssPressable {...props} />;
}

export function TextInput(props: TextInputProps) {
  return <CssTextInput {...props} />;
}

export function ScrollView(
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) {
  return <CssScrollView {...props} />;
}
