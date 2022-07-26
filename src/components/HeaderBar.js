import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import SearchBar from './SearchBar';
import ShoppingCart from './ShoppingCart';
import MenuButton from './MenuButton';

export default function HeaderBar({ navigation }) {
  return (
    <View style={styles.container}>
      <SearchBar />
      <TouchableOpacity onPress={() => navigation.navigate('CartDetailsScreen')}>
        <ShoppingCart />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <MenuButton />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
