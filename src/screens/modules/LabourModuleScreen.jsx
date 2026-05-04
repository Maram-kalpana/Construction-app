import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';

export function LabourModuleScreen({ route, navigation }) {
  const { projectId } = route.params;

  const menuItems = [
    {
      id: 'details',
      title: 'Labour Details',
      desc: 'View all workers — search by name, phone or date.',
      icon: 'account-group',
      iconColor: '#2563eb',
      iconBg: '#dbeafe',
      screen: 'LabourList',
    },
    {
      id: 'report',
      title: 'Daily Labour Report',
      desc: 'Party name, male/female counts, and work done per day.',
      icon: 'file-document-outline',
      iconColor: '#2563eb',
      iconBg: '#dbeafe',
      screen: 'LabourReportForm',
    },
  ];

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Labour Module</Text>
        <Text style={styles.sub}>
          Manage workers, view details, and submit daily reports.
        </Text>

        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate(item.screen, { projectId })}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              <MaterialCommunityIcons name={item.icon} size={26} color={item.iconColor} />
            </View>
            <View style={styles.cardMeta}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#b0bec5" />
          </Pressable>
        ))}

        <View style={styles.note}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.mutedText} />
          <Text style={styles.noteText}>
            Add labour first, then submit daily reports linked to each worker.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  h1: { fontSize: 28, fontWeight: '900', color: '#1a2f4e', marginBottom: 6 },
  sub: { fontSize: 14, color: '#7a8fa8', lineHeight: 20, marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,  // ← replaces gap on card
  },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: '#1a2f4e', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#7a8fa8', lineHeight: 18 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafd',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2eaf4',
    marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 13, color: '#7a8fa8', lineHeight: 18, marginLeft: 10 },  // ← replaces gap on note
});