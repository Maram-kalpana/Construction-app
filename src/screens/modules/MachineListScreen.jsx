import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Modal, Alert } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';
import { getEquipmentEntries } from "../../api/machineApi";
import { getMachines } from "../../api/machineApi";
import { useFocusEffect } from '@react-navigation/native';


export function MachineListScreen({ route, navigation }) {
  const { projectId } = route.params;


  const { dateKey } = useApp(); // ✅ inside component
  const today = dateKey();

  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const [machines, setMachines] = useState([]);
  
  const [machineryList, setMachineryList] = useState([]);
  const [showReasonModal, setShowReasonModal] = useState(false);
const [reason, setReason] = useState('');
const [actionType, setActionType] = useState(null); // 'edit' | 'delete'
const [selectedItem, setSelectedItem] = useState(null);
  const formatTime = (t) => t?.slice(0, 5);
const fetchMachines = async () => {
  console.log("FETCH CALLED 🔥"); // 👈 ADD THIS

  try {
    const res = await getEquipmentEntries({
      project_id: projectId,
      date: selectedDate,
    });

    console.log("FULL RESPONSE:", res.data);

    const list =
      res?.data?.data?.data ||
      res?.data?.data ||
      res?.data ||
      [];

    console.log("FINAL LIST:", list);

    setMachines(Array.isArray(list) ? list : []);
  } catch (err) {
    console.log("Machine fetch error", err?.response?.data || err.message);
  }
};
const fetchMachinery = async () => {
  try {
    const res = await getMachines();
    setMachineryList(res.data.data || []);
  } catch (err) {
    console.log("Machinery fetch error", err);
  }
};

useEffect(() => {
  fetchMachinery();
}, []);
  // ✅ FETCH API
  useEffect(() => {
    fetchMachines();
  }, [selectedDate]);

  useFocusEffect(
  React.useCallback(() => {
    console.log("FOCUS TRIGGERED 🔁");
    fetchMachines();
  }, [selectedDate])
);

  

  // ✅ FILTER DATA
const rows = useMemo(() => {
  if (!search.trim()) return machines;

  const q = search.toLowerCase();
  return machines.filter(
    (m) =>
      String(m.equipment_id || '').includes(q) ||
      (m.work_done || '').toLowerCase().includes(q)
  );
}, [machines, search]);
const getMachineName = (id) => {
  const machine = machineryList.find((m) => m.id === id);
  return machine?.name || `Equipment #${id}`;
};
const handleReasonSubmit = async () => {
  if (!reason.trim()) {
    Alert.alert("Required", "Please enter reason");
    return;
  }

  setShowReasonModal(false);

  if (actionType === 'edit') {
    navigation.navigate('MachineForm', {
      projectId,
      entry: selectedItem,   // ✅ old data
      reason: reason,        // ✅ pass reason
    });
  }

  if (actionType === 'delete') {
    try {
      // 👉 replace with your API
      console.log("DELETE ID:", selectedItem.id, "Reason:", reason);

      // Example:
      // await deleteMachine(selectedItem.id, { reason });

      fetchMachines(); // refresh list
    } catch (err) {
      console.log("Delete error:", err);
    }
  }
};
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.h1}>Machinery</Text>
          <Text style={styles.sub}>
            Party / equipment, start / close time, total hours.
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search party / equipment..."
            placeholderTextColor={colors.mutedText}
          />
        </View>

        {/* DATE + ADD */}
        <View style={styles.dateRow}>
          <DatePickerField
            label=""
            value={selectedDate}
            onChange={setSelectedDate}
            style={styles.dateBtnWrap}
          />
          <GradientButton
            title="Add Machine"
            onPress={() =>
              navigation.navigate('MachineForm', { projectId })
            }
            colors={['#2f86de', '#62b6ff']}
            style={styles.addBtn}
            left={<MaterialCommunityIcons name="plus-circle-outline" size={18} color="#fff" />}
          />
        </View>

        {/* LIST */}
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              
              style={styles.card}
            >
              <View style={styles.row}>
  <View style={styles.icon}>
    <MaterialCommunityIcons name="excavator" size={22} color="#2f86de" />
  </View>

  <View style={styles.meta}>
    <Text style={styles.name}>
  {item.equipment?.name || 'Machine'}
</Text>

    <Text style={styles.sub2}>
  {formatTime(item.start_time)} → {formatTime(item.end_time)} • {item.total_hours} hrs
</Text>
    <Text style={styles.sub2}>
  Vendor: {item.vendor?.name || '-'}
</Text>

    {item.work_done ? (
      <Text style={styles.work}>{item.work_done}</Text>
    ) : null}
  </View>
  

  <View style={{ flexDirection: 'row', gap: 10 }}>

  {/* EDIT */}
  <Pressable
    onPress={() => {
      setSelectedItem(item);
      setActionType('edit');
      setReason('');
      setShowReasonModal(true);
    }}
  >
    <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
  </Pressable>

  {/* DELETE */}
  <Pressable
    onPress={() => {
      setSelectedItem(item);
      setActionType('delete');
      setReason('');
      setShowReasonModal(true);
    }}
  >
    <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
  </Pressable>

</View>
</View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="bulldozer" size={36} color="rgba(233,242,242,0.5)" />
              <Text style={styles.emptyTitle}>No machinery logged</Text>
              <Text style={styles.emptyText}>
                Record excavators, mixers, or hired plant for the day.
              </Text>
            </View>
          }
        />
        <Modal visible={showReasonModal} transparent animationType="slide">
  <View style={styles.modalBackdrop}>
    <Pressable style={{ flex: 1 }} onPress={() => setShowReasonModal(false)} />

    <View style={styles.bottomSheet}>
      <Text style={styles.modalTitle}>Enter Reason</Text>

      <TextInput
        style={styles.reasonInput}
        placeholder="Enter reason..."
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <Pressable style={styles.saveBtn} onPress={handleReasonSubmit}>
        <Text style={styles.saveText}>Continue</Text>
      </Pressable>

      <Pressable onPress={() => setShowReasonModal(false)} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  </View>
</Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10 },
  dateRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  dateBtnWrap: { flex: 1 },
  addBtn: { flex: 1 },
  list: { padding: 16, paddingBottom: 120, gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(98,182,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '900' },
  sub2: { marginTop: 4, color: colors.mutedText, fontSize: 12 },
  work: { marginTop: 6, color: colors.text, fontSize: 13, lineHeight: 18 },
  empty: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  emptyTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },
  reasonInput: {
  width: '100%',
  minHeight: 80,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 12,
  padding: 12,
  fontSize: 14,
  marginBottom: 16,
  textAlignVertical: 'top'
},
modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'flex-end'
},

bottomSheet: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 16,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '900',
  marginBottom: 12
},

saveBtn: {
  backgroundColor: '#2563eb',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center'
},

saveText: {
  color: '#fff',
  fontWeight: '800'
},

cancelBtn: {
  marginTop: 10,
  alignItems: 'center'
},

cancelText: {
  color: '#ef4444',
  fontWeight: '700'
},
});
