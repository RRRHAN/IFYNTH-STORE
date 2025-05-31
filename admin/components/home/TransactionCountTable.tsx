import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TransactionCount } from "@/src/types/home";
import { StyleSheet, Dimensions } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type TransactionCountTableProps = {
  transactionCount: TransactionCount[];
};

const TransactionCountTable: React.FC<TransactionCountTableProps> = ({
  transactionCount,
}) => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";
  const rowBackgroundColor = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9";

  return (
    <ThemedView style={[styles.table, { backgroundColor: headerBackgroundColor }]}>
      <ThemedText style={[styles.tableTitle, { color: headerTextColor }]}>Transaction</ThemedText>

      {/* Header Row */}
      <ThemedView style={styles.row}>
        <ThemedText style={[styles.cell, styles.headerText]}>Status</ThemedText>
        <ThemedText style={[styles.rowLastCell, styles.headerText]}>
          Total Transaction
        </ThemedText>
      </ThemedView>

      {/* Conditional Data Rows or No Data Message */}
      {transactionCount && transactionCount.length > 0 ? (
        transactionCount.map((item, index) => {
          const isLast = index === transactionCount.length - 1;
          return (
            <ThemedView
              key={item.Status}
              style={[styles.row, isLast && styles.lastRow, { backgroundColor: rowBackgroundColor }]}
            >
              <ThemedText style={styles.cell}>{item.Status}</ThemedText>
              <ThemedText style={styles.rowLastCell}>{item.Count}</ThemedText>
            </ThemedView>
          );
        })
      ) : (
        <ThemedView style={[styles.noDataRow, { backgroundColor: rowBackgroundColor }]}>
          <ThemedText style={styles.noDataText}>No transaction data available.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
    width:
      width < 600
        ? width - 20
        : width < 1000
        ? width - 40
        : width < 1500
        ? width - 850
        : width - 1100,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  lastRow: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 0,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    borderRightWidth: 2,
    borderRightColor: "#ccc",
  },
  rowLastCell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    borderRightWidth: 0,
  },
  headerText: {
    fontWeight: "bold",
  },
  noDataRow: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TransactionCountTable;