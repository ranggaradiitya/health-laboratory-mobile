import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import rajaerbaLogo from '../assets/images/rajaerba-icon.png';
import globalStyles from '../../styles';

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={rajaerbaLogo} style={styles.logo} />
      <Text style={[styles.title, globalStyles.setFontBold]}>Rajaerba - Health Laboratory</Text>
      <Text style={[styles.description, globalStyles.setFont]}>
        PT Rajaerba Indochem is a company that sells medical and laboratory equipment products that have been registered with the Ministry of Health.
      </Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.loginBtnWrapper}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={[styles.loginBtn, globalStyles.setFontBold]}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registrationBtnWrapper}
          onPress={() => navigation.navigate('RegistrationScreen')}
        >
          <Text style={[styles.registrationBtn, globalStyles.setFontBold]}>REGISTER</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 25,
  },
  buttonGroup: {
    width: '90%',
    marginTop: 15,
  },
  loginBtnWrapper: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginBtn: {
    color: 'white',
    fontSize: 16,
  },
  registrationBtnWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderColor: 'orange',
    borderWidth: 1,
  },
  registrationBtn: {
    color: 'orange',
    fontSize: 16,
  },
});
