import { AppTheme } from '@/theme/theme';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const DateScroller = () => {
  const theme = useTheme<AppTheme>();
  const [selectedDay, setSelectedDay] = useState('WED');
  const weekDays = [
    { day: 'MON', date: '29' }, { day: 'TUE', date: '30' },
    { day: 'WED', date: '31' }, { day: 'THU', date: '01' },
    { day: 'FRI', date: '02' }, { day: 'SAT', date: '03' },
  ];

  return (
    <View style={styles.dateScrollerContainer}>
      <Text variant="titleLarge">Today</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {weekDays.map((item) => (
          <TouchableOpacity
            key={item.day}
            style={[
              styles.dayContainer,
              { backgroundColor: selectedDay === item.day ? theme.colors.primaryContainer : theme.colors.surface },
            ]}
            onPress={() => setSelectedDay(item.day)}
          >
            <Text style={{ color: selectedDay === item.day ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
              {item.day}
            </Text>
            <Text style={[ styles.dateText, { color: selectedDay === item.day ? theme.colors.primary : theme.colors.onSurface, fontWeight: selectedDay === item.day ? 'bold' : 'normal' }]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
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