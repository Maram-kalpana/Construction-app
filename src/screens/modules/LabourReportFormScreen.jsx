import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, View, TouchableOpacity
} from 'react-native';

import { DatePickerField } from '../../components/DatePickerField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourReportFormScreen({ route, navigation }) {
  const { projectId } = route.params || {};
  const {
    getDailyBundle, labourPersonById, vendors, dateKey, attendanceLabourIds
  } = useApp();
  const today = dateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');

  const bundle = getDailyBundle(projectId, selectedDate);
  const attendedIds = attendanceLabourIds(projectId, selectedDate);

  const vendorsWithRows = useMemo(() => {
    const people = attendedIds.map((id) => labourPersonById(id)).filter(Boolean);
    const map = {};
    people.forEach((p) => {
      const key = p.vendorId || 'no_vendor';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return Object.entries(map).map(([vendorId, persons], idx) => ({
      id: vendorId,
      slNo: idx + 1,
      vendorName: vendorId === 'no_vendor' ? 'No Vendor' : (vendors.find((v) => v.id === vendorId)?.name || 'Vendor'),
      persons,
    })).filter((v) => !search.trim() || v.vendorName.toLowerCase().includes(search.toLowerCase()));
  }, [attendedIds, labourPersonById, search, vendors]);

  const totalPresent = vendorsWithRows.reduce((sum, v) => sum + v.persons.length, 0);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── TITLE ── */}
          <Text style={styles.h1}>Daily Labour Report</Text>
          <Text style={styles.sub}>Date-wise entries and attended labour list.</Text>

          {/* ── ROW: Search + Date side by side ── */}
          <View style={styles.controlRow}>
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={18} color={colors.mutedText} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search party..."
                placeholderTextColor={colors.mutedText}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.mutedText} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.dateWrap}>
              <DatePickerField label="Date" value={selectedDate} onChange={setSelectedDate} style={styles.flex1} />
            </View>
          </View>

          {/* ── SUMMARY BADGE ── */}
          {totalPresent > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryBadge}>
                <MaterialCommunityIcons name="account-check" size={15} color="#137333" />
                <Text style={styles.summaryText}>Total Present: {totalPresent}</Text>
              </View>
              <View style={styles.summaryBadge}>
                <MaterialCommunityIcons name="office-building-outline" size={15} color="#1d4ed8" />
                <Text style={[styles.summaryText, { color: '#1d4ed8' }]}>Parties: {vendorsWithRows.length}</Text>
              </View>
            </View>
          )}

          {/* ── VENDOR CARDS ── */}
          {vendorsWithRows.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={44} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No attendance marked</Text>
              <Text style={styles.emptyText}>No attendance records found for the selected date.</Text>
            </View>
          ) : vendorsWithRows.map((v) => {
            const male = v.persons.filter((p) => p.gender === 'male').length;
            const female = v.persons.filter((p) => p.gender !== 'male').length;
            const total = v.persons.length;
            return (
              <TouchableOpacity
                key={v.id}
                style={styles.vendorCard}
                activeOpacity={0.82}
                onPress={() => navigation.navigate('LabourList', { projectId, vendorId: v.id, date: selectedDate })}
              >
                {/* card header */}
                <View style={styles.vendorHeader}>
                  <View style={styles.vendorIndex}>
                    <Text style={styles.vendorIndexText}>{v.slNo}</Text>
                  </View>
                  <Text style={styles.vendorName} numberOfLines={1}>{v.vendorName}</Text>
                  <View style={styles.editChip}>
                    <MaterialCommunityIcons name="pencil-outline" size={14} color="#2563eb" />
                    <Text style={styles.editChipText}>Edit</Text>
                  </View>
                </View>

                {/* stats */}
                <View style={styles.statsRow}>
                  <View style={[styles.statBox, styles.statMale]}>
                    <Text style={styles.statNum}>{male}</Text>
                    <Text style={styles.statLabel}>Mason</Text>
                  </View>
                  <View style={[styles.statBox, styles.statFemale]}>
                    <Text style={[styles.statNum, { color: '#9d174d' }]}>{female}</Text>
                    <Text style={[styles.statLabel, { color: '#be185d' }]}>Unskilled</Text>
                  </View>
                  <View style={[styles.statBox, styles.statTotal]}>
                    <Text style={[styles.statNum, { color: '#fff', fontSize: 22 }]}>{total}</Text>
                    <Text style={[styles.statLabel, { color: '#bfdbfe' }]}>Total</Text>
                  </View>
                </View>

                {/* names preview */}
                {v.persons.length > 0 && (
                  <View style={styles.namesRow}>
                    <MaterialCommunityIcons name="account-multiple-outline" size={13} color={colors.mutedText} />
                    <Text style={styles.namesText} numberOfLines={1}>
                      {v.persons.map((p) => p.name).slice(0, 4).join(', ')}
                      {v.persons.length > 4 ? ` +${v.persons.length - 4} more` : ''}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <GradientButton
            title="Save Report"
            onPress={() => navigation.goBack()}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },

  h1: { color: '#1a2f4e', fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 3, color: colors.mutedText, marginBottom: 14, fontSize: 12 },

  /* ── control row: search + date ── */
  controlRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // ✅ aligns bottoms perfectly
    gap: 10,
    marginBottom: 14,
  },
  
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: 10,
    height: 48, // ✅ fixed height
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text },
  dateWrap: { flex: 1 },
  flex1: { flex: 1 },

  /* ── summary ── */
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  summaryBadge: {
    flex: 1, // ✅ makes equal width like Date/Search
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // ✅ center content
    gap: 5,
    backgroundColor: '#f0fdf4',
    paddingVertical: 10, // keep height consistent
    borderRadius: 12, // match input look
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  summaryText: { color: '#137333', fontWeight: '700', fontSize: 13 },

  /* ── vendor card ── */
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2eaf4',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  vendorIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorIndexText: { color: '#1e3a5f', fontWeight: '900', fontSize: 13 },
  vendorName: { flex: 1, color: '#1a2f4e', fontSize: 18, fontWeight: '900' },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  editChipText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statMale: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
  statFemale: { backgroundColor: '#fdf2f8', borderWidth: 1, borderColor: '#fbcfe8' },
  statTotal: { backgroundColor: '#2563eb', flex: 1.2 },
  statNum: { color: '#1e3a5f', fontWeight: '900', fontSize: 20, lineHeight: 24 },
  statLabel: { color: '#6b8fb5', fontSize: 11, fontWeight: '700', marginTop: 2 },

  namesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  namesText: { flex: 1, color: colors.mutedText, fontSize: 12 },

  /* ── empty ── */
  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 12, fontWeight: '900', fontSize: 16, color: '#374151' },
  emptyText: { marginTop: 6, color: colors.mutedText, fontSize: 13, textAlign: 'center' },
});