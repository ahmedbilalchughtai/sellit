import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth, storage } from '../config/firebase'; // Import storage
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

export default function Sell() {
    const navigation = useNavigation();
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('new');
    const [category, setCategory] = useState('Mobiles');
    const [images, setImages] = useState([]); // For storing URLs

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const imageUris = result.assets || [];
            const uploadedImageUrls = [];

            // Upload each image to Firebase Storage
            for (const image of imageUris) {
                const storageRef = ref(storage, `images/${Date.now()}_${image.uri.split('/').pop()}`);
                const response = await fetch(image.uri);
                const blob = await response.blob();
                const snapshot = await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(downloadURL);
            }

            setImages(uploadedImageUrls); // Set the URLs as images
        }
    };

    const handleSubmit = async () => {
        if (!productName || !price || !description || images.length === 0 || !category) {
            Alert.alert('Error', 'Please fill in all fields and select at least one image.');
            return;
        }

        const userId = auth.currentUser.uid; 
        const newProduct = {
            name: productName,
            price,
            description,
            condition,
            category,
            imageUrls: images, // Store the URLs from Firebase Storage
            userId,
        };

        try {
            await addDoc(collection(db, 'products'), newProduct);
            Alert.alert('Success', 'Product details submitted successfully!');
            resetForm();
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const resetForm = () => {
        setProductName('');
        setPrice('');
        setDescription('');
        setCondition('new');
        setCategory('Mobiles');
        setImages([]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name:</Text>
                <TextInput
                    style={styles.input}
                    value={productName}
                    onChangeText={setProductName}
                    placeholder="Enter product name"
                    placeholderTextColor="#888"
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Price:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Enter price"
                    placeholderTextColor="#888"
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter product description"
                    placeholderTextColor="#888"
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Condition</Text>
                <Picker
                    selectedValue={condition}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCondition(itemValue)}
                >
                    <Picker.Item label="New" value="new" />
                    <Picker.Item label="Used" value="used" />
                </Picker>
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <Picker
                    selectedValue={category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    {/* Add more categories here */}
                    <Picker.Item label="Electronics" value="Electronics" />
                    <Picker.Item label="Fashion" value="Fashion" />
                    {/* Add other categories */}
                </Picker>
            </View>
            
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                <Text style={styles.imagePickerButtonText}>Pick Images</Text>
            </TouchableOpacity>
            
            {images.length > 0 && (
                <View style={styles.imagesContainer}>
                    {images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.image} />
                    ))}
                </View>
            )}
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0A74DA',
        marginTop: 40,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#0A74DA',
    },
    input: {
        height: 40,
        borderColor: '#0A74DA',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        backgroundColor: '#F5F5F5',
        color: '#0A74DA',
        width: '100%',
    },
    textArea: {
        height: 120,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
        color: '#0A74DA',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    imagePickerButton: {
        backgroundColor: '#0A74DA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    imagePickerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    image: {
        width: '48%',
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#0A74DA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
