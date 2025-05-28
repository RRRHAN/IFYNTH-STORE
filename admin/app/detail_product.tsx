import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles/detailProductStyles";
import { Product, StockDetail } from "@/src/types/product";
import { BASE_URL } from "@/src/api/constants";

type ProductDetailModalProps = {
  product: Product | null;
};

const { width } = Dimensions.get("window");

export default function ProductDetailModal({
  product,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contentTotalHeight, setContentTotalHeight] = useState(0);
  const Top = contentTotalHeight - 650

  useEffect(() => {
    if (product?.ProductImages && product.ProductImages.length > 0) {
      setSelectedImage(`${BASE_URL}/api${product.ProductImages[0].URL}`);
    } else {
      setSelectedImage("https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png");
    }
  }, [product, contentTotalHeight]);

  if (!product) return null;

  const thumbnails =
    product.ProductImages?.map((img) => `${BASE_URL}/api${img.URL}`) || [];

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
        width: "100%",
      }}
      onContentSizeChange={(contentWidth, contentHeight) => {
        setContentTotalHeight(contentHeight);
      }}
    >
      <View style={styles.imageDetailRow}>
        <View
          style={[styles.imageSection]}
        >
          <Image source={{ uri: selectedImage! }} style={styles.mainImage} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {thumbnails.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(uri)}
              >
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
        <View
          style={[
            styles.details,
            {
              position: 'relative',
              top: Platform.OS === "web" ? 0 : - Top,
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>{product.Name}</ThemedText>
              <ThemedText style={styles.subtitle}>
                {product.Category}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {product.Department === "IFY"
                  ? "I Found You"
                  : "No Time to Hell"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>
              Price : Rp {product.Price.toLocaleString()}
            </ThemedText>
          </View>
          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>
              Commodity Capital(Modal) : Rp
              {product.ProductCapital.CapitalPerItem.toLocaleString()}
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