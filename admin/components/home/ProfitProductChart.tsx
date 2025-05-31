import React from "react";
import {
  ScrollView,
  Dimensions,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryAxis,
  VictoryTooltip,
} from "victory-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProfitProduct } from "@/src/types/home";

const screenWidth = Dimensions.get("window").width;

const maxWidth =
  Platform.OS === "web"
    ? {
        width:
          screenWidth > 1500
            ? 820
            : screenWidth > 1000
            ? 800
            : screenWidth > 700
            ? 500
            : screenWidth > 400
            ? 380
            : 300,
      }
    : { width: 380 };

type ProfitChartProps = {
  ProfitProduct: ProfitProduct[] | null;
  height?: number;
};

const ProfitProductChart: React.FC<ProfitChartProps> = ({
  ProfitProduct,
  height = 350,
}) => {
  const colorScheme = useColorScheme();
  const products = ProfitProduct || [];

  const hasValidData =
    products.length > 0 &&
    products.some((p) => p.TotalCapital > 0 || p.TotalIncome > 0);

  const displayProducts = hasValidData
    ? products
    : [{ ProductName: "Produk A", TotalCapital: 0, TotalIncome: 0 }];

  const productNames = displayProducts.map((p) => p.ProductName);

  // Fungsi helper untuk memformat angka
  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      // Lebih dari atau sama dengan 1 Juta
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`; // Contoh: 1.2M, 5M
    }
    if (num >= 1000) {
      // Lebih dari atau sama dengan 1 Ribu
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toLocaleString("id-ID");
  };

  const capitalData = displayProducts.map((p) => ({
    x: p.ProductName,
    y: p.TotalCapital,
    label: `${formatCurrency(p.TotalCapital)}`,
  }));

  const incomeData = displayProducts.map((p) => ({
    x: p.ProductName,
    y: p.TotalIncome,
    label: `${formatCurrency(p.TotalIncome)}`,
  }));

  const chartColors = {
    capital: "#8a4fff",
    income: "#22c55e",
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

  // --- Perhitungan untuk Label Sumbu Y Manual ---
  const allValues = [
    ...capitalData.map((d) => d.y),
    ...incomeData.map((d) => d.y),
  ];
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 100;
  const domainYMax = maxVal === 0 ? 100 : maxVal * 1.1;
  const minVal = 0;

  const numYTicks = 5;
  const yTickValues = Array.from({ length: numYTicks + 1 }, (_, i) => {
    return minVal + ((domainYMax - minVal) / numYTicks) * i;
  });

  const chartPadding = { top: 20, bottom: 50, left: 10, right: 20 };
  const plotAreaHeight = height - chartPadding.top - chartPadding.bottom;

  const tickLabelFontSize = 10;

  // Lebar chart yang akan digulir
  const chartScrollWidth = Math.max(screenWidth, productNames.length * 100);

   const CustomTooltip = (props: any) => {
    return (
      <VictoryTooltip
        {...props}
        flyoutStyle={{
          // Gaya untuk kotak latar belakang tooltip
          fill: colorScheme === "dark" ? "#333" : "white",
          stroke: colorScheme === "dark" ? "#666" : "#ccc",
          // Jika ingin rotasi pada kotak flyout, bisa ditambahkan di sini
          // angle: -45, // Ini akan merotasi seluruh kotak tooltip
        }}
        style={{
          // Gaya untuk teks label di dalam tooltip
          fontSize: 12,
          fill: chartColors.text, // Mengatur warna teks label
          // Rotasi untuk teks label saja (di dalam kotak tooltip)
          // angle: -45, // Rotasi teks label
        }}
        // Untuk rotasi pada teks label saja, VictoryTooltip tidak memiliki prop 'angle'
        // secara langsung pada style teks. Jika sangat diperlukan, Anda mungkin perlu
        // membuat komponen label kustom yang lebih kompleks atau menggunakan VictoryLabel
        // sebagai labelComponent untuk VictoryTooltip.
        // Namun, rotasi tooltip secara keseluruhan (melalui flyoutStyle) lebih umum.

        // Agar tooltip tampil ketika data dihover/sentuh
        activateData={true}
        // Pastikan tooltip muncul di atas elemen lain
        renderInPortal={true}
      />
    );
  };
  
  return (
    <ThemedView
      style={[
        styles.themedViewContainer,
        maxWidth,
        { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0" },
      ]}
    >
      <ThemedText style={[styles.title]}>Product Financial Reports</ThemedText>

      {/* Manual Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColorBox,
              { backgroundColor: chartColors.capital },
            ]}
          />
          <ThemedText style={[styles.legendText, { color: chartColors.text }]}>
            Modal
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColorBox,
              { backgroundColor: chartColors.income },
            ]}
          />
          <ThemedText style={[styles.legendText, { color: chartColors.text }]}>
            Income
          </ThemedText>
        </View>
      </View>
      {/* End Manual Legend */}

      {/* Kontainer untuk Sumbu Y Manual dan ScrollView (Chart + Sumbu X) */}
      <View style={styles.chartAndYAxisContainer}>
        {/* Label Sumbu Y Utama */}
        <ThemedText
          style={[
            styles.yAxisMainLabel,
            { color: chartColors.text, top: height / 2 - 40, left: -50 },
          ]}
        >
          Nominal (Rp)
        </ThemedText>

        {/* Manual Y-Axis Labels */}
        <View style={[styles.yAxisLabelsContainer, { height: height }]}>
          {yTickValues
            .slice()
            .reverse()
            .map((value, i) => {
              const yPixelPosition =
                domainYMax - minVal === 0
                  ? chartPadding.top + plotAreaHeight
                  : chartPadding.top +
                    (1 - (value - minVal) / (domainYMax - minVal)) *
                      plotAreaHeight;

              return (
                <ThemedText
                  key={i}
                  style={[
                    styles.yAxisTickLabel,
                    {
                      fontSize: tickLabelFontSize,
                      color: chartColors.text,
                      top: yPixelPosition - tickLabelFontSize / 2,
                      position: "absolute",
                      marginLeft: 15,
                    },
                  ]}
                >
                  {formatCurrency(value)}
                </ThemedText>
              );
            })}
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          {hasValidData ? (
            <VictoryChart
              width={chartScrollWidth}
              height={height}
              domain={{ y: [minVal, domainYMax] }}
              domainPadding={{ x: 50 }}
              theme={VictoryTheme.material}
              padding={chartPadding}
            >
              {/* X-axis */}
              <VictoryAxis
                label="Nama Produk"
                tickValues={productNames}
                style={{
                  axisLabel: { padding: 40, fill: chartColors.text },
                  tickLabels: {
                    textAnchor: "middle",
                    fontSize: 10,
                    fill: chartColors.text,
                  },
                }}
              />

              {/* Y-axis */}
              <VictoryAxis
                dependentAxis
                tickValues={yTickValues}
                tickFormat={(y) => `${(y / 1000).toFixed(0)}k`}
                style={{
                  tickLabels: { fill: chartColors.text },
                  axisLabel: {
                    padding: 30,
                    fill: chartColors.text,
                    fontSize: 10,
                  },
                  grid: {
                    stroke: colorScheme === "dark" ? "#444" : "#ccc",
                    strokeDasharray: "5, 5",
                  },
                }}
              />

              {/* Bar chart */}
              <VictoryGroup
                offset={50}
                colorScale={[chartColors.capital, chartColors.income]}
                {...({} as any)}
              >
                <VictoryBar data={capitalData} barWidth={20} />
                <VictoryBar data={incomeData} barWidth={20} />
              </VictoryGroup>
            </VictoryChart>
          ) : (
            <View style={styles.noDataMessageContainer}>
              <ThemedText style={styles.noDataMessageText}>
                No product profit data available.
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  themedViewContainer: {
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColorBox: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  chartAndYAxisContainer: {
    flexDirection: "row",
  },
  yAxisLabelsContainer: {
    width: 60,
    position: "relative",
    bottom: 8,
  },
  yAxisTickLabel: {
    fontSize: 10,
    position: "absolute",
  },
  yAxisMainLabel: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
    width: 100,
    textAlign: "center",
  },
  noDataMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    width: "100%",
  },
  noDataMessageText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default ProfitProductChart;
