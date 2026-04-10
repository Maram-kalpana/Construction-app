import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';

export function HomeDashboardScreen({ navigation }) {
  const dateItems = ['01\nM', '02\nT', '03\nW', '04\nT', '05\nF', '06\nS'];
  const tasks = [
    {
      id: 't1',
      title: 'Projects',
      sub: 'Open assigned project list',
      time: '10:00 AM',
      icon: 'office-building-outline',
      onPress: () => navigation.navigate('ProjectsList'),
    },
    {
      id: 't2',
      title: 'Vendors',
      sub: 'View supplier records',
      time: '11:00 AM',
      icon: 'truck-delivery-outline',
      onPress: () => navigation.navigate('VendorsList'),
    },
    {
      id: 't3',
      title: 'Accounts',
      sub: 'Check allocated balances',
      time: '01:30 PM',
      icon: 'bank-outline',
      onPress: () => navigation.navigate('AccountsProjectList'),
    },
  ];

  return (
    <ScreenContainer edges={['top', 'left', 'right']} style={styles.noPad}>
      <View style={styles.root}>
        <View style={styles.headerShell}>
          <View style={styles.headerMain}>
            <View style={styles.topRow}>
              <MaterialCommunityIcons name="menu" size={22} color="#3f4a62" />
              <MaterialCommunityIcons name="bell-badge-outline" size={20} color="#4A90E2" />
            </View>

            <View style={styles.titleRow}>
              <View>
                <Text style={styles.h1}>My Task</Text>
                <Text style={styles.sub}>Today</Text>
              </View>
              <View style={styles.profileWrap}>
                <MaterialCommunityIcons name="account" size={18} color="#1d5fa8" />
              </View>
            </View>

            <Text style={styles.dayHint}>Monday, 1 June</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {dateItems.map((d, i) => (
                <View key={d} style={[styles.datePill, i === 0 && styles.datePillActive]}>
                  <Text style={[styles.dateText, i === 0 && styles.dateTextActive]}>{d}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.cutCorner} />
          <Pressable style={styles.plusFab}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.listArea}>
          <View style={styles.verticalTrack} />
          {tasks.map((t) => (
            <Pressable key={t.id} onPress={t.onPress} style={styles.taskCard}>
              <View style={styles.taskIcon}>
                <MaterialCommunityIcons name={t.icon} size={20} color="#4A90E2" />
              </View>
              <View style={styles.taskMeta}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                <Text style={styles.taskSub}>{t.sub}</Text>
              </View>
              <View style={styles.timePill}>
                <Text style={styles.timeText}>{t.time}</Text>
              </View>
            </Pressable>
          ))}

          <View style={styles.bottomNav}>
            <MaterialCommunityIcons name="home" size={18} color="#dfeeff" />
            <Pressable style={styles.dropBtn}>
              <MaterialCommunityIcons name="water" size={20} color="#4A90E2" />
            </Pressable>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#dfeeff" />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noPad: { paddingTop: 0 },
  root: { flex: 1, backgroundColor: '#4A90E2' },
  headerShell: { paddingTop: 18, backgroundColor: '#4A90E2' },
  headerMain: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h1: { fontSize: 36, fontWeight: '900', color: '#1f2e49' },
  sub: { marginTop: 4, color: '#7f8ba3', fontWeight: '700', fontSize: 16 },
  profileWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e3f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHint: { marginTop: 8, color: '#9db2cb', fontSize: 12, textAlign: 'right' },
  dateRow: { marginTop: 10, gap: 8, paddingRight: 8 },
  datePill: {
    width: 44,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe8f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  datePillActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  dateText: { color: '#7a8aa3', fontWeight: '800', textAlign: 'center', fontSize: 12 },
  dateTextActive: { color: '#fff' },
  cutCorner: {
    position: 'absolute',
    right: 16,
    bottom: -38,
    width: 122,
    height: 98,
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 64,
  },
  plusFab: {
    position: 'absolute',
    right: 24,
    bottom: -22,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  listArea: { flex: 1, paddingTop: 32, paddingHorizontal: 16 },
  verticalTrack: {
    position: 'absolute',
    left: 24,
    top: 56,
    bottom: 120,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  taskCard: {
    marginBottom: 14,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1f4f8d',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#e9f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskMeta: { flex: 1 },
  taskTitle: { color: '#1f2f4b', fontSize: 18, fontWeight: '800' },
  taskSub: { marginTop: 4, color: '#7e8ea8', fontSize: 13 },
  timePill: { backgroundColor: '#1f232c', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  timeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bottomNav: {
    marginTop: 'auto',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  dropBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f4f8d',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
