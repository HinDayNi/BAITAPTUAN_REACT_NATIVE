import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartSummary({ totalItems, totalPrice }) {
  return (
    <View style={styles.summary}>
      <Text style={styles.text}>{totalItems} sản phẩm | Tổng tiền: {totalPrice} đ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: 12 },
  text: { fontSize: 16 }
});