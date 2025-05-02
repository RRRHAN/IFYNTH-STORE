import React from "react";
import { View } from "react-native";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedText } from "../ThemedText";

interface ProductFormInputsProps {
  name: string;
  description: string;
  price: string;
  weight: string;
  capital: string;
  isDark: boolean;
  setName: (text: string) => void;
  setDescription: (text: string) => void;
  setPrice: (text: string) => void;
  setWeight: (text: string) => void;
  setCapital: (text: string) => void;
  styles: any;
}

export default function ProductFormInputs({
  name,
  description,
  price,
  weight,
  capital,
  isDark,
  setName,
  setDescription,
  setPrice,
  setWeight,
  setCapital,
  styles,
}: ProductFormInputsProps) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 3 }}>
          <ThemedText>Product Name</ThemedText>
          <ThemedTextInput
            style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
            placeholder="Enter product name"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ThemedText>Product Weight</ThemedText>
          <ThemedTextInput
            style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
            placeholder="gram"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={weight}
            onChangeText={(text) => setWeight(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>
      </View>
      <ThemedText>Product Description</ThemedText>
      <ThemedTextInput
        style={[
          styles.desc,
          { borderColor: isDark ? "#666" : "#ccc", textAlignVertical: "top" },
        ]}
        placeholder="Enter product description"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText>Product Price</ThemedText>
          <ThemedTextInput
            style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
            placeholder="Enter product price"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={price}
            onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1 }}>
          <ThemedText>Commodity Capital</ThemedText>
          <ThemedTextInput
            style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
            placeholder="Enter commodity capital"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={capital}
            onChangeText={(text) => setCapital(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}
