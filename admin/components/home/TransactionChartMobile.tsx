import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TransactionReport } from "@/src/types/home";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;

const maxWidth =
  Platform.OS === "web"
    ? {
        width:
          screenWidth > 1000
            ? screenWidth / 2.3
            : screenWidth / 1.1
      }
    : { width: 380 };

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

const MTransactionReportChart: React.FC<TransactionChartProps> = ({
  transactionReport,
  height = 277,
}) => {
  const colorScheme = useColorScheme();
  const scrollRef = useRef<ScrollView>(null);
  const scrollViewWidth = useRef(0);

  const [tooltipData, setTooltipData] = useState<{
    value: number;
    x: number;
    y: number;
    date: string;
  } | null>(null);

  const hasData =
    Array.isArray(transactionReport) && transactionReport.length > 0;

  const labels = hasData
    ? transactionReport.map((r) => {
        const date = new Date(r.Date);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return maxWidth.width > 400
          ? `${day}-${month}-${year}`
          : `${day}-${month}`;
      })
    : [];

  const data = hasData
    ? transactionReport.map((r) => r.TotalAmount / 1000)
    : [];

  const actualTotalAmounts = hasData
    ? transactionReport.map((r) => r.TotalAmount)
    : [];

  const MAX_VISIBLE_DATA = getMaxVisibleData(screenWidth);
  const LABEL_WIDTH = 70;
  const MIN_WIDTH = getMinWidth(screenWidth);

  const scrollContentWidth = Math.max(labels.length * LABEL_WIDTH, MIN_WIDTH);

  const chartConfig = {
    backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
    backgroundGradientFrom: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
    backgroundGradientTo: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
    decimalPlaces: 0,
    color: (opacity = 1) => (colorScheme === "dark" ? "#ffffff" : "#111827"),
    labelColor: (opacity = 1) =>
      colorScheme === "dark" ? "#ffffff" : "#111827",
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: colorScheme === "dark" ? "#ffffff" : "#111827",
    },
  };

  const LABEL_COUNT = 5;
  const adjustedChartHeight = screenWidth > 1000 ? height - 25 : 250;
  const [productTableHeight, setProductTableHeight] = useState(0);
  const labelVerticalSpacing =
    productTableHeight > 0 ? productTableHeight / 8.5 : 0;

  useEffect(() => {
    if (scrollRef.current) {
      if (!hasData || labels.length <= MAX_VISIBLE_DATA) {
        const centerScroll = (scrollContentWidth - scrollViewWidth.current) / 2;
        scrollRef.current.scrollTo({ x: centerScroll, animated: true });
      } else {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [hasData, labels.length, scrollContentWidth, scrollViewWidth.current]);

  return (
    <ThemedView
      style={[
        styles.container,
        maxWidth,
        { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0" },
      ]}
      onLayout={(event) => {
        setProductTableHeight(event.nativeEvent.layout.height);
        scrollViewWidth.current =
          event.nativeEvent.layout.width - (styles.yAxisContainer.width || 0);
      }}
    >
      <ThemedText style={styles.title}>Transaction Report</ThemedText>
      <ThemedView style={{ flexDirection: "row" }}>
        <ThemedView
          style={[
            styles.yAxisContainer,
            { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          {[...Array(LABEL_COUNT)].map((_, i) => {
            const max = hasData ? Math.max(...data) : 0;
            const yValue =
              data.length > 0
                ? Math.round((max / (LABEL_COUNT - 1)) * (LABEL_COUNT - 1 - i))
                : (LABEL_COUNT - 1 - i) * (100 / (LABEL_COUNT - 1));

            const labelStyle: any = { ...styles.yAxisLabel };
            if (i === 0) {
              labelStyle.paddingTop = 4;
            } else if (i === LABEL_COUNT - 1) {
              labelStyle.paddingBottom = labelVerticalSpacing;
            } else {
            }

            return (
              <ThemedText key={i} style={labelStyle}>
                {yValue}k
              </ThemedText>
            );
          })}
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          ref={scrollRef}
          contentContainerStyle={[
            styles.chartScrollViewContent,
            {
              minWidth: scrollContentWidth,
              backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0",
            },
          ]}
        >
          {hasData ? (
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
              onDataPointClick={({ value, index, x, y }) => {
                setTooltipData({
                  value: actualTotalAmounts[index],
                  x: x,
                  y: y,
                  date: labels[index],
                });
              }}
            />
          ) : (
            <View
              style={[
                styles.noDataMessageContainer,
                { height: adjustedChartHeight },
              ]}
            >
              <ThemedText style={styles.noDataMessageText}>
                No transaction data available for this period.
              </ThemedText>
            </View>
          )}

          {tooltipData && hasData && (
            <ThemedView
              style={[
                styles.tooltipContainer,
                {
                  left: tooltipData.x,
                  top: tooltipData.y,
                },
              ]}
            >
              <ThemedText style={styles.tooltipText}>
                {tooltipData.date}: Rp{" "}
                {tooltipData.value.toLocaleString("id-ID")}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setTooltipData(null)}
                style={styles.closeTooltipButton}
              >
                <ThemedText style={styles.closeTooltipText}>X</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 10,
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
    paddingBottom: screenWidth < 500 ? 0 : 10,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  closeTooltipButton: {
    marginLeft: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  closeTooltipText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  noDataMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataMessageText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  chartScrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MTransactionReportChart;
