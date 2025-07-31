import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme, IconButton, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

import { LogSheetRef } from '@/screens/main/LogScreen';
import { useDailySummary } from '@/hooks/useDailySummary';
import { useDashboard } from '@/context/DashboardContext';



export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useTheme();
  const { selectedDate, logSheetRef } = useDashboard();
  const { data: dailySummary } = useDailySummary(format(selectedDate, 'yyyy-MM-dd'));

  const handleAddLogPress = () => {
    if (!dailySummary || dailySummary.goal_calories === 0) {
      Alert.alert("Set a Goal First", "Please set a goal for this day before logging food.");
    } else {
      logSheetRef.current?.present();
    }
  };

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.centerButtonContainer}>
        <IconButton
          icon="plus" size={50} mode="contained" containerColor={theme.colors.primary}
          iconColor={theme.colors.onPrimary} style={styles.centerButton}
          onPress={handleAddLogPress}
        />
      </View>
      <View style={[styles.tabBarContainer, { backgroundColor: theme.colors.surface }]}>
        {state.routes.map((route, index) => {
          if (route.name === "Log") return <View key={index} style={styles.tabItem} />;
          
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = route.name === "Home" ? "home-outline" : "chart-line";
          const label = options.tabBarLabel?.toString() ?? route.name;

          return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate(route.name)} style={styles.tabItem}>
              <Icon name={iconName} size={24} color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant} />
              <Text style={{ color: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant, fontSize: 12 }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 95, alignItems: 'center' },
    tabBarContainer: { flexDirection: 'row', height: 70, width: '100%', position: 'absolute', bottom: 0, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerButtonContainer: { position: 'absolute', top: 0, zIndex: 1 },
    centerButton: { width: 60, height: 60, borderRadius: 30, elevation: 10 },
});