import React, { useEffect, useState } from "react";
import { ImageBackground, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { fetchProductCount, fetchTransactionCount } from "@/src/api/home";
import ProductCountTable from "@/components/home/ProductCountTable";
import TransactionCountTable from "@/components/home/TransactionCountTable";
import { DepartentCount, TransactionCount } from "@/src/types/home";
import styles from "../styles/HomeStyles";

export default function HomeScreen() {
  const [productCount, setProductCount] = useState<DepartentCount[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<
    TransactionCount[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductCount = async () => {
      try {
        const res = await fetchProductCount();
        setProductCount(res);
      } catch (err) {
        console.log("Failed to fetch product count", err);
      } finally {
        setLoading(false);
      }
    };

    const loadTransactionCount = async () => {
      try {
        const res = await fetchTransactionCount();
        setTransactionCount(res);
      } catch (err) {
        console.log("Failed to fetch transaction count", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductCount();
    loadTransactionCount();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/banner/banner-bg.svg")}
        resizeMode="cover"
        style={styles.background}
      >
        <ThemedView style={styles.overlayContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              {/* Product Count Section */}
              {productCount && (
                <ThemedView style={styles.section}>
                  <ProductCountTable productCount={productCount} />
                </ThemedView>
              )}

              {/* Transaction Count Section */}
              {transactionCount && (
                <ThemedView style={styles.section}>
                  <TransactionCountTable transactionCount={transactionCount} />
                </ThemedView>
              )}

              {/* Error message */}
              {(!productCount || !transactionCount) && (
                <ThemedText>Failed to load data</ThemedText>
              )}
            </>
          )}
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
}
