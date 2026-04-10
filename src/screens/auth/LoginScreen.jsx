import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';

const C = {
  bgLight: '#EBEDF3',
  bgDark: '#1D1E3A',
  blue: '#1A6AFE',
  textLight: '#7A8398',
  textDark: '#D1D5E4',
};

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const disabled = username.trim().length < 3 || password.length < 3;

  return (
    <ImageBackground source={require('../../../assets/construction1.jpg')} style={styles.root} resizeMode="cover">
      <LinearGradient colors={['rgba(16,24,46,0.35)', 'rgba(16,24,46,0.78)']} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <MaterialCommunityIcons name="water-outline" size={18} color="#dbe6ff" />
            <View style={styles.topProfile}>
              <MaterialCommunityIcons name="account" size={16} color="#1D1E3A" />
            </View>
            <MaterialCommunityIcons name="menu" size={18} color="#dbe6ff" />
          </View>

          <Text style={styles.title}>You need to drink more!</Text>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                if (error) setError('');
              }}
              autoCapitalize="none"
              placeholder="Enter username"
              placeholderTextColor="rgba(209,213,228,0.62)"
              style={styles.input}
            />
            <Text style={[styles.inputLabel, { marginTop: 8 }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError('');
              }}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor="rgba(209,213,228,0.62)"
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              disabled={disabled}
              onPress={async () => {
                try {
                  await login({ username, password });
                } catch {
                  setError('Invalid username or password');
                }
              }}
              style={[styles.loginBtn, disabled && styles.loginFabDisabled]}
            >
              <LinearGradient colors={['#1A6AFE', '#4A90E2']} style={styles.loginBtnGrad}>
                <MaterialCommunityIcons name="arrow-right" size={30} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.bottomContent}>
            <View style={styles.dayRow}>
              {days.map((d) => (
                <Text key={d} style={styles.dayText}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={styles.barRow}>
              {[1, 1, 0, 0, 0, 1, 1].map((filled, idx) => (
                <View key={`login-bar-${idx}`} style={[styles.bar, filled ? styles.barFilled : styles.barEmpty]} />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1D1E3A' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  topBar: {
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  topProfile: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F2F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 6,
    textAlign: 'center',
    color: '#D1D5E4',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    marginTop: 18,
    borderRadius: 34,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    shadowColor: '#BEC7D8',
    shadowOpacity: 0.85,
    shadowRadius: 20,
    shadowOffset: { width: 10, height: 10 },
    elevation: 8,
  },
  inputLabel: {
    color: C.textDark,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: C.textDark,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  loginBtn: {
    marginTop: 14,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  loginBtnGrad: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginFabDisabled: { opacity: 0.55 },
  error: {
    color: '#ffd1d1',
    fontWeight: '700',
    marginTop: -2,
  },
  bottomContent: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  dayRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    color: C.textDark,
    fontWeight: '600',
    fontSize: 12,
  },
  barRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bar: {
    width: 12,
    borderRadius: 999,
  },
  barFilled: {
    height: 58,
    backgroundColor: C.blue,
  },
  barEmpty: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.36)',
  },
  bottomNav: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
