import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

// --- Gluestack UI Imports ---
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { Tooltip, TooltipContent, TooltipText } from "@/components/ui/tooltip";

// --- Other Imports ---
import {
  fetchTransactions,
  handleStatusChange,
  TransactionStatus,
} from "@/src/api/transaction";
import { Transaction } from "@/src/types/transaction";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";

const ALL_TRANSACTION_STATUSES: TransactionStatus[] = [
  "draft",
  "pending",
  "paid",
  "process",
  "delivered",
  "completed",
  "cancelled",
];

const TransactionsScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const [isTinyScreen, setIsTinyScreen] = useState(screenWidth < 768);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: TransactionStatus;
  }>({});
  const [isStatusPickerModalVisible, setStatusPickerModalVisible] =
    useState(false);
  const [currentEditingItemId, setCurrentEditingItemId] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = Platform.OS === "web" ? 12 : 8;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const getData = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
      const initialStatus: { [key: string]: TransactionStatus } = {};
      data.forEach((item) => {
        initialStatus[item.ID] = item.Status as TransactionStatus;
      });
      setSelectedStatus(initialStatus);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    getData();
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsTinyScreen(window.width < 768);
    });
    return () => subscription?.remove();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const getBadgeStyleProps = (currentStatus: TransactionStatus) => {
    let bgColor = "";
    let textColor = "";
    let badgeBorderColor = "";

    switch (currentStatus) {
      case "delivered":
      case "completed":
        bgColor = colorScheme === "dark" ? "#14532d" : "#d1fae5";
        textColor = colorScheme === "dark" ? "#4ade80" : "#10b981";
        badgeBorderColor = colorScheme === "dark" ? "#22c55e" : "#34d399";
        break;
      case "pending":
      case "process":
      case "paid":
        bgColor = colorScheme === "dark" ? "#1d4ed8" : "#bfdbfe";
        textColor = colorScheme === "dark" ? "#93c5fd" : "#3b82f6";
        badgeBorderColor = colorScheme === "dark" ? "#60a5fa" : "#60a5fa";
        break;
      case "cancelled":
      case "draft":
        bgColor = colorScheme === "dark" ? "#7f1d1d" : "#fecaca";
        textColor = colorScheme === "dark" ? "#ef4444" : "#ef4444";
        badgeBorderColor = colorScheme === "dark" ? "#ef4444" : "#f87171";
        break;
      default:
        bgColor = colorScheme === "dark" ? "#374151" : "#e5e7eb";
        textColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
        badgeBorderColor = colorScheme === "dark" ? "#4b5563" : "#9ca3af";
        break;
    }

    return { bgColor, textColor, badgeBorderColor };
  };

  const mainBackgroundClass = "bg-white dark:bg-neutral-900";
  const tableHeaderClass =
    "bg-gray-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200";
  const tableRowEvenClass =
    "bg-gray-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200";
  const tableRowOddClass =
    "bg-gray-50 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200";
  const paginationTextColor = "text-neutral-800 dark:text-white";

  // Using the refined VALID_STATUS_TRANSITIONS for Picker items
  const VALID_STATUS_TRANSITIONS = {
    draft: ["draft", "pending"],
    pending: ["pending", "paid", "cancelled"],
    paid: ["paid", "process", "cancelled"],
    process: ["process", "delivered", "cancelled"],
    delivered: ["delivered"],
    completed: ["completed"],
    cancelled: ["cancelled"],
  };

  if (loading) {
    return (
      <Box
        className={`flex-1 justify-center items-center ${mainBackgroundClass}`}
      >
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#111827"}
        />
      </Box>
    );
  }

  const paginate = (pageNumber: number) => {
    // Ensure page number is within valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatId = (id: string, length = 8) => {
    if (!id || id.length <= length) {
      return id;
    }
    return `${id.substring(0, length)}...`;
  };

  const handleOpenPicker = (
    itemId: string,
    currentStatus: TransactionStatus
  ) => {
    const isPickerDisabled = ["delivered", "cancelled", "draft"].includes(
      currentStatus
    );
    if (!isPickerDisabled) {
      setCurrentEditingItemId(itemId);
      setStatusPickerModalVisible(true);
    }
  };

  const handleStatusUpdate = async (newStatus: TransactionStatus) => {
    if (currentEditingItemId) {
      await handleStatusChange(newStatus, currentEditingItemId);
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

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
      }}
      className={mainBackgroundClass}
    >
      <Box
        className="flex-1 items-center mt-8 px-4"
        style={{ top: Platform.OS === "web" ? 0 : 30 }}
      >
        <Box className="w-full mb-6 items-center">
          <Heading className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            LIST TRANSACTIONS
          </Heading>
        </Box>

        <Box className="p-3 rounded-lg overflow-hidden w-full max-w-8xl">
          <Table className="w-full rounded-lg overflow-hidden">
            <TableHeader className={tableHeaderClass}>
              <TableRow className="border-b">
                {isTinyScreen ? (
                  <>
                    <TableHead className="py-3 px-4 font-bold text-center w-[35%]">
                      ID
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[65%]">
                      Status
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[10%]">
                      Details
                    </TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="py-3 px-4 font-bold text-center w-[15%]">
                      ID
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[25%]">
                      Customer Name
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[20%]">
                      Total Amount
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[20%]">
                      Payment Method
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[20%]">
                      Status
                    </TableHead>
                    <TableHead className="py-3 px-4 font-bold text-center w-[10%]">
                      Details
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.length === 0 ? (
                <TableRow>
                  <TableData className="py-4 text-center w-full">
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      No transactions found.
                    </Text>
                  </TableData>
                </TableRow>
              ) : (
                currentTransactions.map((item, index) => {
                  const currentItemStatus =
                    selectedStatus[item.ID] || item.Status;
                  const badgeStyleProps = getBadgeStyleProps(currentItemStatus);
                  const isInteractionDisabled = [
                    "delivered",
                    "cancelled",
                    "completed", // Added 'completed' as disabled state
                  ].includes(currentItemStatus);

                  return (
                    <TableRow
                      key={item.ID}
                      className={
                        index % 2 === 0 ? tableRowEvenClass : tableRowOddClass
                      }
                    >
                      {isTinyScreen ? (
                        <>
                          <TableData className="py-3 px-4 text-center w-[35%]">
                            <Tooltip
                              placement={
                                Platform.OS === "web" ? "right" : "bottom"
                              }
                              trigger={(triggerProps) => {
                                return (
                                  <Text className="text-sm" {...triggerProps}>
                                    {formatId(item.ID)}
                                  </Text>
                                );
                              }}
                            >
                              <TooltipContent className="bg-neutral-700 p-2 rounded shadow-md">
                                <TooltipText className="text-white text-sm">
                                  {item.ID}
                                </TooltipText>
                              </TooltipContent>
                            </Tooltip>
                          </TableData>
                          <TableData className="py-3 px-4 w-[65%] flex justify-center items-center">
                            <Box className="flex-row items-center center w-full gap-2">
                              <Pressable
                                onPress={() =>
                                  handleOpenPicker(item.ID, currentItemStatus)
                                }
                                disabled={isInteractionDisabled}
                                style={{
                                  opacity: isInteractionDisabled ? 0.5 : 1,
                                  width: "100%",
                                }}
                                className="background-0"
                              >
                                <Badge
                                  variant="outline"
                                  style={{
                                    backgroundColor: badgeStyleProps.bgColor,
                                    borderColor:
                                      badgeStyleProps.badgeBorderColor,
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
                                  >
                                    {currentItemStatus.charAt(0).toUpperCase() +
                                      currentItemStatus.slice(1)}
                                  </BadgeText>
                                </Badge>
                              </Pressable>
                              <Pressable
                                onPress={() =>
                                  handleOpenPicker(item.ID, currentItemStatus)
                                }
                                disabled={isInteractionDisabled}
                                style={{
                                  opacity: isInteractionDisabled ? 0.5 : 1,
                                }}
                                className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
                              >
                                <Box className="flex-row items-center">
                                  <ChevronDown
                                    size={14}
                                    color={
                                      colorScheme === "dark"
                                        ? "#D1D5DB"
                                        : "#4B5563"
                                    }
                                    style={{ marginLeft: 4 }}
                                  />
                                </Box>
                              </Pressable>
                            </Box>
                          </TableData>
                          <TableData
                            className="py-3 px-4 text-center w-[10%]"
                            style={{ right: Platform.OS !== "ios" ? 0 : -35 }}
                          >
                            <Pressable
                              className="p-1 rounded-md bg-gray-200 dark:bg-gray-700"
                              onPress={() =>
                                router.push({
                                  pathname: "/transaction-detail",
                                  params: { id: item.ID },
                                })
                              }
                            >
                              <Eye
                                size={18}
                                color={
                                  colorScheme === "dark" ? "#D1D5DB" : "#4B5563"
                                }
                              />
                            </Pressable>
                          </TableData>
                        </>
                      ) : (
                        <>
                          <TableData className="py-3 px-4 text-center w-[15%]">
                            <Tooltip
                              placement={
                                Platform.OS === "web" ? "right" : "bottom"
                              }
                              trigger={(triggerProps) => {
                                return (
                                  <Text className="text-sm" {...triggerProps}>
                                    {screenWidth > 1500
                                      ? item.ID
                                      : formatId(item.ID)}
                                  </Text>
                                );
                              }}
                            >
                              <TooltipContent className="bg-neutral-700 p-2 rounded shadow-md">
                                <TooltipText className="text-white text-sm">
                                  {item.ID}
                                </TooltipText>
                              </TooltipContent>
                            </Tooltip>
                          </TableData>
                          <TableData className="py-3 px-4 text-center w-[25%]">
                            <Text className="text-sm">
                              {item.ShippingAddress.Name}
                            </Text>
                          </TableData>
                          <TableData className="py-3 px-4 text-center w-[20%]">
                            <Text className="text-sm">
                              Rp {item.TotalAmount.toLocaleString()}
                            </Text>
                          </TableData>
                          <TableData className="py-3 px-4 text-center w-[20%]">
                            <Text className="text-sm">
                              {item.PaymentMethod}
                            </Text>
                          </TableData>
                          <TableData className="py-3 px-4 w-[100%] flex justify-center items-center">
                            <Box className="flex-row items-center center w-full gap-2">
                              <Badge
                                variant="outline"
                                style={{
                                  backgroundColor: badgeStyleProps.bgColor,
                                  borderColor: badgeStyleProps.badgeBorderColor,
                                  flexGrow: 1, // Allow badge to take available space
                                  justifyContent: "center",
                                }}
                              >
                                <BadgeText
                                  style={{
                                    color: badgeStyleProps.textColor,
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  {currentItemStatus.charAt(0).toUpperCase() +
                                    currentItemStatus.slice(1)}
                                </BadgeText>
                              </Badge>
                              <Pressable
                                onPress={() =>
                                  handleOpenPicker(item.ID, currentItemStatus)
                                }
                                disabled={isInteractionDisabled}
                                style={{
                                  opacity: isInteractionDisabled ? 0.5 : 1,
                                }}
                                className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
                              >
                                <Box className="flex-row items-center">
                                  <ChevronDown
                                    size={14}
                                    color={
                                      colorScheme === "dark"
                                        ? "#D1D5DB"
                                        : "#4B5563"
                                    }
                                    style={{ marginLeft: 4 }}
                                  />
                                </Box>
                              </Pressable>
                            </Box>
                          </TableData>
                          <TableData className="py-3 px-4 text-center w-[10%]">
                            <Pressable
                              className="p-1 rounded-md bg-gray-200 dark:bg-gray-700"
                              onPress={() =>
                                router.push({
                                  pathname: "/transaction-detail",
                                  params: { id: item.ID },
                                })
                              }
                            >
                              <Eye
                                size={18}
                                color={
                                  colorScheme === "dark" ? "#D1D5DB" : "#4B5563"
                                }
                                width={50}
                              />
                            </Pressable>
                          </TableData>
                        </>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination controls */}
        <Box className="flex-row justify-center items-center mt-6 mb-12">
          <Button
            size="sm"
            variant="outline"
            action="secondary"
            onPress={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2"
          >
            <Icon
              as={ChevronLeft}
              size="sm"
              color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
            />
            <ButtonText>Previous</ButtonText>
          </Button>

          <Text className={`${paginationTextColor} text-base mx-4`}>
            Page {currentPage} of {totalPages}
          </Text>

          <Button
            size="sm"
            variant="outline"
            action="secondary"
            onPress={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="ml-2"
          >
            <ButtonText>Next</ButtonText>
            <Icon
              as={ChevronRight}
              size="sm"
              color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
            />
          </Button>
        </Box>
      </Box>

      {/* Gluestack UI Modal for Status Picker */}
      <Modal
        isOpen={isStatusPickerModalVisible}
        onClose={() => {
          setStatusPickerModalVisible(false);
          setCurrentEditingItemId(null); // Reset editing item when modal closes
        }}
      >
        <ModalBackdrop />
        <ModalContent style={{ width: 250, height: 200 }}>
          <ModalHeader>
            <Heading
              size="md"
              className="text-typography-950 dark:text-neutral-100"
            >
              Select Status
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 dark:stroke-neutral-400 dark:group-[:hover]/modal-close-button:stroke-neutral-200"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {currentEditingItemStatus &&
              (Platform.OS === "ios" ? (
                <Picker
                  selectedValue={currentEditingItemStatus}
                  onValueChange={(newStatus: TransactionStatus) =>
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
                  {VALID_STATUS_TRANSITIONS[currentEditingItemStatus]?.map(
                    (statusValue) => (
                      <Picker.Item
                        key={statusValue}
                        label={
                          statusValue.charAt(0).toUpperCase() +
                          statusValue.slice(1)
                        }
                        value={statusValue}
                      />
                    )
                  )}
                </Picker>
              ) : (
                <Picker
                  selectedValue={currentEditingItemStatus}
                  onValueChange={(newStatus: TransactionStatus) =>
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
                  {VALID_STATUS_TRANSITIONS[currentEditingItemStatus]?.map(
                    (statusValue) => (
                      <Picker.Item
                        key={statusValue}
                        label={
                          statusValue.charAt(0).toUpperCase() +
                          statusValue.slice(1)
                        }
                        value={statusValue}
                      />
                    )
                  )}
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
    </ScrollView>
  );
};

export default TransactionsScreen;
