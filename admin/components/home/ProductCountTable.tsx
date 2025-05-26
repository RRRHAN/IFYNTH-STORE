// components/home/ProductCountTable.tsx
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DepartentCount } from "@/src/types/home";
import { StyleSheet, Dimensions } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type ProductCountTableProps = {
  productCount: DepartentCount[];
};

const ProductCountTable: React.FC<ProductCountTableProps> = ({
  productCount,
}) => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";
  return (
    <ThemedView style={[styles.table, { backgroundColor: headerBackgroundColor } ]}>
      <ThemedText style={[styles.tableTitle, { color: headerTextColor }]}>Product</ThemedText>

      {/* Header */}
      <ThemedView style={styles.row}>
        <ThemedText style={[styles.cell, styles.headerText]}>
          Department
        </ThemedText>
        <ThemedText style={[styles.rowLastCell, styles.headerText]}>
          Total Product
        </ThemedText>
      </ThemedView>

      {/* Data Rows */}
      {productCount.map((item, index) => {
        const isLast = index === productCount.length - 1;
        return (
          <ThemedView
            key={item.Department}
            style={[styles.row, isLast && styles.lastRow]}
          >
            <ThemedText style={styles.cell}>
              {item.Department === "NTH" ? "No Time To Hell" : "I Found You"}
            </ThemedText>
            <ThemedText style={styles.rowLastCell}>{item.Count}</ThemedText>
          </ThemedView>
        );
      })}
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
        ? width - 700
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
    paddingVertical: 8,
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
});

export default ProductCountTable;
