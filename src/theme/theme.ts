import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const colors = {
  brandStart: '#0f3d3e',
  brandEnd: '#1f6f78',
  buttonStart: '#1976d2',
  buttonEnd: '#42a5f5',
  totalStart: '#2e7d32',
  totalEnd: '#66bb6a',
  expenseStart: '#c62828',
  expenseEnd: '#ef5350',
  balanceStart: '#1565c0',
  balanceEnd: '#42a5f5',
  surface: '#0b1213',
  surface2: '#0f1d1f',
  text: '#e9f2f2',
  mutedText: 'rgba(233, 242, 242, 0.75)',
  outline: 'rgba(233, 242, 242, 0.18)',
};

export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.buttonStart,
    secondary: colors.brandEnd,
    background: '#071012',
    surface: '#0b1213',
    surfaceVariant: '#0f1d1f',
    outline: colors.outline,
    onSurface: colors.text,
    onSurfaceVariant: colors.mutedText,
    onPrimary: '#ffffff',
    onBackground: colors.text,
  },
};

