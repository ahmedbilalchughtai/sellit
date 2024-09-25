import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useUser } from '../context/Usercontext';

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

export default function MyProfile() {
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const { updateUserData } = useUser(); // Use the context method to update user data

  useEffect(() => {
    loadProfileData();
  }, []);

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;

    if (user) {
      const profileData = {
        profilePicture,
        name,
        contactNumber,
        dateOfBirth: dateOfBirth.toString(),
        location,
        gender,
      };

      try {
        await setDoc(doc(db, 'users', user.uid), profileData);
        await updateUserData(profileData); // Update user data in context
        Alert.alert('Changes saved!', 'Your profile has been updated.');
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile data.');
      }
    }
  };

  const loadProfileData = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { profilePicture, name, contactNumber, dateOfBirth, location, gender } = docSnap.data();
          setProfilePicture(profilePicture);
          setName(name);
          setContactNumber(contactNumber);
          setDateOfBirth(new Date(dateOfBirth));
          setLocation(location);
          setGender(gender);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={chooseImage}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your date of birth"
              value={dateOfBirth.toDateString()}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0A74DA', // Dark blue for professional look
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A74DA', // Dark blue for consistency
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5', // Dark background for input
    elevation: 2,
    color: '#999',
  },
  picker: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#F5F5F5', // Dark background for picker
    elevation: 1,
    color: '#999',
  },
  dateInputContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#187BCD', // Light blue for button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
