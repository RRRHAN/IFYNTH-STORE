import React from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedCell } from "@/components/ThemedTable";
import { Status } from "@/src/api/cusoffers";
import { cusProduct } from "@/src/types/product";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = {
  item: cusProduct;
  columnWidths: any;
  selectedStatus: Record<string, Status>;
  setSelectedStatus: React.Dispatch<
    React.SetStateAction<Record<string, Status>>
  >;
  currentItemId: string | null;
  setCurrentItemId: (id: string) => void;
  modalStatusVisible: boolean;
  setModalStatusVisible: (v: boolean) => void;
  handleStatusChange: (status: Status, id: string) => void;
  offers: cusProduct[];
};

export default function StatusOfferIOS({
  item,
  columnWidths,
  selectedStatus,
  setSelectedStatus,
  currentItemId,
  setCurrentItemId,
  modalStatusVisible,
  setModalStatusVisible,
  handleStatusChange,
  offers,
}: Props) {
  const currentItemStatus = currentItemId
    ? selectedStatus[currentItemId] ||
      offers.find((d) => d.ID === currentItemId)?.Status
    : undefined;
  const colorScheme = useColorScheme();
  const pickerItems: JSX.Element[] = [];

  if (currentItemStatus === "pending") {
    pickerItems.push(
      <Picker.Item key="pending" label="Pending" value="pending" />,
      <Picker.Item key="process" label="Process" value="process" />
    );
  } else if (currentItemStatus === "process") {
    pickerItems.push(<Picker.Item key="process" label="Process" value="process" />);
  }

  pickerItems.push(
    <Picker.Item key="approved" label="Approved" value="approved" />,
    <Picker.Item key="rejected" label="Rejected" value="rejected" />
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
            (selectedStatus[item.ID] || item.Status) === "rejected" ||
            (selectedStatus[item.ID] || item.Status) === "approved"
          }
          style={{
            height: 50,
            width: 150,
            justifyContent: "center",
            backgroundColor:
              (selectedStatus[item.ID] || item.Status) === "rejected" ||
              (selectedStatus[item.ID] || item.Status) === "approved"
                ? "#ccc"
                : colorScheme === "dark"
                ? "#555555"
                : "#f9fafb",
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            opacity:
              (selectedStatus[item.ID] || item.Status) === "rejected" ||
              (selectedStatus[item.ID] || item.Status) === "approved"
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
              onValueChange={(newStatus: Status) => {
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
