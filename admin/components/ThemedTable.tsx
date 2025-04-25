import React from "react";
import { View, Text, StyleSheet, type ViewProps, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTableProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTable({ style, lightColor, darkColor, ...otherProps }: ThemedTableProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, styles.table, style]} {...otherProps} />;
}

export function ThemedRow({ style, lightColor, darkColor, ...otherProps }: ThemedTableProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'rowBackground');

  return <View style={[{ backgroundColor }, styles.row, style]} {...otherProps} />;
}

export function ThemedHeader({ style, lightColor, darkColor, ...otherProps }: ThemedTableProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'headerBackground');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedCell({ style, lightColor, darkColor, ...otherProps }: ThemedTextProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Text style={[{ color: textColor }, styles.cell, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    fontSize: 12,
    textAlign: "center",
    padding: 5,
  },
});
