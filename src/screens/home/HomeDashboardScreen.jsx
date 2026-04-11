import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeDashboardScreen({ navigation }) {
  const tasks = [
    {
      id: '1',
      title: 'Projects',
      sub: 'Open assigned project list',
      time: '10:00 AM',
      icon: 'office-building-outline',
      onPress: () => navigation?.navigate?.('ProjectsList'),
    },
    {
      id: '2',
      title: 'Vendors',
      sub: 'View supplier records',
      time: '11:00 AM',
      icon: 'truck-delivery-outline',
      onPress: () => navigation?.navigate?.('VendorsList'),
    },
    {
      id: '3',
      title: 'Accounts',
      sub: 'Check allocated balances',
      time: '01:30 PM',
      icon: 'bank-outline',
      onPress: () => navigation?.navigate?.('AccountsProjectList'),
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── HERO HEADER ── */}
      <ImageBackground
        source={require('../../../assets/construction1.jpg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />

        <View style={styles.heroBody}>
          <Text style={styles.heroTitle}>My Tasks</Text>
          <Text style={styles.heroSub}>📍 Monday, 1 June</Text>
        </View>

        <View style={styles.heroWave} />
      </ImageBackground>

      {/* ── SCROLLABLE BODY ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tasks.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={item.onPress}>
            <View style={styles.leftBar} />
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name={item.icon} size={24} color="#4A90E2" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
            <View style={styles.timeBadge}>
              <MaterialCommunityIcons name="clock-outline" size={11} color="#aaa" />
              <Text style={styles.timeText}> {item.time}</Text>
            </View>
          </Pressable>
        ))}
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
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,40,80,0.45)',
  },

  heroBody: {
    paddingHorizontal: 22,
    paddingBottom: 55,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.3,
  },

  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  heroWave: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 40,
    backgroundColor: '#f4f7fb',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  // ── SCROLL ──
  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },

  // ── CARDS ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',

    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 14px rgba(0,0,0,0.08)' }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }),
  },

  leftBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    backgroundColor: '#4A90E2',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2f4b',
  },

  cardSub: {
    fontSize: 12,
    color: '#8a99b5',
    marginTop: 3,
  },

  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  timeText: {
    color: '#7a8aa8',
    fontSize: 11,
    fontWeight: '600',
  },
});