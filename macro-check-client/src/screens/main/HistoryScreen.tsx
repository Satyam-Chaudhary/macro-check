import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { FlashList } from '@shopify/flash-list';

import { AppTheme } from '@/theme/theme';
import { useLogHistory } from '@/hooks/useLogHistory';
import { LogListItem } from '@/components/dashboard/LogListItem';
import { useFoodLogs } from '@/hooks/useFoodLogs';

export default function HistoryScreen() {
  const theme = useTheme<AppTheme>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: logs, isLoading, refetch, isRefetching } = useLogHistory(selectedDate);
  // Get the delete state from our hook
  const { deleteLog } = useFoodLogs({ optimistic: true });// to show instant deletions

  const calendarTheme = useMemo((): CalendarProps['theme'] => {
    return {
      backgroundColor: theme.colors.surface,
      calendarBackground: theme.colors.surface,
      textSectionTitleColor: theme.colors.onSurfaceVariant,
      selectedDayBackgroundColor: theme.colors.primary,
      selectedDayTextColor: theme.colors.onPrimary,
      todayTextColor: theme.colors.primary,
      dayTextColor: theme.colors.onSurface,
      textDisabledColor: theme.colors.onSurfaceDisabled,
      dotColor: theme.colors.primary,
      selectedDotColor: theme.colors.onPrimary,
      arrowColor: theme.colors.primary,
      monthTextColor: theme.colors.onSurface,
      indicatorColor: theme.colors.primary,
      textDayFontFamily: theme.fonts.bodyMedium.fontFamily,
      textMonthFontFamily: theme.fonts.titleMedium.fontFamily,
      textDayHeaderFontFamily: theme.fonts.bodyMedium.fontFamily,
    };
  }, [theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.header}>
        History
      </Text>
      
      <Calendar
        key={theme.dark ? 'dark-calendar' : 'light-calendar'}
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: theme.colors.primary } }}
        theme={calendarTheme}
        style={[
          styles.calendar,
          { borderColor: theme.dark ? 'transparent' : theme.colors.outlineVariant, borderWidth: 1 }
        ]}
      />

      <View style={styles.logsContainer}>
        {isLoading ? (
          <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
        ) : (
          <FlashList
            data={logs}
            renderItem={({ item }) => (
              <LogListItem
                log={item}
                onDelete={deleteLog}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={72} 
            onRefresh={refetch}
            refreshing={isRefetching}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>No logs found for {selectedDate}.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  calendar: { marginHorizontal: 20, borderRadius: 10, elevation: 4 },
  logsContainer: { flex: 1, marginTop: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
});