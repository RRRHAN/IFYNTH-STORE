import React from "react";
import { View } from "react-native";
import { ThemedTextInput } from "@/components/ThemedTextInput";

interface ProductFormInputsProps {
  name: string;
  description: string;
  price: string;
  isDark: boolean;
  setName: (text: string) => void;
  setDescription: (text: string) => void;
  setPrice: (text: string) => void;
  styles: any;
}

export default function ProductFormInputs({
  name,
  description,
  price,
  isDark,
  setName,
  setDescription,
  setPrice,
  styles,
}: ProductFormInputsProps) {
  return (
    <View>
      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Product Name"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={name}
        onChangeText={setName}
      />

      <ThemedTextInput
        style={[
          styles.input,
          { borderColor: isDark ? "#666" : "#ccc", textAlignVertical: "top" },
        ]}
        placeholder="Product Description"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Price"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />
    </View>
  );
}
