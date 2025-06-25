import React from "react";
import {
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Heading } from "../ui/heading";
import { useColorScheme } from "nativewind";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableData,
  TableCaption,
} from "@/components/ui/table";

import { DepartmentCount } from "@/src/types/home";

const { width } = Dimensions.get("window");

interface ProductCountTableProps {
  productCounts: DepartmentCount[] | null;
  cardTitle?: string;
  isLoading?: boolean;
  hasError?: boolean;
  variant?: "dark" | "light" | "primary" | "secondary" | "accent";
}

const ProductCountTable: React.FC<ProductCountTableProps> = ({
  productCounts,
  cardTitle = "Products by Department",
  isLoading = false,
  hasError = false,
  variant = "accent",
}) => {
  const { colorScheme } = useColorScheme();
  let backgroundColorClass = "";
  let textColorClass = "";
  let subtitleColorClass = "";
  let borderColorClass = "";
  let tableHeaderClass = "";
  let tableRowEvenClass = "";
  let tableRowOddClass = "";

  switch (variant) {
    case "light":
      backgroundColorClass = "bg-white";
      textColorClass = "text-neutral-900";
      subtitleColorClass = "text-neutral-500";
      borderColorClass = "border-neutral-200";
      tableHeaderClass = "bg-gray-100";
      tableRowEvenClass = "bg-white";
      tableRowOddClass = "bg-gray-50";
      break;
    case "primary":
      backgroundColorClass = "bg-blue-600";
      textColorClass = "text-white";
      subtitleColorClass = "text-blue-200";
      borderColorClass = "border-blue-400";
      tableHeaderClass = "bg-blue-700";
      tableRowEvenClass = "bg-blue-600";
      tableRowOddClass = "bg-blue-500";
      break;
    case "secondary":
      backgroundColorClass = "bg-gray-700";
      textColorClass = "text-white";
      subtitleColorClass = "text-gray-300";
      borderColorClass = "border-gray-500";
      tableHeaderClass = "bg-gray-800";
      tableRowEvenClass = "bg-gray-700";
      tableRowOddClass = "bg-gray-600";
      break;
    case "accent":
      backgroundColorClass = "bg-purple-600";
      textColorClass = "text-white";
      subtitleColorClass = "text-purple-200";
      borderColorClass = "border-purple-400";
      tableHeaderClass = "bg-purple-700";
      tableRowEvenClass = "bg-purple-600";
      tableRowOddClass = "bg-purple-500";
      break;
    case "dark":
    default:
      backgroundColorClass = "bg-neutral-900";
      textColorClass = "text-neutral-50";
      subtitleColorClass = "text-neutral-300";
      borderColorClass = "border-neutral-700";
      tableHeaderClass = "bg-neutral-800";
      tableRowEvenClass = "bg-neutral-900";
      tableRowOddClass = "bg-neutral-800";
      break;
  }

  const tableContentTextColorClass = textColorClass;

  if (isLoading) {
    return (
      <Box
        className={`
          ${backgroundColorClass}
          rounded-lg p-5 m-4
          shadow-black shadow-sm
          self-center
          ${borderColorClass} border
          flex-row justify-center items-center
        `}
        style={{ width: width * 0.45, height: 200 }}
      >
        <ActivityIndicator
          size="large"
          color={textColorClass.includes("white") ? "#FFFFFF" : "#000000"}
        />
        <Text className={`ml-2 ${textColorClass}`}>Loading data...</Text>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box
        className={`
          ${backgroundColorClass}
          rounded-lg p-5 m-4
          shadow-black shadow-sm
          self-center
          ${borderColorClass} border
          flex-row justify-center items-center
        `}
        style={{ width: width * 0.45, height: 200 }}
      >
        <Text className="text-red-500 text-center">Failed to load data.</Text>
      </Box>
    );
  }

  return (
    <Box
      className={`
        ${backgroundColorClass}
        rounded-lg p-5 m-4
        shadow-black shadow-sm
        self-center
        ${borderColorClass} border
      `}
      style={{ width: width < 768 ? width * 0.88 : width * 0.4 }}
    >
      <Text
        className={`
          ${subtitleColorClass} text-sm mb-2
        `}
      >
        {cardTitle}
      </Text>
      <Heading
        className={`
          ${textColorClass} text-xl mb-3
        `}
      >
        Total Departments: {productCounts ? productCounts.length : 0}
      </Heading>

      {productCounts && productCounts.length > 0 ? (
        <ScrollView style={{ flexGrow: 1 }}>
          <Table className="w-full">
            <TableHeader className={tableHeaderClass}>
              <TableRow>
                <TableHead
                  className={`py-2 px-3 font-bold text-left ${textColorClass} w-[60%] ${tableRowOddClass}`}
                >
                  Department
                </TableHead>
                <TableHead
                  className={`py-2 px-3 font-bold text-right ${textColorClass} w-[40%] ${tableRowOddClass}`}
                >
                  Count
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productCounts.map((data, index) => (
                <TableRow
                  key={data.Department}
                  className={
                    index % 2 === 0 ? tableRowEvenClass : tableRowOddClass
                  }
                >
                  <TableData
                    className={`py-2 px-3 text-left ${tableContentTextColorClass}`}
                  >
                    {data.Department === "IFY"
                      ? "I Found You"
                      : "No Time to Hell"}
                  </TableData>
                  <TableData
                    className={`py-2 px-3 text-right ${tableContentTextColorClass}`}
                  >
                    {data.Count.toLocaleString()}
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption
              className={`${subtitleColorClass} mt-2 rounded-full ${tableRowOddClass}`}
            >
              Product counts by department.
            </TableCaption>
          </Table>
        </ScrollView>
      ) : (
        <Text className={`${subtitleColorClass} text-base text-center mt-4 ${tableRowOddClass}`}>
          No product data available.
        </Text>
      )}
    </Box>
  );
};

export default ProductCountTable;
