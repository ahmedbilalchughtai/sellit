import React, { createContext, useState, useContext } from 'react';

// Create the CartContext
const CartContext = createContext();

// Provide the CartContext to children components
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Add an item to the cart
    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    // Remove an item from the cart
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    // Clear all items from the cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use the CartContext
export function useCart() {
    return useContext(CartContext);
}
