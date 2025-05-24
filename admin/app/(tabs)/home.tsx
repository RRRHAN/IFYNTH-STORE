import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  fetchProductCount,
  fetchTransactionCount,
  fetchTransactionReports,
  fetchTotalCapital,
  fetchTotalIncome,
} from "@/src/api/home";
import ProductCountTable from "@/components/home/ProductCountTable";
import TransactionCountTable from "@/components/home/TransactionCountTable";
import {
  DepartentCount,
  TransactionCount,
  TransactionReport,
} from "@/src/types/home";
import styles from "../styles/HomeStyles";
import TransactionReportTable from "@/components/home/TransactionReportChart";
import TotalCapitalTable from "@/components/home/TotalCapitalTable";
import TotalIncomeTable from "@/components/home/TotalIncomeTable";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const dummyTransactionReport = Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (50 - i));
    return {
      Date: date.toISOString(),
      TotalAmount: Math.floor(Math.random() * 1000000),
    };
  });

  // state lama tetap
  const [productCount, setProductCount] = useState<DepartentCount[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<
    TransactionCount[] | null
  >(null);
  const [transactionReport, setTransactionReport] = useState<
    TransactionReport[] | null
  >(null);
  const [totalCapital, setTotalCapital] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  // Tambah state baru untuk tinggi tabel
  const [productTableHeight, setProductTableHeight] = useState(0);
  const [transactionTableHeight, setTransactionTableHeight] = useState(0);
  const [totalTableHeight, setTotalTableHeight] = useState(0);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [products, transactions, reports, totalCapital, totalIncome] =
          await Promise.all([
            fetchProductCount(),
            fetchTransactionCount(),
            fetchTransactionReports(),
            fetchTotalCapital(),
            fetchTotalIncome(),
          ]);
        setProductCount(products);
        setTransactionCount(transactions);
        setTransactionReport(reports);
        setTotalCapital(totalCapital);
        setTotalIncome(totalIncome);
      } catch (err) {
        console.log("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    const total = productTableHeight + transactionTableHeight;
    setTotalTableHeight(total);
    loadAll();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/banner/banner-bg.svg")}
        resizeMode="cover"
        style={styles.background}
      >
        <ScrollView>
          <View style={styles.overlayContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <>
                {totalCapital && totalIncome && (
                  <View style={styles.totalTablesContainer}>
                    <TotalCapitalTable totalCapital={totalCapital} />
                    <TotalIncomeTable totalIncome={totalIncome} />
                  </View>
                )}

                {productCount && transactionCount && (
                  <View
                    style={[
                      styles.sectionRow,
                      {
                        flexDirection: width < 1000 ? "column" : "row",
                        alignItems: width < 1000 ? "center" : "flex-start",
                        justifyContent:
                          width < 1000 ? "center" : "space-between",
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
                        <ProductCountTable productCount={productCount} />
                      </View>

                      <View
                        onLayout={(event) => {
                          setTransactionTableHeight(
                            event.nativeEvent.layout.height
                          );
                        }}
                      >
                        <TransactionCountTable
                          transactionCount={transactionCount}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        marginTop: width < 1000 ? 20 : 0,
                      }}
                    >
                      <TransactionReportTable
                        transactionReport={transactionReport}
                        height={totalTableHeight || 277}
                      />
                    </View>
                  </View>
                )}
                {(!productCount || !transactionCount || !totalCapital || !totalIncome) && (
                  <ThemedText>Failed to load data</ThemedText>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
