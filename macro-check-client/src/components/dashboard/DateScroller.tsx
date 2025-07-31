import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { eachDayOfInterval, startOfWeek, endOfWeek, format, isSameDay } from 'date-fns';

type DateScrollerProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
};

export const DateScroller = ({ selectedDate, onDateSelect }: DateScrollerProps) => {
  const theme = useTheme();
  
  // Dynamically generate the days for the current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <View style={styles.dateScrollerContainer}>
      <Text variant="titleLarge">This Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <TouchableOpacity
              key={day.toString()}
              style={[
                styles.dayContainer,
                { backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surface },
              ]}
              onPress={() => onDateSelect(day)}
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
  dateText: {
    marginTop: 5,
    fontSize: 16,
  },
});