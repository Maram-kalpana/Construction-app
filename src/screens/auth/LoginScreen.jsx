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
import { TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          colors={['rgba(6,16,22,0.25)', 'rgba(6,16,22,0.88)', 'rgba(6,16,22,0.95)']}
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
              <TextInput
                label="Username"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  if (error) setError('');
                }}
                mode="outlined"
                autoCapitalize="none"
                outlineStyle={styles.outline}
                style={styles.input}
                textColor={colors.text}
                activeOutlineColor="#7dd3fc"
                outlineColor="rgba(233,242,242,0.18)"
                theme={{ roundness: 14, colors: { background: 'rgba(255,255,255,0.04)' } }}
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError('');
                }}
                mode="outlined"
                secureTextEntry
                outlineStyle={styles.outline}
                style={styles.input}
                textColor={colors.text}
                activeOutlineColor="#7dd3fc"
                outlineColor="rgba(233,242,242,0.18)"
                theme={{ roundness: 14, colors: { background: 'rgba(255,255,255,0.04)' } }}
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
                colors={['#0ea5e9', '#0369a1']}
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
  root: { flex: 1, backgroundColor: '#061016' },
  bg: { flex: 1 },
  bgImage: { transform: [{ scale: 1.08 }], opacity: 0.55 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, justifyContent: 'center' },
  brandBlock: { marginBottom: 18 },
  kicker: { color: 'rgba(233,242,242,0.75)', fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  title: { marginTop: 8, fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: 0.2 },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.82)', maxWidth: 340 },
  card: {
    backgroundColor: 'rgba(8,18,26,0.82)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.22)',
  },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  errorText: { color: '#fecaca', fontWeight: '800', marginBottom: 10 },
  input: { marginBottom: 12 },
  outline: { borderRadius: 14 },
  btn: { marginTop: 6 },
  credHint: { marginTop: 10, color: 'rgba(233,242,242,0.55)', fontSize: 12 },
});
