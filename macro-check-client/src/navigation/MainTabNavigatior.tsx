import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '@/screens/main/DashboardScreen';
import AnalyticsScreen from '@/screens/main/AnalyticsScreen';
import { LogScreen, LogSheetRef } from '@/screens/main/LogScreen';
import { DateProvider } from '@/context/DateContext';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

type MainTabParamList = { Home: undefined; Log: undefined; Analytics: undefined; };
const Tab = createBottomTabNavigator<MainTabParamList>();
const DummyComponent = () => <View />;

export default function MainTabNavigator() {
  const logSheetRef = React.useRef<LogSheetRef>(null);

  return (
    <DateProvider>
      <>
        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} logSheetRef={logSheetRef} />}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Home" component={DashboardScreen} />
          <Tab.Screen name="Log" component={DummyComponent} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        </Tab.Navigator>
        <LogScreen ref={logSheetRef} />
      </>
    </DateProvider>
  );
}