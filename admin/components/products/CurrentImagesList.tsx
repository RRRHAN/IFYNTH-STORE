import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconButton } from "react-native-paper";
import { BASE_URL } from "@/src/api/constants";
interface ProductImage {
  ProductID: string;
  URL: string;
}

interface CurrentImagesListProps {
  productImages: ProductImage[];
  checkedImages: boolean[];
  handleToggleImage: (index: number) => void;
  styles: any;
}

export default function CurrentImagesList({
  productImages,
  checkedImages,
  handleToggleImage,
  styles,
}: CurrentImagesListProps) {
  return (
    <View>
      <ThemedText>Current Images:</ThemedText>
      {productImages.length > 0 ? (
        productImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: `${BASE_URL}/api${image.URL}` }}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleToggleImage(index)}
            >
              <IconButton
                icon={checkedImages[index] ? "check-circle" : "trash-can"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <ThemedText>No current images available</ThemedText>
      )}
    </View>
  );
}
