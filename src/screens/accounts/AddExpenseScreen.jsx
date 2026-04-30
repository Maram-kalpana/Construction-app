import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { SelectField } from '../../components/SelectField';
import { addExpenseApi } from '../../api/expenseApi';
import { getVendorsByType } from '../../api/vendorApi';
import { colors } from '../../theme/theme';

export function AddExpenseScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { user } = useAuth();
  const { addExpense, projects } = useApp();
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  const [name, setName] = useState('');
  const [type, setType] = useState('Labour');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [partyId, setPartyId] = useState(null);
const [partyList, setPartyList] = useState([]);

  const dateLabel = useMemo(() => new Date().toLocaleString(), []);
  const disabled = useMemo(() => name.trim().length < 2 || Number(amount) <= 0 || !Number.isFinite(Number(amount)), [name, amount]);


  useEffect(() => {
  fetchVendorsByType();
}, [type]);

const [partyList, setPartyList] = useState([]);

useEffect(() => {
  fetchVendors();
}, [type]);

const fetchVendors = async () => {
  try {
    const res = await getVendorsByType();

    console.log("VENDOR API:", res.data); // 🔥 debug

    if (res?.data?.success) {
      let vendors = res.data.data || [];

      // ✅ safe filter
     if (type) {
  vendors = vendors.filter(v =>
    v.type?.toLowerCase().includes(type.toLowerCase())
  );
} else if (type === "Material") {
        vendors = vendors.filter(v =>
          v.type?.toLowerCase().includes("material")
        );
      } else if (type === "Machinery") {
        vendors = vendors.filter(v =>
          v.type?.toLowerCase().includes("machinery")
        );
      }

      console.log("FILTERED VENDORS:", vendors);

      setPartyList(vendors);
    } else {
      setPartyList([]);
    }

  } catch (err) {
    console.log("VENDOR ERROR:", err?.response?.data || err);
    setPartyList([]);
  }
};
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

          

            <Text style={styles.label}>Type</Text>
            <SegmentedButtons
              value={type}
              onValueChange={setType}
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
            <View style={styles.formCard}>
           <SelectField
  label="Party"
  value={partyId}
  onChange={setPartyId}
  options={[
    { label: 'Select party', value: null },
    ...(partyList || []).map(p => ({
      label: p.name,
      value: p.id,
    })),
  ]}
/>

            <AppTextField
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />

            <AppTextField
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholder="Optional notes"
            />

            <GradientButton
              title="Save expense"
              disabled={disabled}
              onPress={async () => {
  if (!user) return;

  try {
    const formattedDate = new Date()
      .toISOString()
      .split('T')[0]; // ✅ YYYY-MM-DD

    const payload = {
  project_id: projectId,

  // ✅ always send vendor_id
  vendor_id: partyId,

  // 🔥 IMPORTANT: fake mapping for labour
  labour_id: type === "Labour" ? partyId : null,

  item_id: null,

  type: type.toLowerCase(),
  sector: "",
  amount: String(amount),
  description: description || "",
  expense_date: formattedDate,
  added_by: user.id,
};

    console.log("EXPENSE PAYLOAD:", payload);

    const res = await addExpenseApi(payload);

    if (res?.data?.success) {
      navigation.replace('ExpenseDetails', {
        projectId,
        expense: res.data.data,
      });
    } else {
      alert("Failed to save");
    }

  } catch (err) {
    console.log("EXPENSE ERROR:", err?.response?.data || err);
    alert("Error saving expense");
  }
}}
              style={styles.btn}
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
  btn: { marginTop: 4 },
});
