import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TransactionReport } from "@/src/types/home";
import { useColorScheme } from "nativewind";

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

const getMinWidth = (width: number) => {
  if (width > 1500) {
    return 880;
  } else if (width > 768) {
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
  const { colorScheme } = useColorScheme();
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

  const labels = useMemo(() => {
    if (!hasData) return [];
    return transactionReport.map((r) => {
      const date = new Date(r.Date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return screenWidth > 400
        ? `${day}-${month}-${year}`
        : `${day}-${month}`;
    });
  }, [hasData, transactionReport, screenWidth]);

  const data = useMemo(() => {
    if (!hasData) return [];
    return transactionReport.map((r) => r.TotalAmount / 1000);
  }, [hasData, transactionReport]);

  const actualTotalAmounts = useMemo(() => {
    if (!hasData) return [];
    return transactionReport.map((r) => r.TotalAmount);
  }, [hasData, transactionReport]);

  const MAX_VISIBLE_DATA = getMaxVisibleData(screenWidth);
  const LABEL_WIDTH = 70;
  const MIN_CHART_WIDTH = getMinWidth(screenWidth);
  const scrollContentWidth = Math.max(labels.length * LABEL_WIDTH, MIN_CHART_WIDTH);

  const getChartBgColorClass = () => colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-100";
  const getChartLineColor = (opacity = 1) => colorScheme === "dark" ? `rgba(255, 255, 255, ${opacity})` : `rgba(17, 24, 39, ${opacity})`;
  const getChartLabelColor = (opacity = 1) => colorScheme === "dark" ? `rgba(255, 255, 255, ${opacity})` : `rgba(17, 24, 39, ${opacity})`;
  const getYAxisLabelColor = () => colorScheme === "dark" ? "text-gray-300" : "text-gray-600";
  const getTitleColorClass = () => colorScheme === "dark" ? "text-white" : "text-gray-900";
  const chartConfig = {
    backgroundColor: colorScheme === "dark" ? "#262626" : "#f0f0f0",
    backgroundGradientFrom: colorScheme === "dark" ? "#262626" : "#f0f0f0",
    backgroundGradientTo: colorScheme === "dark" ? "#262626" : "#f0f0f0",
    decimalPlaces: 0,
    color: getChartLineColor,
    labelColor: getChartLabelColor,
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
  const [yAxisContainerHeight, setYAxisContainerHeight] = useState(0);
  const labelVerticalSpacing = yAxisContainerHeight > 0 ? yAxisContainerHeight / (LABEL_COUNT - 1) : 0;
  const yAxisPaddingBottom = screenWidth < 500 ? 0 : 10;


  useEffect(() => {
    if (scrollRef.current) {
      if (!hasData || labels.length <= MAX_VISIBLE_DATA) {
        const centerScroll = (scrollContentWidth - scrollViewWidth.current) / 2;
        scrollRef.current.scrollTo({ x: centerScroll, animated: true });
      } else {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [hasData, labels.length, scrollContentWidth, scrollViewWidth.current, MAX_VISIBLE_DATA]);


  return (
    <Box
      className={`rounded-2xl p-4 ${getChartBgColorClass()}`}
      style={{
        width: screenWidth > 1000 ? screenWidth / 2.3 : screenWidth / 1.1,
      }}
      onLayout={(event) => {
        scrollViewWidth.current = event.nativeEvent.layout.width - 42;
        setYAxisContainerHeight(event.nativeEvent.layout.height - 40);
      }}
    >
      <Heading className={`text-xl font-bold text-center mb-4 mt-2 ${getTitleColorClass()}`}>
        Transaction Report
      </Heading>

      <Box className="flex-row">
        {/* Y-Axis Labels */}
        <Box
          className={`w-10 justify-between mr-1 px-1 ${getChartBgColorClass()}`}
          onLayout={(event) => setYAxisContainerHeight(event.nativeEvent.layout.height)}
        >
          {[...Array(LABEL_COUNT)].map((_, i) => {
            const max = hasData ? Math.max(...data) : 0;
            const yValue =
              data.length > 0
                ? Math.round((max / (LABEL_COUNT - 1)) * (LABEL_COUNT - 1 - i))
                : (LABEL_COUNT - 1 - i) * (100 / (LABEL_COUNT - 1));
            let labelPaddingTop = 0;
            let labelPaddingBottom = 0;
            if (i === 0) {
              labelPaddingTop = 4;
            } else if (i === LABEL_COUNT - 1) {
              labelPaddingBottom = 12;
            }

            return (
              <Text
                key={i}
                className={`text-xs text-right ${getYAxisLabelColor()}`}
                style={{
                  paddingTop: labelPaddingTop,
                  paddingBottom: labelPaddingBottom,
                  height: yAxisContainerHeight / LABEL_COUNT,
                  justifyContent: 'center',
                }}
              >
                {yValue}k
              </Text>
            );
          })}
        </Box>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          ref={scrollRef}
          contentContainerStyle={{
            minWidth: scrollContentWidth,
            backgroundColor: chartConfig.backgroundGradientFrom,
            paddingRight: 10,
            paddingBottom: 10,
          }}
          className="flex-1 rounded-r-2xl"
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
              style={{
                borderRadius: 16,
              }}
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
            <Box
              className="flex-1 justify-center items-center"
              style={{ height: adjustedChartHeight, width: scrollContentWidth }}
            >
              <Text className={`text-base text-center ${getYAxisLabelColor()}`}>
                No transaction data available for this period.
              </Text>
            </Box>
          )}

          {tooltipData && hasData && (
            <Box
              className="absolute bg-black/80 rounded-lg py-1 px-2 flex-row items-center gap-1 z-50"
              style={{
                left: tooltipData.x,
                top: tooltipData.y,
              }}
            >
              <Text className="text-white text-xs font-bold">
                {tooltipData.date}: Rp{tooltipData.value.toLocaleString("id-ID")}
              </Text>
              <Button
                onPress={() => setTooltipData(null)}
                className="ml-2 p-1 rounded-full bg-white/20"
              >
                <ButtonText className="text-white text-xs font-bold">X</ButtonText>
              </Button>
            </Box>
          )}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default MTransactionReportChart;