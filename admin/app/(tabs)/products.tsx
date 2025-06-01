import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  View,
  Modal,
  Platform,
  TouchableOpacity,
  ScrollView,
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
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";

const ProductsScreen = () => {
  const colorScheme = useColorScheme();
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = screenWidth > 1000 ? 8 : 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const getData = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <ThemedView style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#111827"}
        />
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
          // Gunakan ikon FontAwesome sebagai children
          icon={({ color, size }) => (
            <FontAwesome name="eye" size={size} color={color} /> // Ikon "eye" tersedia di FontAwesome
          )}
          size={20}
          iconColor="#00FFFF" // Warna untuk ikon itu sendiri
          onPress={() => {
            setSelectedProduct(item);
            setIsProductModalVisible(true);
          }}
        />
        <IconButton
          // Gunakan ikon FontAwesome sebagai children
          icon={({ color, size }) => (
            <FontAwesome name="edit" size={size} color={color} /> // Ikon "pencil" (atau "edit") tersedia
          )}
          size={20}
          iconColor="#4169E1" // Warna untuk ikon itu sendiri
          onPress={() => {
            setSelectedProduct(item);
            router.push({
              pathname: "/edit_product",
              params: { item: JSON.stringify(item) },
            });
          }}
        />
        <IconButton
          // Gunakan ikon FontAwesome sebagai children
          icon={({ color, size }) => (
            <FontAwesome name="trash" size={size} color={color} /> // Ikon "trash" (atau "remove") tersedia
          )}
          size={20}
          iconColor="#FF0000" // Warna untuk ikon itu sendiri
          onPress={() => handleDelete(item.ID)}
        />
      </ThemedCell>
    </ThemedRow>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
      }}
    >
      <ThemedView
        style={[styles.center, { marginTop: Platform.OS === "web" ? 20 : 80 }]}
      >
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
            {/* Tombol silang dengan FontAwesome */}
            <TouchableOpacity
              onPress={() => {
                console.log("Tombol close diklik");
                setIsProductModalVisible(false);
              }}
              style={{
                position: "absolute",
                top: Platform.OS === "web" ? 50 : 80,
                left: 20,
                backgroundColor: "white",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                elevation: 10,
              }}
            >
              <FontAwesome name="times" size={24} color="black" />{" "}
              {/* Menggunakan "times" untuk silang */}
            </TouchableOpacity>

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
            // Gunakan ikon FontAwesome untuk "plus"
            icon={({ color, size }) => (
              <FontAwesome name="plus" size={size} color={color} /> // Ikon "plus" tersedia di FontAwesome
            )}
            size={24}
            // Default iconColor untuk IconButton paper adalah tema, jadi bisa diabaikan
            // iconColor={colorScheme === "dark" ? "#ffffff" : "#111827"} // Sesuaikan jika perlu
            onPress={() => router.replace("/add_product")}
          />
        </ThemedView>
        <ThemedTable>
          <ThemedHeader style={[styles.row]}>
            {!isMobile && (
              <ThemedHeader style={[{ width: columnWidths.image }]}>
                <ThemedText
                  type="subtitle"
                  style={[styles.header, { fontSize: fontSizeHeader }]}
                >
                  Product Images
                </ThemedText>
              </ThemedHeader>
            )}
            <ThemedHeader style={[{ width: columnWidths.name }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Product Name
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.price }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Price
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.stock }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Total Stock
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.category }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Category
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.department }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Department
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.action }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Action
              </ThemedText>
            </ThemedHeader>
          </ThemedHeader>
          <FlatList
            data={currentProducts}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
            ListEmptyComponent={
              <ThemedText style={{ textAlign: "center", paddingVertical: 20 }}>
                No products found.
              </ThemedText>
            }
          />
        </ThemedTable>
        <View style={styles.paginationContainer}>
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome name="chevron-left" size={size} color={color} />
            )}
            size={20}
            onPress={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            iconColor={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
          <ThemedText style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </ThemedText>
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome name="chevron-right" size={size} color={color} />
            )}
            size={20}
            onPress={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconColor={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default ProductsScreen;
