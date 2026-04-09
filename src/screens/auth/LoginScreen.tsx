import React, { useMemo, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const disabled = useMemo(() => emailOrPhone.trim().length < 3 || password.length < 3, [emailOrPhone, password]);

  return (
    <ScreenContainer>
      <ImageBackground
        source={require('../../../assets/splash-icon.png')}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <View style={styles.top}>
            <Text style={styles.title}>Construction ERP</Text>
            <Text style={styles.subtitle}>Manager Panel</Text>
          </View>

          <View style={styles.card}>
            <TextInput
              label="Email / Phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              outlineStyle={styles.outline}
              style={styles.input}
              textColor={colors.text}
              theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              outlineStyle={styles.outline}
              style={styles.input}
              textColor={colors.text}
              theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
            />

            <GradientButton
              title="Login"
              onPress={() => login({ emailOrPhone, password })}
              disabled={disabled}
              style={styles.btn}
            />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, padding: 20 },
  bg: { flex: 1 },
  bgImage: { opacity: 0.15 },
  top: { marginTop: 28, marginBottom: 24 },
  title: { fontSize: 34, fontWeight: '800', color: colors.text, letterSpacing: 0.2 },
  subtitle: { marginTop: 4, fontSize: 16, color: colors.mutedText },
  card: {
    marginTop: 'auto',
    backgroundColor: 'rgba(11,18,19,0.78)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  input: { backgroundColor: 'transparent', marginBottom: 12 },
  outline: { borderRadius: 14 },
  btn: { marginTop: 10 },
});

