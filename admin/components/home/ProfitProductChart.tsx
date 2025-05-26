import React from "react";
import { ScrollView, Dimensions, View, StyleSheet } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryAxis,
  // VictoryLegend, // <-- Hapus VictoryLegend
} from "victory-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProfitProduct } from "@/src/types/home";

const screenWidth = Dimensions.get("window").width;

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

  const productNames = products.map((p) => p.ProductName);

  const capitalData = products.map((p) => ({
    x: p.ProductName,
    y: p.TotalCapital,
    label: `Modal: Rp ${p.TotalCapital.toLocaleString("id-ID")}`,
  }));

  const incomeData = products.map((p) => ({
    x: p.ProductName,
    y: p.TotalIncome,
    label: `Income: Rp ${p.TotalIncome.toLocaleString("id-ID")}`,
  }));

  const chartColors = {
    capital: "#8a4fff", // Ungu
    income: "#22c55e", // Hijau
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

  // --- Perhitungan untuk Label Sumbu Y Manual ---
  const allValues = [
    ...capitalData.map((d) => d.y),
    ...incomeData.map((d) => d.y),
  ];
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 0;
  const domainYMax = maxVal * 1.1;
  const minVal = 0;

  const numYTicks = 5;
  const yTickValues = Array.from({ length: numYTicks + 1 }, (_, i) => {
    return minVal + ((domainYMax - minVal) / numYTicks) * i;
  });

  const chartPadding = { top: 20, bottom: 50, left: 10, right: 20 };
  const plotAreaHeight = height - chartPadding.top - chartPadding.bottom;
  // --- Akhir Perhitungan untuk Label Sumbu Y Manual ---

  return (
    <ThemedView
      style={{
        padding: 10,
        borderRadius: 20,
        backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
        width: 800,
      }}
    >
      <ThemedText
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
          color: chartColors.text,
        }}
      >
        Laporan Keuangan Produk
      </ThemedText>

      {/* Manual Legend */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 7.5,
              backgroundColor: chartColors.capital,
              marginRight: 5,
            }}
          />
          <ThemedText style={{ fontSize: 12, color: chartColors.text }}>
            Modal
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 7.5,
              backgroundColor: chartColors.income,
              marginRight: 5,
            }}
          />
          <ThemedText style={{ fontSize: 12, color: chartColors.text }}>
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
            { color: chartColors.text, top: height / 2 - 40, left: -50},
          ]}
        >
          Nominal (Rp)
        </ThemedText>
        {/* Manual Y-Axis Labels */}
        <View style={[styles.yAxisLabelsContainer, { height: height }]}>
          {yTickValues.reverse().map((value, i) => {
            const yPixelPosition =
              chartPadding.top +
              (1 - (value - minVal) / (domainYMax - minVal)) * plotAreaHeight;
            return (
              <ThemedText
                key={i}
                style={[
                  styles.yAxisTickLabel,
                  {
                    color: chartColors.text,
                    top: yPixelPosition - styles.yAxisTickLabel.fontSize / 2,
                    position: "absolute",
                    marginLeft: 15,
                  },
                ]}
              >
                {(value / 1000).toFixed(0)}k
              </ThemedText>
            );
          })}
        </View>
        <ScrollView horizontal>
          <VictoryChart
            width={Math.max(screenWidth, productNames.length * 150)}
            height={height}
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
                  angle: -40,
                  textAnchor: "middle",
                  fontSize: 10,
                  fill: chartColors.text,
                },
              }}
            />

            {/* Y-axis */}
            <VictoryAxis
              dependentAxis
              label="Jumlah (Rp)"
              tickFormat={(y) => `${(y / 1000).toFixed(0)}k`}
            />

            {/* Bar chart */}
            <VictoryGroup
              offset={50}
              colorScale={[chartColors.capital, chartColors.income]}
              {...({} as any)}
            >
              <VictoryBar data={capitalData} />
              <VictoryBar data={incomeData} />
            </VictoryGroup>
          </VictoryChart>
        </ScrollView>
      </View>
      {/* End Manual Y-Axis Labels */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  chartAndYAxisContainer: {
    flexDirection: "row",
  },
  yAxisLabelsContainer: {
    width: 60,
    position: "relative",
  },
  yAxisTickLabel: {
    fontSize: 10,
  },
  yAxisMainLabel: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
    width: 100,
    textAlign: "center",
  },
});

export default ProfitProductChart;
