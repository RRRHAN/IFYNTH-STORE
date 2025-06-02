import React, { useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  View,
  Platform,
  ScrollView,
  StyleSheet // Import StyleSheet for your styles
} from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedTable,
  ThemedRow,
  ThemedHeader,
  ThemedCell,
} from "@/components/ThemedTable";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";
import { fetchAdminActivity } from "@/src/api/admin";
import { AdminActivity } from "@/src/types/setting";

const LogsScreen = () => {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(screenWidth < 768);
  const [showAdminIdColumn, setShowAdminIdColumn] = useState(
    screenWidth >= 1000
  );

  const columnWidths = {
    no: screenWidth * (showAdminIdColumn ? 0.05 : 0.1),
    userId: screenWidth * 0.15,
    name: screenWidth * (showAdminIdColumn ? 0.2 : 0.25),
    activity: screenWidth * (showAdminIdColumn ? 0.4 : 0.5),
    time: screenWidth * (showAdminIdColumn ? 0.2 : 0.15),
  };

  const [fontSizeHeader, setFontSizeHeader] = useState(
    screenWidth < 768 ? 14 : 18
  );

  const router = useRouter();
  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = screenWidth > 1000 ? 12 : 10;
  const totalPages = Math.ceil(activity.length / dataPerPage);

  const formatTime = (timestamp: string, currentScreenWidth: number) => {
    const date = new Date(timestamp);
    if (currentScreenWidth < 1000) {
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
    } catch (err) {
      console.error("Failed to fetch logs:", err);
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
      setShowAdminIdColumn(window.width >= 1000);
    });
    return () => subscription?.remove();
  }, []);

  const indexOfLastProduct = currentPage * dataPerPage;
  const indexOfFirstProduct = indexOfLastProduct - dataPerPage;
  const currentProducts = activity.slice(
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

  const renderItem = ({
    item,
    index,
  }: {
    item: AdminActivity;
    index: number;
  }) => (
    <ThemedRow>
      <ThemedCell style={[{ width: columnWidths.no }]}>
        {indexOfFirstProduct + index + 1}
      </ThemedCell>
      {showAdminIdColumn && (
        <ThemedCell style={[{ width: columnWidths.userId }]}>
          {item.UserID}
        </ThemedCell>
      )}
      <ThemedCell style={[{ width: columnWidths.name }]}>
        {item.Name}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.activity }]}>
        {item.Description}
      </ThemedCell>
      <ThemedCell style={[{ width: columnWidths.time }]}>
        {formatTime(item.CreatedAt, screenWidth)}
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
        {/* Adjusted headerContainer for button and title */}
        <ThemedView style={styles.headerContainer}>
          <IconButton
            icon={({ color, size }) => (
              <FontAwesome name="arrow-left" size={size} color={color} />
            )}
            size={30}
            onPress={() => router.replace("/setting")}
            style={styles.backButton}
          />
          <ThemedText style={[styles.title, {flex: 1, textAlign: 'center'}]}>LIST ACTIVITIES</ThemedText>
          <View style={styles.backButtonPlaceholder} />
        </ThemedView>
        <ThemedTable>
          <ThemedHeader style={[styles.row]}>
            <ThemedHeader style={[{ width: columnWidths.no }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                No
              </ThemedText>
            </ThemedHeader>
            {showAdminIdColumn && (
              <ThemedHeader style={[{ width: columnWidths.userId }]}>
                <ThemedText
                  type="subtitle"
                  style={[styles.header, { fontSize: fontSizeHeader }]}
                >
                  Admin ID
                </ThemedText>
              </ThemedHeader>
            )}
            <ThemedHeader style={[{ width: columnWidths.name }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Admin Name
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.activity }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Activity
              </ThemedText>
            </ThemedHeader>
            <ThemedHeader style={[{ width: columnWidths.time }]}>
              <ThemedText
                type="subtitle"
                style={[styles.header, { fontSize: fontSizeHeader }]}
              >
                Time
              </ThemedText>
            </ThemedHeader>
          </ThemedHeader>
          <FlatList
            data={currentProducts}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.UserID + item.CreatedAt + index}
            ListEmptyComponent={
              <ThemedText style={{ textAlign: "center", paddingVertical: 20 }}>
                No logs found.
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

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: 'relative',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  backButtonPlaceholder: {
    width: 30,
    height: 30,
  },
  image: {
    width: 80,
    height: 80,
  },
  header: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  cell: {
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  imageCell: {
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  paginationText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
});
// --- END: styles.ts content ---

export default LogsScreen;