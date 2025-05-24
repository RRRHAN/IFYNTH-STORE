import React, { useRef } from "react";
import { Dimensions, StyleSheet, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TransactionReport } from "@/src/types/home";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;

const getMaxVisibleData = (width: number) => {
  if (width < 401) return 4;
  if (width < 500) return 5;
  if (width < 600) return 6;
  if (width < 700) return 7;
  if (width < 800) return 9;
  if (width < 900) return 10;
  if (width < 1000) return 12;
  if (width < 1350) return 8;
  if (width < 1550) return 10;
  return 12;
};

const getMinWidth = (screenWidth: number) => {
  if (screenWidth > 1500) {
    return 880;
  } else if (screenWidth > 768) {
    return 600;
  } else {
    return 350;
  }
};

type TransactionChartProps = {
  transactionReport: TransactionReport[] | null;
  height?: number;
};

const TransactionReportChart: React.FC<TransactionChartProps> = ({
  transactionReport,
  height = 277,
}) => {
  const colorScheme = useColorScheme();
  const scrollRef = useRef<ScrollView>(null);

  const labels = (transactionReport ?? []).map((r) => {
    const date = new Date(r.Date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  });

  const data = (transactionReport ?? []).map((r) => r.TotalAmount / 1000);

  const MAX_VISIBLE_DATA = getMaxVisibleData(screenWidth);
  const LABEL_WIDTH = 70;
  const MIN_WIDTH = getMinWidth(screenWidth);

  const visibleCount = Math.min(labels.length, MAX_VISIBLE_DATA);
  const chartWidth = visibleCount * LABEL_WIDTH;
  const scrollContentWidth = Math.max(labels.length * LABEL_WIDTH, MIN_WIDTH);
  const chartDisplayWidth = Math.max(chartWidth, MIN_WIDTH);

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 0,
    color: (opacity = 1) => (colorScheme === "dark" ? "#ffffff" : "#111827"),
    labelColor: (opacity = 1) =>
      colorScheme === "dark" ? "#ffffff" : "#111827",
    style: { borderRadius: 16 },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: colorScheme === "dark" ? "#ffffff" : "#111827",
    },
  };

  const LABEL_COUNT = 5;
  const adjustedChartHeight = screenWidth > 1000 ? height - 25 : 250;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Transaction Report</ThemedText>
      <ThemedView style={{ flexDirection: "row" }}>
        {/* Manual Y-axis */}
        <ThemedView style={[styles.yAxisContainer]}>
          {[...Array(LABEL_COUNT)].map((_, i) => {
            const max = Math.max(...data);
            const yValue = Math.round(
              (max / (LABEL_COUNT - 1)) * (LABEL_COUNT - 1 - i)
            );
            return (
              <ThemedText
                key={i}
                style={[
                  styles.yAxisLabel,
                  i === LABEL_COUNT - 1 && styles.bottomYAxisLabel,
                ]}
              >
                {yValue}k
              </ThemedText>
            );
          })}
        </ThemedView>

        {/* Chart with horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ width: scrollContentWidth }}
          style={{ width: chartDisplayWidth }}
          ref={scrollRef}
          onContentSizeChange={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={scrollContentWidth}
            height={adjustedChartHeight}
            yAxisSuffix="k"
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero
            withHorizontalLabels={false}
          />
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
  },
  chart: {
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  yAxisContainer: {
    width: 40,
    justifyContent: "space-between",
    marginRight: 2,
    paddingTop: 3,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  bottomYAxisLabel: {
    paddingBottom: 35,
  },
});

export default TransactionReportChart;
