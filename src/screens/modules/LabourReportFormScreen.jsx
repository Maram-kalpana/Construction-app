import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourReportFormScreen({ route, navigation }) {
  const { projectId, entryId } = route.params || {};
  const {
    getDailyBundle, addLabourEntry, deleteLabourEntry,
    findLabourByPhone, labourPersonById, dateKey
  } = useApp();

  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const editing = useMemo(
    () => bundle.labourEntries.find((e) => e.id === entryId) ?? null,
    [bundle.labourEntries, entryId]
  );

  const [phone, setPhone]                   = useState(editing ? labourPersonById(editing.labourId)?.phone || '' : '');
  const [labourId, setLabourId]             = useState(editing?.labourId || null);
  const [masteryName, setMasteryName]       = useState(editing?.masteryName || '');
  const [mason, setMason]                   = useState(String(editing?.mason || ''));
  const [maleSkilled, setMaleSkilled]       = useState(String(editing?.maleSkilled || ''));
  const [femaleUnskilled, setFemaleUnskilled] = useState(String(editing?.femaleUnskilled || ''));
  const [others, setOthers]                 = useState(String(editing?.others || ''));
  const [workDone, setWorkDone]             = useState(editing?.workDone || '');
  const [showForm, setShowForm]             = useState(!!editing); // show form only when editing or after tap

  const person = labourId ? labourPersonById(labourId) : null;

  const onLookup = () => {
    const found = findLabourByPhone(phone);
    if (!found) {
      Alert.alert('Not found', 'Labour not found by phone. Add labour first.');
      return;
    }
    setLabourId(found.id);
  };

  const onSave = async () => {
    if (!labourId) {
      Alert.alert('Select labour', 'Find and select a labour by phone.');
      return;
    }
    await addLabourEntry(
      projectId,
      { id: editing?.id, labourId, masteryName, mason, maleSkilled, femaleUnskilled, others, workDone },
      today,
    );
    navigation.goBack();
  };

  const onDelete = async () => {
    await deleteLabourEntry(projectId, editing.id, today);
    navigation.goBack();
  };

  // ── TABLE ──────────────────────────────────────────────
  const TableView = () => (
    <View style={styles.tableWrap}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thCell, styles.colSl]}>Sl.{'\n'}No.</Text>
        <Text style={[styles.thCell, styles.colParty]}>Party Name</Text>
        <Text style={[styles.thCell, styles.colLabour]}>M</Text>
        <Text style={[styles.thCell, styles.colLabour]}>F</Text>
        <Text style={[styles.thCell, styles.colLabour]}>Mation</Text>
        <Text style={[styles.thCell, styles.colWork]}>Work Done{'\n'}Measurements</Text>
      </View>

      {/* Rows */}
      {bundle.labourEntries.length === 0 ? (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>No entries yet. Add a report below.</Text>
        </View>
      ) : (
        bundle.labourEntries.map((entry, index) => {
          const lp = labourPersonById(entry.labourId);
          return (
            <TouchableOpacity
              key={entry.id}
              style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}
              onPress={() => navigation.push('LabourReportForm', { projectId, entryId: entry.id })}
              activeOpacity={0.7}
            >
              <Text style={[styles.tdCell, styles.colSl]}>{index + 1}</Text>
              <Text style={[styles.tdCell, styles.colParty]}>{entry.masteryName || lp?.name || '—'}</Text>
              <Text style={[styles.tdCell, styles.colLabour]}>{entry.mason || '0'}</Text>
              <Text style={[styles.tdCell, styles.colLabour]}>{entry.maleSkilled || '0'}</Text>
              <Text style={[styles.tdCell, styles.colLabour]}>{entry.femaleUnskilled || '0'}</Text>
              <Text style={[styles.tdCell, styles.colWork]} numberOfLines={2}>{entry.workDone || '—'}</Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

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
          <Text style={styles.sub}>Today's entries — tap a row to edit.</Text>

          {/* ── TABLE ── */}
          <TableView />

          {/* ── ADD BUTTON (only when not already showing form) ── */}
          {!showForm && !editing && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowForm(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Add Labour Report</Text>
            </TouchableOpacity>
          )}

          {/* ── FORM (shown after tapping Add or when editing) ── */}
          {(showForm || editing) && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editing ? '✏️ Edit Entry' : '➕ New Entry'}
              </Text>

              {/* Phone lookup */}
              <View style={styles.lookupRow}>
                <AppTextField
                  label="Labour phone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.inputFlex}
                  placeholder="Find labour by phone"
                />
                <GradientButton title="Find" onPress={onLookup} style={styles.findBtn} />
              </View>
              <Text style={styles.personText}>
                {person ? `✅ ${person.name}` : 'No labour selected'}
              </Text>

              <AppTextField
                label="Party name"
                value={masteryName}
                onChangeText={setMasteryName}
                placeholder="Party / mastery"
              />

              <View style={styles.grid2}>
                <AppTextField label="Mason (M)" value={mason} onChangeText={setMason} keyboardType="numeric" style={styles.half} placeholder="0" />
                <AppTextField label="Male / Skilled (F)" value={maleSkilled} onChangeText={setMaleSkilled} keyboardType="numeric" style={styles.half} placeholder="0" />
              </View>

              <View style={styles.grid2}>
                <AppTextField label="Female / Unskilled" value={femaleUnskilled} onChangeText={setFemaleUnskilled} keyboardType="numeric" style={styles.half} placeholder="0" />
                <AppTextField label="Others (Mation)" value={others} onChangeText={setOthers} keyboardType="numeric" style={styles.half} placeholder="0" />
              </View>

              <AppTextField
                label="Work done / measurements"
                value={workDone}
                onChangeText={setWorkDone}
                multiline
                numberOfLines={3}
                placeholder="e.g. 80 x 9' walls"
              />

              {/* Save */}
              <GradientButton
                title={editing ? 'Update report' : 'Save report'}
                onPress={onSave}
                left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
              />

              {/* Delete — only when editing */}
              {editing && (
                <GradientButton
                  title="Delete report"
                  onPress={onDelete}
                  colors={['#c62828', '#ef5350']}
                  style={styles.delBtn}
                />
              )}

              {/* Cancel — only when adding new */}
              {!editing && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },

  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 4, color: colors.mutedText, marginBottom: 14, fontSize: 13 },

  // ── TABLE ──
  tableWrap: {
    borderWidth: 1,
    borderColor: '#c8d6e5',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderBottomWidth: 1,
    borderBottomColor: '#93c5fd',
  },

  thCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e3a5f',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#93c5fd',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2eaf4',
    backgroundColor: '#fff',
  },

  rowEven: {
    backgroundColor: '#f8fbff',
  },

  tdCell: {
    fontSize: 12,
    color: '#1f2f4b',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#e2eaf4',
  },

  // column widths
  colSl:     { width: 36 },
  colParty:  { flex: 1, textAlign: 'left', paddingLeft: 8 },
  colLabour: { width: 44 },
  colWork:   { flex: 1, textAlign: 'left', paddingLeft: 6 },

  emptyRow: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    color: colors.mutedText,
    fontSize: 13,
  },

  // ── ADD BUTTON ──
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    height: 48,
    marginBottom: 16,
  },

  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // ── FORM CARD ──
  formCard: {
    backgroundColor: '#f8fbff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 16,
    marginBottom: 10,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },

  lookupRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },

  inputFlex: { flex: 1, marginBottom: 0 },
  findBtn:   { width: 90, marginBottom: 12 },

  personText: {
    marginBottom: 12,
    color: colors.mutedText,
    fontWeight: '700',
    fontSize: 13,
  },

  grid2: { flexDirection: 'row', gap: 10 },
  half:  { flex: 1 },

  delBtn: { marginTop: 10 },

  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },

  cancelText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 14,
  },
});