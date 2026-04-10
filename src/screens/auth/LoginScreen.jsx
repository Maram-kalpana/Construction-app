import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
  const progress = useMemo(() => (Number(username.trim().length > 0) + Number(password.length > 0)) / 2, [username, password]);
  const disabled = username.trim().length < 3 || password.length < 3;

  const curveAnim = useRef(new Animated.Value(0)).current;
  const liquidAnim = useRef(new Animated.Value(0.22)).current;

  useEffect(() => {
    Animated.timing(curveAnim, {
      toValue: progress,
      duration: 360,
      useNativeDriver: false,
    }).start();
    Animated.timing(liquidAnim, {
      toValue: 0.22 + progress * 0.36,
      duration: 380,
      useNativeDriver: false,
    }).start();
  }, [curveAnim, liquidAnim, progress]);

  const curveTop = curveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['48%', '41%'],
  });

  const liquidHeight = liquidAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['22%', '58%'],
  });

  return (
    <View style={styles.root}>
      <View style={styles.lightHalf} />
      <View style={styles.darkHalf} />
      <Animated.View style={[styles.waveWrap, { top: curveTop }]}>
        <Svg width="100%" height={170}>
          <Path
            d="M0,70 C70,42 140,50 205,72 C256,88 308,90 380,54 L380,170 L0,170 Z"
            fill={C.bgDark}
          />
        </Svg>
      </Animated.View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <MaterialCommunityIcons name="water-outline" size={18} color={C.textLight} />
          <View style={styles.topProfile}>
            <MaterialCommunityIcons name="account" size={16} color={C.bgDark} />
          </View>
          <MaterialCommunityIcons name="menu" size={18} color={C.textLight} />
        </View>

        <Text style={styles.title}>You need to drink more!</Text>

        <View style={styles.glassWrap}>
          <Animated.View style={[styles.liquid, { height: liquidHeight }]} />
          <View style={styles.waveBubble} />
          <View style={styles.glassShade} />
          <View style={styles.formArea}>
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
          </View>
          <Pressable
            disabled={disabled}
            onPress={async () => {
              try {
                await login({ username, password });
              } catch {
                setError('Invalid username or password');
              }
            }}
            style={[styles.loginFab, disabled && styles.loginFabDisabled]}
          >
            <MaterialCommunityIcons name="arrow-right" size={30} color="#fff" />
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
              <View key={`${idx}`} style={[styles.bar, filled ? styles.barFilled : styles.barEmpty]} />
            ))}
          </View>

          <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <MaterialCommunityIcons name="home-outline" size={20} color="rgba(209,213,228,0.9)" />
            <Pressable style={styles.centerDrop}>
              <MaterialCommunityIcons name="water" size={22} color="#fff" />
            </Pressable>
            <MaterialCommunityIcons name="clock-outline" size={20} color="rgba(209,213,228,0.9)" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgLight },
  flex: { flex: 1 },
  lightHalf: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
    backgroundColor: C.bgLight,
  },
  darkHalf: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: C.bgDark,
  },
  waveCut: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  waveWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 170,
  },
  topBar: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: 18,
    textAlign: 'center',
    color: C.textLight,
    fontSize: 15,
    fontWeight: '600',
  },
  glassWrap: {
    marginTop: 28,
    marginHorizontal: 34,
    height: 330,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#BEC7D8',
    shadowOpacity: 0.85,
    shadowRadius: 20,
    shadowOffset: { width: 10, height: 10 },
    elevation: 10,
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.blue,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  waveBubble: {
    position: 'absolute',
    left: -14,
    right: -14,
    bottom: 148,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26,106,254,0.9)',
  },
  glassShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  formArea: {
    paddingTop: 24,
    paddingHorizontal: 18,
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: C.textDark,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  loginFab: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  loginFabDisabled: { opacity: 0.55 },
  error: {
    color: '#ffd1d1',
    fontWeight: '700',
    marginTop: -2,
  },
  bottomContent: {
    marginTop: 'auto',
    paddingHorizontal: 30,
    paddingBottom: 6,
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
  centerDrop: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
});
