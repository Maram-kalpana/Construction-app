import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { DatePickerField } from '../../components/DatePickerField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';
import { getLabours } from '../../api/labourApi';
import { getTodayAttendance } from '../../api/attendanceApi';
import { createReport } from '../../api/reportApi';

export function LabourReportFormScreen({ route, navigation }) {
  const { projectId } = route.params || {};
  const { vendors, dateKey } = useApp();
  const today = dateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const [labours, setLabours] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const labourRes = await getLabours();
      const attendanceRes = await getTodayAttendance();
      const laboursData = labourRes?.data?.data || [];
      const attendanceData = attendanceRes?.data?.data || [];
      setLabours(laboursData);
      setAttendance(attendanceData);
    } catch (err) {
      console.log('Report fetch error:', err.response?.data || err.message);
    }
  };

  const vendorsWithRows = useMemo(() => {
    const presentLabourIds = (attendance || [])
      .filter((a) => a?.is_present == 1)
      .map((a) => Number(a?.labour_id));

    const presentLabours = (labours || []).filter((l) =>
      presentLabourIds.includes(Number(l.id))
    );

    const map = {};
    presentLabours.forEach((p) => {
      const key = p.vendor_id || 'no_vendor';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });

    return Object.entries(map).map(([vendorId, persons], idx) => ({
      id: vendorId,
      slNo: idx + 1,
      vendorName:
        vendorId === 'no_vendor'
          ? 'No Vendor'
          : vendors.find((v) => v.id == vendorId)?.name || 'Vendor',
      persons,
    }));
  }, [labours, attendance, vendors]);

  const totalPresent = vendorsWithRows.reduce((sum, v) => sum + v.persons.length, 0);

  const handleSaveReport = async () => {
    try {
      for (const v of vendorsWithRows) {
        const mason = v.persons.filter((p) => p.gender === 'male').length;
        const female_unskilled = v.persons.filter((p) => p.gender !== 'male').length;
        const payload = {
          vendor_id: Number(v.id),
          mason,
          male_skilled: 0,
          female_unskilled,
          others: 0,
          work_done: 'Work done',
          date: selectedDate,
        };
        await createReport(payload);
      }
      console.log('Report saved successfully');
      navigation.goBack();
    } catch (err) {
      console.log('Report save error:', err.response?.data || err.message);
    }
  };

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
          {/* TITLE */}
          <Text style={styles.h1}>Daily Labour Report</Text>
          <Text style={styles.sub}>Date-wise entries and attended labour list</Text>

          {/* Search + Date */}
          <View style={styles.controlRow}>
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={18} color={colors.mutedText} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search party"
                placeholderTextColor={colors.mutedText}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.mutedText} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.dateWrap}>
              <DatePickerField
                label="Date"
                value={selectedDate}
                onChange={setSelectedDate}
                style={styles.flex1}
              />
            </View>
          </View>

          {/* Summary badges */}
          {totalPresent > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryBadgeLeft}>
                <MaterialCommunityIcons name="account-check" size={15} color="#137333" />
                <Text style={styles.summaryText}>Total Present: {totalPresent}</Text>
              </View>
              <View style={styles.summaryBadgeRight}>
                <MaterialCommunityIcons name="office-building-outline" size={15} color="#1d4ed8" />
                <Text style={[styles.summaryText, { color: '#1d4ed8' }]}>
                  Parties: {vendorsWithRows.length}
                </Text>
              </View>
            </View>
          )}

          {/* Vendor cards */}
          {vendorsWithRows.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={44} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No attendance marked</Text>
              <Text style={styles.emptyText}>
                No attendance records found for the selected date.
              </Text>
            </View>
          ) : (
            vendorsWithRows.map((v) => {
              const male = v.persons.filter((p) => p.gender === 'male').length;
              const female = v.persons.filter((p) => p.gender !== 'male').length;
              const total = v.persons.length;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={styles.vendorCard}
                  activeOpacity={0.82}
                  onPress={() =>
                    navigation.navigate('LabourList', {
                      projectId,
                      vendorId: v.id,
                      date: selectedDate,
                    })
                  }
                >
                  {/* Card header */}
                  <View style={styles.vendorHeader}>
                    <View style={styles.vendorIndex}>
                      <Text style={styles.vendorIndexText}>{v.slNo}</Text>
                    </View>
                    <Text style={styles.vendorName} numberOfLines={1}>
                      {v.vendorName}
                    </Text>
                    <View style={styles.editChip}>
                      <MaterialCommunityIcons name="pencil-outline" size={14} color="#2563eb" />
                      <Text style={styles.editChipText}>Edit</Text>
                    </View>
                  </View>

                  {/* Stats */}
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

                  {/* Names preview */}
                  {v.persons.length > 0 && (
                    <View style={styles.namesRow}>
                      <MaterialCommunityIcons
                        name="account-multiple-outline"
                        size={13}
                        color={colors.mutedText}
                      />
                      <Text style={styles.namesText} numberOfLines={1}>
                        {(v.persons || [])
                          .map((p) => String(p.full_name || ''))
                          .slice(0, 4)
                          .join(', ')}
                        {v.persons.length > 4 ? ` +${v.persons.length - 4} more` : ''}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}

          <GradientButton
            title="Save Report"
            onPress={handleSaveReport}
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

  // control row: search + date
  controlRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    height: 48,
    marginRight: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text, marginLeft: 6 },
  dateWrap: { flex: 1 },
  flex1: { flex: 1 },

  // summary badges
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  summaryBadgeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginRight: 10,
  },
  summaryBadgeRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryText: { color: '#137333', fontWeight: '700', fontSize: 13, marginLeft: 5 },

  // vendor card
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
    marginBottom: 12,
  },
  vendorIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  vendorIndexText: { color: '#1e3a5f', fontWeight: '900', fontSize: 13 },
  vendorName: { flex: 1, color: '#1a2f4e', fontSize: 18, fontWeight: '900' },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  editChipText: { color: '#2563eb', fontSize: 12, fontWeight: '700', marginLeft: 4 },

  // stats row
  statsRow: { flexDirection: 'row', marginBottom: 10 },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statMale: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
  statFemale: { backgroundColor: '#fdf2f8', borderWidth: 1, borderColor: '#fbcfe8' },
  statTotal: { backgroundColor: '#2563eb', flex: 1.2, marginRight: 0 },
  statNum: { color: '#1e3a5f', fontWeight: '900', fontSize: 20, lineHeight: 24 },
  statLabel: { color: '#6b8fb5', fontSize: 11, fontWeight: '700', marginTop: 2 },

  // names row
  namesRow: { flexDirection: 'row', alignItems: 'center' },
  namesText: { flex: 1, color: colors.mutedText, fontSize: 12, marginLeft: 6 },

  // empty
  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 12, fontWeight: '900', fontSize: 16, color: '#374151' },
  emptyText: { marginTop: 6, color: colors.mutedText, fontSize: 13, textAlign: 'center' },
});