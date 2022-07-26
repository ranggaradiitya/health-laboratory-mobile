import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import MenuIcon from '../assets/images/outline_menu_black_24dp.png';

export default function MenuButton({ marginRight }) {
  return (
    <View style={styles.container}>
      <Image source={MenuIcon} style={[styles.menuIcon, {
        marginRight: marginRight,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
  },
  menuIcon: {
    width: 40,
    height: 40,
    tintColor: 'orange',
  },
});
