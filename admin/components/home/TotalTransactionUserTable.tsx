import React, { useState, useMemo } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TotalTransactionUser } from "@/src/types/home";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

type TotalTransactionUserTableProps = {
  totalTransactionUser: TotalTransactionUser[]; // This prop should always be an array, even if empty
};

const ITEMS_PER_PAGE = 5;
const TotalTransactionUserTable: React.FC<TotalTransactionUserTableProps> = ({
  totalTransactionUser,
}) => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = colorScheme === "dark" ? "#ffffff" : "#111827";
  const headerTextColor = colorScheme === "dark" ? "#000" : "#fff";
  const rowBackgroundColor = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9";

  const [currentPage, setCurrentPage] = useState(1);

  // Ensure totalPages is at least 1, even if data is empty
  const totalPages = Math.max(
    1,
    Math.ceil(totalTransactionUser.length / ITEMS_PER_PAGE)
  );

  const currentTableData = useMemo(() => {
    // **CRITICAL FIX:** Ensure totalTransactionUser is an array before slicing
    if (
      !Array.isArray(totalTransactionUser) ||
      totalTransactionUser.length === 0
    ) {
      return []; // Return an empty array if data is not an array or is empty
    }
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

      {/* Conditional Data Rows or No Data Message */}
      {currentTableData.length > 0 ? (
        currentTableData.map((item, index) => {
          const isLastVisibleRow = index === currentTableData.length - 1;
          const isLastGlobalRow =
            (currentPage - 1) * ITEMS_PER_PAGE + index ===
            totalTransactionUser.length - 1;
          const isLastRowStyled = isLastVisibleRow && isLastGlobalRow;

          return (
            <ThemedView
              key={`${item.UserID}-${index}`}
              style={[
                styles.row,
                { backgroundColor: rowBackgroundColor },
                isLastRowStyled ? styles.lastRow : null,
              ]}
            >
              <ThemedText style={styles.cell}>{item.CustomerName}</ThemedText>
              <ThemedText style={styles.rowLastCell}>
                {item.PhoneNumber}
              </ThemedText>
              <ThemedText style={styles.rowLastCell}>
                {item.TotalTransaction}
              </ThemedText>
              <ThemedText style={styles.rowLastCell}>
                Rp{item.TotalAmount.toLocaleString("id-ID")}
              </ThemedText>
            </ThemedView>
          );
        })
      ) : (
        <ThemedView
          style={[styles.noDataRow, { backgroundColor: rowBackgroundColor }]}
        >
          <ThemedText style={styles.noDataText}>
            No transaction data available.
          </ThemedText>
        </ThemedView>
      )}

      {/* Pagination Controls */}
      {totalTransactionUser.length > ITEMS_PER_PAGE && (
        <ThemedView
          style={[
            styles.paginationContainer,
            { backgroundColor: rowBackgroundColor },
          ]}
        >
          <TouchableOpacity
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <ThemedText
              style={[
                styles.paginationButtonText,
                currentPage === 1 && styles.disabledButtonText,
              ]}
            >
              Previous
            </ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </ThemedText>
          <TouchableOpacity
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
          >
            <ThemedText
              style={[
                styles.paginationButtonText,
                currentPage === totalPages && styles.disabledButtonText,
              ]}
            >
              Next
            </ThemedText>
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
    width: width > 1000 ? width / 1.83 : width / 1.1,
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
  noDataRow: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});

export default TotalTransactionUserTable;
