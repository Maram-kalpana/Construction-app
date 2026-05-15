import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

import { addManagerExpense } from '../../api/expenseApi';
import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';
import { formatDateOnlyLocal } from '../../utils/dateOnly';

function vendorsMatchingType(vendors, expenseType) {
  const hay = (v) =>
    `${String(v.vendorType || '').toLowerCase()} ${String(v.name || '').toLowerCase()}`;
  const labourKeys = ['labour', 'labor', 'worker', 'contract', 'mistry', 'mason', 'helper'];
  const materialKeys = [
    'material',
    'supplier',
    'cement',
    'sand',
    'brick',
    'steel',
    'stone',
    'aggregate',
    'vendor',
    'tile',
    'paint',
  ];
  const machineryKeys = ['machinery', 'hire', 'equipment', 'plant', 'excav', 'crane', 'mixer', 'rental', 'vehicle'];

  const keys =
    expenseType === 'Labour'
      ? labourKeys
      : expenseType === 'Material'
        ? materialKeys
        : machineryKeys;

  return (vendors || []).filter((v) => keys.some((k) => hay(v).includes(k)));
}

function formatApiError(err) {
  const d = err?.response?.data;
  if (typeof d?.message === 'string') return d.message;
  if (d?.errors && typeof d.errors === 'object') {
    const parts = [];
    for (const [k, v] of Object.entries(d.errors)) {
      const msgs = Array.isArray(v) ? v : [v];
      msgs.forEach((m) => {
        if (m != null && String(m).trim()) parts.push(`${k}: ${String(m).trim()}`);
      });
    }
    if (parts.length) return parts.join('\n');
  }
  return err?.message || 'Request failed';
}

export function AddExpenseScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { user } = useAuth();
  const { addExpense, projects, vendors } = useApp();
  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(projectId)),
    [projects, projectId],
  );

  const [expenseType, setExpenseType] = useState('Labour');
  const [partyId, setPartyId] = useState(null);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const partyList = useMemo(
    () => vendorsMatchingType(vendors, expenseType),
    [vendors, expenseType],
  );

  const partyOptions = useMemo(
    () => [
      { label: 'Select party', value: null },
      ...partyList.map((v) => ({ label: v.name, value: v.id })),
    ],
    [partyList],
  );

  const onTypeChange = useCallback((v) => {
    setExpenseType(v);
    setPartyId(null);
  }, []);

  const partyLabel =
    expenseType === 'Labour'
      ? 'Party name (labour)'
      : expenseType === 'Material'
        ? 'Party name (material)'
        : 'Party name (machinery hire)';

  const selectedName = partyList.find((v) => v.id === partyId)?.name || '';

  const disabled = useMemo(
    () =>
      saving ||
      partyId == null ||
      Number(amount) <= 0 ||
      !Number.isFinite(Number(amount)),
    [saving, partyId, amount],
  );

  const dateLabel = useMemo(() => new Date().toLocaleString(), []);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Add expense</Text>
          <Text style={styles.sub}>
            {project ? `${project.name} • ${project.location}` : `Project ${projectId}`}
            {'\n'}
            <Text style={styles.subMuted}>Date: {dateLabel}</Text>
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Type</Text>
            <SegmentedButtons
              value={expenseType}
              onValueChange={onTypeChange}
              style={styles.segment}
              buttons={[
                { value: 'Labour', label: 'Labour' },
                { value: 'Material', label: 'Material' },
                { value: 'Machinery', label: 'Machinery' },
              ]}
              theme={{
                colors: {
                  secondaryContainer: 'rgba(125,211,252,0.22)',
                  onSecondaryContainer: colors.text,
                  outline: colors.outline,
                },
              }}
            />

            <SelectField
              label={partyLabel}
              value={partyId}
              onChange={setPartyId}
              placeholder={partyList.length ? 'Select party' : 'No matching parties'}
              options={partyOptions}
            />
            {partyList.length === 0 ? (
              <Text style={styles.hint}>
                No vendors match this type yet. Add vendors whose category or name suggests {expenseType.toLowerCase()}{' '}
                (e.g. “Labour contractor”, “Cement supplier”).
              </Text>
            ) : null}

            <AppTextField
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />

            <GradientButton
              title={saving ? 'Saving…' : 'Save expense'}
              disabled={disabled}
              onPress={async () => {
                if (!user) return;
                setSaving(true);
                const amt = Number(amount);
                const expenseDate = formatDateOnlyLocal(new Date());
                const pid = Number(projectId);
                const payload = {
                  project_id: Number.isFinite(pid) ? pid : projectId,
                  vendor_id: Number(partyId),
                  amount: amt,
                  expense_date: expenseDate,
                  description: `${expenseType}: ${selectedName}`.trim(),
                  expense_type: expenseType,
                };
                try {
                  const res = await addManagerExpense(payload);
                  const created = res?.data?.data ?? res?.data ?? {};
                  const id = created.id ?? created.expense_id;
                  const dateStr = created.expense_date ?? created.date ?? expenseDate;
                  const dateIso =
                    typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)
                      ? `${dateStr.slice(0, 10)}T12:00:00.000Z`
                      : new Date(created.created_at || Date.now()).toISOString();
                  const exp = {
                    id: id ?? `exp_${Date.now()}`,
                    managerId: user.id,
                    name: selectedName,
                    partyId,
                    type: created.expense_type ?? created.category ?? expenseType,
                    amount: Number(created.amount ?? amt),
                    dateIso,
                  };
                  addExpense(projectId, exp);
                  navigation.replace('ExpenseDetails', { projectId, expense: exp });
                } catch (err) {
                  console.log('[AddExpense] API error:', err?.response?.data || err?.message);
                  Alert.alert('Could not save expense', formatApiError(err));
                } finally {
                  setSaving(false);
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 28 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 16, lineHeight: 18 },
  subMuted: { color: 'rgba(233,242,242,0.55)' },
  formCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 16,
  },
  label: { color: colors.text, fontWeight: '800', marginBottom: 10, marginTop: 4 },
  segment: { marginBottom: 12 },
  hint: {
    marginTop: -4,
    marginBottom: 12,
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
});
