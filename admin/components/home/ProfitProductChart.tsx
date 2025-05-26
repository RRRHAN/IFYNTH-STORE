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
    capital: "#8a4fff", // Ungu
    income: "#22c55e",  // Hijau
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

  return (
    <ThemedView style={{ padding: 10, borderRadius: 20, backgroundColor: colorScheme === 'dark' ? '#1c1c1c' : '#f0f0f0' }}> {/* Tambahkan background */}
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
          width={Math.max(screenWidth, productNames.length * 80)} // Pastikan lebar cukup
          height={height}
          domainPadding={{ x: 50 }} // Padding di sekitar bar
          theme={VictoryTheme.material}
          padding={{ top: 50, bottom: 80, left: 60, right: 20 }} // Sesuaikan padding chart keseluruhan
        >
          {/* Legend */}
          <VictoryLegend
            x={screenWidth / 4} // Posisikan legend di tengah atas
            y={1} // Posisikan legend di bagian atas chart
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fill: chartColors.text, fontSize: 12 },
            }}
            data={[
              { name: "Modal", symbol: { fill: chartColors.capital } }, // Modal = Ungu
              { name: "Income", symbol: { fill: chartColors.income } }, // Income = Hijau
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
            label="Jumlah (Rp)" // Label Y-axis yang lebih umum
            tickFormat={(y) => `${(y / 1000).toFixed(0)}k`} // Format label Y-axis (misal: 100000 jadi 100k)
            style={{
              axisLabel: { padding: 40, fill: chartColors.text }, // Hapus angle -90, VictoryAxis biasanya memposisikan label secara otomatis
              tickLabels: { fontSize: 10, padding: 5, fill: chartColors.text },
            }}
          />

          {/* Bar chart */}
          <VictoryGroup
            offset={20} // Jarak antar bar dalam satu grup
            colorScale={[chartColors.capital, chartColors.income]}{...({} as any)}
          >
            {/* Urutan penting: Capital dulu, lalu Income untuk mencocokkan colorScale */}
            <VictoryBar data={capitalData} />
            <VictoryBar data={incomeData} />
          </VictoryGroup>
        </VictoryChart>
      </ScrollView>
    </ThemedView>
  );
};

export default ProfitProductChart;