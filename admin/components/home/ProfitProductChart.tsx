import React, { useEffect, useRef } from "react"; // Import useEffect dan useRef
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
          screenWidth > 1000
            ? screenWidth / 2.3
            : screenWidth / 1.1
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
    products.some((p) => p.TotalCapital > 0 || p.TotalRevenue > 0);

  const displayProducts = hasValidData
    ? products
    : [{ Name: "Produk A", TotalCapital: 0, TotalRevenue: 0 }];

  const productNames = displayProducts.map((p) => p.Name);

  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toLocaleString("id-ID");
  };

  const capitalData = displayProducts.map((p) => ({
    x: p.Name,
    y: p.TotalCapital,
    label: `${formatCurrency(p.TotalCapital)}`,
  }));

  const incomeData = displayProducts.map((p) => ({
    x: p.Name,
    y: p.TotalRevenue,
    label: `${formatCurrency(p.TotalRevenue)}`,
  }));

  const chartColors = {
    capital: "#8a4fff",
    income: "#22c55e",
    text: colorScheme === "dark" ? "#fff" : "#000",
  };

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

  const minChartWidthPerProduct = screenWidth > 1000 ? 100 : 150;
  const calculatedChartWidth = productNames.length * minChartWidthPerProduct;

  const chartWidth = Math.max(
    screenWidth - chartPadding.left - chartPadding.right - 60,
    calculatedChartWidth
  );

  const isCentered = productNames.length <= 5;

  const scrollViewRef = useRef<ScrollView>(null);
  const containerWidthRef = useRef(0);

  useEffect(() => {
    if (
      isCentered &&
      scrollViewRef.current &&
      containerWidthRef.current > 0 &&
      chartWidth > 0
    ) {
      const visibleScrollViewWidth =
        screenWidth -
        (styles.themedViewContainer.padding * 2 || 0) -
        styles.yAxisLabelsContainer.width;

      if (chartWidth < visibleScrollViewWidth) {
        const scrollXOffset = (chartWidth - visibleScrollViewWidth) / 2;
        scrollViewRef.current.scrollTo({
          x: scrollXOffset,
          animated: true,
          y: 0,
        });
      } else {
        scrollViewRef.current.scrollTo({ x: 0, animated: true, y: 0 });
      }
    }
  }, [isCentered, chartWidth, screenWidth]);

  // --- END: Perubahan untuk Auto-Scroll ke Tengah ---

  return (
    <ThemedView
      style={[
        styles.themedViewContainer,
        maxWidth,
        { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f0f0f0" },
      ]}
    >
      <ThemedText style={[styles.title]}>Product Financial Reports</ThemedText>

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

      <View style={styles.chartAndYAxisContainer}>
        <ThemedText
          style={[
            styles.yAxisMainLabel,
            { color: chartColors.text, top: height / 2 - 40, left: -50 },
          ]}
        >
          Nominal (Rp)
        </ThemedText>

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
          ref={scrollViewRef}
          horizontal
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: isCentered ? "center" : "flex-start",
            alignItems: "flex-start",
          }}
          onLayout={(event) => {
            containerWidthRef.current = event.nativeEvent.layout.width;
            if (
              isCentered &&
              scrollViewRef.current &&
              chartWidth > 0 &&
              containerWidthRef.current > 0
            ) {
              const scrollXOffset =
                (chartWidth - containerWidthRef.current) / 2;
              if (scrollXOffset > 0) {
                scrollViewRef.current.scrollTo({
                  x: scrollXOffset,
                  animated: false,
                  y: 0,
                });
              } else {
                scrollViewRef.current.scrollTo({ x: 0, animated: false, y: 0 });
              }
            }
          }}
        >
          {hasValidData ? (
            <VictoryChart
              width={chartWidth}
              height={height}
              domain={{ y: [minVal, domainYMax] }}
              domainPadding={{ x: 50 }}
              theme={VictoryTheme.material}
              padding={chartPadding}
            >
              <VictoryAxis
                tickValues={productNames}
                style={{
                  axisLabel: { padding: 40, fill: chartColors.text },
                  tickLabels: {
                    textAnchor: "middle",
                    fontSize: 10,
                    fill: chartColors.text,
                    angle: 10,
                  },
                }}
              />

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
            <View
              style={[styles.noDataMessageContainer, { width: chartWidth }]}
            >
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
  },
  noDataMessageText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default ProfitProductChart;
