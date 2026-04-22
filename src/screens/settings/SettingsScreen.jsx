import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';

export function SettingsScreen({ navigation }) {

  React.useLayoutEffect(() => {
    navigation?.setOptions?.({ headerShown: false });
  }, [navigation]);

  const RowArrow = ({ icon, color, label, sub, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
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

        {/* ── ABOUT ── */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
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