import React, { useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Platform,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
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

const TransactionsScreen = () => {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(screenWidth < 700);
  const [isTinyScreen, setIsTinyScreen] = useState(screenWidth < 500);

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

  const router = useRouter();
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

  const getData = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsMobile(window.width < 768);
      setIsTinyScreen(window.width < 500);
      setFontSizeHeader(window.width < 768 ? 14 : 18);
    });
    return () => subscription?.remove();
  }, []);

  if (loading) {
    return (
      <ThemedView style={[styles.center]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Transaction }) => (
    <ThemedRow>
      {isTinyScreen ? (
        <>
          <ThemedCell style={{ width: columnWidths.id }}>{item.ID}</ThemedCell>
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
                      onValueChange={(newStatus: TransactionStatus) => {
                        handleStatusChange(newStatus, item.ID);
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [item.ID]: newStatus,
                        }));
                      }}
                      itemStyle={{ height: 120 }}
                    >
                      {item.Status === "pending" && (
                        <>
                          <Picker.Item label="Pending" value="pending" />
                          <Picker.Item label="Paid" value="paid" />
                        </>
                      )}
                      {item.Status === "paid" && (
                        <Picker.Item label="Paid" value="paid" />
                      )}
                      <Picker.Item label="Proccess" value="proccess" />
                      <Picker.Item label="Delivered" value="delivered" />
                      <Picker.Item label="Cancelled" value="cancelled" />
                    </Picker>
                  </ThemedView>
                </View>
              </Modal>
            </>
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
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor:
                    colorScheme === "dark" ? "#555555" : "#f9fafb",
                  color: colorScheme === "dark" ? "#f9fafb" : "#555555",
                  borderRadius: 10,
                }}
              >
                {item.Status === "pending" && (
                  <>
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Paid" value="paid" />
                  </>
                )}
                {item.Status === "paid" && (
                  <Picker.Item label="Paid" value="paid" />
                )}
                <Picker.Item label="Proccess" value="proccess" />
                <Picker.Item label="Delivered" value="delivered" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </ThemedCell>
          )}
          <ThemedCell style={{ width: columnWidths.action }}>
            <IconButton
              icon="eye"
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
                      onValueChange={(newStatus: TransactionStatus) => {
                        handleStatusChange(newStatus, item.ID);
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [item.ID]: newStatus,
                        }));
                      }}
                      style={{
                        height: 50,
                        width: "100%",
                        backgroundColor: "#fff",
                      }}
                    >
                      {item.Status === "pending" && (
                        <>
                          <Picker.Item label="Pending" value="pending" />
                          <Picker.Item label="Paid" value="paid" />
                        </>
                      )}
                      {item.Status === "paid" && (
                        <Picker.Item label="Paid" value="paid" />
                      )}
                      <Picker.Item label="Proccess" value="proccess" />
                      <Picker.Item label="Delivered" value="delivered" />
                      <Picker.Item label="Cancelled" value="cancelled" />
                    </Picker>
                  </ThemedView>
                </View>
              </Modal>
            </>
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
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor:
                    colorScheme === "dark" ? "#555555" : "#f9fafb",
                  color: colorScheme === "dark" ? "#f9fafb" : "#555555",
                  borderRadius: 10,
                }}
              >
                {item.Status === "pending" && (
                  <>
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Paid" value="paid" />
                  </>
                )}
                {item.Status === "paid" && (
                  <Picker.Item label="Paid" value="paid" />
                )}
                <Picker.Item label="Proccess" value="proccess" />
                <Picker.Item label="Delivered" value="delivered" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </ThemedCell>
          )}

          <ThemedCell style={[{ width: columnWidths.action }]}>
            <IconButton
              icon="eye"
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

  return (
    <ThemedView
      style={[styles.center, { marginTop: Platform.OS === "web" ? 20 : 50 }]}
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
      <ScrollView horizontal>
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
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
          />
        </ThemedTable>
      </ScrollView>
    </ThemedView>
  );
};

export default TransactionsScreen;
