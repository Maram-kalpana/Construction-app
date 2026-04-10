import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  brandStart: '#e9f5ff',
  brandEnd: '#cfe7ff',
  accentStart: '#5ab0ff',
  accentEnd: '#1d78d8',
  buttonStart: '#2f86de',
  buttonEnd: '#62b6ff',
  totalStart: '#2e7d32',
  totalEnd: '#66bb6a',
  expenseStart: '#c62828',
  expenseEnd: '#ef5350',
  balanceStart: '#1565c0',
  balanceEnd: '#42a5f5',
  surface: '#ffffff',
  surface2: '#f2f8ff',
  text: '#18314f',
  mutedText: 'rgba(24, 49, 79, 0.7)',
  outline: 'rgba(77, 135, 196, 0.18)',
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.buttonStart,
    secondary: colors.brandEnd,
    background: '#e9f5ff',
    surface: '#ffffff',
    surfaceVariant: '#f2f8ff',
    outline: colors.outline,
    onSurface: colors.text,
    onSurfaceVariant: colors.mutedText,
    onPrimary: '#ffffff',
    onBackground: colors.text,
  },
};
