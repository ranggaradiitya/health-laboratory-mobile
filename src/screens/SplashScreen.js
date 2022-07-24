import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import rajaerbaLogo from '../assets/images/rajaerba-icon.png';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={rajaerbaLogo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
});
