import { MD3DarkTheme, MD3LightTheme , configureFonts} from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System', 
};
export const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E84D2E',
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E84D2E',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};