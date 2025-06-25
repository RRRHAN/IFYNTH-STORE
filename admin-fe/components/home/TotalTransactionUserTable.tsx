import React, { useState, useMemo } from "react";
import { Dimensions, Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { TotalTransactionUser } from "@/src/types/home";

const { width: screenWidth } = Dimensions.get("window");

type TotalTransactionUserTableProps = {
  totalTransactionUser: TotalTransactionUser[];
};

const ITEMS_PER_PAGE = 5;

const TotalTransactionUserTable: React.FC<TotalTransactionUserTableProps> = ({
  totalTransactionUser,
}) => {
  const { colorScheme } = useColorScheme();

  const getTableHeaderBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-800" : "bg-blue-200";
  const getHeaderTextColorClass = () =>
    colorScheme === "dark" ? "text-white" : "text-blue-900";

  const getTableRowBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-700" : "bg-white";
  const getTableRowOddBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-750" : "bg-blue-50";

  const getTableRowBorderColorClass = (index: number) => {
    if (colorScheme === "dark") {
      return index % 2 === 0 ? "border-neutral-600" : "border-neutral-500";
    } else {
      return index % 2 === 0 ? "border-blue-100" : "border-blue-200";
    }
  };

  const getBorderColorClass = () =>
    colorScheme === "dark" ? "border-neutral-700" : "border-blue-300";

  const getDynamicTextColor = () =>
    colorScheme === "dark" ? "text-white" : "text-gray-900";
  const getPaginationButtonBgClass = (disabled: boolean) => {
    if (disabled) return colorScheme === "dark" ? "bg-gray-700" : "bg-gray-300";
    return "bg-blue-600";
  };
  const getPaginationButtonTextColorClass = (disabled: boolean) => {
    if (disabled) return colorScheme === "dark" ? "text-gray-400" : "text-gray-600";
    return "text-white";
  };
  const getPaginationTextColorClass = () =>
    colorScheme === "dark" ? "text-neutral-200" : "text-gray-700";
  const getNoDataBgClass = () =>
    colorScheme === "dark" ? "bg-neutral-700" : "bg-blue-50";
  const getNoDataTextColorClass = () =>
    colorScheme === "dark" ? "text-gray-400" : "text-gray-800";


  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(
    1,
    Math.ceil(totalTransactionUser.length / ITEMS_PER_PAGE)
  ), [totalTransactionUser.length]);

  const currentTableData = useMemo(() => {
    if (
      !Array.isArray(totalTransactionUser) ||
      totalTransactionUser.length === 0
    ) {
      return [];
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

  const tableWidth = useMemo(() => {
    if (screenWidth > 1000) {
      return screenWidth / 1.83;
    } else {
      return screenWidth / 1.1;
    }
  }, [screenWidth]);

  const columnWidths = useMemo(() => ({
    name: tableWidth * 0.25,
    phoneNumber: tableWidth * 0.25,
    totalTransaction: tableWidth * 0.25,
    totalAmount: tableWidth * 0.25,
  }), [tableWidth]);


  return (
    <Box
      className={`border rounded-xl overflow-hidden ${getBorderColorClass()}`}
      style={{ width: tableWidth, backgroundColor: getTableHeaderBgClass() }}
    >
      <Heading className={`text-xl font-bold text-center mt-3 pb-2 border-b-2 ${getBorderColorClass()} ${getHeaderTextColorClass()}`}>
        Total Transaction Customer
      </Heading>

      {/* Header Baris */}
      <HStack className={`py-2 border-b ${getBorderColorClass()} ${getTableHeaderBgClass()}`}>
        <Box style={{ width: columnWidths.name }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()}`}>
          <Text className={`font-bold text-base ${getHeaderTextColorClass()}`}>Name</Text>
        </Box>
        <Box style={{ width: columnWidths.phoneNumber }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()}`}>
          <Text className={`font-bold text-base ${getHeaderTextColorClass()}`}>Phone Number</Text>
        </Box>
        <Box style={{ width: columnWidths.totalTransaction }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()} `}>
          <Text className={`font-bold text-base ${getHeaderTextColorClass()}`}>Total Transaction</Text>
        </Box>
        <Box style={{ width: columnWidths.totalAmount }} className="flex-1 justify-center items-center">
          <Text className={`font-bold text-base ${getHeaderTextColorClass()}`}>Total Amount</Text>
        </Box>
      </HStack>
      {currentTableData.length > 0 ? (
        currentTableData.map((item, index) => {
          const rowBackgroundColor = index % 2 === 0 ? getTableRowBgClass() : getTableRowOddBgClass();

          return (
            <HStack
              key={`${item.UserID}-${index}`}
              className={`py-2 border-b ${getTableRowBorderColorClass(index)}`}
              style={{ backgroundColor: rowBackgroundColor }}
            >
              <Box style={{ width: columnWidths.name }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()}`}>
                <Text className={`text-base ${getDynamicTextColor()}`}>{item.CustomerName}</Text>
              </Box>
              <Box style={{ width: columnWidths.phoneNumber }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()}`}>
                <Text className={`text-base ${getDynamicTextColor()}`}>{item.PhoneNumber}</Text>
              </Box>
              <Box style={{ width: columnWidths.totalTransaction }} className={`flex-1 justify-center items-center border-r-2 ${getBorderColorClass()}`}>
                <Text className={`text-base ${getDynamicTextColor()}`}>{item.TotalTransaction}</Text>
              </Box>
              <Box style={{ width: columnWidths.totalAmount }} className="flex-1 justify-center items-center">
                <Text className={`text-base ${getDynamicTextColor()}`}>Rp{item.TotalAmount.toLocaleString("id-ID")}</Text>
              </Box>
            </HStack>
          );
        })
      ) : (
        <Box
          className={`py-5 justify-center items-center`}
          style={{ backgroundColor: getNoDataBgClass() }}
        >
          <Text className={`text-lg ${getNoDataTextColorClass()}`}>
            No transaction data available.
          </Text>
        </Box>
      )}
      {totalTransactionUser.length > ITEMS_PER_PAGE && (
        <HStack
          className={`flex-row justify-center items-center py-3 border-t ${getBorderColorClass()}`}
          style={{ backgroundColor: getNoDataBgClass() }}
        >
          <Button
            onPress={goToPreviousPage}
            isDisabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg mx-1 ${getPaginationButtonBgClass(currentPage === 1)}`}
          >
            <ButtonIcon
              as={ChevronLeft}
              size="md"
              className={`${getPaginationButtonTextColorClass(currentPage === 1)}`}
            />
          </Button>
          <Text className={`text-base mx-2 ${getPaginationTextColorClass()}`}>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onPress={goToNextPage}
            isDisabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg mx-1 ${getPaginationButtonBgClass(currentPage === totalPages)}`}
          >
            <ButtonIcon
              as={ChevronRight}
              size="md"
              className={`${getPaginationButtonTextColorClass(currentPage === totalPages)}`}
            />
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default TotalTransactionUserTable;