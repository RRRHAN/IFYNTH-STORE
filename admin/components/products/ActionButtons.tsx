import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface ActionButtonsProps {
  pickImage: () => void;
  handleUpdateProduct?: () => void;
  handleAddProduct?: () => void;
  styles: any;
}

export default function ActionButtons({
  pickImage,
  handleUpdateProduct,
  handleAddProduct,
  styles,
}: ActionButtonsProps) {
  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={pickImage}
      >
        <ThemedText style={styles.buttonText}>Pick an Image</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={handleUpdateProduct || handleAddProduct}
      >
        <ThemedText style={styles.buttonText}>
          {handleUpdateProduct ? "Update Product" : "Add Product"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
