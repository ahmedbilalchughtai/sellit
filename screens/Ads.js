import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Ads() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = auth.currentUser?.uid;
    const navigation = useNavigation(); // Hook to access navigation

    useEffect(() => {
        if (!userId) {
            Alert.alert('Error', 'User not authenticated');
            setLoading(false);
            return;
        }

        const loadAds = () => {
            const q = query(collection(db, 'products'), where('userId', '==', userId));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                try {
                    const adsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Fetched Ads:', adsList); // Debug log
                    setAds(adsList);
                } catch (error) {
                    console.error('Error processing ads:', error);
                    setError('Failed to process ads');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Error fetching ads:', error);
                Alert.alert('Error', 'Failed to fetch ads');
                setError('Failed to fetch ads');
                setLoading(false);
            });

            return () => unsubscribe(); // Cleanup listener on unmount
        };

        loadAds();
    }, [userId]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            Alert.alert('Success', 'Ad deleted successfully');
        } catch (error) {
            console.error('Error deleting ad:', error);
            Alert.alert('Error', 'Failed to delete ad');
        }
    };

    const handlePress = (ad) => {
        navigation.navigate('AdDetails', { ad }); // Navigate to AdDetails screen
    };

    const renderAd = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>PKR {item.price}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton} onPress={() => handlePress(item)}>
                <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>Error: {error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={ads}
                keyExtractor={item => item.id}
                renderItem={renderAd}
                contentContainerStyle={styles.list}
            />
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
        padding: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#187BCD',
    },
    price: {
        fontSize: 16,
        color: '#187BCD',
        marginVertical: 10,
    },
    deleteButton: {
        backgroundColor: '#187BCD',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    detailsButton: {
        backgroundColor: '#187BCD',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    errorText: {
        color: '#FF3D3D',
        fontSize: 18,
        textAlign: 'center',
    },
});
