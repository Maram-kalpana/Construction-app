import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tasks = [
  {
    id: '1',
    title: 'Projects',
    sub: 'Open assigned project list',
    icon: 'office-building-outline',
    screen: 'ProjectsList',
  },
  {
    id: '2',
    title: 'Vendors',
    sub: 'View supplier records',
    icon: 'truck-delivery-outline',
    screen: 'VendorsList',
  },
  {
    id: '3',
    title: 'Accounts',
    sub: 'Check allocated balances',
    icon: 'bank-outline',
    screen: 'AccountsProjectList',
  },
  {
    id: '4',
    title: 'Daily Report',
    sub: 'View daily site reports',
    icon: 'clipboard-text-outline',
    screen: 'DailyReport',
  },
];

export default function HomeDashboardScreen({ navigation }) {
  const renderCard = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => navigation?.navigate?.(item.screen)}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={32} color="#4A90E2" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSub}>{item.sub}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── HERO HEADER ── */}
      <ImageBackground
        source={require('../../../assets/sruthika_final_logo.png')}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />

        <View style={styles.heroBody}>
          <Text style={styles.heroTitle}>My Dashboard</Text>
          <Text style={styles.heroSub}>Have a Good Day</Text>
        </View>

        <View style={styles.heroWave} />
      </ImageBackground>

      {/* ── 2×2 GRID ── */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f3f8',
  },

  // ── HERO ──
  hero: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,35,75,0.50)',
  },

  heroBody: {
    paddingHorizontal: 22,
    paddingBottom: 52,
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
    backgroundColor: '#f0f3f8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  // ── GRID ──
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 30,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  // ── CARD ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '48%',
    paddingVertical: 26,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,

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

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#eaf3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e2f4d',
    textAlign: 'center',
  },

  cardSub: {
    fontSize: 11,
    color: '#8a99b5',
    textAlign: 'center',
    lineHeight: 15,
  },
});