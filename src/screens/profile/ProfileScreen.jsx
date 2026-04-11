import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, Switch, Platform, Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [activitiesEnabled, setActivitiesEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [touchIDEnabled, setTouchIDEnabled] = useState(true);
  const [photoUri, setPhotoUri] = useState(null);

  // ── hide the navigator header so we don't get double "Profile" ──
  React.useLayoutEffect(() => {
    navigation?.setOptions?.({ headerShown: false });
  }, [navigation]);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const Row = ({ icon, label, sub, toggle, value, onToggle, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons name={icon} size={20} color="#4A90E2" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {toggle
        ? <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#ddd', true: '#4CD964' }}
            thumbColor="#fff"
          />
        : <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
      }
    </TouchableOpacity>
  );

  return (
    // edges={['top']} so SafeAreaView only pads the status bar, no bottom gap
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ── HERO ── */}
        <LinearGradient
          colors={['#4A90E2', '#2c5f9e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* back + title row */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            <Text style={styles.backText}>Profile</Text>
          </TouchableOpacity>

          {/* avatar with camera badge */}
          <View style={styles.avatarArea}>
            <TouchableOpacity style={styles.avatarWrap} onPress={pickPhoto} activeOpacity={0.85}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialCommunityIcons name="account-hard-hat" size={40} color="#4A90E2" />
                </View>
              )}
              {/* camera badge */}
              <View style={styles.cameraBadge}>
                <MaterialCommunityIcons name="camera" size={13} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── NAME ── */}
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{user?.name ?? 'Site Manager'}</Text>
          <Text style={styles.roleText}>{user?.role === 'manager' ? 'Site Manager' : user?.role ?? ''}</Text>
        </View>

        {/* ── PROFILE SECTION ── */}
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.section}>
          <Row icon="account-outline" label="Account details" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon="file-document-outline" label="Documents" onPress={() => {}} />
          <View style={styles.divider} />
          <Row
            icon="map-marker-outline"
            label="Turn your location"
            sub="This will improve lots of things"
            toggle value={locationEnabled} onToggle={setLocationEnabled}
          />
        </View>

        {/* ── BANK DETAIL ── */}
        <Text style={styles.sectionLabel}>BANK DETAIL</Text>
        <View style={styles.section}>
          <Row icon="bank-outline" label="Bank Account" onPress={() => {}} />
        </View>

        {/* ── NOTIFICATIONS ── */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.section}>
          <Row
            icon="chart-bar"
            label="Activities notifications"
            sub="Payment Success, Failed and other activities"
            toggle value={activitiesEnabled} onToggle={setActivitiesEnabled}
          />
          <View style={styles.divider} />
          <Row
            icon="send-outline"
            label="Email notification"
            toggle value={emailEnabled} onToggle={setEmailEnabled}
          />
        </View>

        {/* ── SECURITY ── */}
        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={styles.section}>
          <Row
            icon="fingerprint"
            label="Sign in with touch ID"
            toggle value={touchIDEnabled} onToggle={setTouchIDEnabled}
          />
          <View style={styles.divider} />
          <Row icon="lock-outline" label="Change password" onPress={() => {}} />
        </View>

        {/* ── LOGOUT ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },

  // ── HERO ──
  hero: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 50,        // extra bottom so avatar overlaps nicely
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },

  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  avatarArea: {
    alignItems: 'center',
    marginTop: 16,
  },

  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'visible',      // let badge peek out

    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 14px rgba(0,0,0,0.2)' }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }),
  },

  avatarImg: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // ── NAME ──
  nameBlock: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2f4b',
  },

  roleText: {
    fontSize: 13,
    color: '#8a99b5',
    marginTop: 3,
  },

  // ── SECTIONS ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9baabb',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',

    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2f4b',
  },

  rowSub: {
    fontSize: 11,
    color: '#9baabb',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f4fa',
    marginLeft: 66,
  },

  // ── LOGOUT ──
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ef4444',

    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 12px rgba(239,68,68,0.35)' }
      : {
          shadowColor: '#ef4444',
          shadowOpacity: 0.35,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }),
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});