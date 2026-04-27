import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { DatePickerField } from '../../components/DatePickerField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function StockModuleScreen({ route }) {
  const { projectId } = route.params;

const app = useApp();

const getDailyBundle = app?.getDailyBundle;
const updateDailyPartial = app?.updateDailyPartial;
const addCementConsumption = app?.addCementConsumption;
const deleteCementConsumption = app?.deleteCementConsumption;
const stockWorkOptions = app?.stockWorkOptions;
const dateKey = app?.dateKey || (() => new Date().toISOString().slice(0, 10));
  const today = dateKey();
  const [selectedDate, setSelectedDate] = useState(today);
 const bundle = getDailyBundle
  ? getDailyBundle(projectId, selectedDate)
  : {
      cementStock: {},
      cementConsumption: [],
      remarks: '',
    };
  const stock = bundle.cementStock || {};
  const lines = bundle.cementConsumption || [];
  const remarks = bundle.remarks ?? '';

  const [openBal, setOpenBal] = useState(stock.openBal ?? '');
  const [received, setReceived] = useState(stock.received ?? '');
  const [cum, setCum] = useState(stock.cum ?? '');
  const [bal, setBal] = useState(stock.bal ?? '');
  const [remarksLocal, setRemarksLocal] = useState(remarks);

  const [work, setWork] = useState('');
  const [qty, setQty] = useState('');
  const [search, setSearch] = useState('');
  const [projectIdState, setProjectIdState] = useState(projectId);

  useEffect(() => {
    setOpenBal(stock.openBal ?? '');
    setReceived(stock.received ?? '');
    setCum(stock.cum ?? '');
    setBal(stock.bal ?? '');
    setRemarksLocal(bundle.remarks ?? '');
  }, [stock.openBal, stock.received, stock.cum, stock.bal, bundle.remarks]);

  const workOptions = useMemo(() => {
  const list = stockWorkOptions ? stockWorkOptions(projectId) : [];

  return list
    .filter((w) =>
      w.toLowerCase().includes(work.toLowerCase())
    )
    .slice(0, 6);
}, [projectId, stockWorkOptions, work]);
  const visibleLines = useMemo(
    () => lines.filter((line) => !search.trim() || (line.work || '').toLowerCase().includes(search.toLowerCase())),
    [lines, search],
  );

  const persistStock = async (next) => {
  if (!updateDailyPartial) return;

  const b = getDailyBundle
    ? getDailyBundle(projectId, selectedDate)
    : { cementStock: {} };

  await updateDailyPartial(
    projectId,
    { cementStock: { ...b.cementStock, ...next } },
    selectedDate
  );
};

  const persistRemarks = async (text) => {
  if (!updateDailyPartial) return;

  setRemarksLocal(text);
  await updateDailyPartial(projectId, { remarks: text }, selectedDate);
};

  const onAddLine = async () => {
  if (!addCementConsumption) return;

  if (work.trim().length < 2) {
    Alert.alert('Missing', 'Describe the work using cement.');
    return;
  }

  await addCementConsumption(projectId, { work, qty }, selectedDate);
  setWork('');
  setQty('');
};
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Cement & stock</Text>
          <Text style={styles.sub}>Consumption by work, opening balance, receipts, and closing balance.</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>

  {/* DATE */}
  <View style={{ flex: 1 }}>
    <DatePickerField
      label="Date"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  </View>

  {/* PROJECT */}
  <View style={{ flex: 1 }}>
    <SelectField
      label="Project"
      value={projectIdState}
      onChange={setProjectIdState}
      options={[
        { label: 'Current Project', value: projectId },
      ]}
    />
  </View>

</View>
          <View style={styles.searchWrap}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search consumption work..."
              placeholderTextColor={colors.mutedText}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>Cement stock report</Text>
            <View style={styles.grid2}>
              <AppTextField
                label="Open bal."
                value={openBal}
                onChangeText={setOpenBal}
                onBlur={() => persistStock({ openBal, received, cum, bal })}
                style={styles.halfWrap}
                placeholder="0"
              />
              <AppTextField
                label="Received"
                value={received}
                onChangeText={setReceived}
                onBlur={() => persistStock({ openBal, received, cum, bal })}
                style={styles.halfWrap}
                placeholder="0"
              />
            </View>
            <View style={styles.grid2}>
              <AppTextField
                label="Cumulative"
                value={cum}
                onChangeText={setCum}
                onBlur={() => persistStock({ openBal, received, cum, bal })}
                style={styles.halfWrap}
                placeholder="0"
              />
              <AppTextField
                label="Balance"
                value={bal}
                onChangeText={setBal}
                onBlur={() => persistStock({ openBal, received, cum, bal })}
                style={styles.halfWrap}
                placeholder="0"
              />
            </View>
            <GradientButton
  title="Save stock figures"
  onPress={() => persistStock({ openBal, received, cum, bal })}
  colors={['#2f86de', '#62b6ff']}
  style={styles.primaryBtn}
  left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
/>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>Cement consumption</Text>
            <FlatList
              data={visibleLines}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.lineRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lineWork}>{item.work}</Text>
                    <Text style={styles.lineQty}>Qty: {item.qty || '—'}</Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Alert.alert('Delete line?', undefined, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteCementConsumption(projectId, item.id, selectedDate) },
                      ]);
                    }}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fca5a5" />
                  </Pressable>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>No consumption lines yet.</Text>}
            />
            <SelectField
              label="Work"
              value={work || null}
              onChange={(v) => setWork(v || '')}
              placeholder="e.g. PCC work / brick work"
              options={[
                { label: 'Select work', value: null },
                { label: 'PCC work - ground floor slab', value: 'PCC work - ground floor slab' },
                { label: 'Brick work - 2nd floor walls', value: 'Brick work - 2nd floor walls' },
                ...workOptions.map((name) => ({ label: name, value: name })),
              ]}
            />
            <AppTextField
              label="Qty (bags)"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              placeholder="0"
            />
            <GradientButton title="Add consumption line" onPress={onAddLine} colors={['#2f86de', '#62b6ff']} />
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>Remarks / details report</Text>
            <AppTextField
              label="Narrative notes for the day"
              value={remarksLocal}
              onChangeText={(t) => {
                setRemarksLocal(t);
              }}
              onBlur={() => persistRemarks(remarksLocal)}
              multiline
              numberOfLines={6}
              placeholder="Write daily details..."
            />
            <GradientButton title="Save remarks" onPress={() => persistRemarks(remarksLocal)} colors={['#2f86de', '#62b6ff']} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18, marginBottom: 14 },
  searchWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10 },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 16,
    marginBottom: 14,
  },
  section: { color: colors.text, fontWeight: '900', marginBottom: 12 },
  grid2: { flexDirection: 'row', gap: 10 },
  halfWrap: { flex: 1, marginBottom: 0 },
  primaryBtn: { marginTop: 6, width: '100%' },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
    gap: 10,
  },
  lineWork: { color: colors.text, fontWeight: '800' },
  lineQty: { marginTop: 4, color: colors.mutedText, fontSize: 12 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -4, marginBottom: 10 },
  optionChip: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionText: { color: '#1e3a5f', fontWeight: '700', fontSize: 12 },
  empty: { color: colors.mutedText, marginBottom: 10 },
});
