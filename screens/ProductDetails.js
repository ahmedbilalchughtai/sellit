import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/Cartctx'; // Assuming this is your cart context

const { width, height } = Dimensions.get('window');

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const { cartItems, addToCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = () => {
    try {
      const isProductInCart = cartItems.some(item => item.id === product.id);
      if (isProductInCart) {
        Alert.alert('Product Already in Cart', 'This item is already in your cart.');
        return;
      }
      addToCart(product);
      console.log('Added to cart:', product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderImage = ({ item, index }) => (
    <TouchableOpacity onPress={() => openImageModal(index)}>
      <Image
        source={{ uri: item }}
        style={[styles.productImage, { resizeMode: 'contain' }]}
        onError={error => console.error('Image loading error:', error)}
      />
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={product.imageUris}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={getItemLayout}
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>PKR {product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.condition}>Condition: {product.condition}</Text>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.addToCartButtonContainer}
      >
        <Button mode="contained" onPress={handleAddToCart} style={styles.addToCartButton} labelStyle={styles.addToCartButtonText}>
          Add to Cart
        </Button>
      </LinearGradient>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCloseModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={styles.modalCloseText}>X</Text>
          </TouchableOpacity>
          <FlatList
            data={product.imageUris}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.fullscreenImage}
                resizeMode="contain" // Preserve aspect ratio and fit within the container
              />
            )}
            horizontal
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={getItemLayout}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    productImage: {
        justifyContent: 'center',
        width: width - 40,
        height: 320,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#187BCD',
    },
    price: {
        fontSize: 20,
        color: '#187BCD',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#999',
    },
    condition: {
        fontSize: 16,
        color: '#187BCD',
    },
    addToCartButtonContainer: {
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
    },
    addToCartButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#187BCD'
    },
    addToCartButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenImage: {
        width: width,
        height: height * 1.0, // Set height to 80% of the screen height
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    modalCloseText: {
        fontSize: 24,
        color: '#fff',
    },
});

export default ProductDetails;
