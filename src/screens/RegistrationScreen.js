import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import rajaerbaLogo from '../assets/images/rajaerba-icon.png';
import globalStyles from '../../styles';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function RegistrationScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getUsers();
    }
  }, [isFocused]);

  const getUsers = async () => {
    try {
      const response = await axios.get('https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users.json');
      setUsers(response.data);
    } catch (error) {
      console.err(error);
    }
  };

  const validateRegister = () => (name === '' || email === '' || password === '') ? false : true;

  const isEmailExist = () => {
    for (const key in users) {
      const user = users[key];
      if (user.email === email) {
        return true;
      }
    }
    return false;
  };

  const handleregister = async () => {
    if (validateRegister()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Warning', 'Email is not valid');
        return;
      }

      if (isEmailExist()) {
        Alert.alert('Registration Failed', 'Email already exist');
        return;
      }
      try {
        const newUser = {
          address: '',
          birthDate: '',
          email: email,
          fullName: name,
          gender: '',
          password: password,
          phoneNumber: '',
          role: 'user',
          userName: '',
        };
        await axios.post('https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users.json', newUser);
        navigation.navigate('LoginScreen');
      } catch (error) {
        console.err(error);
        Alert.alert('Registration Failed', 'Please try again');
      }
    } else {
      Alert.alert('Warning', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={rajaerbaLogo} style={styles.logo} />
      <Text style={[styles.title, globalStyles.setFontBold]}>Create Account</Text>
      <View style={styles.formGroup}>
        <TextInput placeholder="Full Name" style={[styles.input, globalStyles.setFont]} sytle={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={[styles.input, globalStyles.setFont]} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={[styles.input, globalStyles.setFont]} secureTextEntry={true} value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.buttonWrapper} onPress={handleregister}>
          <Text style={[styles.button, globalStyles.setFontBold]}>REGISTER</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginWrapper}>
        <Text style={globalStyles.setFont}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={[globalStyles.setFontBold, styles.loginLink]}>Login</Text>
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
  loginWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginLink: {
    color: 'orange',
    marginLeft: 5,
  },
});
