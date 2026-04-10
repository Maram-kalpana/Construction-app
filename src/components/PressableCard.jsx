import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export function PressableCard({ children, onPress, style, gradientColors = ['#2f86de', '#62b6ff'] }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, style, pressed && styles.pressedWrap]}>
      {({ pressed }) =>
        pressed ? (
          <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
            {children}
          </LinearGradient>
        ) : (
          <View style={styles.card}>{children}</View>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 22 },
  pressedWrap: { transform: [{ scale: 0.99 }] },
  card: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(125,180,235,0.28)',
  },
});

