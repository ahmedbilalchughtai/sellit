import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { useUser } from '../context/Usercontext';

export default function Profile() {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { user, updateUserData } = useUser(); // Retrieve the current user from context

  useEffect(() => {
    const fetchUserData = async () => {};

    fetchUserData();
  }, [updateUserData]);

  const handleViewProfile = () => {
    navigation.navigate('MyProfile');
  };

  const handleMyAds = () => {
    navigation.navigate('Ads');
  };

  const handleLogOut = async () => {
    try {
      await signOut();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{'Welcome'}</Text>
        <TouchableOpacity onPress={handleViewProfile}>
          <Text style={styles.viewProfile}>Edit Profile &gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={handleMyAds}>
          <Text style={styles.cardText}>My Ads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleLogOut}>
          <Text style={styles.cardText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  header: {
    padding: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 32,
    color: '#0A74DA', // Dark blue for a professional look
    marginBottom: 8,
  },
  viewProfile: {
    fontSize: 18,
    color: '#0A74DA', // Same dark blue for consistency
  },
  cardContainer: {
    margin: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#187BCD', // Light blue for a clean button style
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    color: '#FFFFFF', // White text for readability on the light blue background
  },
});
