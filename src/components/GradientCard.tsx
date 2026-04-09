import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

export function GradientCard({
  colors,
  children,
  style,
}: {
  colors: [string, string];
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.shadowWrap, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 16,
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      default: {},
    }),
  },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
});

