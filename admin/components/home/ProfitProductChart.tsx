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
    ? { width: screenWidth > 1000 ? 700 : screenWidth > 1500 ? 820 : 900 }
    : { width: 500 };

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
    capital: "#8a4fff",
    income: "#22c55e",
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

  const tickLabelFontSize = 10;
  // --- Akhir Perhitungan untuk Label Sumbu Y Manual ---

  return (
    <ThemedView
      style={[
        styles.themedViewContainer,
        maxWidth,
        { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0" },
      ]}
    >
      <ThemedText
        style={[styles.title]} // Dipisahkan
      >
        Laporan Keuangan Produk
      </ThemedText>

      {/* Manual Legend */}
      <View style={styles.legendContainer}>
        {/* Dipisahkan */}
        <View style={styles.legendItem}>

          {/* Dipisahkan */}
          <View
            style={[
              styles.legendColorBox, // Dipisahkan
              { backgroundColor: chartColors.capital },
            ]}
          />
          <ThemedText style={[styles.legendText, { color: chartColors.text }]}>
  
            {/* Dipisahkan */}
            Modal
          </ThemedText>
        </View>
        <View style={styles.legendItem}>

          {/* Dipisahkan */}
          <View
            style={[
              styles.legendColorBox, // Dipisahkan
              { backgroundColor: chartColors.income },
            ]}
          />
          <ThemedText style={[styles.legendText, { color: chartColors.text }]}>
  
            {/* Dipisahkan */}
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
                  {(value / 1000).toFixed(0)}k
                </ThemedText>
              );
            })}
        </View>

        <ScrollView horizontal>
          <VictoryChart
            width={Math.max(screenWidth, productNames.length * 150)}
            height={height}
            domain={{ y: [minVal, domainYMax] }} // Ini bukan style, ini domain data
            domainPadding={{ x: 50 }} // Ini bukan style, ini padding domain
            theme={VictoryTheme.material} // Ini bukan style, ini tema
            padding={chartPadding} // Ini bukan style, ini padding chart
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
              tickValues={yTickValues} // Ini bukan style, ini tick values
              tickFormat={(y) => `${(y / 1000).toFixed(0)}k`} // Ini bukan style, ini format tick
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
              offset={50} // Ini bukan style, ini offset
              colorScale={[chartColors.capital, chartColors.income]} // Ini bukan style, ini color scale
              {...({} as any)}
            >
              <VictoryBar
                data={capitalData}
                barWidth={20}
                // Jika menggunakan tooltip, pastikan prop label dan labelComponent ada di sini
                /*
                labels={({ datum }) => datum.label}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: colorScheme === "dark" ? "#333" : "white",
                      stroke: colorScheme === "dark" ? "#666" : "#ccc",
                    }}
                    style={{
                      fontSize: 12,
                      fill: chartColors.text,
                    }}
                    activateData={true}
                    renderInPortal={true}
                  />
                }
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onPressIn: () => [{ mutation: (props) => ({ active: true }) }],
                      onPressOut: () => [{ mutation: (props) => ({ active: undefined }) }],
                    },
                  },
                ]}
                */
              />
              <VictoryBar
                data={incomeData}
                barWidth={20}
                // Jika menggunakan tooltip, pastikan prop label dan labelComponent ada di sini
                /*
                labels={({ datum }) => datum.label}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: colorScheme === "dark" ? "#333" : "white",
                      stroke: colorScheme === "dark" ? "#666" : "#ccc",
                    }}
                    style={{
                      fontSize: 12,
                      fill: chartColors.text,
                    }}
                    activateData={true}
                    renderInPortal={true}
                  />
                }
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onPressIn: () => [{ mutation: (props) => ({ active: true }) }],
                      onPressOut: () => [{ mutation: (props) => ({ active: undefined }) }],
                    },
                  },
                ]}
                */
              />
            </VictoryGroup>
          </VictoryChart>
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
});

export default ProfitProductChart;
