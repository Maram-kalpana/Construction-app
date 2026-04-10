import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
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
  const { getDailyBundle, addMachineEntry, deleteMachineEntry, dateKey } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const editing = useMemo(() => bundle.machines.find((e) => e.id === entryId) ?? null, [bundle.machines, entryId]);

  const [partyName, setPartyName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHrs, setTotalHrs] = useState('');
  const [workDone, setWorkDone] = useState('');

  useEffect(() => {
    if (!editing) return;
    setPartyName(editing.partyName ?? '');
    setStartTime(editing.startTime ?? '');
    setEndTime(editing.endTime ?? '');
    setTotalHrs(String(editing.totalHrs ?? ''));
    setWorkDone(editing.workDone ?? '');
  }, [editing]);

  const applyComputedHours = () => {
    const auto = diffHours(startTime, endTime);
    if (auto) setTotalHrs(auto);
  };

  const onSave = async () => {
    if (partyName.trim().length < 2) {
      Alert.alert('Missing', 'Enter party / machine name.');
      return;
    }
    await addMachineEntry(
      projectId,
      {
        id: editing?.id,
        partyName,
        startTime,
        endTime,
        totalHrs,
        workDone,
      },
      today,
    );
    navigation.goBack();
  };

  const onDelete = () => {
    if (!editing) return;
    Alert.alert('Delete', 'Remove this machinery row?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMachineEntry(projectId, editing.id, today);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>Use 12h or 24h times, e.g. 9:00 AM or 17:30</Text>
          <TextInput
            label="Party / equipment name"
            value={partyName}
            onChangeText={setPartyName}
            mode="outlined"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <View style={styles.row2}>
            <TextInput
              label="Start"
              value={startTime}
              onChangeText={setStartTime}
              mode="outlined"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
            <TextInput
              label="Close"
              value={endTime}
              onChangeText={setEndTime}
              onBlur={applyComputedHours}
              mode="outlined"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
          </View>
          <Pressable onPress={applyComputedHours} style={styles.calc}>
            <Text style={styles.calcText}>Calculate hours from times</Text>
          </Pressable>
          <TextInput
            label="Total hours"
            value={totalHrs}
            onChangeText={setTotalHrs}
            mode="outlined"
            keyboardType="decimal-pad"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <TextInput
            label="Work done / measurements"
            value={workDone}
            onChangeText={setWorkDone}
            mode="outlined"
            multiline
            numberOfLines={4}
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <GradientButton
            title={editing ? 'Update row' : 'Save row'}
            onPress={onSave}
            colors={['#9a3412', '#fb923c']}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
          {editing ? (
            <Pressable onPress={onDelete} style={styles.del}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#fca5a5" />
              <Text style={styles.delText}>Delete</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  hint: { color: colors.mutedText, marginBottom: 12, lineHeight: 18 },
  input: { backgroundColor: 'transparent', marginBottom: 12 },
  outline: { borderRadius: 14 },
  row2: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  calc: { marginBottom: 10, alignSelf: 'flex-start' },
  calcText: { color: '#7dd3fc', fontWeight: '800', fontSize: 13 },
  del: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' },
  delText: { color: '#fca5a5', fontWeight: '800' },
});
