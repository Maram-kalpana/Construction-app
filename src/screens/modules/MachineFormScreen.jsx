import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

function parseTimeToMinutes(t) {
  const s = String(t || '').trim();
  const m = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3]?.toLowerCase();
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
  return h * 60 + min;
}

function diffHours(start, end) {
  const a = parseTimeToMinutes(start);
  const b = parseTimeToMinutes(end);
  if (a == null || b == null || b < a) return '';
  const hrs = (b - a) / 60;
  return hrs.toFixed(1);
}

export function MachineFormScreen({ route, navigation }) {
  const { projectId, entryId } = route.params;
  const { getDailyBundle, addMachineEntry, deleteMachineEntry, machineNameOptions, vendors, dateKey } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const editing = useMemo(() => bundle.machines.find((e) => e.id === entryId) ?? null, [bundle.machines, entryId]);

  const [partyName, setPartyName] = useState('');
  const [vendorId, setVendorId] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHrs, setTotalHrs] = useState('');
  const [workDone, setWorkDone] = useState('');

  useEffect(() => {
    if (!editing) return;
    setPartyName(editing.partyName ?? '');
    setVendorId(editing.vendorId ?? null);
    setStartTime(editing.startTime ?? '');
    setEndTime(editing.endTime ?? '');
    setTotalHrs(String(editing.totalHrs ?? ''));
    setWorkDone(editing.workDone ?? '');
  }, [editing]);

  // Auto-calculate whenever start or end changes
  useEffect(() => {
    const auto = diffHours(startTime, endTime);
    if (auto) setTotalHrs(auto);
  }, [startTime, endTime]);

  const machineOptions = useMemo(
    () => machineNameOptions(projectId)
      .filter((name) => name.toLowerCase().includes(partyName.toLowerCase()))
      .slice(0, 6),
    [machineNameOptions, partyName, projectId],
  );

  const onSave = async () => {
    if (partyName.trim().length < 2) {
      Alert.alert('Missing', 'Enter party / machine name.');
      return;
    }
    await addMachineEntry(
      projectId,
      { id: editing?.id, partyName, vendorId, startTime, endTime, totalHrs, workDone },
      today,
    );
    navigation.goBack();
  };

  const onDelete = () => {
    if (!editing) return;
    Alert.alert('Delete', 'Remove this machinery row?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteMachineEntry(projectId, editing.id, today);
          navigation.goBack();
        },
      },
    ]);
  };

  const hoursValid = !!diffHours(startTime, endTime);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Equipment ── */}
          <Text style={styles.sectionLabel}>Equipment</Text>
          <SelectField
            label="Equipment"
            value={partyName || null}
            onChange={(v) => setPartyName(v || '')}
            placeholder="Select equipment"
            options={[
              { label: 'Select equipment', value: null },
              { label: 'JCB Excavator', value: 'JCB Excavator' },
              { label: 'Concrete Mixer', value: 'Concrete Mixer' },
              { label: 'Vibrator', value: 'Vibrator' },
              ...machineNameOptions(projectId).map((n) => ({ label: n, value: n })),
            ]}
          />

          {machineOptions.length > 0 && (
            <View style={styles.optionsRow}>
              {machineOptions.map((n) => (
                <Pressable key={n} onPress={() => setPartyName(n)} style={styles.optionChip}>
                  <Text style={styles.optionText}>{n}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* ── Vendor ── */}
          <Text style={styles.sectionLabel}>Vendor</Text>
          <SelectField
            label="Vendor"
            value={vendorId}
            onChange={setVendorId}
            placeholder="Select vendor"
            options={[
              { label: 'Select vendor', value: null },
              { label: 'Ravi Hire', value: 'ven_demo_1' },
              { label: 'ACC Dealer', value: 'ven_demo_2' },
              { label: 'Sri Ganesh', value: 'ven_demo_3' },
              ...vendors.map((v) => ({ label: v.name, value: v.id })),
            ]}
          />

          {/* ── Time ── */}
          <Text style={styles.sectionLabel}>Working Hours</Text>
          <Text style={styles.hint}>Use 12h or 24h — e.g. 9:00 AM or 17:30</Text>

          <View style={styles.timeRow}>
            <AppTextField
              label="Start time"
              value={startTime}
              onChangeText={setStartTime}
              style={styles.timeField}
              placeholder="9:00 AM"
            />
            <View style={styles.timeArrow}>
              <MaterialCommunityIcons name="arrow-right" size={18} color={colors.mutedText} />
            </View>
            <AppTextField
              label="Close time"
              value={endTime}
              onChangeText={setEndTime}
              style={styles.timeField}
              placeholder="5:30 PM"
            />
          </View>

          {/* Total hours — auto display */}
          <View style={styles.totalCard}>
            <View style={styles.totalLeft}>
              <MaterialCommunityIcons name="clock-check-outline" size={22} color="#2563eb" />
              <View>
                <Text style={styles.totalLabel}>Total Hours</Text>
                <Text style={styles.totalSub}>Auto-calculated from times above</Text>
              </View>
            </View>
            <View style={[styles.totalBadge, hoursValid && styles.totalBadgeActive]}>
              <Text style={[styles.totalNum, hoursValid && styles.totalNumActive]}>
                {totalHrs || '—'}
              </Text>
              {hoursValid && <Text style={styles.totalUnit}>hrs</Text>}
            </View>
          </View>

          {/* Manual override */}
          <Pressable onPress={() => {
            const auto = diffHours(startTime, endTime);
            setTotalHrs(auto || totalHrs);
          }} style={styles.recalcBtn}>
            <MaterialCommunityIcons name="refresh" size={14} color="#2563eb" />
            <Text style={styles.recalcText}>Recalculate</Text>
          </Pressable>

          {/* ── Work done ── */}
          <Text style={styles.sectionLabel}>Work Details</Text>
          <AppTextField
            label="Work done / measurements"
            value={workDone}
            onChangeText={setWorkDone}
            multiline
            numberOfLines={4}
            placeholder="Enter work details..."
          />

          {/* ── Save ── */}
          <GradientButton
            title={editing ? 'Update Row' : 'Save Row'}
            onPress={onSave}
            colors={['#2f86de', '#62b6ff']}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />

          {editing && (
            <Pressable onPress={onDelete} style={styles.delBtn}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
              <Text style={styles.delText}>Delete this entry</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },

  sectionLabel: {
    color: '#1a2f4e',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
    paddingLeft: 8,
  },
  hint: { color: colors.mutedText, marginBottom: 12, fontSize: 13, lineHeight: 18 },

  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -4, marginBottom: 10 },
  optionChip: {
    backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#bfdbfe',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  optionText: { color: '#1e3a5f', fontWeight: '700', fontSize: 12 },

  /* Time row */
  timeRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    gap: 8, marginBottom: 14,
  },
  timeField: { flex: 1 },
  timeArrow: {
    paddingBottom: 14,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Total hours card */
  totalCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8faff',
    borderWidth: 1, borderColor: '#dbeafe',
    borderRadius: 16, padding: 14, marginBottom: 8,
  },
  totalLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#1a2f4e' },
  totalSub: { fontSize: 11, color: colors.mutedText, marginTop: 2 },
  totalBadge: {
    flexDirection: 'row', alignItems: 'baseline', gap: 4,
    backgroundColor: '#e2e8f0', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  totalBadgeActive: { backgroundColor: '#2563eb' },
  totalNum: { fontSize: 22, fontWeight: '900', color: '#94a3b8' },
  totalNumActive: { color: '#fff' },
  totalUnit: { fontSize: 13, fontWeight: '700', color: '#bfdbfe' },

  recalcBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginBottom: 16,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#eff6ff', borderRadius: 10,
    borderWidth: 1, borderColor: '#bfdbfe',
  },
  recalcText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },

  delBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 16, justifyContent: 'center',
    paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#fef2f2',
    borderWidth: 1, borderColor: '#fecaca',
  },
  delText: { color: '#ef4444', fontWeight: '800', fontSize: 14 },
});