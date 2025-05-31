import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

// Impor MaterialCommunityIcons
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <MaterialCommunityIcons name="image-plus" size={20} color="white" style={{ marginRight: 8 }} />
        <ThemedText style={styles.buttonText}>Pick an Image</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={handleUpdateProduct || handleAddProduct}
      >
        {handleUpdateProduct ? (
          <MaterialCommunityIcons name="update" size={20} color="white" style={{ marginRight: 8 }} />
        ) : (
          <MaterialCommunityIcons name="plus-circle" size={20} color="white" style={{ marginRight: 8 }} />
        )}
        <ThemedText style={styles.buttonText}>
          {handleUpdateProduct ? "Update Product" : "Add Product"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}