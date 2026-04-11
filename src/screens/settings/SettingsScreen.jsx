import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, Switch, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';

export function SettingsScreen({ navigation }) {

  React.useLayoutEffect(() => {
    navigation?.setOptions?.({ headerShown: false });
  }, [navigation]);

  // toggles
  const [pushNotifs, setPushNotifs]         = useState(true);
  const [siteAlerts, setSiteAlerts]         = useState(true);
  const [paymentAlerts, setPaymentAlerts]   = useState(true);
  const [biometric, setBiometric]           = useState(false);
  const [autoBackup, setAutoBackup]         = useState(true);
  const [offlineMode, setOfflineMode]       = useState(false);
  const [gpsTracking, setGpsTracking]       = useState(true);
  const [darkMode, setDarkMode]             = useState(false);

  const Section = ({ label }) => (
    <Text style={styles.sectionLabel}>{label}</Text>
  );

  const RowToggle = ({ icon, color, label, sub, value, onToggle }) => (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#ddd', true: '#4CD964' }}
        thumbColor="#fff"
      />
    </View>
  );

  const RowArrow = ({ icon, color, label, sub, onPress, danger }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, danger && { color: '#ef4444' }]}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const RowInfo = ({ icon, color, label, value }) => (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── HERO ── */}
      <LinearGradient
        colors={['#4A90E2', '#2c5f9e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Settings</Text>
        <Text style={styles.heroSub}>App preferences & site configuration</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── SITE MANAGEMENT ── */}
        <Section label="SITE MANAGEMENT" />
        <View style={styles.section}>
          <RowArrow
            icon="office-building-cog-outline"
            color="#4A90E2"
            label="Site Configuration"
            sub="Manage active sites and zones"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="account-hard-hat-outline"
            color="#f59e0b"
            label="Worker Roles & Permissions"
            sub="Define access levels per role"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <RowToggle
            icon="crosshairs-gps"
            color="#10b981"
            label="GPS Worker Tracking"
            sub="Track worker location on site"
            value={gpsTracking}
            onToggle={setGpsTracking}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="clipboard-list-outline"
            color="#8b5cf6"
            label="Daily Report Template"
            sub="Customize your EOD report fields"
            onPress={() => {}}
          />
        </View>

        {/* ── NOTIFICATIONS ── */}
        <Section label="NOTIFICATIONS" />
        <View style={styles.section}>
          <RowToggle
            icon="bell-outline"
            color="#4A90E2"
            label="Push Notifications"
            sub="General app notifications"
            value={pushNotifs}
            onToggle={setPushNotifs}
          />
          <View style={styles.divider} />
          <RowToggle
            icon="alert-outline"
            color="#ef4444"
            label="Site Safety Alerts"
            sub="Incidents, hazards and delays"
            value={siteAlerts}
            onToggle={setSiteAlerts}
          />
          <View style={styles.divider} />
          <RowToggle
            icon="cash-multiple"
            color="#10b981"
            label="Payment & Budget Alerts"
            sub="Vendor payments and overspend"
            value={paymentAlerts}
            onToggle={setPaymentAlerts}
          />
        </View>

        {/* ── DATA & STORAGE ── */}
        <Section label="DATA & STORAGE" />
        <View style={styles.section}>
          <RowToggle
            icon="cloud-upload-outline"
            color="#4A90E2"
            label="Auto Backup"
            sub="Daily backup to cloud storage"
            value={autoBackup}
            onToggle={setAutoBackup}
          />
          <View style={styles.divider} />
          <RowToggle
            icon="wifi-off"
            color="#f59e0b"
            label="Offline Mode"
            sub="Cache data for no-network sites"
            value={offlineMode}
            onToggle={setOfflineMode}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="database-export-outline"
            color="#8b5cf6"
            label="Export Reports"
            sub="Download as PDF or Excel"
            onPress={() => Alert.alert('Export', 'Choose format: PDF or Excel')}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="broom"
            color="#ef4444"
            label="Clear Cache"
            sub="Free up local storage"
            onPress={() => Alert.alert('Clear Cache', 'Cache cleared successfully.')}
          />
        </View>

        {/* ── SECURITY ── */}
        <Section label="SECURITY" />
        <View style={styles.section}>
          <RowToggle
            icon="fingerprint"
            color="#4A90E2"
            label="Biometric Login"
            sub="Fingerprint or Face ID"
            value={biometric}
            onToggle={setBiometric}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="lock-reset"
            color="#f59e0b"
            label="Change Password"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="shield-account-outline"
            color="#10b981"
            label="Two-Factor Authentication"
            sub="Add extra login security"
            onPress={() => {}}
          />
        </View>

        {/* ── APPEARANCE ── */}
        <Section label="APPEARANCE" />
        <View style={styles.section}>
          <RowToggle
            icon="theme-light-dark"
            color="#8b5cf6"
            label="Dark Mode"
            sub="Switch to dark theme"
            value={darkMode}
            onToggle={setDarkMode}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="translate"
            color="#4A90E2"
            label="Language"
            sub="English (Default)"
            onPress={() => {}}
          />
        </View>

        {/* ── ABOUT ── */}
        <Section label="ABOUT" />
        <View style={styles.section}>
          <RowInfo
            icon="cellphone-information"
            color="#4A90E2"
            label="App Version"
            value={`v${APP_VERSION}`}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="file-document-outline"
            color="#8b5cf6"
            label="Terms & Conditions"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="shield-outline"
            color="#10b981"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <RowArrow
            icon="headset"
            color="#f59e0b"
            label="Contact Support"
            sub="Raise a ticket or call helpdesk"
            onPress={() => Alert.alert('Support', 'support@srutikaconstr.com')}
          />
        </View>

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
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 22,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },

  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  scroll: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9baabb',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 4,
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
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

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2f4b',
  },

  rowSub: {
    fontSize: 11,
    color: '#9baabb',
    marginTop: 2,
    lineHeight: 16,
  },

  valueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A90E2',
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f4fa',
    marginLeft: 67,
  },
});