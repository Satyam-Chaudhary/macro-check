import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { useSessionStore } from './src/store/useSessionStore';
import { darkTheme as paperDarkTheme, lightTheme as paperLightTheme } from './src/theme/theme';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


export default function App() {
  const { theme } = useSessionStore();

  const paperTheme = theme === 'dark' ? paperDarkTheme : paperLightTheme;

  // 2. Create a separate, compatible theme for React Navigation
  const navigationTheme = {
    // Start with the default navigation theme
    ...(theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme),
    // 3. Override its colors with our custom theme colors for consistency
    colors: {
      ...(theme === 'dark' ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      primary: paperTheme.colors.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <QueryClientProvider client={queryClient}>
    <PaperProvider theme={paperTheme}>
      <BottomSheetModalProvider>
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}