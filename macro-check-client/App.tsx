import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { useSessionStore } from './src/store/useSessionStore';
import { darkTheme as paperDarkTheme, lightTheme as paperLightTheme } from './src/theme/theme';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

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
    // Provide each component with its own, correctly formatted theme
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}