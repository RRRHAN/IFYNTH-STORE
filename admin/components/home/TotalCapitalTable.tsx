// components/home/TotalCapitalTable.tsx
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type Props = {
  totalCapital: number; // Expects a number, so 0 if no actual data
};

const TotalCapitalTable: React.FC<Props> = ({ totalCapital }) => {
  const colorScheme = useColorScheme();

  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";
  const rowBackgroundColor = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9"; // Added for consistency

  return (
    <ThemedView style={[styles.table, { backgroundColor: rowBackgroundColor }]}>
      {/* Header */}
      <ThemedView
        style={[styles.row, { backgroundColor: headerBackgroundColor }]}
      >
        <ThemedText
          style={[styles.cell, styles.headerText, { color: headerTextColor }]}
        >
          Total Capital
        </ThemedText>
      </ThemedView>

      {/* Data Row or No Data Message */}
      <ThemedView style={styles.row}>
        {totalCapital > 0 ? ( // Condition to check if capital is positive
          <ThemedText style={[styles.cell]}>
            Rp{totalCapital.toLocaleString("id-ID")}
          </ThemedText>
        ) : (
          <ThemedText style={[styles.cell, styles.noDataText]}>
            Rp0 (No capital data)
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
    width:
          width < 450
        ? width - 250
        : width < 500
        ? width - 300
        : width < 768
        ? width - 400
        : width < 1000
        ? width - 550
        : width < 1500
        ? width - 900
        : width - 1500,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    padding: 12,
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  headerText: {
    fontWeight: "bold",
  },
  // New style for no data text
  noDataText: {
    color: '#888', // A subtle color for the message
    fontStyle: 'italic', // Optional: make it italic
  },
});

export default TotalCapitalTable;