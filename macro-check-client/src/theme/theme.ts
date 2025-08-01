import { MD3DarkTheme, MD3LightTheme, configureFonts, MD3Theme } from 'react-native-paper';
export type AppTheme = MD3Theme & {
  colors: {
    secondarySurface: string;
    tertiarySurface: string;
  };
};

const fontConfig = {
  fontFamily: 'System',
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E84D2E',
    background: '#000000',
    surface: '#1E1E1E',
    primaryContainer: '#332200',
    secondarySurface: '#212121', 
    tertiarySurface: '#1d1d1d9a', 
  },
};

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E84D2E',
    background: '#F7F7F7',
    surface: '#FFFFFF',
    primaryContainer: '#FFF3E0',
    secondarySurface: '#FFFFFF', 
    tertiarySurface: '#FFFFFF',
  },
};