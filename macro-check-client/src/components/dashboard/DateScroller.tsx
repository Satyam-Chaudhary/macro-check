import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { eachDayOfInterval, startOfWeek, format, isSameDay } from 'date-fns';
import { useDashboard } from '@/context/DashboardContext';
export const DateScroller = () => {
  const theme = useTheme();
  const { selectedDate, setSelectedDate } = useDashboard();
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const daysToShow = eachDayOfInterval({ start: weekStart, end: today });

  return (
    <View style={styles.dateScrollerContainer}>
      <Text variant="titleLarge">This Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {daysToShow.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <TouchableOpacity
              key={day.toString()}
              style={[
                styles.dayContainer,
                { backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surface },
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Text style={{ color: isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                {format(day, 'EEE')}
              </Text>
              <Text style={[ styles.dateText, { color: isSelected ? theme.colors.primary : theme.colors.onSurface, fontWeight: isSelected ? 'bold' : 'normal' }]}>
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
            
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dateScrollerContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    },
    dayContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    },
    dateScrrollSecondContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    },
    dateText: {
    marginTop: 5,
    fontSize: 16,
    },
});