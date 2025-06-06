// components/transaction/transaction-detail-screen.tsx
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { BASE_URL } from "@/src/api/constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Transaction } from "@/src/types/transaction";
import { fetchTransactionById } from "@/src/api/transaction";
import { ArrowLeft, X } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
const ucfirst = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Fungsi helper untuk format angka
const number_format = (num: number | null | undefined | string) => {
  if (num == null || num === "") return "0";
  if (typeof num === "string") {
    num = parseFloat(num.replace(/\./g, "").replace(/,/g, ""));
    if (isNaN(num)) return "0";
  }
  return num.toLocaleString("id-ID");
};

const TransactionDetailScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showFullScreenImageModal, setShowFullScreenImageModal] =
    useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(
    null
  );
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      setLoading(true);
      setError(null);

      fetchTransactionById(id)
        .then((data) => {
          if (data) {
            setTransaction(data);
          } else {
            setError("Transaction not found.");
          }
        })
        .catch((err) => {
          console.error("Error fetching transaction:", err);
          setError(err.message || "Failed to load transaction details.");
          setTransaction(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("Invalid transaction ID provided.");
    }
  }, [id]);

  const getTextColor = (baseColor: string) => {
    return colorScheme === "dark"
      ? `text-${baseColor}-100`
      : `text-${baseColor}-900`;
  };
  const getSubtitleColor = (baseColor: string) => {
    return colorScheme === "dark"
      ? `text-${baseColor}-400`
      : `text-${baseColor}-600`;
  };
  const getBackgroundColor = (baseColor: string) => {
    if (baseColor === "white")
      return colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
    if (baseColor === "gray")
      return colorScheme === "dark" ? "bg-neutral-700" : "bg-gray-100";
    return "";
  };
  const getBorderColor = (baseColor: string) => {
    return colorScheme === "dark"
      ? `border-${baseColor}-700`
      : `border-${baseColor}-200`;
  };

  const handleImageClick = (imageUrl: string) => {
    setFullScreenImageUrl(imageUrl);
    setShowFullScreenImageModal(true);
  };

  const handleCloseFullScreenImageModal = () => {
    setShowFullScreenImageModal(false);
    setFullScreenImageUrl(null);
  };

  const { width: screenWidth } = Dimensions.get("window");
  const isMobileView = screenWidth < 768;
  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-0 dark:bg-neutral-900">
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#111827"}
        />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading transaction details...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-0 dark:bg-neutral-900">
        <Text className="text-red-500 dark:text-red-300 text-center px-4">
          Error: {error}
        </Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-0 dark:bg-neutral-900">
        <Text className="text-neutral-600 dark:text-neutral-400 text-center px-4">
          No transaction details found for ID: {id}.
        </Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }
  return (
    <Box className="flex-1 bg-background-0 dark:bg-neutral-900">
      <Box
        className={`w-full max-w-xl self-center px-4 py-4
          ${getBackgroundColor("white")}`}
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 16,
        }}
      >
        <Button
          variant="link"
          action="secondary"
          onPress={() => router.push("/(tabs)/transaction")}
          className="p-0"
        >
          <ButtonIcon
            as={ArrowLeft}
            size="lg"
            color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
          />
          <ButtonText className="ml-2 text-base text-neutral-800 dark:text-neutral-200">
            Back to Transactions List
          </ButtonText>
        </Button>
      </Box>
      <Box
        className={`
          w-full max-w-xl self-center px-5 py-4 border-b ${getBorderColor(
            "neutral"
          )}
          ${getBackgroundColor("gray")}
          flex-row justify-between items-center flex-wrap
        `}
      >
        <Box className="flex-row items-center gap-3">
          <Badge
            size="sm"
            className="bg-yellow-500 text-white font-bold px-2 py-1 rounded-sm text-xs"
          >
            <BadgeText>Star+</BadgeText>
          </Badge>
          <Text className={`font-semibold ${getTextColor("gray")}`}>
            IFYNTH Store
          </Text>
        </Box>
        <Box className="mt-2 md:mt-0">
          {transaction.Status === "delivered" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              The order has arrived at the destination address. Received by the
              person concerned.
              <Badge size="sm" action="success" className="ml-2">
                <BadgeText>HAS BEEN ASSESSED</BadgeText>
              </Badge>
            </Text>
          ) : transaction.Status === "completed" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              Order has been completed.
            </Text>
          ) : transaction.Status === "cancelled" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              Order cancelled.
            </Text>
          ) : transaction.Status === "process" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              The order is in transit.
            </Text>
          ) : transaction.Status === "paid" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              The store has confirmed payment, the product is being processed.
            </Text>
          ) : transaction.Status === "pending" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              Payment placed, awaiting store confirmation.
            </Text>
          ) : transaction.Status === "draft" ? (
            <Text className={`${getSubtitleColor("neutral")}`}>
              Waiting for payment.
            </Text>
          ) : (
            <Text className={`${getSubtitleColor("neutral")}`}>
              Status: {ucfirst(transaction.Status ?? "-")}
            </Text>
          )}
        </Box>
      </Box>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: Platform.OS === "web" ? 100 : 20,
        }}
      >
        <Box
          className={`
            rounded-lg shadow-md w-full max-w-xl
            ${getBackgroundColor("white")} border ${getBorderColor("neutral")}
          `}
        >
          <Box className="p-5 flex-col gap-3 border-b border-neutral-200 dark:border-neutral-700">
            <Heading size="sm" className={`mb-2 ${getTextColor("gray")}`}>
              Transaction Info
            </Heading>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Transaction ID: </Text>
              {transaction.ID}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">User ID:</Text>{" "}
              {transaction.UserID}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Payment Method: </Text>
              {transaction.PaymentMethod}
            </Text>
            {transaction.PaymentProof && (
              <Box>
                <Text className={`${getSubtitleColor("neutral")} mb-1`}>
                  <Text className="font-semibold">Payment Proof: </Text>
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleImageClick(
                      `${BASE_URL}/api${transaction.PaymentProof}`
                    )
                  }
                  activeOpacity={0.7}
                  className="w-full h-48 rounded-md overflow-hidden"
                >
                  <Image
                    source={{
                      uri: `${BASE_URL}/api${transaction.PaymentProof}`,
                    }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Box>
            )}
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Transaction Date: </Text>
              {new Date(transaction.CreatedAt).toLocaleString("id-ID")}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Last Updated: </Text>
              {new Date(transaction.UpdatedAt).toLocaleString("id-ID")}
            </Text>
          </Box>

          <Box className="p-5 flex-col gap-3 border-b border-neutral-200 dark:border-neutral-700">
            <Heading size="sm" className={`mb-2 ${getTextColor("gray")}`}>
              Shipping Address
            </Heading>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Recipient Name: </Text>
              {transaction.ShippingAddress.Name ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Phone Number: (+62) </Text>
              {transaction.ShippingAddress.PhoneNumber ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Address: </Text>
              {transaction.ShippingAddress.Address ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Zip Code: </Text>
              {transaction.ShippingAddress.ZipCode ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Destination Label: </Text>
              {transaction.ShippingAddress.DestinationLabel ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Courier: </Text>
              {transaction.ShippingAddress.Courir ?? "N/A"}
            </Text>
            <Text className={`${getSubtitleColor("neutral")}`}>
              <Text className="font-semibold">Shipping Cost: </Text> Rp
              {number_format(transaction.ShippingAddress.ShippingCost)}
            </Text>
          </Box>
          <Box className="p-5 flex-col gap-4">
            <Heading size="sm" className={`mb-2 ${getTextColor("gray")}`}>
              Products in Order
            </Heading>
            {transaction.TransactionDetails &&
            transaction.TransactionDetails.length > 0 ? (
              transaction.TransactionDetails.map((detail, key) => {
                return (
                  <Box
                    key={detail.ID}
                    className={`flex-row gap-4 items-start overflow-hidden`}
                    style={
                      isMobileView
                        ? {
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }
                        : {}
                    }
                  >
                    <Box className="flex-shrink-0 w-20 h-20 border border-neutral-200 rounded-md overflow-hidden">
                      <Image
                        source={{
                          uri: detail.Product?.ProductImages?.[0]?.URL
                            ? `${BASE_URL}/api${detail.Product.ProductImages[0].URL}`
                            : "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </Box>
                    <Box className="flex-grow flex-col gap-1">
                      <Text
                        className={`text-base font-medium ${getTextColor(
                          "gray"
                        )}`}
                      >
                        {detail.Product?.Name ?? "Nama Produk Tidak Diketahui"}
                      </Text>
                      <Text
                        className={`text-sm ${getSubtitleColor("neutral")}`}
                      >
                        Variasi: {detail.Size ?? "Ukuran Tidak Diketahui"}
                      </Text>
                      <Text
                        className={`text-sm ${getSubtitleColor("neutral")}`}
                      >
                        x{detail.Quantity ?? 1}
                      </Text>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Text className="text-center py-3 text-neutral-500">
                There are no products in this order.
              </Text>
            )}
          </Box>
        </Box>
      </ScrollView>
      <Box
        className={`
          w-full max-w-xl self-center p-5 border-t ${getBorderColor("neutral")}
          ${getBackgroundColor("gray")}
          flex-row justify-end items-center rounded-b-lg // Tambahkan rounded-b-lg
        `}
      >
        <Box className="flex-row items-center">
          <Text className={`text-base mr-4 ${getTextColor("gray")}`}>
            Order Total:
          </Text>
          <Text className={`text-xl font-bold ${getTextColor("gray")}`}>
            Rp{number_format(transaction.TotalAmount ?? 0)}
          </Text>
        </Box>
      </Box>
      <Modal
        isOpen={showFullScreenImageModal}
        onClose={handleCloseFullScreenImageModal}
        size="full"
      >
        <ModalBackdrop />
        <ModalContent
          className={`flex-1 ${
            colorScheme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <ModalHeader className="w-full">
            <Button
              variant="link"
              onPress={handleCloseFullScreenImageModal}
              className="absolute top-4 right-4 z-10 p-0"
            >
              <ButtonIcon
                as={X}
                size="xl"
                className={`${
                  colorScheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              />
            </Button>
          </ModalHeader>
          <ModalBody className="flex-1 w-full">
            {fullScreenImageUrl ? (
              <Image
                source={{ uri: fullScreenImageUrl }}
                className="w-80% h-80"
                resizeMode="contain"
                alt="Payment Proof Full Screen"
              />
            ) : (
              <Text
                className={`${
                  colorScheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Image not available.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionDetailScreen;
