import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native';

import { AppProvider } from './src/contexts/AppContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { paperTheme } from './src/theme/theme';


// 🔥 GLOBAL FONT SCALE
const FONT_SCALE = 1.3;

// ✅ Override Text globally
const oldTextRender = Text.render;
Text.render = function (...args) {
  const origin = oldTextRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{ fontSize: 14 * FONT_SCALE }, origin.props.style],
  });
};




export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </AppProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}