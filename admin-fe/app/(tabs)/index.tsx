// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import {
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import MyRevenueCard from "@/components/home/income-card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  fetchProductCount,
  fetchTransactionCount,
  fetchTransactionReports,
  fetchTotalCapital,
  fetchTotalIncome,
  fetchTotalTransactionUser,
  fetchProductProfit,
} from "@/src/api/home";
import {
  DepartmentCount,
  TransactionCount,
  TransactionReport,
  TotalTransactionUser,
  ProfitProduct,
} from "@/src/types/home";
import { checkLoginStatus } from "@/src/api/admin";
import { useColorScheme } from "nativewind";
import ProductCountTable from "@/components/home/product-count-table";
import TransactionCountTable from "@/components/home/transaction-count-table";
import MTransactionReportChart from "@/components/home/MTransactionReportChart";
import TotalTransactionUserTable from "@/components/home/TotalTransactionUserTable";
import {
  dummyProfitProducts,
  dummyTransactionReports,
  dummyTotalTransactionUsers,
} from "@/components/DataDummy/home";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [productCount, setProductCount] = useState<DepartmentCount[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<
    TransactionCount[] | null
  >(null);
  const [transactionReport, setTransactionReport] = useState<
    TransactionReport[] | null
  >(null);
  const [totalTransactionUser, setTotalTransactionUser] = useState<
    TotalTransactionUser[] | null
  >(null);
  const [ProfitProduct, setProfitProduct] = useState<ProfitProduct[] | null>(
    null
  );
  const [totalCapital, setTotalCapital] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  useEffect(() => {
    const loadAllDataSequentially = async () => {
      setLoading(true);
      setHasError(false);

      const isLoggedIn = await checkLoginStatus(router);
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const products = await fetchProductCount();
        setProductCount(products);

        const transactions = await fetchTransactionCount();
        setTransactionCount(transactions);

        const reports = await fetchTransactionReports();
        setTransactionReport(reports);

        const capital = await fetchTotalCapital();
        setTotalCapital(capital);

        const income = await fetchTotalIncome();
        setTotalIncome(income);

        setPercentageChange(20.1);

        const usersData = await fetchTotalTransactionUser();
        setTotalTransactionUser(usersData);

        const profitProductData = await fetchProductProfit();
        setProfitProduct(profitProductData);
      } catch (err: any) {
        console.error("Failed to fetch home data", err);
        setHasError(true);
        setProductCount([]);
        setTransactionCount([]);
        setTransactionReport([]);
        setTotalCapital(0);
        setTotalIncome(0);
        setTotalTransactionUser([]);
        setProfitProduct([]);
        setPercentageChange(0);
      } finally {
        setLoading(false);
      }
    };

    loadAllDataSequentially();
  }, []);

  const cardVariantI = colorScheme === "dark" ? "dark" : "light";
  const cardVariantC = colorScheme === "dark" ? "secondary" : "primary";
  const cardVariantP = colorScheme === "dark" ? "accent" : "secondary";

  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-background-0 dark:bg-neutral-900"
      contentContainerStyle={{
        paddingTop: Platform.OS === "web" ? 50 : 50,
        paddingBottom: Platform.OS === "web" ? 100 : 150,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        className="w-full mb-6 items-center px-4"
        style={{ top: Platform.OS === "web" ? 0 : 0 }}
      >
        <Heading className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Dashboard Overview
        </Heading>
      </Box>
      <Box
        className="flex-row flex-wrap justify-center w-full max-w-8xl"
        style={{ paddingHorizontal: 16 }}
      >
        <MyRevenueCard
          cardTitle="Total Revenue"
          incomeAmount={totalIncome}
          percentageChange={percentageChange}
          variant={cardVariantI}
        />
        <MyRevenueCard
          cardTitle="Total Capital"
          incomeAmount={totalCapital}
          percentageChange={percentageChange}
          variant={cardVariantC}
        />
      </Box>
      <Box
        className="flex-row flex-wrap justify-center w-full max-w-8xl"
        style={{
          flexDirection: width < 768 ? "column" : "row",
          alignItems: width < 1000 ? "center" : "flex-start",
          paddingHorizontal: 10,
          marginTop: 20,
        }}
      >
        <ProductCountTable
          productCounts={productCount}
          cardTitle="Products by Department"
          isLoading={loading}
          hasError={hasError}
          variant={cardVariantP}
        />
        <TransactionCountTable
          transactionCounts={transactionCount}
          cardTitle="Transactions by Status"
          isLoading={loading}
          hasError={hasError}
          variant={cardVariantC}
        />
      </Box>

      <Box
        className="w-full max-w-8xl mt-4 px-4"
        style={{
          alignItems: "center",
        }}
      >
        <MTransactionReportChart
          transactionReport={transactionReport}
          height={380}
        />
      </Box>
      <Box
        className="w-full max-w-8xl mt-4 px-4"
        style={{
          alignItems: "center",
        }}
      >
        <TotalTransactionUserTable
          totalTransactionUser={totalTransactionUser}
        />
      </Box>
      {loading && (
        <Box
          className="absolute inset-0 flex-1 justify-center items-center z-50"
          style={{
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.8)",
          }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
          <Text
            className={`mt-2 ${
              colorScheme === "dark" ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Loading dashboard data...
          </Text>
        </Box>
      )}
      {hasError && !loading && (
        <Box
          className="absolute inset-0 flex-1 justify-center items-center z-50"
          style={{
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.9)",
          }}
        >
          <Text className="text-red-500 dark:text-red-300 text-center text-lg px-4">
            Failed to load data. Please check your internet connection and try
            again.
          </Text>
        </Box>
      )}
    </ScrollView>
  );
}
