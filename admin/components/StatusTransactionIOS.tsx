import React, { JSX } from 'react';
import { Modal, Platform, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedCell } from "@/components/ThemedTable";
import { TransactionStatus } from "@/src/api/transaction";
import { Transaction } from "@/src/types/transaction";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = {
  item: Transaction;
  columnWidths: any;
  selectedStatus: Record<string, TransactionStatus>;
  setSelectedStatus: React.Dispatch<
    React.SetStateAction<Record<string, TransactionStatus>>
  >;
  currentItemId: string | null;
  setCurrentItemId: (id: string) => void;
  modalStatusVisible: boolean;
  setModalStatusVisible: (v: boolean) => void;
  handleStatusChange: (status: TransactionStatus, id: string) => void;
  transactions: Transaction[];
};

export default function StatusTransactionIOS({
  item,
  columnWidths,
  selectedStatus,
  setSelectedStatus,
  currentItemId,
  setCurrentItemId,
  modalStatusVisible,
  setModalStatusVisible,
  handleStatusChange,
  transactions,
}: Props) {
  const currentItemStatus = currentItemId
    ? selectedStatus[currentItemId] ||
      transactions.find((d) => d.ID === currentItemId)?.Status
    : undefined;
  const colorScheme = useColorScheme();
  const pickerItems: JSX.Element[] = [];

  if (currentItemStatus === "pending") {
    pickerItems.push(
      <Picker.Item key="pending" label="Pending" value="pending" />,
      <Picker.Item key="paid" label="Paid" value="paid" />
    );
  } else if (currentItemStatus === "paid") {
    pickerItems.push(<Picker.Item key="paid" label="Paid" value="paid" />);
  }

  pickerItems.push(
    <Picker.Item key="process" label="Process" value="process" />,
    <Picker.Item key="delivered" label="Delivered" value="delivered" />,
    <Picker.Item key="cancelled" label="Cancelled" value="cancelled" />
  );
  return (
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
          onPress={() => {
            setCurrentItemId(item.ID);
            setModalStatusVisible(true);
          }}
          disabled={
            (selectedStatus[item.ID] || item.Status) === "cancelled" ||
            (selectedStatus[item.ID] || item.Status) === "delivered"
          }
          style={{
            height: 50,
            width: 150,
            justifyContent: "center",
            backgroundColor:
              (selectedStatus[item.ID] || item.Status) === "cancelled" ||
              (selectedStatus[item.ID] || item.Status) === "delivered"
                ? "#ccc"
                : colorScheme === "dark"
                ? "#555555"
                : "#f9fafb",
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            opacity:
              (selectedStatus[item.ID] || item.Status) === "cancelled" ||
              (selectedStatus[item.ID] || item.Status) === "delivered"
                ? 0.5
                : 1,
          }}
        >
          <ThemedText style={{ textAlign: "center" }}>
            {(selectedStatus[item.ID] || item.Status).charAt(0).toUpperCase() +
              (selectedStatus[item.ID] || item.Status).slice(1)}
          </ThemedText>
        </TouchableOpacity>
      </ThemedCell>
      <Modal visible={modalStatusVisible} transparent animationType="slide">
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
              selectedValue={currentItemStatus}
              onValueChange={(newStatus: TransactionStatus) => {
                if (!currentItemId) return;
                handleStatusChange(newStatus, currentItemId);
                setSelectedStatus((prev) => ({
                  ...prev,
                  [currentItemId]: newStatus,
                }));
              }}
              itemStyle={{ height: 120 }}
            >
              {pickerItems}
            </Picker>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}
