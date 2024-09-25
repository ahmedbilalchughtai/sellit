import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';

export default function Home() {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        // Fetch the current user
        const auth = getAuth();
        const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
            const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
            console.log('Fetched Products:', productsList); // Debugging line to check product data
        }, (error) => {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'Failed to fetch products');
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const filteredProducts = products.filter(product => {
        const matchesQuery = product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        
        // Price range filtering
        const price = parseFloat(product.price);
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        const withinPriceRange = price >= min && price <= max;
        
        return matchesQuery && matchesCategory && withinPriceRange;
    });

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <TouchableOpacity onPress={() => handleProductPress(item)}>
                {item.imageUris && item.imageUris.length > 0 ? (
                    <Image
                        source={{ uri: item.imageUris[0] }} // Display the first image
                        style={styles.productImage}
                        onError={() => console.log('Image load error')}
                    />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>PKR {item.price}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search Products"
                placeholderTextColor="#A59FCF"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
                <Picker.Item label="All Categories" value="All Categories" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="Fashion" value="Fashion" />
                <Picker.Item label="Home & Kitchen Appliances" value="Home & Kitchen Appliances" />
                <Picker.Item label="Beauty" value="Beauty" />
                <Picker.Item label="Mobiles" value="Mobiles" />
                <Picker.Item label="Vehicles" value="Vehicles" />
                <Picker.Item label="Property" value="Property" />
                <Picker.Item label="Animals" value="Animals" />
                <Picker.Item label="Furniture" value="Furniture" />
                <Picker.Item label="Books" value="Books" />
                <Picker.Item label="Sports" value="Sports" />
                <Picker.Item label="Kids Toys" value="Kids Toys" />
                <Picker.Item label="Laptops" value="Laptops" />
                <Picker.Item label="Tablets" value="Tablets" />
                <Picker.Item label="Headphones" value="Headphones" />
                <Picker.Item label="Clothing" value="Clothing" />
                <Picker.Item label="Wallets" value="Wallets" />
                <Picker.Item label="Other Accessories" value="Other Accessories" />
            </Picker>
            <View style={styles.priceRangeContainer}>
                <TextInput
                    style={styles.priceInput}
                    placeholder="Min Price"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholderTextColor="#A59FCF"
                />
                <TextInput
                    style={styles.priceInput}
                    placeholder="Max Price"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholderTextColor="#A59FCF"
                />
            </View>
            <Text style={styles.title}>Products</Text>
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Darker background
        padding: 20,
    },
    searchBar: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F5F5F5', // Slightly lighter than background
        color: '#187BCD', // Purple for text input
        marginBottom: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#187BCD',
    },
    picker: {
        width: '100%',
        height: 50,
        color: '#187BCD', // Purple for picker items
        marginBottom: 20,
    },
    priceRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceInput: {
        width: '48%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        color: '#187BCD', // Purple for text in price input
        borderWidth: 1,
        borderColor: '#187BCD',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#187BCD', // Purple title
        marginTop: 20,
        marginLeft: 130,
    },
    row: {
        justifyContent: 'space-between',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    productContainer: {
        flex: 1,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    noImageText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
        textAlign: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#187BCD', // Purple for product names
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 16,
        color: '#187BCD', // Purple for product prices
        marginBottom: 10,
        textAlign: 'center',
    },
});
