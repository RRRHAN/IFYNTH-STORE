// components/home/TotalTransactionUserTable.tsx
import React, { useState, useMemo } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TotalTransactionUser } from "@/src/types/home";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type TotalTransactionUserTableProps = {
  totalTransactionUser: TotalTransactionUser[];
};

const ITEMS_PER_PAGE = 5;
const TotalTransactionUserTable: React.FC<TotalTransactionUserTableProps> = ({
  totalTransactionUser,
}) => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";

  // State untuk halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung total halaman yang dibutuhkan
  const totalPages = Math.ceil(totalTransactionUser.length / ITEMS_PER_PAGE);

  // Ambil data untuk halaman saat ini
  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return totalTransactionUser.slice(startIndex, endIndex);
  }, [totalTransactionUser, currentPage]);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Tampilkan tabel hanya jika ada data atau jika data lebih dari 5
  if (totalTransactionUser.length === 0) {
    return (
      <ThemedView style={styles.noDataContainer}>
        <ThemedText style={styles.noDataText}>No transaction data available.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.table, { backgroundColor: headerBackgroundColor }]}
    >
      <ThemedText style={[styles.tableTitle, { color: headerTextColor }]}>
        Total Transaction Customer
      </ThemedText>

      {/* Header */}
      <ThemedView style={styles.row}>
        <ThemedText style={[styles.cell, styles.headerText]}>Name</ThemedText>
        <ThemedText style={[styles.rowLastCell, styles.headerText]}>
          Phone Number
        </ThemedText>
        <ThemedText style={[styles.rowLastCell, styles.headerText]}>
          Total Transaction
        </ThemedText>
        <ThemedText style={[styles.rowLastCell, styles.headerText]}>
          Total Amount
        </ThemedText>
      </ThemedView>
      {currentTableData.map((item, index) => {
        const isLast = index === currentTableData.length - 1;
        return (
          <ThemedView
            key={`${item.UserID}-${index}`}
            style={[styles.row, isLast && styles.lastRow]}
          >
            <ThemedText style={styles.cell}>
              {item.CustomerName}
            </ThemedText>
            <ThemedText style={styles.rowLastCell}>{item.PhoneNumber}</ThemedText>
            <ThemedText style={styles.rowLastCell}>{item.TotalTransaction}</ThemedText>
            <ThemedText style={styles.rowLastCell}>{item.TotalAmount}</ThemedText>
          </ThemedView>
        );
      })}
      {totalTransactionUser.length > ITEMS_PER_PAGE && (
        <ThemedView style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          >
            <ThemedText style={[styles.paginationButtonText, currentPage === 1 && styles.disabledButtonText]}>Previous</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </ThemedText>
          <TouchableOpacity
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          >
            <ThemedText style={[styles.paginationButtonText, currentPage === totalPages && styles.disabledButtonText]}>Next</ThemedText>
          </TouchableOpacity>
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#007bff",
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "#666",
  },
  paginationText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
  },
});

export default TotalTransactionUserTable;