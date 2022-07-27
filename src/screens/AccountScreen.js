import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useLayoutEffect} from 'react';
import MenuButton from '../components/MenuButton';
import GlobalStyles from '../../styles';
import {Context} from '../../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen({navigation}) {
  const [newEmail, setNewEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState('');

  const {state, dispatch} = useContext(Context);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      headerLeft: false,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <MenuButton marginRight={12} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleChangeEmail = async () => {
    if (newEmail === '') {
      Alert.alert('Warning', 'Email cannot be empty');
      return;
    }

    // email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Warning', 'Email is not valid');
      return;
    }

    if (newEmail === state.userToken.email) {
      Alert.alert('Warning', 'Email is the same');
      return;
    }

    try {
      const updatedEmail = {email: newEmail};
      await axios.patch(
        `https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users/${state.userToken.id}.json`,
        updatedEmail,
      );
      await AsyncStorage.setItem(
        'userToken',
        JSON.stringify({...state.userToken, email: newEmail}),
      );
      dispatch({type: 'UPDATE_EMAIL', payload: newEmail});
      Alert.alert('Success', 'Email has been updated');
      setNewEmail('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChnagePassword = async () => {
    if (newPassword === '' || newPasswordConfirm === '') {
      Alert.alert('Warning', 'Password or Confirm Password cannot be empty');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      Alert.alert('Warning', 'Password does not match');
      return;
    }

    try {
      const updatedPassword = {password: newPassword};
      await axios.patch(
        `https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users/${state.userToken.id}.json`,
        updatedPassword,
      );
      await AsyncStorage.setItem(
        'userToken',
        JSON.stringify({...state.userToken, password: newPassword}),
      );
      dispatch({type: 'UPDATE_PASSWORD', payload: newPassword});
      Alert.alert('Success', 'Password has been updated');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.addressWrapper}>
          <Text style={[styles.label, GlobalStyles.setFontBold]}>
            New Email
          </Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="Enter your full name"
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
            <Text style={[styles.buttonText, GlobalStyles.setFontBold]}>
              Change Email
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>
            New Password
          </Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="Enter your full name"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>
            Confirm New Password
          </Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="Enter your full name"
            value={newPasswordConfirm}
            onChangeText={setNewPasswordConfirm}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChnagePassword}>
            <Text style={[styles.buttonText, GlobalStyles.setFontBold]}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  addressWrapper: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  divider: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
    margin: 20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
