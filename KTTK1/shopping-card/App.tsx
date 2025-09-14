import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductList from './ProductList';
import CartSummary from './CartSummary';

const PRODUCTS = [
  { id: '1', name: 'Sản phẩm A', price: 100000 },
  { id: '2', name: 'Sản phẩm B', price: 200000 },
  { id: '3', name: 'Sản phẩm C', price: 150000 },
];

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
      <ProductList products={PRODUCTS} onAdd={addToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});