import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function StockModuleScreen({ route }) {
  const { projectId } = route.params;
  const {
    getDailyBundle,
    updateDailyPartial,
    addCementConsumption,
    deleteCementConsumption,
    dateKey,
  } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
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

  useEffect(() => {
    setOpenBal(stock.openBal ?? '');
    setReceived(stock.received ?? '');
    setCum(stock.cum ?? '');
    setBal(stock.bal ?? '');
    setRemarksLocal(bundle.remarks ?? '');
  }, [stock.openBal, stock.received, stock.cum, stock.bal, bundle.remarks]);

  const persistStock = async (next) => {
    const b = getDailyBundle(projectId, today);
    await updateDailyPartial(projectId, { cementStock: { ...b.cementStock, ...next } }, today);
  };

  const persistRemarks = async (text) => {
    setRemarksLocal(text);
    await updateDailyPartial(projectId, { remarks: text }, today);
  };

  const onAddLine = async () => {
    if (work.trim().length < 2) {
      Alert.alert('Missing', 'Describe the work using cement.');
      return;
    }
    await addCementConsumption(projectId, { work, qty }, today);
    setWork('');
    setQty('');
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Cement & stock</Text>
          <Text style={styles.sub}>Consumption by work, opening balance, receipts, and closing balance.</Text>

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
              data={lines}
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
                        { text: 'Delete', style: 'destructive', onPress: () => deleteCementConsumption(projectId, item.id, today) },
                      ]);
                    }}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fca5a5" />
                  </Pressable>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>No consumption lines yet.</Text>}
            />
            <AppTextField
              label="Work"
              value={work}
              onChangeText={setWork}
              placeholder="e.g. PCC work / brick work"
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
  empty: { color: colors.mutedText, marginBottom: 10 },
});
