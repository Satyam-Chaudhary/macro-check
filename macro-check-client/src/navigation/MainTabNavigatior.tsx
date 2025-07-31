import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '@/screens/main/DashboardScreen';
import AnalyticsScreen from '@/screens/main/AnalyticsScreen';
import { LogScreen } from '@/screens/main/LogScreen';
import { SetGoalScreen } from '@/screens/main/SetGoalScreen';
import { DashboardProvider , useDashboard} from '@/context/DashboardContext';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

type MainTabParamList = { Home: undefined; Log: undefined; Analytics: undefined; };
const Tab = createBottomTabNavigator<MainTabParamList>();
const DummyComponent = () => <View />;

// This component now contains the logic that needs access to the context
const TabNavigatorContent = () => {
  const { logSheetRef, setGoalSheetRef } = useDashboard();

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Log" component={DummyComponent} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      </Tab.Navigator>
      <LogScreen ref={logSheetRef} />
      <SetGoalScreen ref={setGoalSheetRef} />
    </>
  );
}

// The main export wraps everything in the provider
export default function MainTabNavigator() {
  return (
    <DashboardProvider>
      <TabNavigatorContent />
    </DashboardProvider>
  );
}