import React from 'react';
import { FlatList } from 'react-native';
import ProductItem from './ProductItem';

export default function ProductList({ products, onAdd }) {
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ProductItem product={item} onAdd={onAdd} />}
    />
  );
}