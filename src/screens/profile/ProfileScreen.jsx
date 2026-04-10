import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} style={styles.noTop}>
      <View style={styles.inner}>
        <LinearGradient colors={['#0ea5e9', '#0369a1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-hard-hat" size={40} color="#0c4a6e" />
          </View>
          <Text style={styles.name}>{user?.name ?? 'Manager'}</Text>
          <Text style={styles.role}>{user?.role === 'manager' ? 'Site manager' : user?.role ?? 'User'}</Text>
          <Text style={styles.contact}>{user?.emailOrPhone ?? ''}</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Signed in</Text>
          <Text style={styles.value}>Construction ERP mobile</Text>
          <Text style={styles.hint}>Daily reports sync locally on this device until you connect a backend.</Text>
        </View>

        <View style={styles.spacer} />
        <GradientButton title="Sign out" onPress={() => logout()} colors={['#7f1d1d', '#ef4444']} style={styles.btn} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noTop: { paddingTop: 0 },
  inner: { flex: 1, padding: 20 },
  hero: {
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { color: '#fff', fontSize: 22, fontWeight: '900' },
  role: { marginTop: 4, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },
  contact: { marginTop: 8, color: 'rgba(255,255,255,0.85)' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.72)',
    padding: 16,
    marginBottom: 16,
  },
  label: { color: colors.mutedText, fontWeight: '800', fontSize: 12 },
  value: { marginTop: 6, color: colors.text, fontWeight: '900', fontSize: 16 },
  hint: { marginTop: 10, color: colors.mutedText, lineHeight: 18 },
  spacer: { flex: 1, minHeight: 24 },
  btn: {},
});
