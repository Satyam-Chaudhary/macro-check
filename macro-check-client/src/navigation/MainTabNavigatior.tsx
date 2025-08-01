import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "@/screens/main/DashboardScreen";
import AnalyticsScreen from "@/screens/main/AnalyticsScreen";
import { LogScreen } from "@/screens/main/LogScreen";
import { SetGoalScreen } from "@/screens/main/SetGoalScreen";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import HistoryScreen from "@/screens/main/HistoryScreen";
import ProfileScreen from "@/screens/main/ProfileScreen";

type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Log: undefined;
  Analytics: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();
const DummyComponent = () => <View />;

// This component now contains the logic that needs access to the context
const TabNavigatorContent = () => {
  const { logSheetRef, setGoalSheetRef } = useDashboard();

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />} // to replace default tab bar with custom tab bar 
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Log" component={DummyComponent} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <LogScreen ref={logSheetRef} />
      <SetGoalScreen ref={setGoalSheetRef} />
    </>
  );
};

// The main export wraps everything in the provider
export default function MainTabNavigator() {
  return (
    <DashboardProvider>
      <TabNavigatorContent />
    </DashboardProvider>
  );
}
