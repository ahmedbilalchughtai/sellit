import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Dialog from 'react-native-dialog';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handleLogin = async () => {
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert('Login Successful', `Welcome back!`);
                navigation.navigate('Home'); // Navigate to the Home screen
            } catch (err) {
                Alert.alert('Login Error', err.message);
            }
        } else {
            Alert.alert('Error', 'Please fill out all fields.');
        }
    };

    const handleForgotPassword = () => {
        setDialogVisible(true);
    };

    const handleSendPasswordResetEmail = async () => {
        if (resetEmail) {
            try {
                await sendPasswordResetEmail(auth, resetEmail);
                Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
                setDialogVisible(false);
                setResetEmail('');
            } catch (err) {
                Alert.alert('Error', err.message);
            }
        } else {
            Alert.alert('Error', 'Please enter your email address.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Welcome Back!</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Reset Password</Dialog.Title>
                <Dialog.Description>
                    Enter your email address to receive a password reset link.
                </Dialog.Description>
                <Dialog.Input
                    placeholder="Email Address"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Send" onPress={handleSendPasswordResetEmail} />
            </Dialog.Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light background
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
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#0288D1', // Dark grey color for the forgot password text
        fontWeight: 'bold',
        marginTop: 5,
    },
    signupText: {
        fontSize: 16,
        color: '#333',
        marginTop: 20,
    },
    signupLink: {
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
