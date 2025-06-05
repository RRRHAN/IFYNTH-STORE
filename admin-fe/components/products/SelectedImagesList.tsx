import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native"; // Import StyleSheet
import { ThemedText } from "@/components/ThemedText";
// Removed unused IconButton import

// Import FontAwesome
import { FontAwesome } from '@expo/vector-icons';

interface SelectedImagesListProps {
  images: { uri: string }[];
  handleRemoveImage: (index: number) => void;
  styles: any; // Consider defining a more specific type for 'styles'
}

export default function SelectedImagesList({
  images,
  handleRemoveImage,
  styles,
}: SelectedImagesListProps) {
  if (images.length === 0) return null;

  return (
    <View>
      <ThemedText>Selected Images:</ThemedText>
      {images.map((img, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri: img.uri }} style={styles.image} />
          <TouchableOpacity
            style={[
              styles.removeButton, // Existing styles
              styles.iconButtonContainer
            ]}
            onPress={() => handleRemoveImage(index)}
          >
            {/* Using FontAwesome directly */}
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}