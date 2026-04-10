import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourReportFormScreen({ route, navigation }) {
  const { projectId, entryId } = route.params || {};
  const { getDailyBundle, addLabourEntry, deleteLabourEntry, findLabourByPhone, labourPersonById, dateKey } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const editing = useMemo(() => bundle.labourEntries.find((e) => e.id === entryId) ?? null, [bundle.labourEntries, entryId]);

  const [phone, setPhone] = useState(editing ? labourPersonById(editing.labourId)?.phone || '' : '');
  const [labourId, setLabourId] = useState(editing?.labourId || null);
  const [masteryName, setMasteryName] = useState(editing?.masteryName || '');
  const [mason, setMason] = useState(String(editing?.mason || ''));
  const [maleSkilled, setMaleSkilled] = useState(String(editing?.maleSkilled || ''));
  const [femaleUnskilled, setFemaleUnskilled] = useState(String(editing?.femaleUnskilled || ''));
  const [others, setOthers] = useState(String(editing?.others || ''));
  const [workDone, setWorkDone] = useState(editing?.workDone || '');

  const person = labourId ? labourPersonById(labourId) : null;

  const onLookup = () => {
    const found = findLabourByPhone(phone);
    if (!found) {
      Alert.alert('Not found', 'Labour not found by phone. Add labour first.');
      return;
    }
    setLabourId(found.id);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.h1}>Daily labour report form</Text>
          <Text style={styles.sub}>Enter only labour report fields for today.</Text>

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
          <Text style={styles.personText}>{person ? `Selected: ${person.name}` : 'No labour selected'}</Text>

          <AppTextField label="Party name" value={masteryName} onChangeText={setMasteryName} placeholder="Party / mastery" />
          <View style={styles.grid2}>
            <AppTextField label="Mason" value={mason} onChangeText={setMason} keyboardType="numeric" style={styles.half} placeholder="0" />
            <AppTextField label="Male / skilled" value={maleSkilled} onChangeText={setMaleSkilled} keyboardType="numeric" style={styles.half} placeholder="0" />
          </View>
          <View style={styles.grid2}>
            <AppTextField label="Female / unskilled" value={femaleUnskilled} onChangeText={setFemaleUnskilled} keyboardType="numeric" style={styles.half} placeholder="0" />
            <AppTextField label="Others" value={others} onChangeText={setOthers} keyboardType="numeric" style={styles.half} placeholder="0" />
          </View>
          <AppTextField label="Work done / measurements" value={workDone} onChangeText={setWorkDone} multiline numberOfLines={3} placeholder="Work details" />

          <GradientButton
            title={editing ? 'Update report' : 'Save report'}
            onPress={async () => {
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
            }}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
          {editing ? (
            <GradientButton
              title="Delete report"
              onPress={async () => {
                await deleteLabourEntry(projectId, editing.id, today);
                navigation.goBack();
              }}
              colors={['#c62828', '#ef5350']}
              style={styles.delBtn}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 36 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 14 },
  lookupRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  inputFlex: { flex: 1, marginBottom: 0 },
  findBtn: { width: 90, marginBottom: 12 },
  personText: { marginBottom: 12, color: colors.mutedText, fontWeight: '700' },
  grid2: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  delBtn: { marginTop: 10 },
});

