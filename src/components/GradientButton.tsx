import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors as appColors } from '../theme/theme';

export function GradientButton({
  title,
  onPress,
  colors = [appColors.buttonStart, appColors.buttonEnd],
  style,
  disabled,
  left,
}: {
  title: string;
  onPress: () => void;
  colors?: [string, string];
  style?: ViewStyle;
  disabled?: boolean;
  left?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[style, disabled && styles.disabled]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
        <View style={styles.row}>
          {left ? <View style={styles.left}>{left}</View> : null}
          <Text style={styles.text}>{title}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  left: { marginRight: 10 },
  text: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  disabled: { opacity: 0.6 },
});

