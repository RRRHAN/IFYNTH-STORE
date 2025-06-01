import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type Props = {
  totalIncome: number;
};

const TotalIncomeTable: React.FC<Props> = ({ totalIncome }) => {
  const colorScheme = useColorScheme();

  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";
  const rowBackgroundColor = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9";

  return (
    <ThemedView style={[styles.table, { backgroundColor: rowBackgroundColor }]}>
      <ThemedView
        style={[styles.row, { backgroundColor: headerBackgroundColor }]}
      >
        <ThemedText
          style={[styles.cell, styles.headerText, { color: headerTextColor }]}
        >
          Total Income
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.row}>
        {totalIncome > 0 ? (
          <ThemedText style={[styles.cell]}>
            Rp{totalIncome.toLocaleString("id-ID")}
          </ThemedText>
        ) : (
          <ThemedText style={[styles.cell, styles.noDataText]}>
            Rp0 (No income data)
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
    width: width > 1000 ? width / 4.5 : width / 2.35,
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
  noDataText: {
    color: '#888',
    fontStyle: 'italic',
  },
});

export default TotalIncomeTable;