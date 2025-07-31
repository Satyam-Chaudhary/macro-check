import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, useTheme, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { format } from 'date-fns'; 

import { useDailySummary } from '@/hooks/useDailySummary';
import { Header } from '@/components/dashboard/Header';
import { DateScroller } from '@/components/dashboard/DateScroller';
import { CustomProgressBar } from '@/components/dashboard/CustomProgressBar';
import { CalorieChart } from '@/components/dashboard/CalorieChart';
import { useDashboard } from '@/context/DashboardContext';

import { SetGoalSheetRef } from './SetGoalScreen';

export default function DashboardScreen() {
  const theme = useTheme();
  const { selectedDate } = useDashboard();
  const { setGoalSheetRef } = useDashboard();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { data: dailySummary, isLoading, isError, refetch, isRefetching } = useDailySummary(formattedDate);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay loop style={{ width: 150, height: 150 }}
          />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text>Could not fetch summary data.</Text>
          <Button onPress={() => refetch()}>Try Again</Button>
        </View>
      );
    }
    
    if (!dailySummary || dailySummary.goal_calories === 0) {
      return (
        <Card style={styles.card}>
          <Card.Content style={styles.centerContainer}>
            <LottieView 
              source={require('@/assets/animations/set-goal.json')} 
              autoPlay loop={false} style={{ width: 150, height: 150 }}
            />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 10}}>No Goal Set</Text>
            <Text style={{textAlign: 'center', marginTop: 5}}>Set a goal for this day to see your progress!</Text>
            <Button 
              mode="contained" 
              style={{marginTop: 20}} 
              onPress={() => setGoalSheetRef.current?.present()} // Use the ref here
            >
              Set Goal
            </Button>
          </Card.Content>
        </Card>
      );
    }

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
      </>
    );
  };
  
  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      data={[]}
      keyExtractor={() => 'dummy'}
      renderItem={() => null} 
      onRefresh={refetch}
      refreshing={isRefetching}
      ListHeaderComponent={
        <>
          <Header/>
          <DateScroller />
        </>
      }
      ListFooterComponent={renderContent()}
      ListFooterComponentStyle={{ paddingBottom: 80 }} // Extra space to see content above tab bar
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
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