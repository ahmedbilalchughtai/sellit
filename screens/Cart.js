import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useCart } from '../context/Cartctx'; // Import useCart
import { MaterialIcons } from '@expo/vector-icons'; // Import icons
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation and useRoute
import { Picker } from '@react-native-picker/picker';

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCart(); // Use cart and removeFromCart from context
    const navigation = useNavigation(); // Use navigation
    const route = useRoute(); // Get route parameters

    const [isModalVisible, setModalVisible] = useState(false);
    const [isConfirmationVisible, setConfirmationVisible] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
        paymentMethod: 'Cash on Delivery',
    });

    useEffect(() => {
        if (route.params?.orderPlaced) {
            setConfirmationVisible(true); // Show confirmation modal if orderPlaced parameter exists
        }
    }, [route.params?.orderPlaced]);

    const handleRemove = (id) => {
        removeFromCart(id); // Remove item from cart
    };

    const handleBuyNow = () => {
        setModalVisible(true); // Show the modal
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const { firstName, lastName, email, contactNumber, address } = formData;

        if (!firstName || !lastName || !email || !contactNumber || !address) {
            Alert.alert('Please fill in all the fields');
            return;
        }

        // Handle form submission here (e.g., send data to a server)
        setModalVisible(false); // Close the modal
        clearCart(); // Clear the cart
        setFormData({ // Reset form fields
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            address: '',
            paymentMethod: 'Cash on Delivery',
        });
        navigation.navigate('Cart', { orderPlaced: true }); // Navigate back to Cart screen with parameter
    };

    const handleBack = () => {
        setModalVisible(false); // Close the modal
    };

    const calculateTotalCost = () => {
        return cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>PKR {item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.list}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total Cost: PKR {calculateTotalCost()}</Text>
                    </View>
                    <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                        <Text style={styles.buyNowButtonText}>Place Order</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Modal for billing information */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Billing Information</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contact Number"
                            keyboardType="phone-pad"
                            value={formData.contactNumber}
                            onChangeText={(text) => handleChange('contactNumber', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                        />
                        <Picker
                            selectedValue={formData.paymentMethod}
                            style={styles.picker}
                            onValueChange={(itemValue) => handleChange('paymentMethod', itemValue)}
                        >
                            <Picker.Item label="Cash on Delivery" value="Cash on Delivery" />
                            <Picker.Item label="Credit/Debit Card" value="Credit/Debit Card" />
                        </Picker>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, styles.backButton]}
                                onPress={handleBack}
                            >
                                <Text style={styles.submitButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                visible={isConfirmationVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setConfirmationVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Order Confirmed</Text>
                        <Text style={styles.confirmationText}>
                            Congratulations, your order is confirmed. Thanks for Shopping!
                        </Text>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                                clearCart(); // Clear the cart
                                setConfirmationVisible(false); // Close the confirmation modal
                            }}
                        >
                            <Text style={styles.submitButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        padding: 15,
        marginBottom: 25,
        marginTop: 25,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#187BCD', // Green color for the title
    },
    price: {
        fontSize: 14,
        color: '#187BCD', // Changed to white for better contrast
        marginVertical: 5,
    },
    removeButton: {
        position: 'absolute',
        right: 10,
        top: 20,
        backgroundColor: '#187BCD', // Green color for remove button
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#187BCD', // Green color for empty cart message
        textAlign: 'center',
        marginTop: 50,
    },
    totalContainer: {
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#187BCD', // Changed to white for better contrast
    },
    buyNowButton: {
        backgroundColor: '#187BCD', // Green color for buy now button
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buyNowButtonText: {
        color: '#F5F5F5',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        marginBottom: 15,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#187BCD', // Green color for submit button
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    backButton: {
        backgroundColor: '#187BCD', // Coral color for back button
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    confirmationText: {
        textAlign: 'center',
        marginBottom: 20,
    },
});
