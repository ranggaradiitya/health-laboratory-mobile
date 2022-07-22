import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import arrowUp from '../assets/images/outline_arrow_upward_white_24dp.png';

export default function FloatingButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={arrowUp} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
    opacity: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});
