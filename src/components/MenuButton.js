import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import MenuIcon from '../assets/images/outline_menu_black_24dp.png';
import { Context } from '../../App';

export default function MenuButton() {
  const { state } = useContext(Context);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => state.menuScreenNavigation.toggleDrawer()}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>
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
