import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SegmentedButtons, TextInput } from 'react-native-paper';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourFormScreen({ route, navigation }) {
  const { projectId, entryId } = route.params;
  const {
    getDailyBundle,
    findLabourByPhone,
    upsertLabourPerson,
    addLabourEntry,
    deleteLabourEntry,
    labourPersonById,
    dateKey,
  } = useApp();
  const today = dateKey();

  const [phone, setPhone] = useState('');
  const [lookupHit, setLookupHit] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [photoUri, setPhotoUri] = useState(null);
  const [masteryName, setMasteryName] = useState('');
  const [mason, setMason] = useState('');
  const [maleSkilled, setMaleSkilled] = useState('');
  const [femaleUnskilled, setFemaleUnskilled] = useState('');
  const [others, setOthers] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [labourId, setLabourId] = useState(null);

  const bundle = getDailyBundle(projectId, today);
  const editingEntry = useMemo(() => bundle.labourEntries.find((e) => e.id === entryId) ?? null, [bundle.labourEntries, entryId]);

  useEffect(() => {
    if (!editingEntry) return;
    const person = labourPersonById(editingEntry.labourId);
    setLabourId(editingEntry.labourId);
    setPhone(person?.phone ?? '');
    setName(person?.name ?? '');
    setAge(person?.age ?? '');
    setGender(person?.gender ?? 'male');
    setPhotoUri(person?.photoUri ?? null);
    setLookupHit(person);
    setMasteryName(editingEntry.masteryName ?? '');
    setMason(String(editingEntry.mason ?? ''));
    setMaleSkilled(String(editingEntry.maleSkilled ?? ''));
    setFemaleUnskilled(String(editingEntry.femaleUnskilled ?? ''));
    setOthers(String(editingEntry.others ?? ''));
    setWorkDone(editingEntry.workDone ?? '');
  }, [editingEntry, labourPersonById]);

  const pickImage = async (useCamera) => {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', useCamera ? 'Camera access is required.' : 'Photo library access is required.');
      return;
    }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets?.[0]?.uri) setPhotoUri(result.assets[0].uri);
  };

  const onLookup = () => {
    const found = findLabourByPhone(phone);
    if (found) {
      setLookupHit(found);
      setLabourId(found.id);
      setName(found.name);
      setAge(found.age);
      setGender(found.gender);
      setPhotoUri(found.photoUri);
    } else {
      setLookupHit(null);
      setLabourId(null);
      Alert.alert('Not found', 'No worker with this phone. Fill details below to create a new profile.');
    }
  };

  const canSave = useMemo(() => {
    const digits = phone.replace(/\D/g, '');
    const p = digits.length >= 8;
    const n = name.trim().length >= 2;
    return p && n;
  }, [phone, name]);

  const savePerson = async () => {
    const person = await upsertLabourPerson({
      id: labourId ?? undefined,
      name,
      age,
      gender,
      phone,
      photoUri,
    });
    setLabourId(person.id);
    setLookupHit(person);
    return person;
  };

  const onSave = async () => {
    const person = await savePerson();
    await addLabourEntry(
      projectId,
      {
        id: editingEntry?.id,
        labourId: person.id,
        masteryName,
        mason,
        maleSkilled,
        femaleUnskilled,
        others,
        workDone,
      },
      today,
    );
    navigation.goBack();
  };

  const onDelete = () => {
    if (!editingEntry) return;
    Alert.alert('Remove row', 'Delete this labour line from today?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteLabourEntry(projectId, editingEntry.id, today);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Phone (lookup)</Text>
          <View style={styles.rowPhone}>
            <TextInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              outlineStyle={styles.outline}
              style={[styles.input, styles.inputFlex]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
            <Pressable onPress={onLookup} style={styles.lookupBtn}>
              <Text style={styles.lookupText}>Find</Text>
            </Pressable>
          </View>
          {lookupHit ? (
            <Text style={styles.hint}>Matched: {lookupHit.name}</Text>
          ) : (
            <Text style={styles.hintMuted}>New worker — complete profile, then daily row.</Text>
          )}

          <View style={styles.photoRow}>
            {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : <View style={styles.photoPlaceholder} />}
            <View style={styles.photoActions}>
              <GradientButton title="Take photo" onPress={() => pickImage(true)} colors={['#0f766e', '#14b8a6']} />
              <GradientButton
                title="Gallery"
                onPress={() => pickImage(false)}
                colors={['#334155', '#64748b']}
                style={styles.mt8}
              />
            </View>
          </View>

          <TextInput
            label="Full name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            keyboardType="numeric"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <Text style={styles.label}>Gender</Text>
          <SegmentedButtons
            value={gender}
            onValueChange={setGender}
            buttons={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            style={styles.segment}
            theme={{
              colors: {
                secondaryContainer: 'rgba(125,211,252,0.2)',
                onSecondaryContainer: colors.text,
                outline: colors.outline,
              },
            }}
          />

          <Text style={styles.section}>Daily labour row</Text>
          <TextInput
            label="Masonry / party name"
            value={masteryName}
            onChangeText={setMasteryName}
            mode="outlined"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />
          <View style={styles.grid2}>
            <TextInput
              label="Mason"
              value={mason}
              onChangeText={setMason}
              mode="outlined"
              keyboardType="numeric"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
            <TextInput
              label="Male / skilled"
              value={maleSkilled}
              onChangeText={setMaleSkilled}
              mode="outlined"
              keyboardType="numeric"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
          </View>
          <View style={styles.grid2}>
            <TextInput
              label="Female / unskilled"
              value={femaleUnskilled}
              onChangeText={setFemaleUnskilled}
              mode="outlined"
              keyboardType="numeric"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
            <TextInput
              label="Others"
              value={others}
              onChangeText={setOthers}
              mode="outlined"
              keyboardType="numeric"
              outlineStyle={styles.outline}
              style={[styles.input, styles.half]}
              textColor={colors.text}
              theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
            />
          </View>
          <TextInput
            label="Work done / measurements"
            value={workDone}
            onChangeText={setWorkDone}
            mode="outlined"
            multiline
            numberOfLines={3}
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#7dd3fc', outline: colors.outline, background: 'transparent' } }}
          />

          <GradientButton
            title={editingEntry ? "Update today's row" : "Add to today's list"}
            onPress={async () => {
              if (!phone.trim() || name.trim().length < 2) {
                Alert.alert('Missing info', 'Enter phone and name.');
                return;
              }
              await onSave();
            }}
            disabled={!canSave}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />

          {editingEntry ? (
            <Pressable onPress={onDelete} style={styles.deleteWrap}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#fca5a5" />
              <Text style={styles.deleteText}>Remove from today</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 8 },
  rowPhone: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 6 },
  inputFlex: { flex: 1 },
  input: { backgroundColor: 'transparent', marginBottom: 12 },
  outline: { borderRadius: 14 },
  lookupBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(125,211,252,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.35)',
  },
  lookupText: { color: '#7dd3fc', fontWeight: '900' },
  hint: { color: '#86efac', marginBottom: 12, fontWeight: '700' },
  hintMuted: { color: colors.mutedText, marginBottom: 12 },
  photoRow: { flexDirection: 'row', gap: 14, marginBottom: 14, alignItems: 'center' },
  photo: { width: 96, height: 96, borderRadius: 16, backgroundColor: '#111' },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  photoActions: { flex: 1, gap: 8 },
  mt8: { marginTop: 0 },
  segment: { marginBottom: 14 },
  section: { color: colors.text, fontWeight: '900', fontSize: 16, marginVertical: 10 },
  grid2: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  deleteWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, justifyContent: 'center' },
  deleteText: { color: '#fca5a5', fontWeight: '800' },
});
