import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconButton } from "react-native-paper";

interface SelectedImagesListProps {
  images: { uri: string }[];
  handleRemoveImage: (index: number) => void;
  styles: any;
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
            style={styles.removeButton}
            onPress={() => handleRemoveImage(index)}
          >
            <IconButton icon="trash-can" size={24} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
