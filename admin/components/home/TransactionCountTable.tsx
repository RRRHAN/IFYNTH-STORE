import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TransactionCount } from "@/src/types/home";
import styles from "@/app/styles/HomeStyles";

type TransactionCountTableProps = {
  transactionCount: TransactionCount[];
};

const TransactionCountTable: React.FC<TransactionCountTableProps> = ({
  transactionCount,
}) => {
  return (
    <ThemedView style={styles.table}>
      <ThemedText style={styles.tableTitle}>Transaction</ThemedText>
      <ThemedView style={styles.row}>
        <ThemedText style={styles.cell}>Status</ThemedText>
        <ThemedText style={styles.rowLastCell}>Total Transaction</ThemedText>
      </ThemedView>
      {transactionCount.map((item) => (
        <ThemedView key={item.Status} style={styles.row}>
          <ThemedText style={styles.cell}>{item.Status}</ThemedText>
          <ThemedText style={styles.rowLastCell}>{item.Count}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

export default TransactionCountTable;
