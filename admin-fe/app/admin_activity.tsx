import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
} from "react-native";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

// Icons from Lucide
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { fetchAdminActivity } from "@/src/api/admin";
import { AdminActivity } from "@/src/types/setting";
import { useRouter } from "expo-router"; // Pindahkan useRouter ke sini

const LogsScreen = () => {
  const { colorScheme } = useColorScheme();
  const { width: screenWidth } = Dimensions.get("window");
  const router = useRouter();

  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobileLayout, setIsMobileLayout] = useState(screenWidth < 768);
  const [showAdminIdColumn, setShowAdminIdColumn] = useState(
    screenWidth >= 1000
  );

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = screenWidth > 1000 ? 12 : 10;
  const totalPages = Math.ceil((activity?.length || 0) / dataPerPage);

  // Helper functions for styling
  const getTextColor = (baseColor: string) =>
    colorScheme === "dark" ? `text-${baseColor}-100` : `text-${baseColor}-900`;
  const getTableHeaderBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-100";
  const getTableRowBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-700" : "bg-white";
  const getTableRowHoverBgClass = () =>
    colorScheme === "dark" ? "hover:bg-neutral-600" : "hover:bg-gray-50";
  const getBorderColorClass = () =>
    colorScheme === "dark" ? "border-neutral-700" : "border-gray-200";
  const getLoadingTextColorClass = () =>
    colorScheme === "dark" ? "text-neutral-400" : "text-slate-500";
  const getPaginationTextColorClass = () =>
    colorScheme === "dark" ? "text-neutral-200" : "text-gray-700";

  const columnWidths = useMemo(() => {
    return {
      no: screenWidth * (showAdminIdColumn ? 0.05 : 0.1),
      userId: screenWidth * 0.15,
      name: screenWidth * (showAdminIdColumn ? 0.2 : 0.25),
      activity: screenWidth * (showAdminIdColumn ? 0.4 : 0.5),
      time: screenWidth * (showAdminIdColumn ? 0.2 : 0.15),
    };
  }, [screenWidth, showAdminIdColumn]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (screenWidth < 1000) {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
  };

  const getData = async () => {
    try {
      const data = await fetchAdminActivity();
      setActivity(data);
    } catch (err: any) {
      console.error("Failed to fetch logs:", err);
      setError(err.message || "Failed to load admin activities.");
      setActivity([]);
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
      setShowAdminIdColumn(window.width >= 1000);
    });
    return () => subscription?.remove();
  }, []);

  const indexOfLastProduct = currentPage * dataPerPage;
  const indexOfFirstProduct = indexOfLastProduct - dataPerPage;
  const currentActivities = useMemo(
    () => (activity || []).slice(indexOfFirstProduct, indexOfLastProduct),
    [activity, indexOfFirstProduct, indexOfLastProduct]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Penanganan state Loading / Error ---
  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-neutral-900 dark:bg-neutral-900">
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#111827"}
        />
        <Text className={`mt-2 ${getLoadingTextColorClass()}`}>
          Loading admin activities...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 justify-center items-center bg-neutral-900 dark:bg-neutral-900">
        <Text className="text-red-500 dark:text-red-300 text-center px-4">
          Error: {error}
        </Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: AdminActivity;
    index: number;
  }) => (
    <HStack
      key={item.UserID + item.CreatedAt + index}
      className={`py-3 items-center border-b ${getBorderColorClass()} ${getTableRowBgClass()} ${getTableRowHoverBgClass()}`}
    >
      {/* Kolom No */}
      <Box
        style={{ width: columnWidths.no }} // <-- Perbaikan di sini
        className="justify-center items-center px-2"
      >
        <Text className={`${getTextColor("gray")} text-sm`}>
          {indexOfFirstProduct + index + 1}
        </Text>
      </Box>
      {/* Kolom Admin ID (Opsional) */}
      {showAdminIdColumn && (
        <Box
          style={{ width: columnWidths.userId }} // <-- Perbaikan di sini
          className="justify-center items-center px-2"
        >
          <Text className={`${getTextColor("gray")} text-sm`}>
            {item.UserID}
          </Text>
        </Box>
      )}
      {/* Kolom Admin Name */}
      <Box
        style={{ width: columnWidths.name }} // <-- Perbaikan di sini
        className="justify-center items-center px-2"
      >
        <Text className={`${getTextColor("gray")} text-sm`}>{item.Name}</Text>
      </Box>
      {/* Kolom Activity */}
      <Box
        style={{ width: columnWidths.activity }} // <-- Perbaikan di sini
        className="justify-center items-center px-2"
      >
        <Text className={`${getTextColor("gray")} text-sm text-center`}>
          {item.Description}
        </Text>
      </Box>
      {/* Kolom Time */}
      <Box
        style={{ width: columnWidths.time }} // <-- Perbaikan di sini
        className="justify-center items-center px-2"
      >
        <Text className={`${getTextColor("gray")} text-sm text-center`}>
          {formatTime(item.CreatedAt)}
        </Text>
      </Box>
    </HStack>
  );

  return (
    <Box className={`flex-1 ${getTableHeaderBgClass()}`}>
      {/* Header Statis (Tombol Kembali & Judul) */}
      <Box
        className={`w-full px-4 py-4 flex-row items-center justify-between
          ${getTableHeaderBgClass()} border-b ${getBorderColorClass()}
        `}
        style={{ paddingTop: Platform.OS === "android" ? 40 : 16 }}
      >
        <Button
          variant="link"
          action="secondary"
          onPress={() => router.replace("/setting")}
          className="p-0"
        >
          <ButtonIcon
            as={ArrowLeft}
            size="lg"
            color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
          />
        </Button>
        <Heading
          size="xl"
          className={`flex-1 text-center ${getTextColor("gray")}`}
        >
          ADMIN ACTIVITIES
        </Heading>
        {/* Placeholder untuk menyamakan spasi, jika tombol kembali ada di kiri */}
        <Box className="w-10" />
      </Box>

      {/* Tabel */}
      <Box
        className={`relative flex flex-col w-full h-full overflow-hidden rounded-lg shadow-md
          ${getTableHeaderBgClass()}
        `}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "web" ? 100 : 150,
          }}
        >
          <VStack style={{ minWidth: screenWidth }}>
            {/* Header Tabel */}
            <HStack
              className={`border-b ${getBorderColorClass()} py-3 ${getTableHeaderBgClass()}`}
            >
              <Box
                style={{ width: columnWidths.no }} // <-- Perbaikan di sini
                className="justify-center items-center px-2"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getTextColor(
                    "neutral"
                  )}`}
                >
                  No
                </Text>
              </Box>
              {showAdminIdColumn && (
                <Box
                  style={{ width: columnWidths.userId }} // <-- Perbaikan di sini
                  className="justify-center items-center px-2"
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${getTextColor(
                      "neutral"
                    )}`}
                  >
                    Admin ID
                  </Text>
                </Box>
              )}
              <Box
                style={{ width: columnWidths.name }} // <-- Perbaikan di sini
                className="justify-center items-center px-2"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getTextColor(
                    "neutral"
                  )}`}
                >
                  Admin Name
                </Text>
              </Box>
              <Box
                style={{ width: columnWidths.activity }} // <-- Perbaikan di sini
                className="justify-center items-center px-2"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getTextColor(
                    "neutral"
                  )}`}
                >
                  Activity
                </Text>
              </Box>
              <Box
                style={{ width: columnWidths.time }} // <-- Perbaikan di sini
                className="justify-center items-center px-2"
              >
                <Text
                  className={`text-xs font-semibold leading-none uppercase ${getTextColor(
                    "neutral"
                  )}`}
                >
                  Time
                </Text>
              </Box>
            </HStack>

            {/* Konten Tabel */}
            {currentActivities.length === 0 ? (
              <Box className="py-8 items-center justify-center">
                <Text className={`${getLoadingTextColorClass()} text-base`}>
                  No logs found.
                </Text>
              </Box>
            ) : (
              <FlatList
                data={currentActivities}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  item.UserID + item.CreatedAt + index
                }
                scrollEnabled={false}
              />
            )}
          </VStack>
        </ScrollView>
      </Box>

      {/* Pagination */}
      <HStack className="justify-center items-center mt-4 pb-8">
        <Button
          variant="link"
          onPress={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ButtonIcon
            as={ChevronLeft}
            size="md"
            className={`${currentPage === 1 ? "opacity-50" : ""} ${getTextColor(
              "gray"
            )}`}
          />
        </Button>
        <Text className={`mx-4 text-base ${getPaginationTextColorClass()}`}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          variant="link"
          onPress={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ButtonIcon
            as={ChevronRight}
            size="md"
            className={`${
              currentPage === totalPages ? "opacity-50" : ""
            } ${getTextColor("gray")}`}
          />
        </Button>
      </HStack>
    </Box>
  );
};

export default LogsScreen;
