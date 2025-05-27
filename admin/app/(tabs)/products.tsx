import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  View,
  Modal,
  Platform
} from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../styles/productStyles";
import { Product } from "@/src/types/product";
import { fetchProducts } from "@/src/api/products";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedTable,
  ThemedRow,
  ThemedHeader,
  ThemedCell,
} from "@/components/ThemedTable";
import { deleteProduct } from "@/src/api/products";
import ModalComponent from "@/components/ModalComponent";
import ProductDetailModal from "@/app/detail_product";
import { BASE_URL } from "@/src/api/constants";

const ProductsScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(screenWidth < 768);
  const columnWidths = isMobile
    ? {
        name: screenWidth * 0.3,
        price: screenWidth * 0.15,
        stock: screenWidth * 0.1,
        category: screenWidth * 0.1,
        department: screenWidth * 0.15,
        action: screenWidth * 0.12,
      }
    : {
        image: screenWidth * 0.15,
        name: screenWidth * 0.15,
        price: screenWidth * 0.15,
        stock: screenWidth * 0.15,
        category: screenWidth * 0.1,
        department: screenWidth * 0.1,
        action: screenWidth * 0.1,
      };

      const [fontSizeTitle, setFontSizeTitle] = useState(
        screenWidth < 768 ? 20 : 28
      );
      const [fontSizeHeader, setFontSizeHeader] = useState(
        screenWidth < 768 ? 14 : 18
      );

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visible, setVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    getData();
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsMobile(window.width < 768);
      setFontSizeTitle(window.width < 768 ? 20 : 28);
      setFontSizeHeader(window.width < 768 ? 14 : 18);
    });
    return () => subscription?.remove();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteProduct(productId);
      setSuccessMessage("Product deleted successfully!");
      getData();
      setErrorMessage(""); // Clear any previous errors
      setVisible(true); // Show success modal
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
      setSuccessMessage(""); // Clear any previous successes
      setVisible(true); // Show error modal
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <ThemedRow>
      {!isMobile && (
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
                  ? `${BASE_URL}/api${item.ProductImages[0].URL}`
                  : "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
            }}
          />
        </ThemedCell>
      )}
      <ThemedCell style={[{ width: columnWidths.name }]}>
        {item.Name}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.price }]}>
        Rp {item.Price.toLocaleString()}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.stock }]}>
        {item.TotalStock}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.category }]}>
        {item.Category}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.department }]}>
        {item.Department === "IFY" ? "I Found You" : "No Time to Hell"}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.action }]}>
        <IconButton
          icon="eye"
          size={20}
          iconColor="#00FFFF"
          onPress={() => {
            setSelectedProduct(item);
            setIsProductModalVisible(true);
          }}
        />
        <IconButton
          icon="pencil"
          size={20}
          iconColor="#4169E1"
          onPress={() => {setSelectedProduct(item);
            router.push({
              pathname: "/edit_product",
              params: { item: JSON.stringify(item) },
            });
          }}
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor="#FF0000"
          onPress={() => handleDelete(item.ID)}
        />
      </ThemedCell>
    </ThemedRow>
  );

  return (
    <ThemedView style={[styles.center, {marginTop: Platform.OS === "web" ? 20 : 50, }]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProductModalVisible}
        onRequestClose={() => setIsProductModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          {/* Tombol silang dengan React Native Paper */}
          <IconButton
            icon="close"
            size={24}
            onPress={() => setIsProductModalVisible(false)}
            style={{
              position: "absolute",
              top: 40,
              left: 20,
              backgroundColor: "white",
              zIndex: 1,
            }}
            iconColor="black"
          />

          {/* Konten modal */}
          <ProductDetailModal product={selectedProduct} />
        </View>
      </Modal>
      <ModalComponent
        visible={visible}
        hideModal={() => setVisible(false)}
        message={errorMessage || successMessage}
      />
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={[styles.title]}>LIST PRODUCTS</ThemedText>
        <IconButton
          icon="plus"
          size={24}
          onPress={() => router.replace("/add_product")}
        />
      </ThemedView>
      <ScrollView horizontal>
        <ThemedTable>
          <ThemedHeader style={[styles.row]}>
            {!isMobile && (
              <ThemedHeader style={[{ width: columnWidths.image }]}>
                <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                  Product Images
                </ThemedText>
              </ThemedHeader>
            )}
            <ThemedHeader style={[{ width: columnWidths.name }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Product Name
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.price }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Price
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.stock }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Total Stock
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.category }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Category
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.department }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Department
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.action }]}>
              <ThemedText type="subtitle" style={[styles.header, { fontSize: fontSizeHeader }]}>
                Action
              </ThemedText>
            </ThemedHeader>
          </ThemedHeader>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
          />
        </ThemedTable>
      </ScrollView>
    </ThemedView>
  );
};
export default ProductsScreen;
