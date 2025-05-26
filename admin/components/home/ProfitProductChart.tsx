import React from "react";
import { ScrollView, Dimensions } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryAxis,
  VictoryLegend,
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
  height = 300,
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
    capital: "#8a4fff",
    income: "#22c55e",
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <ThemedView style={{ padding: 10, borderRadius: 20 }}>
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
      <ScrollView horizontal>
        <VictoryChart
          width={Math.max(screenWidth, productNames.length * 80)}
          height={height}
          domainPadding={{ x: 50 }}
          theme={VictoryTheme.material}
        >
          {/* Legend */}
          <VictoryLegend
            x={125}
            y={1}
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fill: chartColors.text, fontSize: 12 },
            }}
            data={[
              { name: "Profit", symbol: { fill: chartColors.income } },
              { name: "Cost", symbol: { fill: chartColors.capital } },
            ]}
          />

          {/* X-axis */}
          <VictoryAxis
            label="Nama Produk"
            style={{
              axisLabel: { padding: 30, fill: chartColors.text },
              tickLabels: {
                angle: -45,
                textAnchor: "end",
                fontSize: 10,
                padding: 5,
                fill: chartColors.text,
              },
            }}
          />

          {/* Y-axis */}
          <VictoryAxis
            dependentAxis
            label="Keuntungan"
            style={{
              axisLabel: { padding: 40, angle: -90, fill: chartColors.text },
              tickLabels: { fontSize: 10, padding: 5, fill: chartColors.text },
            }}
          />

          {/* Bar chart */}
          <VictoryGroup
            offset={20}
            colorScale={[chartColors.capital, chartColors.income]}
            {...({} as any)}
          >
            <VictoryBar data={incomeData} />
            <VictoryBar data={capitalData} />
          </VictoryGroup>
        </VictoryChart>
      </ScrollView>
    </ThemedView>
  );
};

export default ProfitProductChart;
