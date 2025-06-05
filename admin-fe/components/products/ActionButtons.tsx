import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

// Import FontAwesome
import { FontAwesome } from '@expo/vector-icons';

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
        style={[styles.button, { backgroundColor: "#28a745", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={pickImage}
      >
        <FontAwesome name="image" size={20} color="white" style={{ marginRight: 8 }} />
        <ThemedText style={styles.buttonText}>Pick an Image</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={handleUpdateProduct || handleAddProduct}
      >
        {handleUpdateProduct ? (
          // FontAwesome for "Update Product"
          <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 8 }} />
        ) : (
          // FontAwesome for "Add Product"
          <FontAwesome name="plus-circle" size={20} color="white" style={{ marginRight: 8 }} />
        )}
        <ThemedText style={styles.buttonText}>
          {handleUpdateProduct ? "Update Product" : "Add Product"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}