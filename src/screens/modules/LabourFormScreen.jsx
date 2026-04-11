import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
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
import { SegmentedButtons } from 'react-native-paper';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourFormScreen({ route, navigation }) {
  const { labourId: routeLabourId } = route.params || {};
  const {
    findLabourByPhone,
    upsertLabourPerson,
    labourPersonById,
  } = useApp();

  const [phone, setPhone] = useState('');
  const [lookupHit, setLookupHit] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [photoUri, setPhotoUri] = useState(null);
  const [labourId, setLabourId] = useState(null);

  useEffect(() => {
    if (!routeLabourId) return;
    const person = labourPersonById(routeLabourId);
    if (!person) return;
    setLabourId(routeLabourId);
    setPhone(person?.phone ?? '');
    setName(person?.name ?? '');
    setAge(person?.age ?? '');
    setGender(person?.gender ?? 'male');
    setPhotoUri(person?.photoUri ?? null);
    setLookupHit(person);
  }, [routeLabourId, labourPersonById]);

  const pickImage = async (useCamera) => {
  const perm = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!perm.granted) {
    Alert.alert('Permission needed', useCamera ? 'Camera access is required.' : 'Photo library access is required.');
    return;
  }

  const result = useCamera
    ? await ImagePicker.launchCameraAsync({
        mediaTypes: [ImagePicker.MediaType.image],  // ✅ add this
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.image],  // ✅ add this
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

  if (!result.canceled && result.assets?.[0]?.uri) {
    setPhotoUri(result.assets[0].uri);
  }
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

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Phone (lookup)</Text>
          <View style={styles.rowPhone}>
            <AppTextField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, styles.inputFlex]}
              placeholder="Search by phone number"
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
              <GradientButton title="Take photo" onPress={() => pickImage(true)} colors={['#2f86de', '#62b6ff']} />
              <GradientButton
                title="Gallery"
                onPress={() => pickImage(false)}
                colors={['#2f86de', '#62b6ff']}
                style={styles.mt8}
              />
            </View>
          </View>

          <AppTextField
            label="Full name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter labour name"
          />
          <AppTextField
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter age"
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

          <GradientButton
            title={routeLabourId ? 'Update labour' : 'Save labour'}
            onPress={async () => {
              if (!phone.trim() || name.trim().length < 2) {
                Alert.alert('Missing info', 'Enter phone and name.');
                return;
              }
              await savePerson();
              navigation.goBack();
            }}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 8 },
  rowPhone: { flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginBottom: 6 },
  inputFlex: { flex: 1 },
  input: { marginBottom: 12 },
  lookupBtn: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(59,144,232,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(59,144,232,0.28)',
  },
  lookupText: { color: '#215da1', fontWeight: '900' },
  hint: { color: '#137333', marginBottom: 12, fontWeight: '700' },
  hintMuted: { color: colors.mutedText, marginBottom: 12 },
  photoRow: { flexDirection: 'row', gap: 14, marginBottom: 14, alignItems: 'center' },
  photo: { width: 96, height: 96, borderRadius: 18, backgroundColor: '#dbeafe' },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  photoActions: { flex: 1, gap: 8 },
  mt8: { marginTop: 0 },
  segment: { marginBottom: 14 },
});
