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
import Svg, { Path } from 'react-native-svg';
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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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
            <View style={styles.screen}>

              {/* ── TOP IMAGE ── */}
              <View style={styles.topContainer}>
                <ImageBackground
                  source={require('../../../assets/construction1.jpg')}
                  style={styles.topBg}
                  resizeMode="cover"
                />

                {/* ── WAVE CURVE ── */}
                <View style={styles.curveContainer}>
                  <Svg
                    width={width}
                    height={110}
                    viewBox={`0 0 ${width} 110`}
                    preserveAspectRatio="none"
                  >
                    <Path
                      d={`M0,0 Q${width * 0.35},110 ${width},50 L${width},110 L0,110 Z`}
                      fill="#fff"
                    />
                  </Svg>
                </View>
              </View>

              {/* ── FORM CARD ── */}
              <View style={styles.card}>

                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>Sign in</Text>
                  <View style={styles.titleUnderline} />
                </View>

                <Text style={styles.label}>Username</Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons name="account-outline" size={20} color="#bbb" />
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#bbb" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="#ccc"
                    secureTextEntry={secure}
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <MaterialCommunityIcons
                      name={secure ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#bbb"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                    <Text style={styles.remember}>Remember Me</Text>
                  </TouchableOpacity>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={async () => {
                    Keyboard.dismiss();
                    try {
                      await login({ username, password });
                    } catch {
                      setError('Invalid username or password');
                    }
                  }}
                >
                  <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>

                {/* bottom padding so content clears keyboard */}
                <View style={{ height: insets.bottom + 40 }} />
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  screen: {
    flex: 1,
  },

  topContainer: {
    position: 'relative',
  },

  topBg: {
    height: height * 0.42,  // ⬅ reduced from 0.50 so form has more room
  },

  curveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
  },

  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingTop: 4,
  },

  titleWrapper: {
    marginBottom: 22,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111',
  },

  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#e85757',
    marginTop: 6,
  },

  label: {
    marginTop: 8,
    marginBottom: 4,
    color: '#888',
    fontSize: 13,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
    paddingBottom: 6,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#222',
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
    borderRadius: 2,
  },

  checkboxChecked: {
    backgroundColor: '#4A90E2',
  },

  remember: {
    color: '#555',
    fontSize: 13,
  },

  forgot: {
    color: '#e85757',
    fontSize: 13,
  },

  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 13,
  },

  loginBtn: {
    alignSelf: 'center',
    width: '75%',
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(74,144,226,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});