import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

// A more vibrant, high-contrast dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E84D2E', // Vibrant Orange
    accent: '#E84D2E',
    background: '#000000', // True black background
    surface: '#1E1E1E', // Slightly lighter surface for cards
    primaryContainer: '#332200', // Dark orange for selected items
  },
};

// A light theme with the orange accent
export const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E84D2E', // Vibrant Orange
    accent: '#E84D2E',
    background: '#F7F7F7',
    surface: '#FFFFFF',
    primaryContainer: '#FFF3E0', // Light orange for selected items
  },
};

