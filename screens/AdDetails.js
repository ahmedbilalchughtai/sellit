import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function AdDetails({ route }) {
    const { ad } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{ uri: ad.imageUris && ad.imageUris.length > 0 ? ad.imageUris[0] : 'https://via.placeholder.com/150' }}
                style={styles.image}
            />
            <Text style={styles.title}>{ad.name}</Text>
            <Text style={styles.price}>PKR {ad.price}</Text>
            <Text style={styles.description}>{ad.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0A74DA',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#000',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#000',
    },
});
