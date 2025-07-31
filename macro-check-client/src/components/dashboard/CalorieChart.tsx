import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PieChart } from "react-native-gifted-charts";
import { AppTheme } from "@/theme/theme";

type CalorieChartProps = {
  actual: number;
  goal: number;
};

export const CalorieChart = ({ actual, goal }: CalorieChartProps) => {
  const theme = useTheme<AppTheme>();

  const remaining = Math.max(0, goal - actual);
  const pieData = [
    { value: actual, color: theme.colors.primary },
    { value: remaining, color: theme.colors.surfaceDisabled },
  ];

  return (
    <View style={[styles.chartContainer]}>
      <PieChart
        data={pieData}
        donut
        radius={90}
        innerRadius={75}
        innerCircleColor={theme.colors.secondarySurface}
        centerLabelComponent={() => (
          <View style={[styles.chartCenterContainer]}>
            <Text
              variant="headlineLarge"
              style={[
                styles.chartCenterText,
                { color:  theme.colors.onSurface},
              ]}
            >
              {actual}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.chartCenterSubText,
                { color: theme.colors.primary  },
              ]}
            >
              / {goal} kcal
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    paddingVertical: 20,
    height: 220,
  },
  chartCenterContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartCenterText: {
    fontWeight: "bold",
  },
  chartCenterSubText: {
    marginTop: 4,
  },
});
