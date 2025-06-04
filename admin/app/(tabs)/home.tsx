import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  fetchProductCount,
  fetchTransactionCount,
  fetchTransactionReports,
  fetchTotalCapital,
  fetchTotalIncome,
  fetchTotalTransactionUser,
  fetchProductProfit,
} from "@/src/api/home";
import ProductCountTable from "@/components/home/ProductCountTable";
import TransactionCountTable from "@/components/home/TransactionCountTable";
import {
  DepartentCount,
  TransactionCount,
  TransactionReport,
  TotalTransactionUser,
  ProfitProduct,
} from "@/src/types/home";
import styles from "../styles/HomeStyles";
import TotalCapitalTable from "@/components/home/TotalCapitalTable";
import TotalIncomeTable from "@/components/home/TotalIncomeTable";
import TotalTransactionUserTable from "@/components/home/TotalTransactionUserTable";
import ProfitProductChart from "@/components/home/ProfitProductChart";
import { ScrollView } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import MTransactionReportChart from "@/components/home/TransactionChartMobile";
import {
  dummyProfitProducts,
  dummyTransactionReports,
  dummyTotalTransactionUsers,
} from "@/components/DataDummy/home";
import { checkLoginStatus } from "@/src/api/admin";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [productCount, setProductCount] = useState<DepartentCount[] | null>(
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
    const [ProfitProduct, setProfitProduct] = useState<
    ProfitProduct[] | null
  >(null);
  const [totalCapital, setTotalCapital] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [hasError, setHasError] = useState(false);

  const [contentTotalHeight, setContentTotalHeight] = useState(0);
  const [productTableHeight, setProductTableHeight] = useState(0);
  const [transactionTableHeight, setTransactionTableHeight] = useState(0);
  const [totalTableHeight, setTotalTableHeight] = useState(0);

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
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

        const transactions = await fetchTransactionCount();
        setTransactionCount(transactions);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

        const reports = await fetchTransactionReports();
        setTransactionReport(reports);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

        const capital = await fetchTotalCapital();
        setTotalCapital(capital);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

        const income = await fetchTotalIncome();
        setTotalIncome(income);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

        const usersData = await fetchTotalTransactionUser();
        setTotalTransactionUser(usersData);

        const profitProduct = await fetchProductProfit();
        setProfitProduct(profitProduct);
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
      } finally {
        setLoading(false);
      }
    };

    loadAllDataSequentially();
  }, []);

  useEffect(() => {
    if (productTableHeight > 0 || transactionTableHeight > 0) {
      const total = productTableHeight + transactionTableHeight;
      setTotalTableHeight(total);
    }
  }, [productTableHeight, transactionTableHeight]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <ImageBackground
            source={require("@/assets/images/banner/banner-bg.png")}
            resizeMode="cover"
            style={styles.background}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: Platform.OS === "web" ? 100 : 150,
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                setContentTotalHeight(contentHeight);
              }}
            >
              <View style={styles.overlayContent}>
                <View style={styles.totalTablesContainer}>
                  <TotalCapitalTable totalCapital={totalCapital || 0} />
                  <TotalIncomeTable totalIncome={totalIncome || 0} />
                </View>

                <View
                  style={[
                    styles.sectionRow,
                    {
                      flexDirection: width < 1000 ? "column" : "row",
                      alignItems: width < 1000 ? "center" : "flex-start",
                      justifyContent: width < 1000 ? "center" : "space-between",
                      gap: width < 1000 ? 20 : 20,
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      gap: 20,
                      backgroundColor: "rgba(255, 255, 255, 0)",
                    }}
                  >
                    <View
                      onLayout={(event) =>
                        setProductTableHeight(event.nativeEvent.layout.height)
                      }
                    >
                      <ProductCountTable productCount={productCount || []} />
                    </View>

                    <View
                      onLayout={(event) => {
                        setTransactionTableHeight(
                          event.nativeEvent.layout.height
                        );
                      }}
                    >
                      <TransactionCountTable
                        transactionCount={transactionCount || []}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.totalTablesContainer,
                      {
                        top: Platform.OS === "web" ? 0 : -485,
                      },
                    ]}
                  >
                    <TotalTransactionUserTable
                      totalTransactionUser={totalTransactionUser || []}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.sectionRow,
                    {
                      flexDirection: width < 1000 ? "column" : "row",
                      alignItems: width < 1000 ? "center" : "flex-start",
                      justifyContent: width < 1000 ? "center" : "space-between",
                      gap: width < 1000 ? 20 : 40,
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingTop: width < 1000 ? 40 : 20,
                      top: Platform.OS === "web" ? 0 : -500,
                    }}
                  >
                    <MTransactionReportChart
                      transactionReport={transactionReport || [] }
                      height={380}
                    />
                  </View>
                  {Platform.OS === "web" && (
                    <View
                      style={{
                        flex: 1,
                        paddingTop: width < 1000 ? 40 : 20,
                      }}
                    >
                      <ProfitProductChart
                        ProfitProduct={ProfitProduct}
                        height={320}
                      />
                    </View>
                  )}
                </View>
                {hasError && (
                  <ThemedText style={styles.errorMessage}>
                    Error loading some data. Please try again.
                  </ThemedText>
                )}
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      )}
    </View>
  );
}
