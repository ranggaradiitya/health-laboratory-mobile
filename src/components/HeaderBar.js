import { StyleSheet, View } from 'react-native';
import React from 'react';
import SearchBar from './SearchBar';
import ShoppingCart from './ShoppingCart';
import MenuButton from './MenuButton';

export default function HeaderBar() {
  return (
    <View style={styles.container}>
      <SearchBar />
      <ShoppingCart />
      <MenuButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
