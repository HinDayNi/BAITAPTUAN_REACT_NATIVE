import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProductItem({ product, onAdd }) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} đ</Text>
      <Button title="Thêm vào giỏ" onPress={() => onAdd(product)} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16, marginBottom: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ddd',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  name: { fontSize: 16 },
  price: { fontSize: 16, color: 'green', marginRight: 12 }
});