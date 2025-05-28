import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
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
              // fallback ke fileUrl as image
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
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
          <>
            <ThemedCell
              style={[
                {
                  width: columnWidths.status,
                  minHeight: 60,
                  overflow: "visible",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setModalStatusVisible(true)}
                style={{
                  height: 50,
                  width: 150,
                  justifyContent: "center",
                  backgroundColor:
                    colorScheme === "dark" ? "#555555" : "#f9fafb",
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                }}
              >
                <ThemedText style={{ textAlign: "center" }}>
                  {(selectedStatus[item.ID] || item.Status)
                    .charAt(0)
                    .toUpperCase() +
                    (selectedStatus[item.ID] || item.Status).slice(1)}
                </ThemedText>
              </TouchableOpacity>
            </ThemedCell>
            <Modal
              visible={modalStatusVisible}
              transparent
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <ThemedView
                  style={{
                    paddingBottom: 20,
                    width: 300,
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalStatusVisible(false)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        alignItems: "center",
                        right: 95,
                        bottom: 15,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: "#000",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        ❌
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText
                      style={{
                        paddingVertical: 10,
                        alignItems: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        right: 30,
                      }}
                    >
                      Status
                    </ThemedText>
                  </View>

                  <Picker
                    selectedValue={selectedStatus[item.ID] || item.Status}
                    onValueChange={(newStatus: Status) => {
                      handleStatusChange(newStatus, item.ID);
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [item.ID]: newStatus,
                      }));
                    }}
                    itemStyle={{ height: 120 }}
                  >
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Process" value="process" />
                    <Picker.Item label="Approved" value="approved" />
                    <Picker.Item label="Rejected" value="rejected" />
                  </Picker>
                </ThemedView>
              </View>
            </Modal>
          </>
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
              style={{
                height: 50,
                width: "100%",
                backgroundColor: colorScheme === "dark" ? "#555555" : "#f9fafb",
                color: colorScheme === "dark" ? "#f9fafb" : "#555555",
                borderRadius: 10,
              }}
            >
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Process" value="process" />
              <Picker.Item label="Approved" value="approved" />
              <Picker.Item label="Rejected" value="rejected" />
            </Picker>
          </ThemedCell>
        )}

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
            onPress={() => {
              setSelectedProduct(item);
              router.push({
                pathname: "/message",
                params: { item: JSON.stringify(item) },
              });
            }}
          />
        </ThemedCell>
      </ThemedRow>
    );
  };

  return (
    <ThemedView
      style={[styles.center, { marginTop: Platform.OS === "web" ? 20 : 50 }]}
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
            <ThemedText style={{ fontSize: 20, color: "black" }}>✕</ThemedText>
          </TouchableOpacity>

          <OfferDetailModal product={selectedProduct} />
        </View>
      </Modal>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={[styles.title]}>LIST USER ADVERTISEMENT</ThemedText>
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
            data={offers}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
          />
        </ThemedTable>
      </ScrollView>
    </ThemedView>
  );
};

export default UserAdvertisementScreen;
