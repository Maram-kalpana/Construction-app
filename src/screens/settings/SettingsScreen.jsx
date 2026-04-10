import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';

const APP_VERSION = '1.0.0';

export function SettingsScreen() {
  const version = APP_VERSION;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} style={styles.noTop}>
      <View style={styles.inner}>
        <Text style={styles.h1}>Settings</Text>
        <Text style={styles.sub}>App preferences and information.</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="cellphone-information" size={22} color="#7dd3fc" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>App version</Text>
            <Text style={styles.rowSub}>{version}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="theme-light-dark" size={22} color="#7dd3fc" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Appearance</Text>
            <Text style={styles.rowSub}>Premium dark theme with site gradients</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="shield-check" size={22} color="#7dd3fc" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Data</Text>
            <Text style={styles.rowSub}>Stored on-device with AsyncStorage. Add a cloud API when you are ready.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noTop: { paddingTop: 0 },
  inner: { flex: 1, padding: 20 },
  h1: { fontSize: 26, fontWeight: '900', color: colors.text },
  sub: { marginTop: 8, color: colors.mutedText, marginBottom: 20, lineHeight: 18 },
  row: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  rowSub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },
});
