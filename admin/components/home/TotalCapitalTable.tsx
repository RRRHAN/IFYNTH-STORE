// components/home/TotalCapitalTable.tsx
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
const { width } = Dimensions.get("window");

type Props = {
  totalCapital: number;
};

const TotalCapitalTable: React.FC<Props> = ({ totalCapital }) => {
  const colorScheme = useColorScheme();

  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";

  return (
    <ThemedView style={styles.table}>
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

      {/* Data Row */}
      <ThemedView style={styles.row}>
        <ThemedText style={[styles.cell]}>
          Rp{totalCapital.toLocaleString("id-ID")}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
    width: width < 1000 ? (width < 500 ? "70%" : "80%") : "100%",
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
});

export default TotalCapitalTable;
