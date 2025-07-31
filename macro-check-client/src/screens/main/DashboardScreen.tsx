import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';


import { Header } from '@/components/dashboard/Header';
import { DateScroller } from '@/components/dashboard/DateScroller';
import { CustomProgressBar } from '@/components/dashboard/CustomProgressBar';
import { CalorieChart } from '@/components/dashboard/CalorieChart';
import { AppTheme } from '@/theme/theme';

export default function DashboardScreen() {
  const theme = useTheme<AppTheme>();

  const dailySummary = {
    goal_calories: 2200, actual_calories: 850,
    goal_protein: 200, actual_protein: 180,
    goal_carbs: 200, actual_carbs: 90,
    goal_fat: 70, actual_fat: 30,
  };

  const remainingCalories = Math.max(0, dailySummary.goal_calories - dailySummary.actual_calories);
  const pieData = [
    { value: dailySummary.actual_calories, color: theme.colors.primary },
    { value: remainingCalories, color: theme.colors.surfaceDisabled },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header />
      <DateScroller />

      <Card style={styles.card}>
        <Card.Content>
          <CalorieChart
            actual={dailySummary.actual_calories}
            goal={dailySummary.goal_calories}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <CustomProgressBar progress={dailySummary.actual_protein / dailySummary.goal_protein} color="#E57373" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_protein} / {dailySummary.goal_protein}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <CustomProgressBar progress={dailySummary.actual_carbs / dailySummary.goal_carbs} color="#81C784" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_carbs} / {dailySummary.goal_carbs}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <CustomProgressBar progress={dailySummary.actual_fat / dailySummary.goal_fat} color="#64B5F6" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_fat} / {dailySummary.goal_fat}g</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    height: 220,
  },
  chartCenterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenterText: { fontWeight: 'bold' },
  chartCenterSubText: { marginTop: 4 },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  macroItem: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 12,
  },
});