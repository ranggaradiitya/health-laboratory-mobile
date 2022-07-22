import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import ShoppingCartIcon from '../assets/images/outline_shopping_cart_black_24dp.png';
import { Context } from '../../App';

export default function ShoppingCart() {
  const { state } = useContext(Context);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => state.menuScreenNavigation.navigate('CartDetailsScreen')}>
        <Image source={ShoppingCartIcon} style={styles.icon} />
        {state.productInCart.length > 0 && <Text style={styles.quantity}>{state.productInCart.length}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: 'orange',
  },
  quantity: {
    fontSize: 10,
    color: 'white',
    backgroundColor: 'orange',
    paddingTop: 4,
    borderRadius: 100,
    marginLeft: 5,
    width: 23,
    height: 23,
    textAlign: 'center',
    position: 'absolute',
    top: -7,
    right: -7,
  },
});
