import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
} from "victory-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TransactionReport } from "@/src/types/home";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;

const maxWidth =
  Platform.OS === "web"
    ? { width: screenWidth > 1000 ? 700 : screenWidth > 1500 ? 820 : 900 }
    : { width: 500 };

const formatDateTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };
  return date.toLocaleDateString("id-ID", options);
};

type TransactionChartProps = {
  transactionReport: TransactionReport[] | null;
  height?: number;
};

const TransactionReportChart: React.FC<TransactionChartProps> = ({
  transactionReport,
  height = 350,
}) => {
  const transactions = transactionReport || [];
  const colorScheme = useColorScheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formattedCurrentTime = formatDateTime(currentTime);

  const dateData = transactions.map((t) => {
    const date = new Date(t.Date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  });

  const transactionData = transactions.map((t) => ({
    x: t.Date,
    y: t.TotalAmount,
    label: `Nomina;: Rp ${t.TotalAmount.toLocaleString("id-ID")}`,
  }));

  const chartColors = {
    transaction: "#8a4fff",
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

  // --- Perhitungan untuk Label Sumbu Y Manual ---
  const allValues = [...transactionData.map((d) => d.y)];
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
        {
          backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
        },
      ]}
    >
      <ThemedText style={styles.title}>Transaction Report</ThemedText>

      <ThemedText style={[styles.dateTimeText, { color: chartColors.text }]}>
        {formattedCurrentTime}
      </ThemedText>
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
            width={Math.max(screenWidth, dateData.length * 150)}
            height={height}
            domain={{ y: [minVal, domainYMax] }}
            theme={VictoryTheme.material}
            padding={chartPadding}
          >
            {/* X-axis */}
            <VictoryAxis
              label="Nama Produk"
              tickValues={dateData}
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
            <VictoryArea data={transactionData} />
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
  dateTimeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
});

export default TransactionReportChart;
