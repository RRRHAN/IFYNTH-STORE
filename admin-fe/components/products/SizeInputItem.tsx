// components/SizeInputItem.tsx
import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import styles from "@/app/styles/addProductStyles";

type Props = {
  size: string;
  stock: number;
  onStockChange: (value: string) => void;
};

export default function SizeInputItem({ size, stock, onStockChange }: Props) {
  const isDark = false;

  return (
    <View style={styles.sizeWrapper}>
      <ThemedText style={[styles.sizeText]}>Size: {size}</ThemedText>
      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        value={stock.toString()}
        onChangeText={onStockChange}
        placeholder="Stock"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        keyboardType="numeric"
      />
    </View>
  );
}
