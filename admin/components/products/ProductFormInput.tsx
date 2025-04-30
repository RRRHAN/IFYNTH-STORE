import React from "react";
import { View } from "react-native";
import { ThemedTextInput } from "@/components/ThemedTextInput";

interface ProductFormInputsProps {
  name: string;
  description: string;
  price: string;
  capital: string;
  isDark: boolean;
  setName: (text: string) => void;
  setDescription: (text: string) => void;
  setPrice: (text: string) => void;
  setCapital: (text: string) => void;
  styles: any;
}

export default function ProductFormInputs({
  name,
  description,
  price,
  capital,
  isDark,
  setName,
  setDescription,
  setPrice,
  setCapital,
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

<ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Commodity Capital"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={capital}
        onChangeText={(text) => setCapital(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />
    </View>
  );
}
