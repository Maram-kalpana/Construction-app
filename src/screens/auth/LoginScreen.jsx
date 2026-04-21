import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const { height, width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('manager123');
  const [secure, setSecure] = useState(true);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── FULL-SCREEN CONSTRUCTION BACKGROUND ── */}
      <ImageBackground
        source={require('../../../assets/construction1.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* dark tint overlay */}
        <View style={styles.overlay} />
      </ImageBackground>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.screen, { paddingTop: insets.top }]}>

              {/* ── TOP BADGE ── */}
              <View style={styles.topBadge}>
                <Text style={styles.topTitle}>LOGIN</Text>
                <Text style={styles.topSub}>TO CONTINUE</Text>
              </View>

              {/* ── GLASS CARD (no expo-blur) ── */}
              <View style={styles.glassCard}>

                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>Sign in</Text>
                  <View style={styles.titleUnderline} />
                </View>

                <Text style={styles.label}>Username</Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons name="account-outline" size={20} color="#4A90E2" />
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#4A90E2" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    secureTextEntry={secure}
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <MaterialCommunityIcons
                      name={secure ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="rgba(255,255,255,0.4)"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && (
                        <MaterialCommunityIcons name="check" size={11} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.remember}>Remember Me</Text>
                  </TouchableOpacity>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={styles.loginBtn}
                  activeOpacity={0.85}
                  onPress={async () => {
                    Keyboard.dismiss();
                    setError('');
                    try {
                      await login({ username, password });
                    } catch {
                      setError('Invalid username or password');
                    }
                  }}
                >
                  <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.dotsRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

              </View>

              <View style={{ height: insets.bottom + 24 }} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,22,40,0.58)',
  },

  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },

  topBadge: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 28,
  },

  topTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  topSub: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 5,
    marginTop: 4,
  },

  // ── glass card — no expo-blur needed ──
  glassCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(12,30,65,0.68)',   // dark navy glass
    padding: 24,
    // subtle inner highlight at top edge
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },

  titleWrapper: {
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },

  titleUnderline: {
    width: 36,
    height: 3,
    backgroundColor: '#e85757',
    marginTop: 6,
    borderRadius: 2,
  },

  label: {
    marginBottom: 5,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.22)',
    marginBottom: 18,
    paddingBottom: 8,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    marginRight: 8,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#4A90E2',
  },

  remember: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },

  forgot: {
    color: '#e85757',
    fontSize: 13,
    fontWeight: '600',
  },

  error: {
    color: '#e85757',
    marginBottom: 8,
    fontSize: 13,
  },

  loginBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  dotActive: {
    backgroundColor: '#4A90E2',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});