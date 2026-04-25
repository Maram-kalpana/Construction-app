import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { DatePickerField } from '../../components/DatePickerField';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';
import { getLabours } from "../../api/labourApi";
import { addLabour } from "../../api/labourApi";
import { deleteLabour, updateLabour } from "../../api/labourApi";
import { markAttendance, getTodayAttendance } from "../../api/attendanceApi";
import { Alert } from "react-native";

export function LabourListScreen({ route, navigation }) {
  const { projectId, vendorId: filterVendorId, date: routeDate } = route.params || {};
  const { vendors, dateKey, toggleAttendance, attendanceFor } = useApp();

  const today = dateKey();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(routeDate || today);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [gender, setGender] = useState('male');
  const [vendorId, setVendorId] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [labours, setLabours] = useState([]);
const [loading, setLoading] = useState(false);
const [editId, setEditId] = useState(null);
const [attendanceMap, setAttendanceMap] = useState({});
useEffect(() => {
  fetchLabours();
  fetchAttendance();
}, []);

const fetchLabours = async () => {
  try {
    setLoading(true);

    const res = await getLabours();
    const data = res?.data?.data || [];

    const formatted = data.map((item) => ({
      id: item.id,
      name: item.full_name,
      age: item.age,
      gender: item.gender,
      phone: item.phone,
      vendorId: item.vendor_id,
      photoUri: item.profile_pic,
    }));

    setLabours(formatted);

  } catch (err) {
    console.log("Labour fetch error:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

// ✅ OUTSIDE (correct)
const fetchAttendance = async () => {
  try {
    const res = await getTodayAttendance();
    const data = res?.data?.data || [];

    const map = {};
    data.forEach((item) => {
      map[item.labour_id] = item.is_present == 1;
    });

    setAttendanceMap(map);

  } catch (err) {
    console.log("Attendance fetch error:", err.response?.data || err.message);
  }
};
  const filtered = useMemo(() => {
  if (!search.trim()) {
    return labours.filter(
      (p) => !filterVendorId || p.vendorId === filterVendorId
    );
  }

  const q = search.toLowerCase();

  return labours.filter((p) => {
    const searchHit =
      p.name?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      (vendors.find((v) => v.id === p.vendorId)?.name || '')
        .toLowerCase()
        .includes(q);

    return (!filterVendorId || p.vendorId === filterVendorId) && searchHit;
  });
}, [filterVendorId, labours, search, vendors]);
  // ── Camera ──
  const openCamera = async () => {
    setShowPhotoModal(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // ── Gallery ──
  const openGallery = async () => {
    setShowPhotoModal(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ updated
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };
  const handleEdit = (item) => {
  setEditId(item.id);

  setName(item.name || '');
  setAge(String(item.age || ''));
  setPhone(item.phone || '');
  setGender(item.gender || 'male');
  setVendorId(Number(item.vendorId) || null);
  setPhotoUri(item.photoUri || null);

  setShowAddModal(true);
};
const handleDelete = (id) => {
  Alert.alert(
    "Delete Labour",
    "Are you sure you want to delete?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLabour(id);
            fetchLabours();
          } catch (err) {
            console.log("Delete error:", err.response?.data);
          }
        },
      },
    ]
  );
};

  const resetModal = () => {
  setEditId(null);   // 🔥 IMPORTANT FIX
  setName('');
  setAge('');
  setPhone('');
  setGender('male');
  setVendorId(null);
  setPhotoUri(null);
  setShowAddModal(false);
};

  const renderItem = ({ item, index }) => {
    const isPresent = attendanceMap[item.id] || false;



    return (
  <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
    
    {/* SL */}
    <View style={[styles.cell, styles.colSl]}>
      <Text style={styles.cellText}>{index + 1}</Text>
    </View>

    {/* Photo */}
    <View style={[styles.cell, styles.colPhoto]}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons name="account" size={18} color="#90a4c0" />
        </View>
      )}
    </View>

    {/* Name */}
    <View style={[styles.cell, styles.colName]}>
      <Text style={styles.name}>{item.name || '—'}</Text>
      <Text style={styles.phone}>{item.phone || ''}</Text>
      <Text style={styles.wage}>₹ {item.dailyWage || '0'}</Text>
    </View>

    {/* Vendor */}
    <View style={[styles.cell, styles.colVendor]}>
      <Text style={styles.cellText}>
        {vendors.find((v) => Number(v.id) === Number(item.vendorId))?.name}
      </Text>
    </View>

    {/* Gender */}
    <View style={[styles.cell, styles.colGender]}>
      <View style={[
        styles.genderBadge,
        item.gender === 'female' ? styles.genderF : styles.genderM
      ]}>
        <Text style={styles.genderText}>
          {item.gender?.[0]?.toUpperCase() ?? '—'}
        </Text>
      </View>
    </View>

    {/* Age */}
    <View style={[styles.cell, styles.colAge]}>
      <Text style={styles.cellText}>{item.age || '—'}</Text>
    </View>

    {/* Attendance */}
    <View style={[styles.cell, styles.colAttend]}>
      <Pressable
        onPress={async () => {
  try {
    const newStatus = !attendanceMap[item.id];

    await markAttendance({
      labour_ids: [item.id],   // ✅ fixed
      date: selectedDate,
      is_present: newStatus ? 1 : 0,
    });

    setAttendanceMap((prev) => ({
      ...prev,
      [item.id]: newStatus,
    }));

  } catch (err) {
    console.log("Attendance error:", err.response?.data || err.message);
  }
}}
      >
        <View style={[styles.checkbox, isPresent && styles.checkboxActive]}>
          {isPresent && (
            <MaterialCommunityIcons name="check" size={13} color="#fff" />
          )}
        </View>
      </Pressable>
    </View>

    {/* 🔥 ACTIONS (FIXED POSITION) */}
    <View style={[styles.cell, styles.colAction]}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        
        <Pressable onPress={() => handleEdit(item)}>
          <MaterialCommunityIcons name="pencil" size={16} color="#2563eb" />
        </Pressable>

        <Pressable onPress={() => handleDelete(item.id)}>
          <MaterialCommunityIcons name="delete" size={16} color="#ef4444" />
        </Pressable>

      </View>
    </View>

  </View>
);
  };
 const presentCount = labours.filter(
  (p) => attendanceMap[p.id]
).length;


  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={(
            <>
              {/* ── HEADER ── */}
              <View style={styles.header}>
                <Text style={styles.h1}>Labour Details</Text>
                <Text style={styles.sub}>Tap checkbox to mark attendance for selected date.</Text>
              </View>

              <View style={styles.controlRow}>
  
  {/* DATE */}
  <View style={styles.dateWrap}>
    <DatePickerField
      label="Date"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  </View>

  {/* SEARCH (WITH LABEL) */}
  <View style={styles.searchContainer}>
    <Text style={styles.label}>Search</Text>

    <View style={styles.searchWrap}>
      <MaterialCommunityIcons name="magnify" size={18} color={colors.mutedText} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={colors.mutedText}
        value={search}
        onChangeText={setSearch}
      />
      {search.length > 0 && (
        <Pressable onPress={() => setSearch('')} hitSlop={8}>
          <MaterialCommunityIcons name="close-circle" size={16} color={colors.mutedText} />
        </Pressable>
      )}
    </View>
  </View>

</View>

              {/* ── ROW 2: Present badge + Add Labour side by side ── */}
              <View style={styles.actionContainer}>
  
  {/* EMPTY LABEL SPACE (to match Date/Search) */}
  <View style={styles.fakeLabel} />

  <View style={styles.actionRow}>
    
    <View style={styles.badge}>
      <MaterialCommunityIcons name="account-check" size={15} color="#137333" />
      <Text style={styles.badgeText}>
        Present: {presentCount} / {labours.length}
      </Text>
    </View>

    <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
      <MaterialCommunityIcons name="plus" size={16} color="#fff" />
      <Text style={styles.addBtnText}>Add Labour</Text>
    </Pressable>

  </View>
</View>

              {/* ── TABLE HEADER ── */}
              <View style={styles.tableHeader}>
                <Text style={[styles.th, styles.colSl]}>#</Text>
                <Text style={[styles.th, styles.colPhoto]}>Pic</Text>
                <Text style={[styles.th, styles.colName]}>Name / Phone</Text>
                <Text style={[styles.th, styles.colVendor]}>Vendor</Text>
                <Text style={[styles.th, styles.colGender]}>G</Text>
                <Text style={[styles.th, styles.colAge]}>Age</Text>
                <Text style={[styles.th, styles.colAttend]}>✓</Text>
<Text style={[styles.th, styles.colAction, { borderRightWidth: 0 }]}>⋯</Text>
              </View>
            </>
          )}
          ListEmptyComponent={(
            <View style={styles.empty}>
              <MaterialCommunityIcons name="account-group-outline" size={40} color="#ccc" />
              <Text style={styles.emptyTitle}>No workers found</Text>
              <Text style={styles.emptyText}>Add labour from the button above.</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {/* ══════════ ADD LABOUR MODAL ══════════ */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={resetModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Labour</Text>

            {/* ── Photo + Name row ── */}
            <View style={styles.photoNameRow}>
              {/* Photo circle — opens camera/gallery picker */}
              <Pressable style={styles.photoCircle} onPress={() => setShowPhotoModal(true)}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoImg} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <MaterialCommunityIcons name="camera-plus" size={26} color="#4A90E2" />
                    <Text style={styles.photoHint}>Photo</Text>
                  </View>
                )}
              </Pressable>

              
    
 

  <View style={{ flex: 1 }}>
    <AppTextField
      label="Full Name"
      value={name}
      onChangeText={setName}
      placeholder="Enter full name"
    />
  </View>
</View>

{/* ── Phone + Daily Wages ── */}
<View style={styles.grid2}>
  <AppTextField
    style={styles.half}
    label="Phone Number"
    value={phone}
    onChangeText={setPhone}
    keyboardType="phone-pad"
    placeholder="Phone number"
  />

  <AppTextField
    style={styles.half}
    label="Daily Wages"
    value={dailyWage}
    onChangeText={setDailyWage}
    keyboardType="numeric"
    placeholder="₹ Amount"
  />
</View>
            {/* ── Age + Gender ── */}
            <View style={styles.grid2}>
              <AppTextField
                style={styles.half}
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="Age"
              />
              <SelectField
                style={styles.half}
                label="Gender"
                value={gender}
                onChange={setGender}
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </View>

            {/* ── Date + Vendor ── */}
            <View style={styles.grid2}>
              <DatePickerField style={styles.half} label="Effective Date" value={selectedDate} onChange={setSelectedDate} />
              <SelectField
                style={styles.half}
                label="Vendor"
                value={vendorId}
                onChange={setVendorId}
                placeholder="Select vendor"
                options={[
                  { label: 'Select vendor', value: null },
                  ...vendors.map((v) => ({ label: v.name, value: v.id })),
                ]}
              />
            </View>

            {/* ── Save ── */}
            <Pressable
              style={styles.saveBtn}
              onPress={async () => {
  if (!name.trim() || !phone.trim()) return;

  try {
    if (editId) {
      await updateLabour(editId, {
        full_name: name,
        age: Number(age),
        gender,
        phone,
        vendor_id: vendorId,
        profile_pic: photoUri,
      });
    } else {
      await addLabour({
  full_name: name,
  age: Number(age),
  gender,
  phone,
  vendor_id: vendorId,
  project_id: projectId,   // 🔥 MUST ADD
});
    }

    setEditId(null);
    await fetchLabours();   // 🔥 important
    resetModal();

  } catch (err) {
    console.log("Save error:", err.response?.data || err.message);
  }
}}
            >
              <MaterialCommunityIcons name="content-save" size={17} color="#fff" />
              <Text style={styles.saveText}>Save Labour</Text>
            </Pressable>
            <Pressable onPress={resetModal} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ══════════ PHOTO SOURCE MODAL ══════════ */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <Pressable style={styles.photoBackdrop} onPress={() => setShowPhotoModal(false)}>
          <View style={styles.photoSheet}>
            <Text style={styles.photoSheetTitle}>Add Photo</Text>

            {/* Camera option */}
            <Pressable style={styles.photoOption} onPress={openCamera}>
              <View style={[styles.photoOptionIcon, { backgroundColor: '#eff6ff' }]}>
                <MaterialCommunityIcons name="camera" size={26} color="#2563eb" />
              </View>
              <View style={styles.photoOptionMeta}>
                <Text style={styles.photoOptionTitle}>Take Photo</Text>
                <Text style={styles.photoOptionDesc}>Open camera and capture now</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#b0bec5" />
            </Pressable>

            <View style={styles.photoDivider} />

            {/* Gallery option */}
            <Pressable style={styles.photoOption} onPress={openGallery}>
              <View style={[styles.photoOptionIcon, { backgroundColor: '#f0fdf4' }]}>
                <MaterialCommunityIcons name="image-multiple" size={26} color="#16a34a" />
              </View>
              <View style={styles.photoOptionMeta}>
                <Text style={styles.photoOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.photoOptionDesc}>Pick an existing photo</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#b0bec5" />
            </Pressable>

            {/* Remove option — only if photo already selected */}
            {photoUri && (
              <>
                <View style={styles.photoDivider} />
                <Pressable
                  style={styles.photoOption}
                  onPress={() => { setPhotoUri(null); setShowPhotoModal(false); }}
                >
                  <View style={[styles.photoOptionIcon, { backgroundColor: '#fef2f2' }]}>
                    <MaterialCommunityIcons name="delete-outline" size={26} color="#ef4444" />
                  </View>
                  <View style={styles.photoOptionMeta}>
                    <Text style={[styles.photoOptionTitle, { color: '#ef4444' }]}>Remove Photo</Text>
                    <Text style={styles.photoOptionDesc}>Clear current photo</Text>
                  </View>
                </Pressable>
              </>
            )}

            <Pressable style={styles.photoCancelBtn} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.photoCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },

  /* ── page header ── */
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  h1: { fontSize: 22, fontWeight: '900', color: '#1a2f4e' },
  sub: { marginTop: 3, color: colors.mutedText, fontSize: 12 },

  /* ── control row: date + search ── */
  controlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // ✅ IMPORTANT (not center)
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
  },
  flex1: { flex: 1 },
  dateWrap: {
    flex: 1,
     // ✅ force same height
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: 12,
    height: 48, // clean standard height
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    height: '100%', // ✅ THIS FIXES ALIGNMENT
    paddingVertical: 0, // ✅ remove extra space
  },

  /* ── action row: present badge + add button ── */
  actionContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  
  fakeLabel: {
    height: 20, // ✅ SAME as label + margin
  },
  
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  
  badge: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#e6f4ec',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b7dfca',
  },
  
  addBtn: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    borderRadius: 12,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  /* ── table ── */
  list: { paddingBottom: 30, marginHorizontal: 12 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#93c5fd',
    paddingVertical: 9,
    overflow: 'hidden',
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e3a5f',
    textAlign: 'center',
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderRightColor: '#93c5fd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#e2eaf4',
    borderLeftWidth: 1,
    borderLeftColor: '#e2eaf4',
    borderRightWidth: 1,
    borderRightColor: '#e2eaf4',
    backgroundColor: '#fff',
  },
  rowEven: { backgroundColor: '#f8fbff' },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: '#e2eaf4',
  },
  cellText: { fontSize: 12, color: '#374151', textAlign: 'center', fontWeight: '500' },
  colSl:     { width: 25 },
  colPhoto:  { width: 40 },
  colName:   { flex: 1, alignItems: 'flex-start', paddingLeft: 10 },
  colVendor: { width: 50 },
  colGender: { width: 30 },
  colAge:    { width: 30 },
  colAttend: { width: 40 },
  colAction: { width: 40 },
  avatar: { width: 32, height: 32, borderRadius: 8 },
  avatarPlaceholder: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#eaf3ff', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 13, fontWeight: '700', color: '#1f2f4b' },
  phone: { fontSize: 11, color: colors.mutedText, marginTop: 1 },
  genderBadge: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  genderM: { backgroundColor: '#dbeafe' },
  genderF: { backgroundColor: '#fce7f3' },
  genderText: { fontSize: 11, fontWeight: '800', color: '#1e3a5f' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#2563eb',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  empty: { alignItems: 'center', padding: 36 },
  emptyTitle: { marginTop: 10, fontWeight: '900', fontSize: 16, color: colors.text },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center', fontSize: 13 },

  /* ══ Add Labour Modal ══ */
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 18,
    borderWidth: 1, borderColor: colors.outline,
  },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '900', marginBottom: 14 },

  /* photo + name row inside modal */
  photoNameRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  photoCircle: {
    width: 86,
    height: 86,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf3ff',
    overflow: 'hidden',
    flexShrink: 0,
  },
  photoImg: { width: 86, height: 86 },
  photoPlaceholder: { alignItems: 'center', gap: 4 },
  photoHint: { color: '#4A90E2', fontSize: 11, fontWeight: '700' },
  namePhoneCol: { flex: 1, gap: 0 },

  grid2: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  half: { flex: 1 },
  saveBtn: {
    marginTop: 4, backgroundColor: '#2563eb', borderRadius: 14,
    height: 46, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  cancelText: { color: '#ef4444', fontWeight: '800', fontSize: 14 },

  /* ══ Photo Source Modal ══ */
  photoBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.40)', justifyContent: 'flex-end',
  },
  photoSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  photoSheetTitle: { fontSize: 18, fontWeight: '900', color: '#1a2f4e', marginBottom: 16 },
  photoOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12,
  },
  photoOptionIcon: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  photoOptionMeta: { flex: 1 },
  photoOptionTitle: { fontSize: 15, fontWeight: '800', color: '#1a2f4e' },
  photoOptionDesc: { fontSize: 12, color: colors.mutedText, marginTop: 2 },
  photoDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 2 },
  photoCancelBtn: {
    marginTop: 14, alignItems: 'center', paddingVertical: 12,
    backgroundColor: '#f8fafc', borderRadius: 14,
  },
  photoCancelText: { color: '#ef4444', fontWeight: '800', fontSize: 15 },
  searchContainer: {
    flex: 1,
  },
  
  label: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 6,
  },
});