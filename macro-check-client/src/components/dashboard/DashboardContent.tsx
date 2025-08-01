import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme, List } from 'react-native-paper';
import { DailySummary } from '@/schemas/analytics';
import { CalorieChart } from './CalorieChart';
import { CustomProgressBar } from './CustomProgressBar';

import { LogListItem } from './LogListItem'; 
import { useFoodLogs } from '@/hooks/useFoodLogs';

type DashboardContentProps = {
  dailySummary: DailySummary;
};

export const DashboardContent = ({ dailySummary }: DashboardContentProps) => {
  const theme = useTheme();
  const { deleteLog, isDeleting, deletingLogId } = useFoodLogs();

  return (
    <>
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
            <CustomProgressBar progress={dailySummary.actual_protein / (dailySummary.goal_protein || 1)} color="#E57373" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_protein} / {dailySummary.goal_protein}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <CustomProgressBar progress={dailySummary.actual_carbs / (dailySummary.goal_carbs || 1)} color="#81C784" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_carbs} / {dailySummary.goal_carbs}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <CustomProgressBar progress={dailySummary.actual_fat / (dailySummary.goal_fat || 1)} color="#64B5F6" trackColor={theme.colors.surfaceDisabled} />
            <Text style={[styles.macroValue, { color: theme.colors.onSurfaceVariant }]}>{dailySummary.actual_fat} / {dailySummary.goal_fat}g</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>Today's Logs</List.Subheader>
          {dailySummary.logs.length > 0 ? (
            dailySummary.logs.map((log) => (
              <LogListItem
                key={log.id}
                log={log}
                onDelete={deleteLog} 
                isDeleting={isDeleting && deletingLogId === log.id}
              />
            ))
          ) : (
            <Text style={styles.noLogsText}>No food logged yet for today.</Text>
          )}
        </List.Section>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
    card: { marginHorizontal: 20, marginBottom: 15, },
    macroContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    macroItem: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
    macroLabel: { fontSize: 14, marginBottom: 8 },
    macroValue: { fontSize: 12 },
    noLogsText: { textAlign: 'center', padding: 20, fontStyle: 'italic' },
});