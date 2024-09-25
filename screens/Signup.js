import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate password length
    const isPasswordValid = (password) => {
        return password.length >= 6;
    };

    const handleSignup = async () => {
        if (fullName && email && password && confirmPassword) {
            if (!isPasswordValid(password)) {
                Alert.alert('Error', 'Password should be at least 6 characters long.');
                return;
            }

            if (password === confirmPassword) {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    Alert.alert('Signup Successful', `Welcome, ${fullName}!`);
                    navigation.navigate('Login'); // Navigate to the Login screen
                } catch (err) {
                    Alert.alert('Signup Error', err.message);
                }
            } else {
                Alert.alert('Error', 'Your passwords do not match.');
            }
        } else {
            Alert.alert('Error', 'Please fill out all fields.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Register</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#A0A0A0"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#A0A0A0"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#0288D1" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#A0A0A0"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#0288D1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Log In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',  // Light background
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0288D1', // Dark blue title
        marginBottom: 20,
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 1, // Adds underline
        borderBottomColor: '#0288D1', // Underline color
        color: '#0288D1', // Dark blue text
        marginBottom: 20,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#0288D1', // Dark blue button background
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    loginText: {
        fontSize: 16,
        color: '#333',
        marginTop: 20,
    },
    loginLink: {
        fontSize: 16,
        color: '#0288D1',
        fontWeight: 'bold',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5, // Space between inputs
    },
    icon: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
});
