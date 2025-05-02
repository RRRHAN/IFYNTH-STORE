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
import { cusProduct } from "./types/product";

type OfferDetailModalProps = {
  product: cusProduct | null;
};

const { width } = Dimensions.get("window");

export default function OfferDetailModal({
  product,
}: OfferDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (product?.Files && product.Files.length > 0) {
      setSelectedImage(`http://localhost:7777${product.Files[0].URL}`);
    } else {
      setSelectedImage("https://via.placeholder.com/300");
    }
  }, [product]);

  if (!product) return null;

  const thumbnails =
    product.Files?.map((img) => `http://localhost:7777${img.URL}`) || [];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.imageDetailRow}>
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
              <ThemedText style={styles.title}>Product Name : {product.Name}</ThemedText>
              <ThemedText style={styles.subtitle}>Customer Name : {product.customer_name}</ThemedText>
              <ThemedText style={styles.subtitle}>Status : {product.Status}</ThemedText>
            </View>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>Price : Rp {product.Price.toLocaleString()}
            </ThemedText>
          </View>
          <ThemedText style={styles.description}>
            {product.Description || "No description available."}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}
