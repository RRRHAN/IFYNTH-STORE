import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DepartentCount } from "@/src/types/home";
import styles from "@/app/styles/HomeStyles";

type ProductCountTableProps = {
  productCount: DepartentCount[];
};

const ProductCountTable: React.FC<ProductCountTableProps> = ({ productCount }) => {
  return (
    <ThemedView style={styles.table}>
      <ThemedText style={styles.tableTitle}>Product</ThemedText>
      <ThemedView style={styles.row}>
        <ThemedText style={styles.cell}>Department</ThemedText>
        <ThemedText style={styles.rowLastCell}>Total Product</ThemedText>
      </ThemedView>
      {productCount.map((item) => (
        <ThemedView key={item.Department} style={styles.row}>
          <ThemedText style={styles.cell}>
            {item.Department === "NTH" ? "No Time To Hell" : "I Found You"}
          </ThemedText>
          <ThemedText style={styles.rowLastCell}>{item.Count}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

export default ProductCountTable;
