import React, { useEffect, useState, useMemo } from "react";
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Badge, BadgeText } from "@/components/ui/badge";

// Icons from Lucide
import {
  ArrowLeft,
  Eye,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";

// Imports dari project Anda
import { useRouter } from "expo-router";
import { cusProduct } from "@/src/types/product";
import {
  fetchOffers,
  handleStatusChange as apiHandleStatusChange,
  Status,
} from "@/src/api/cusoffers";
import { BASE_URL } from "@/src/api/constants";
import { generateVideoThumbnailJS } from "@/hooks/helpers/ThumbnailProcessor";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useColorScheme } from "nativewind";
import OfferDetailModal from "../detail_offer";

const VALID_ADVERTISEMENT_STATUS_TRANSITIONS = {
  pending: ["pending", "process", "approved", "rejected"],
  process: ["process", "approved", "rejected"],
  approved: ["approved"],
  rejected: ["rejected"],
};

const UserAdvertisementScreen = () => {
  const { colorScheme } = useColorScheme();
  const { width: screenWidth } = Dimensions.get("window");
  const router = useRouter();

  const [offers, setOffers] = useState<cusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobileLayout, setIsMobileLayout] = useState(screenWidth < 768);

  const [selectedProduct, setSelectedProduct] = useState<cusProduct | null>(
    null
  );
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const [isStatusPickerModalVisible, setStatusPickerModalVisible] =
    useState(false);
  const [currentEditingItemId, setCurrentEditingItemId] = useState<
    string | null
  >(null);

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: Status;
  }>({});
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = screenWidth > 1000 ? 8 : 4;
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const getDynamicTextColor = () =>
    colorScheme === "dark" ? "text-white" : "text-gray-900";
  const getSubduedTextColor = () =>
    colorScheme === "dark" ? "text-gray-300" : "text-gray-600";
  const getTableHeaderBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-100";
  const getTableRowBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-700" : "bg-white";
  const getTableRowOddBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-50";

  const getTableRowHoverBgClass = () =>
    colorScheme === "dark" ? "hover:bg-neutral-600" : "hover:bg-gray-50";
  const getBorderColorClass = () =>
    colorScheme === "dark" ? "border-neutral-700" : "border-gray-200";
  const getLoadingTextColorClass = () =>
    colorScheme === "dark" ? "text-neutral-400" : "text-slate-500";
  const getPaginationTextColorClass = () =>
    colorScheme === "dark" ? "text-neutral-200" : "text-gray-700";
  const getMainBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-50";

  const MAX_TABLE_DISPLAY_WIDTH = Platform.OS === "web" ? 1500 : 500;
  const effectiveTableContentWidth = Math.min(
    screenWidth,
    MAX_TABLE_DISPLAY_WIDTH
  );

  const columnWidths = useMemo(() => {
    return isMobileLayout
      ? {
          name: effectiveTableContentWidth * 0.4,
          status: effectiveTableContentWidth * 0.3,
          action: effectiveTableContentWidth * 0.15,
        }
      : {
          image: effectiveTableContentWidth * 0.2,
          name: effectiveTableContentWidth * 0.3,
          price: effectiveTableContentWidth * 0.3,
          status: effectiveTableContentWidth * 0.18,
          action: effectiveTableContentWidth * 0.2,
        };
  }, [effectiveTableContentWidth, isMobileLayout]);

  const getBadgeStyleProps = (currentStatus: Status) => {
    let bgColor = "";
    let textColor = "";
    let badgeBorderColor = "";

    switch (currentStatus) {
      case "approved":
        bgColor = colorScheme === "dark" ? "#14532d" : "#d1fae5";
        textColor = colorScheme === "dark" ? "#4ade80" : "#10b981";
        badgeBorderColor = colorScheme === "dark" ? "#22c55e" : "#34d399";
        break;
      case "pending":
        bgColor = colorScheme === "dark" ? "bg-orange-800" : "bg-orange-100";
        textColor =
          colorScheme === "dark" ? "text-orange-400" : "text-orange-700";
        badgeBorderColor =
          colorScheme === "dark" ? "border-orange-500" : "border-orange-400";
        break;
      case "process":
        bgColor = colorScheme === "dark" ? "#1d4ed8" : "#bfdbfe";
        textColor = colorScheme === "dark" ? "#93c5fd" : "#3b82f6";
        badgeBorderColor = colorScheme === "dark" ? "#60a5fa" : "#60a5fa";
        break;
      case "rejected":
        bgColor = colorScheme === "dark" ? "#7f1d1d" : "#fecaca";
        textColor = colorScheme === "dark" ? "#ef4444" : "#ef4444";
        badgeBorderColor = colorScheme === "dark" ? "#ef4444" : "#f87171";
        break;
      default:
        bgColor = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200";
        textColor = colorScheme === "dark" ? "text-gray-400" : "text-gray-700";
        badgeBorderColor =
          colorScheme === "dark" ? "border-gray-500" : "border-gray-400";
        break;
    }
    return { bgColor, textColor, badgeBorderColor };
  };

  const getData = async () => {
    try {
      const data = await fetchOffers();
      if (data && data.length > 0) {
        setOffers(data);
        const initialStatus: { [key: string]: Status } = {};
        data.forEach((item) => {
          initialStatus[item.ID] = item.Status as Status;
        });
        setSelectedStatus(initialStatus);
      } else {
        console.warn("No offers found.");
        setOffers([]);
        setError("No advertisements found.");
      }
    } catch (err: any) {
      console.error("Failed to fetch offers:", err);
      setError(err.message || "Failed to load advertisements.");
      setOffers([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    getData();
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsMobileLayout(window.width < 768);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    async function generateAndSetThumbnails() {
      const newThumbnails: { [key: string]: string } = {};
      for (const item of offers) {
        if (item.Files && item.Files.length > 0) {
          const fileUrl = item.Files[0].URL;
          const mediaUrl = `${BASE_URL}/api${fileUrl}`;

          if (/\.(mp4|webm|ogg)$/i.test(fileUrl)) {
            try {
              let uri: string;
              if (Platform.OS === "web") {
                uri = await generateVideoThumbnailJS(mediaUrl);
              } else {
                const result = await VideoThumbnails.getThumbnailAsync(
                  mediaUrl,
                  { time: 1000 }
                );
                uri = result.uri;
              }
              newThumbnails[item.ID] = uri;
            } catch (error) {
              console.warn("Failed to generate thumbnail for video:", error);
              newThumbnails[item.ID] = `${BASE_URL}/api${fileUrl}`;
            }
          } else {
            newThumbnails[item.ID] = `${BASE_URL}/api${fileUrl}`;
          }
        } else {
          newThumbnails[item.ID] =
            "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";
        }
      }
      setThumbnailUrls((prev) => ({ ...prev, ...newThumbnails }));
    }

    if (offers.length > 0) {
      generateAndSetThumbnails();
    }
  }, [offers]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = useMemo(() => {
    const slicedOffers = offers.slice(indexOfFirstItem, indexOfLastItem);
    slicedOffers.forEach((item) => {
      if (!selectedStatus[item.ID] && item.Status) {
        setSelectedStatus((prev) => ({
          ...prev,
          [item.ID]: item.Status as Status,
        }));
      }
    });
    return slicedOffers;
  }, [offers, indexOfFirstItem, indexOfLastItem, selectedStatus]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenPicker = (itemId: string, currentStatus: Status) => {
    const isPickerDisabled = ["approved", "rejected"].includes(currentStatus);
    if (!isPickerDisabled) {
      setCurrentEditingItemId(itemId);
      setStatusPickerModalVisible(true);
    }
  };

  const handleStatusUpdate = async (newStatus: Status) => {
    if (currentEditingItemId) {
      await apiHandleStatusChange(newStatus, currentEditingItemId);
      setSelectedStatus((prev) => ({
        ...prev,
        [currentEditingItemId]: newStatus,
      }));
      setStatusPickerModalVisible(false);
      setCurrentEditingItemId(null);
    }
  };

  const currentEditingItemStatus = currentEditingItemId
    ? selectedStatus[currentEditingItemId]
    : undefined;

  if (loading) {
    return (
      <Box className={`flex-1 justify-center items-center ${getMainBgClass()}`}>
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#111827"}
        />
        <Text className={`mt-2 ${getLoadingTextColorClass()}`}>
          Loading advertisements...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={`flex-1 justify-center items-center ${getMainBgClass()}`}>
        <Text className="text-red-500 dark:text-red-300 text-center px-4">
          Error: {error}
        </Text>
        <Button onPress={() => getData()} className="mt-4">
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  const renderItem = ({ item, index }: { item: cusProduct; index: number }) => {
    // Tambahkan 'index' di sini
    const thumbnailUrl =
      thumbnailUrls[item.ID] ||
      "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";
    const currentItemStatus = selectedStatus[item.ID] || item.Status;
    const badgeStyleProps = getBadgeStyleProps(currentItemStatus);
    const isInteractionDisabled = ["approved", "rejected"].includes(
      currentItemStatus
    );

    // Tentukan kelas latar belakang baris berdasarkan indeks
    const rowBgClass =
      index % 2 === 0 ? getTableRowBgClass() : getTableRowOddBgClass();

    return (
      <HStack
        key={item.ID}
        className={`py-3 items-center border-b ${getBorderColorClass()} ${rowBgClass} ${getTableRowHoverBgClass()}`}
      >
        {!isMobileLayout && (
          <Box
            style={{ width: columnWidths.image }}
            className="justify-center items-center px-2"
          >
            <Image
              style={{ width: 80, height: 80 }}
              className="object-cover rounded-md"
              source={{ uri: thumbnailUrl }}
              alt="Product Image"
            />
          </Box>
        )}
        <Box
          style={{ width: columnWidths.name }}
          className="justify-center items-center px-2 text-center"
        >
          <Text className={`font-medium text-sm ${getDynamicTextColor()}`}>
            {item.customer_name}
          </Text>
          <Text className={`text-xs ${getSubduedTextColor()}`}>
            {item.Name}
          </Text>
        </Box>
        {!isMobileLayout && (
          <Box
            style={{ width: columnWidths.price }}
            className="justify-center items-center px-2 text-center"
          >
            <Text className={`text-sm ${getDynamicTextColor()}`}>
              Rp {item.Price.toLocaleString()}
            </Text>
          </Box>
        )}
        <Box
          style={{ width: columnWidths.status }}
          className="py-3 px-4 flex justify-center items-center"
        >
          <Box className="flex-row items-center w-full gap-2">
            <Pressable
              onPress={() => handleOpenPicker(item.ID, currentItemStatus)}
              disabled={isInteractionDisabled}
              style={{
                opacity: isInteractionDisabled ? 0.5 : 1,
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <Badge
                variant="outline"
                style={{
                  backgroundColor: badgeStyleProps.bgColor,
                  borderColor: badgeStyleProps.badgeBorderColor,
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <BadgeText
                  style={{
                    color: badgeStyleProps.textColor,
                    fontSize: 11,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  className={`${badgeStyleProps.textColor} text-center`}
                >
                  {currentItemStatus.charAt(0).toUpperCase() +
                    currentItemStatus.slice(1)}
                </BadgeText>
              </Badge>
            </Pressable>
            {!isInteractionDisabled && (
              <Pressable
                onPress={() => handleOpenPicker(item.ID, currentItemStatus)}
                disabled={isInteractionDisabled}
                style={{
                  opacity: isInteractionDisabled ? 0.5 : 1,
                }}
                className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
              >
                <Box className="flex-row items-center">
                  <Icon
                    as={ChevronDown}
                    size="sm"
                    className={getSubduedTextColor()}
                    style={{ marginLeft: 4 }}
                  />
                </Box>
              </Pressable>
            )}
          </Box>
        </Box>
        <Box
          style={{ width: columnWidths.action }}
          className="flex-row justify-around items-center px-2"
        >
          <Button
            variant="link"
            onPress={() => {
              setSelectedProduct(item);
              setIsProductModalVisible(true);
            }}
            className="p-0"
          >
            <ButtonIcon as={Eye} size="md" className="text-blue-500" />
          </Button>
          <Button
            variant="link"
            onPress={() => {
              setSelectedProduct(item);
              router.push({
                pathname: "/message",
                params: { item: JSON.stringify(item) },
              });
            }}
            className="p-0 relative"
          >
            <ButtonIcon
              as={MessageSquare}
              size="md"
              className="text-indigo-600"
            />
            {item.UnreadCount > 0 && (
              <Box className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 justify-center items-center">
                <Text className="text-white text-xs font-bold leading-none">
                  {item.UnreadCount}
                </Text>
              </Box>
            )}
          </Button>
        </Box>
      </HStack>
    );
  };

  return (
    <Box className={`flex-1 ${getMainBgClass()}`}>
      <Box
        className={`w-full px-4 py-4 flex-row items-center justify-between
        `}
        style={{ paddingTop: Platform.OS === "android" ? 40 : 16 }}
      >
        <Box className="w-8" />
        <Heading size="xl" className={`flex-1 text-center`}>
          LIST USER ADVERTISEMENT
        </Heading>
        <Box className="w-8" />
      </Box>
      <Box
        className={`relative flex flex-col flex-1 w-full overflow-hidden rounded-lg shadow-md
           self-center mt-4 ${getTableHeaderBgClass()}
        `}
        style={{ maxWidth: screenWidth * 0.9 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
        >
          <VStack style={{ minWidth: effectiveTableContentWidth }}>
            <HStack
              className={`border-b ${getBorderColorClass()} py-3 ${getTableHeaderBgClass()}`}
            >
              {!isMobileLayout && (
                <Box
                  style={{ width: columnWidths.image }}
                  className="justify-center items-center px-2 text-center"
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${getDynamicTextColor()}`}
                  >
                    Product Images
                  </Text>
                </Box>
              )}
              <Box
                style={{ width: columnWidths.name }}
                className="justify-center items-center px-2 text-center"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getDynamicTextColor()}`}
                >
                  Customer & Product Name
                </Text>
              </Box>
              {!isMobileLayout && (
                <Box
                  style={{ width: columnWidths.price }}
                  className="justify-center items-center px-2 text-center"
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${getDynamicTextColor()}`}
                  >
                    Price
                  </Text>
                </Box>
              )}
              <Box
                style={{ width: columnWidths.status }}
                className="justify-center items-center px-2 text-center"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getDynamicTextColor()}`}
                >
                  Status
                </Text>
              </Box>
              <Box
                style={{ width: columnWidths.action }}
                className="justify-center items-center px-2 text-center"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getDynamicTextColor()}`}
                >
                  Action
                </Text>
              </Box>
            </HStack>
            {currentOffers.length === 0 ? (
              <Box className="py-8 items-center justify-center">
                <Text className={`${getLoadingTextColorClass()} text-base`}>
                  No advertisements found.
                </Text>
              </Box>
            ) : (
              <FlatList
                data={currentOffers}
                renderItem={renderItem}
                keyExtractor={(item) => item.ID}
                scrollEnabled={false}
              />
            )}
          </VStack>
        </ScrollView>
      </Box>

      <HStack className="flex-row justify-center items-center mt-6 mb-12 w-full max-w-xl self-center">
        <Button
          size="sm"
          variant="outline"
          action="secondary"
          onPress={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ButtonIcon
            as={ChevronLeft}
            size="md"
            className={`${
              currentPage === 1 ? "opacity-50" : ""
            } ${getDynamicTextColor()}`}
          />
        </Button>
        <Text className={`mx-4 text-base ${getPaginationTextColorClass()}`}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          size="sm"
          variant="outline"
          action="secondary"
          onPress={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ButtonIcon
            as={ChevronRight}
            size="md"
            className={`${
              currentPage === totalPages ? "opacity-50" : ""
            } ${getDynamicTextColor()}`}
          />
        </Button>
      </HStack>
      <Modal
        isOpen={isProductModalVisible}
        onClose={() => setIsProductModalVisible(false)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent
          className={`flex-1 ${getMainBgClass()} rounded-lg shadow-md`}
        >
          <ModalHeader className={`w-full border-b ${getBorderColorClass()} p-4`}>
            <Box className="w-full flex-row justify-between items-center">
              <Heading size="lg" className={`${getDynamicTextColor()}`}>
                Offer Details
              </Heading>
              <Button
                variant="link"
                onPress={() => setIsProductModalVisible(false)}
                className="p-0"
              >
                <ButtonIcon
                  as={X}
                  size="lg"
                  className={`${getDynamicTextColor()}`}
                />
              </Button>
            </Box>
          </ModalHeader>
          <ModalBody className="p-0 flex-1">
            {selectedProduct ? (
              <OfferDetailModal product={selectedProduct} />
            ) : (
              <Box className="flex-1 justify-center items-center">
                <Text className={`${getDynamicTextColor()}`}>
                  No product selected.
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter className="w-full border-t ${getBorderColorClass()} p-4">
            <Button
              variant="outline"
              onPress={() => setIsProductModalVisible(false)}
              className="flex-1"
            >
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isStatusPickerModalVisible}
        onClose={() => {
          setStatusPickerModalVisible(false);
          setCurrentEditingItemId(null);
        }}
      >
        <ModalBackdrop />
        <ModalContent style={{ width: 250, height: 200 }}>
          <ModalHeader>
            <Heading size="md" className={`${getDynamicTextColor()}`}>
              Select Status
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className={`stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 ${
                  colorScheme === "dark"
                    ? "dark:stroke-neutral-400 dark:group-[:hover]/modal-close-button:stroke-neutral-200"
                    : ""
                }`}
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {currentEditingItemStatus &&
              (Platform.OS === "ios" ? (
                <Picker
                  selectedValue={currentEditingItemStatus}
                  onValueChange={(newStatus: Status) =>
                    handleStatusUpdate(newStatus)
                  }
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "transparent",
                  }}
                  itemStyle={{
                    color: colorScheme === "dark" ? "#fff" : "#000",
                    top: -70,
                  }}
                >
                  {VALID_ADVERTISEMENT_STATUS_TRANSITIONS[
                    currentEditingItemStatus
                  ]?.map((statusValue) => (
                    <Picker.Item
                      key={statusValue}
                      label={
                        statusValue.charAt(0).toUpperCase() +
                        statusValue.slice(1)
                      }
                      value={statusValue}
                    />
                  ))}
                </Picker>
              ) : (
                <Picker
                  selectedValue={currentEditingItemStatus}
                  onValueChange={(newStatus: Status) =>
                    handleStatusUpdate(newStatus)
                  }
                  style={{
                    width: "100%",
                    height: 55,
                    backgroundColor: "transparent",
                    color: colorScheme === "dark" ? "#fff" : "#000",
                  }}
                  itemStyle={{
                    color: colorScheme === "dark" ? "#fff" : "#000",
                  }}
                >
                  {VALID_ADVERTISEMENT_STATUS_TRANSITIONS[
                    currentEditingItemStatus
                  ]?.map((statusValue) => (
                    <Picker.Item
                      key={statusValue}
                      label={
                        statusValue.charAt(0).toUpperCase() +
                        statusValue.slice(1)
                      }
                      value={statusValue}
                    />
                  ))}
                </Picker>
              ))}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setStatusPickerModalVisible(false);
                setCurrentEditingItemId(null);
              }}
              className="mr-2"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setStatusPickerModalVisible(false);
                setCurrentEditingItemId(null);
              }}
            >
              <ButtonText>Done</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserAdvertisementScreen;
