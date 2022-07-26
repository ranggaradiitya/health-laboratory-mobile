import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import rajaerbaLogo from '../assets/images/rajaerba-icon.png';
import globalStyles from '../../styles';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { dispatch } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getFetchUrl = () => {
        return 'https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users.json';
      };
      const fetchData = async () => {
        const response = await axios.get(getFetchUrl());
        const data = response.data;
        setUsers(data);
      };
      fetchData();
    }
  }, [isFocused]);

  const validateLogin = () => (email === '' || password === '') ? false : true;

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = () => {
    if (validateLogin()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Warning', 'Email is not valid');
        return;
      }

      for (const key in users) {
        const user = users[key];
        if (user.email === email && user.password === password) {
          const userData = { ...user, id: key };
          AsyncStorage.setItem('userToken', JSON.stringify(userData));
          dispatch({ type: 'SIGN_IN', payload: userData });
          clearInputs();
          return;
        }
      }
      Alert.alert('Login Failed', 'Invalid email or password');
    } else {
      Alert.alert('Warning', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={rajaerbaLogo} style={styles.logo} />
      <Text style={[styles.title, globalStyles.setFontBold]}>Welcome back.</Text>
      <View style={styles.formGroup}>
        <TextInput placeholder="Email" style={[styles.input, globalStyles.setFont]} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={[styles.input, globalStyles.setFont]} value={password} onChangeText={setPassword} secureTextEntry={true} />
        <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
          <Text style={[styles.button, globalStyles.setFontBold]}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerWrapper}>
        <Text style={globalStyles.setFont}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => { navigation.navigate('RegistrationScreen'); clearInputs(); }}>
          <Text style={[globalStyles.setFontBold, styles.registerLink]}>Register</Text>
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
    marginBottom: 10,
  },
  formGroup: {
    width: '90%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    width: '100%',
    backgroundColor: 'white',
  },
  buttonWrapper: {
    width: '100%',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
    color: '#fff',
  },
  registerWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerLink: {
    color: 'orange',
    marginLeft: 5,
  },
});
