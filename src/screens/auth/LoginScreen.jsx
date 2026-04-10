import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const disabled = useMemo(() => username.trim().length < 3 || password.length < 3, [username, password]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../../assets/construction1.jpg')}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <LinearGradient
          colors={['rgba(233,245,255,0.12)', 'rgba(233,245,255,0.78)', 'rgba(233,245,255,0.94)']}
          style={StyleSheet.absoluteFill}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(insets.top, 12) + 8,
                paddingBottom: Math.max(insets.bottom, 16) + 24,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.brandBlock} pointerEvents="none">
              <Text style={styles.kicker}>SRUTIKA CONSTRUCTIONS</Text>
              <Text style={styles.title}>Daily Progress</Text>
              <Text style={styles.subtitle}>Manager workspace — labour, materials & stock in one place.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign in</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <AppTextField
                label="Username"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  if (error) setError('');
                }}
                autoCapitalize="none"
                placeholder="Enter username"
              />
              <AppTextField
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError('');
                }}
                secureTextEntry
                placeholder="Enter password"
              />
              <GradientButton
                title="Continue"
                onPress={async () => {
                  try {
                    await login({ username, password });
                  } catch {
                    setError('Invalid username or password');
                  }
                }}
                disabled={disabled}
                colors={['#3b90e8', '#61b8ff']}
                style={styles.btn}
              />
              <Text style={styles.credHint}>Demo login: manager / manager123</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e9f5ff' },
  bg: { flex: 1 },
  bgImage: { transform: [{ scale: 1.04 }], opacity: 0.42 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, justifyContent: 'center' },
  brandBlock: { marginBottom: 18 },
  kicker: { color: 'rgba(24,49,79,0.72)', fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  title: { marginTop: 8, fontSize: 34, fontWeight: '900', color: '#17324f', letterSpacing: 0.2 },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 22, color: 'rgba(24,49,79,0.82)', maxWidth: 340 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(125,180,235,0.32)',
  },
  cardTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginBottom: 14 },
  errorText: { color: '#b42318', fontWeight: '800', marginBottom: 10 },
  btn: { marginTop: 6 },
  credHint: { marginTop: 10, color: 'rgba(24,49,79,0.55)', fontSize: 12 },
});
