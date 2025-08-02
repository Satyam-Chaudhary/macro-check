import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { FlashList } from '@shopify/flash-list';

import { AppTheme } from '@/theme/theme';
import { useLogHistory } from '@/hooks/useLogHistory';
import { LogListItem } from '@/components/dashboard/LogListItem';
import { useFoodLogs } from '@/hooks/useFoodLogs';

const getCalendarTheme = (theme: AppTheme): CalendarProps['theme'] => ({
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
});

export default function HistoryScreen() {
  const theme = useTheme<AppTheme>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: logs, isLoading, refetch, isRefetching } = useLogHistory(selectedDate);
  const { deleteLog } = useFoodLogs({ optimistic: true });

  const calendarTheme = useMemo((): CalendarProps['theme'] => getCalendarTheme(theme), [theme]);

  const renderListContent = () => {
    
    if (isLoading) {
      <View style = { styles.logsContainer}>
      return <ActivityIndicator animating={true} style={{ marginTop: 20 }} />;
      </View>
    }
    return (
      <View style = {styles.logsContainer}>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No logs found for {selectedDate}.</Text>
          </View>
        }
        />
        </View>
    );
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      data={[{ key: 'content' }]} 
      keyExtractor={(item) => item.key}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListHeaderComponent={
        <>
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
        </>
      }
      renderItem={renderListContent}
      contentContainerStyle={{ paddingBottom: 100 }} 
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  calendar: { marginHorizontal: 20, borderRadius: 10, elevation: 4 },
  logsContainer: { flex: 1, marginTop: 20, marginHorizontal: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
});