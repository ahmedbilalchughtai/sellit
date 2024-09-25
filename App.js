import React from 'react';
import { ProductProvider } from './ProductContext'; // Adjust the path as needed
import AppNavigation from './navigation/appNavigation';

export default function App() {
  return (
    <ProductProvider>
      <AppNavigation />
    </ProductProvider>
  );
}
    