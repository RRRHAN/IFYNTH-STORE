import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles/detailProductStyles";
import { Product, StockDetail } from "./types/product";

type ProductDetailModalProps = {
  product: Product | null;
};

const { width } = Dimensions.get("window");

export default function ProductDetailModal({
  product,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (product?.ProductImages && product.ProductImages.length > 0) {
      setSelectedImage(`http://localhost:7777${product.ProductImages[0].URL}`);
    } else {
      setSelectedImage("https://via.placeholder.com/300");
    }
  }, [product]);

  if (!product) return null;

  const thumbnails =
    product.ProductImages?.map((img) => `http://localhost:7777${img.URL}`) || [];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.imageDetailRow}>
        {/* Gambar utama + thumbnail */}
        <View style={styles.imageSection}>
          <Image source={{ uri: selectedImage! }} style={styles.mainImage} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {thumbnails.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(uri)}>
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumbnail,
                    selectedImage === uri && styles.activeThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Detail produk */}
        <View style={styles.details}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>{product.Name}</ThemedText>
              <ThemedText style={styles.subtitle}>{product.Category}</ThemedText>
              <ThemedText style={styles.subtitle}>{product.Department === "IFY" ? "I Found You" : "No Time to Hell"}</ThemedText>
            </View>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>
              Rp {product.Price.toLocaleString()}
            </ThemedText>
          </View>

          <View style={styles.stockTable}>
            <View style={styles.stockHeader}>
              <ThemedText style={styles.stockHeaderText}>Size</ThemedText>
              <ThemedText style={styles.stockHeaderText}>Stock</ThemedText>
            </View>
            {product.StockDetails.map((stock: StockDetail) => (
              <View key={stock.ID} style={styles.stockRow}>
                <ThemedText style={styles.stockText}>{stock.Size}</ThemedText>
                <ThemedText style={styles.stockText}>{stock.Stock}</ThemedText>
              </View>
            ))}
          </View>

          <ThemedText style={styles.description}>
            {product.Description || "No description available."}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}
