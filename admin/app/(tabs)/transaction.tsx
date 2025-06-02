import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  View,
  FlatList,
  ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";
import styles from "../styles/transactionStyles";
import {
  fetchTransactions,
  handleStatusChange,
  TransactionStatus,
} from "@/src/api/transaction";
import { Transaction } from "@/src/types/transaction";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedTable,
  ThemedRow,
  ThemedHeader,
  ThemedCell,
} from "@/components/ThemedTable";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "@/hooks/useColorScheme";
import StatusTransactionIOS from "@/components/StatusTransactionIOS";
import { FontAwesome } from "@expo/vector-icons"; // Mengubah import menjadi FontAwesome

const TransactionsScreen = () => {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const [isTinyScreen, setIsTinyScreen] = useState(screenWidth < 500);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const columnWidths = isTinyScreen
    ? {
        id: screenWidth * 0.4,
        status: screenWidth * 0.4,
        action: screenWidth * 0.15,
      }
    : {
        name: screenWidth * 0.2,
        amount: screenWidth * 0.15,
        method: screenWidth * 0.15,
        status: screenWidth * 0.18,
        action: screenWidth * 0.1,
      };

  const [fontSizeHeader, setFontSizeHeader] = useState(
    screenWidth < 768 ? 14 : 18
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: TransactionStatus;
  }>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = Platform.OS === "web" ? 12 : 8;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const getData = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
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
      setIsTinyScreen(window.width < 500);
      setFontSizeHeader(window.width < 768 ? 14 : 18);
    });
    return () => subscription?.remove();
  }, []);

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

  // Get current transactions for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <ThemedRow>
      {isTinyScreen ? (
        <>
          <ThemedCell style={{ width: columnWidths.id }}>{item.ID}</ThemedCell>
          {Platform.OS === "ios" ? (
            <StatusTransactionIOS
              item={item}
              columnWidths={columnWidths}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              currentItemId={currentItemId}
              setCurrentItemId={setCurrentItemId}
              modalStatusVisible={modalStatusVisible}
              setModalStatusVisible={setModalStatusVisible}
              handleStatusChange={handleStatusChange}
              transactions={transactions}
            />
          ) : (
            <ThemedCell style={[{ width: columnWidths.status }]}>
              <Picker
                selectedValue={selectedStatus[item.ID] || item.Status}
                onValueChange={(newStatus: TransactionStatus) => {
                  handleStatusChange(newStatus, item.ID);
                  setSelectedStatus((prev) => ({
                    ...prev,
                    [item.ID]: newStatus,
                  }));
                }}
                enabled={
                  (selectedStatus[item.ID] || item.Status) !== "delivered" &&
                  (selectedStatus[item.ID] || item.Status) !== "cancelled" &&
                  (selectedStatus[item.ID] || item.Status) !== "draft"
                }
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor:
                    (selectedStatus[item.ID] || item.Status) === "delivered" ||
                    (selectedStatus[item.ID] || item.Status) === "cancelled"
                      ? "#ddd"
                      : colorScheme === "dark"
                      ? "#555555"
                      : "#f9fafb",
                  color:
                    (selectedStatus[item.ID] || item.Status) === "delivered" ||
                    (selectedStatus[item.ID] || item.Status) === "cancelled"
                      ? "#888"
                      : colorScheme === "dark"
                      ? "#f9fafb"
                      : "#555555",
                  borderRadius: 10,
                }}
              >
                {item.Status === "draft" && (
                  <Picker.Item label="Draft" value="draft" />
                )}
                {item.Status === "pending" && (
                  <>
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Paid" value="paid" />
                  </>
                )}
                {item.Status === "paid" && (
                  <Picker.Item label="Paid" value="paid" />
                )}
                {item.Status !== "draft" && (
                  <>
                    <Picker.Item label="Proccess" value="proccess" />
                    <Picker.Item label="Delivered" value="delivered" />
                    <Picker.Item label="Cancelled" value="cancelled" />
                  </>
                )}
              </Picker>
            </ThemedCell>
          )}
          <ThemedCell style={{ width: columnWidths.action }}>
            <IconButton
              // Gunakan ikon FontAwesome sebagai children
              icon={({ color, size }) => (
                <FontAwesome name="eye" size={size} color={color} /> // Ikon "eye" tersedia di FontAwesome
              )}
              size={20}
              iconColor="#00FFFF"
              onPress={() => {
                setSelectedTransaction(item);
                setIsTransactionModalVisible(true);
              }}
            />
          </ThemedCell>
        </>
      ) : (
        <>
          <ThemedCell style={[{ width: columnWidths.name }]}>
            {item.ID}
          </ThemedCell>
          <ThemedCell style={[{ width: columnWidths.name }]}>
            {item.ShippingAddress.Name}
          </ThemedCell>
          <ThemedCell style={[{ width: columnWidths.amount }]}>
            Rp {item.TotalAmount.toLocaleString()}
          </ThemedCell>
          <ThemedCell style={[{ width: columnWidths.method }]}>
            {item.PaymentMethod}
          </ThemedCell>
          {Platform.OS === "ios" ? (
            <StatusTransactionIOS
              item={item}
              columnWidths={columnWidths}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              currentItemId={currentItemId}
              setCurrentItemId={setCurrentItemId}
              modalStatusVisible={modalStatusVisible}
              setModalStatusVisible={setModalStatusVisible}
              handleStatusChange={handleStatusChange}
              transactions={transactions}
            />
          ) : (
            <ThemedCell style={[{ width: columnWidths.status }]}>
              <Picker
                selectedValue={selectedStatus[item.ID] || item.Status}
                onValueChange={(newStatus: TransactionStatus) => {
                  handleStatusChange(newStatus, item.ID);
                  setSelectedStatus((prev) => ({
                    ...prev,
                    [item.ID]: newStatus,
                  }));
                }}
                enabled={
                  (selectedStatus[item.ID] || item.Status) !== "delivered" &&
                  (selectedStatus[item.ID] || item.Status) !== "cancelled" &&
                  (selectedStatus[item.ID] || item.Status) !== "draft"
                }
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor:
                    (selectedStatus[item.ID] || item.Status) === "delivered" ||
                    (selectedStatus[item.ID] || item.Status) === "cancelled"
                      ? "#ddd"
                      : colorScheme === "dark"
                      ? "#555555"
                      : "#f9fafb",
                  color:
                    (selectedStatus[item.ID] || item.Status) === "delivered" ||
                    (selectedStatus[item.ID] || item.Status) === "cancelled"
                      ? "#888"
                      : colorScheme === "dark"
                      ? "#f9fafb"
                      : "#555555",
                  borderRadius: 10,
                }}
              >
                {item.Status === "draft" && (
                  <Picker.Item label="Draft" value="draft" />
                )}
                {item.Status === "pending" && (
                  <>
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Paid" value="paid" />
                  </>
                )}
                {item.Status === "paid" && (
                  <Picker.Item label="Paid" value="paid" />
                )}
                {item.Status !== "draft" && (
                  <>
                    <Picker.Item label="Proccess" value="proccess" />
                    <Picker.Item label="Delivered" value="delivered" />
                    <Picker.Item label="Cancelled" value="cancelled" />
                  </>
                )}
              </Picker>
            </ThemedCell>
          )}

          <ThemedCell style={[{ width: columnWidths.action }]}>
            <IconButton
              // Gunakan ikon FontAwesome sebagai children
              icon={({ color, size }) => (
                <FontAwesome name="eye" size={size} color={color} /> // Ikon "eye" tersedia di FontAwesome
              )}
              size={25}
              iconColor="#00FFFF"
              onPress={() => {
                setSelectedTransaction(item);
                setIsTransactionModalVisible(true);
              }}
            />
          </ThemedCell>
        </>
      )}
    </ThemedRow>
  );

  // Function to handle page changes
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
      }}
    >
      <ThemedView
        style={[styles.center, { marginTop: Platform.OS === "web" ? 20 : 80 }]}
      >
        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            visible={isTransactionModalVisible}
            onClose={() => setIsTransactionModalVisible(false)}
          />
        )}
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={[styles.title]}>LIST TRANSACTIONS</ThemedText>
        </ThemedView>
        <ThemedTable>
          <ThemedHeader style={[styles.row]}>
            {isTinyScreen ? (
              <>
                <ThemedHeader style={{ width: columnWidths.id }}>
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: fontSizeHeader, textAlign: "center" }}
                  >
                    Transaction ID
                  </ThemedText>
                </ThemedHeader>
                <ThemedHeader style={{ width: columnWidths.status }}>
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: fontSizeHeader, textAlign: "center" }}
                  >
                    Status
                  </ThemedText>
                </ThemedHeader>
                <ThemedHeader style={{ width: columnWidths.action }}>
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: fontSizeHeader, textAlign: "center" }}
                  >
                    Action
                  </ThemedText>
                </ThemedHeader>
              </>
            ) : (
              <>
                <ThemedHeader style={[{ width: columnWidths.name }]}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.header, { fontSize: fontSizeHeader }]}
                  >
                    Transaction ID
                  </ThemedText>
                </ThemedHeader>
                <ThemedHeader style={[{ width: columnWidths.name }]}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.header, { fontSize: fontSizeHeader }]}
                  >
                    Customer Name
                  </ThemedText>
                </ThemedHeader>
                <ThemedHeader style={[{ width: columnWidths.amount }]}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.header, { fontSize: fontSizeHeader }]}
                  >
                    Total Amount
                  </ThemedText>
                </ThemedHeader>
                <ThemedHeader style={[{ width: columnWidths.method }]}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.header, { fontSize: fontSizeHeader }]}
                  >
                    Payment Method
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
              </>
            )}
          </ThemedHeader>
          <FlatList
            data={currentTransactions} // Use paginated data
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
            ListEmptyComponent={
              <ThemedText style={{ textAlign: "center", paddingVertical: 20 }}>
                No transactions found.
              </ThemedText>
            }
          />
        </ThemedTable>

        {/* Pagination controls */}
        <View style={styles.paginationContainer}>
          <IconButton
            // Gunakan ikon FontAwesome untuk chevron-left
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
            // Gunakan ikon FontAwesome untuk chevron-right
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

export default TransactionsScreen;
