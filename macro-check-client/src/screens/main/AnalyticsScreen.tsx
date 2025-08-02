import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Card, ActivityIndicator, Button } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { AppTheme } from '@/theme/theme';
import { useWeeklySummary } from '@/hooks/useWeeklySummary';
import Markdown from 'react-native-markdown-display';
import { format, parseISO } from 'date-fns';

export default function AnalyticsScreen() {
  const theme = useTheme<AppTheme>();
  const { data: summary, isLoading, isError, refetch, isRefetching } = useWeeklySummary();

  if (isLoading) {
    return <View style={styles.centerContainer}><ActivityIndicator animating={true} /></View>;
  }

  if (isError || !summary) {
    return (
      <View style={styles.centerContainer}>
        <Text>Could not fetch analytics data.</Text>
        <Button onPress={() => refetch()}>Try Again</Button>
      </View>
    );
  }

  const chartData = summary.daily_breakdown.map(day => ({
    value: day.calories,
    label: format(parseISO(day.date), 'EEE'), // Format date string to day name
  }));

  const markdownStyles = StyleSheet.create({
    body: {
      color: theme.colors.onSurface,
      fontSize: 14,
    },
    heading2: {
      color: theme.colors.onSurface,
      borderBottomWidth: 1,
      borderColor: theme.colors.outlineVariant,
      paddingBottom: 5,
      marginTop: 10,
      marginBottom: 10,
    },
  });


  return (
    
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]} 
        />
      }
    >
      <Text variant="headlineMedium" style={styles.header}>
        Weekly Analytics
      </Text>

      <Card style={styles.card}>
        <View style={{marginTop: 15}}>
        <Card.Title titleStyle={{ fontSize: 20, color: theme.colors.primary }} title="AI Summary" />
        </View>
        <Card.Content>
          {/* <Text variant="bodyLarge">{summary.natural_language_summary}</Text> */}
          <Markdown style={markdownStyles}>
            {summary.natural_language_summary}
          </Markdown>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Calorie Intake (Last 7 Days)" />
        <Card.Content>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <LineChart
              data={chartData}
              height={300}
              color={theme.colors.primary}
              thickness={3}
              spacing={50}
              initialSpacing={20}
              curved
              dataPointsColor={theme.colors.secondary}
              yAxisTextStyle={{ color: theme.colors.onSurfaceVariant }}
              xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant }}
              rulesType="dashed"
              rulesColor={theme.colors.surfaceDisabled}

            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    marginBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});