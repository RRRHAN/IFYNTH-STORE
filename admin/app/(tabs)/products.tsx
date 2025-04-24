import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text
} from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../styles/productStyles";
import { Product } from "../types/product";
import { fetchProducts } from "@/app/api/products";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTable, ThemedRow, ThemedHeader, ThemedCell } from "@/components/ThemedTable";

const ProductsScreen = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <ThemedRow>
      <ThemedCell
        style={[
          {
            width: columnWidths.image,
          },
        ]}
      >
        <Image
          style={styles.image}
          source={{
            uri:
              item.ProductImages && item.ProductImages.length > 0
                ? `http://localhost:7777${item.ProductImages[0].URL}`
                : "https://via.placeholder.com/80", // fallback image
          }}
        />
      </ThemedCell>
      <ThemedCell
        style={[
          { width: columnWidths.name }, // Menggunakan warna teks dari tema
        ]}
      >
        {item.Name}
      </ThemedCell>
      <ThemedCell
        style={[
          
          { width: columnWidths.price }, // Menggunakan warna teks dari tema
        ]}
      >
        Rp {item.Price.toLocaleString()}
      </ThemedCell>
      <ThemedCell
        style={[
          
          { width: columnWidths.stock }, // Menggunakan warna teks dari tema
        ]}
      >
        {item.TotalStock}
      </ThemedCell>
      <ThemedCell
        style={[
          
          { width: columnWidths.category }, // Menggunakan warna teks dari tema
        ]}
      >
        {item.Category}
      </ThemedCell>
      <ThemedCell
        style={[
          
          { width: columnWidths.department }, // Menggunakan warna teks dari tema
        ]}
      >
        {item.Department}
      </ThemedCell>
      <ThemedCell style={[ { width: columnWidths.action }]}>
        <IconButton
          icon="eye"
          size={20}
          iconColor="#00FFFF"
          onPress={() => console.log("Detail")}
        />
        <IconButton
          icon="pencil"
          size={20}
          iconColor="#4169E1"
          onPress={() => console.log("Edit")}
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor="#FF0000"
          onPress={() => console.log("Remove")}
        />
      </ThemedCell>
    </ThemedRow>
  );
  

  return (
    <ThemedView style={[styles.center,]}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={[styles.title,]}>
          LIST PRODUCTS
        </ThemedText>
        <IconButton
          icon="plus"
          size={24}
          onPress={() => router.replace("/add_product")}
        />
      </ThemedView>
      <ScrollView horizontal>
        <ThemedView style={styles.table}>
          <ThemedHeader style={[styles.row,]}>
            <ThemedHeader style={[ { width: columnWidths.image }]}>
              <Text>Product Images</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.name }]}>
              <Text>Product Name</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.price }]}>
              <Text>Price</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.stock }]}>
              <Text>Total Stock</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.category }]}>
              <Text>Category</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.department }]}>
              <Text>Department</Text>
            </ThemedHeader>
            <ThemedHeader style={[ { width: columnWidths.action }]}>
              <Text>Action</Text>
            </ThemedHeader>
          </ThemedHeader>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};
export default ProductsScreen;

const screenWidth = Dimensions.get("window").width;
const columnWidths = {
  image: screenWidth * 0.15,
  name: screenWidth * 0.15,
  description: screenWidth * 0.1,
  price: screenWidth * 0.15,
  stock: screenWidth * 0.15,
  category: screenWidth * 0.1,
  department: screenWidth * 0.1,
  action: screenWidth * 0.1,
};

