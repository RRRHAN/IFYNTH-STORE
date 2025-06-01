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
} from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../styles/cusProductStyles";
import { cusProduct } from "@/src/types/product";
import { fetchOffers, handleStatusChange, Status } from "@/src/api/cusoffers";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedTable,
  ThemedRow,
  ThemedHeader,
  ThemedCell,
} from "@/components/ThemedTable";
import OfferDetailModal from "../detail_offer";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "@/src/api/constants";
import { generateVideoThumbnailJS } from "@/hooks/helpers/ThumbnailProcessor";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as VideoThumbnails from "expo-video-thumbnails";
import StatusOfferIOS from "@/components/StatusOfferIOS";
import { FontAwesome } from "@expo/vector-icons"; // Mengubah import menjadi FontAwesome

const UserAdvertisementScreen = () => {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(screenWidth < 768);
  const columnWidths = isMobile
    ? {
        name: screenWidth * 0.22,
        status: screenWidth * 0.4,
        action: screenWidth * 0.12,
      }
    : {
        image: screenWidth * 0.15,
        name: screenWidth * 0.2,
        price: screenWidth * 0.15,
        status: screenWidth * 0.18,
        action: screenWidth * 0.1,
      };
  const [fontSizeHeader, setFontSizeHeader] = useState(
    screenWidth < 768 ? 14 : 18
  );

  const router = useRouter();
  const [offers, setOffers] = useState<cusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<cusProduct | null>(
    null
  );
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: Status;
  }>({});

  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(offers.length / itemsPerPage);

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
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    getData();
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsMobile(window.width < 768);
      setFontSizeHeader(window.width < 768 ? 14 : 18);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    async function generateThumbnails() {
      for (const item of offers) {
        if (item.Files && item.Files.length > 0) {
          const fileUrl = item.Files[0].URL;
          if (/\.(mp4|webm|ogg)$/i.test(fileUrl)) {
            try {
              const mediaUrl = `${BASE_URL}/api${fileUrl}`;
              if (Platform.OS === "web") {
                const url = await generateVideoThumbnailJS(mediaUrl);
                setThumbnailUrls((prev) => ({ ...prev, [item.ID]: url }));
              } else {
                const { uri } = await VideoThumbnails.getThumbnailAsync(
                  mediaUrl,
                  { time: 1000 }
                );
                setThumbnailUrls((prev) => ({
                  ...prev,
                  [item.ID]: uri,
                }));
              }
            } catch (error) {
              console.warn("Failed to generate thumbnail for video", error);
              setThumbnailUrls((prev) => ({
                ...prev,
                [item.ID]: `${BASE_URL}/api${fileUrl}`,
              }));
            }
          } else {
            setThumbnailUrls((prev) => ({
              ...prev,
              [item.ID]: `${BASE_URL}/api${fileUrl}`,
            }));
          }
        }
      }
    }

    if (offers.length > 0) {
      generateThumbnails();
    }
  }, [offers]);

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

  // Calculate items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = offers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderItem = ({ item }: { item: cusProduct }) => {
    const thumbnailUrl =
      thumbnailUrls[item.ID] ||
      "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";

    return (
      <ThemedRow>
        {!isMobile && (
          <ThemedCell style={[{ width: columnWidths.image }]}>
            {
              <Image
                style={styles.image}
                source={{
                  uri:
                    thumbnailUrl ||
                    "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
                }}
              />
            }
          </ThemedCell>
        )}
        <ThemedCell style={[{ width: columnWidths.name }]}>
          {item.customer_name}
        </ThemedCell>
        <ThemedCell style={[{ width: columnWidths.name }]}>
          {item.Name}
        </ThemedCell>
        {!isMobile && (
          <ThemedCell style={[{ width: columnWidths.price }]}>
            Rp {item.Price.toLocaleString()}
          </ThemedCell>
        )}
        {Platform.OS === "ios" ? (
          <StatusOfferIOS
            item={item}
            columnWidths={columnWidths}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            currentItemId={currentItemId}
            setCurrentItemId={setCurrentItemId}
            modalStatusVisible={modalStatusVisible}
            setModalStatusVisible={setModalStatusVisible}
            handleStatusChange={handleStatusChange}
            offers={offers}
          />
        ) : (
          <ThemedCell
            style={[
              {
                width: columnWidths.status,
                minHeight: 60,
                overflow: "visible",
              },
            ]}
          >
            <Picker
              selectedValue={selectedStatus[item.ID] || item.Status}
              onValueChange={(newStatus: Status) => {
                handleStatusChange(newStatus, item.ID);
                setSelectedStatus((prev) => ({
                  ...prev,
                  [item.ID]: newStatus,
                }));
              }}
              enabled={
                (selectedStatus[item.ID] || item.Status) !== "approved" &&
                (selectedStatus[item.ID] || item.Status) !== "rejected"
              }
              style={{
                height: 50,
                width: "100%",
                backgroundColor:
                  (selectedStatus[item.ID] || item.Status) === "approved" ||
                  (selectedStatus[item.ID] || item.Status) === "rejected"
                    ? "#ddd"
                    : colorScheme === "dark"
                    ? "#555555"
                    : "#f9fafb",
                color:
                  (selectedStatus[item.ID] || item.Status) === "approved" ||
                  (selectedStatus[item.ID] || item.Status) === "rejected"
                    ? "#888"
                    : colorScheme === "dark"
                    ? "#f9fafb"
                    : "#555555",
                borderRadius: 10,
              }}
            >
              {item.Status === "pending" && (
                <>
                  <Picker.Item label="Pending" value="pending" />
                  <Picker.Item label="Process" value="process" />
                </>
              )}
              {item.Status === "process" && (
                <Picker.Item label="Process" value="process" />
              )}
              <Picker.Item label="Approved" value="approved" />
              <Picker.Item label="Rejected" value="rejected" />
            </Picker>
          </ThemedCell>
        )}

        <ThemedCell style={[{ width: columnWidths.action }]}>
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome name="eye" size={size} color={color} />
            )}
            size={20}
            iconColor="#00FFFF"
            onPress={() => {
              setSelectedProduct(item);
              setIsProductModalVisible(true);
            }}
          />
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome name="comment" size={size} color={color} />
            )}
            size={20}
            iconColor="#4169E1"
            onPress={() => {
              setSelectedProduct(item);
              router.push({
                pathname: "/message",
                params: { item: JSON.stringify(item) },
              });
            }}
          />
          {item.UnreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <ThemedText style={styles.badgeText}>
                {item.UnreadCount}
              </ThemedText>
            </View>
          )}
        </ThemedCell>
      </ThemedRow>
    );
  };

  return (
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
          <TouchableOpacity
            onPress={() => {
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
            {/* Gunakan ikon FontAwesome untuk tombol close modal */}
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>

          <OfferDetailModal product={selectedProduct} />
        </View>
      </Modal>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={[styles.title]}>LIST USER ADVERTISEMENT</ThemedText>
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
          {!isMobile && (
            <ThemedHeader style={[{ width: columnWidths.price }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Price
              </ThemedText>
            </ThemedHeader>
          )}
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
          data={currentOffers}
          renderItem={renderItem}
          keyExtractor={(item) => item.ID}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", padding: 20 }}>
              No advertisements found.
            </ThemedText>
          }
        />
      </ThemedTable>

      {/* Pagination Controls */}
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
  );
};

export default UserAdvertisementScreen;
