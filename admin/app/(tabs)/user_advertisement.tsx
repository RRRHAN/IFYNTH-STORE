import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  View,
  Modal,
} from "react-native";
import { IconButton, Tooltip } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../styles/productStyles";
import { cusProduct } from "../types/product";
import { fetchOffers, handleStatusChange } from "@/app/api/cusoffers";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedTable,
  ThemedRow,
  ThemedHeader,
  ThemedCell,
} from "@/components/ThemedTable";
import ModalComponent from "@/components/ModalComponent";
import OfferDetailModal from "../detail_offer";
import { Picker } from "@react-native-picker/picker";

const userOffers = () => {
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(screenWidth < 768);
  const columnWidths = isMobile
    ? {
        name: screenWidth * 0.15,
        price: screenWidth * 0.15,
        status: screenWidth * 0.15,
        action: screenWidth * 0.12,
      }
    : {
        image: screenWidth * 0.15,
        name: screenWidth * 0.2,
        price: screenWidth * 0.15,
        status: screenWidth * 0.12,
        action: screenWidth * 0.1,
      };

  const [fontSizeTitle, setFontSizeTitle] = useState(
    screenWidth < 768 ? 20 : 28
  );
  const [fontSizeHeader, setFontSizeHeader] = useState(
    screenWidth < 768 ? 14 : 18
  );

  const router = useRouter();
  const [offers, setOffers] = useState<cusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<cusProduct | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const getData = async () => {
    try {
      const data = await fetchOffers();

      if (data && data.length > 0) {
        setOffers(data);
      } else {
        console.warn("No products found.");
        setOffers([]);
      }
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

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: cusProduct }) => (
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
                item.Files && item.Files.length > 0
                  ? `http://localhost:7777${item.Files[0].URL}`
                  : "https://via.placeholder.com/80",
            }}
          />
        </ThemedCell>
      )}
      <ThemedCell style={[{ width: columnWidths.name }]}>
        {item.customer_name}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.name }]}>
        {item.Name}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.price }]}>
        Rp {item.Price.toLocaleString()}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.status }]}>
        <Picker
          selectedValue={selectedStatus !== "pending" ? item.Status : selectedStatus}
          onValueChange={(newStatus) => {
            setSelectedStatus(newStatus);
            handleStatusChange(newStatus, item.ID);
          }}
          style={{ height: 50, width: "100%" }}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Approved" value="approved" />
          <Picker.Item label="Rejected" value="rejected" />
        </Picker>
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
          icon="message"
          size={20}
          iconColor="#4169E1"
          onPress={() => {setSelectedProduct(item);
            router.push({
              pathname: "/message",
              params: { item: JSON.stringify(item) },
            });
          }}
        />
      </ThemedCell>
    </ThemedRow>
  );

  return (
    <ThemedView style={[styles.center]}>
      {/* Modal untuk menampilkan ProductDetailScreen */}
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
          <OfferDetailModal product={selectedProduct} />
        </View>
      </Modal>
      <ModalComponent
        visible={visible}
        hideModal={() => setVisible(false)}
        message={errorMessage || successMessage}
      />
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={[styles.title]}>LIST USER ADVERTISEMENT</ThemedText>
        <IconButton icon="plus" size={24} />
      </ThemedView>
      <ScrollView horizontal>
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
                Customer Name
              </ThemedText>
            </ThemedHeader>
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
            <ThemedHeader style={[{ width: columnWidths.status }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Status
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
            data={offers}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
          />
        </ThemedTable>
      </ScrollView>
    </ThemedView>
  );
};
export default userOffers;
