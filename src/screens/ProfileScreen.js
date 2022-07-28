import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import MenuButton from '../components/MenuButton';
import GlobalStyles from '../../styles';
import { Context } from '../../App';
import DatePicker from 'react-native-modern-datepicker';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useContext(Context);

  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const [name, setName] = useState(state.userToken.fullName ? state.userToken.fullName : '');
  const [username, setUsername] = useState(state.userToken.userName ? state.userToken.userName : '');
  const [email, setEmail] = useState(state.userToken.email);
  const [phoneNumber, setPhoneNumber] = useState(state.userToken.phoneNumber ? state.userToken.phoneNumber : '');
  const [address, setAddress] = useState(state.userToken.address ? state.userToken.address : '');
  const [cardNumber, setCardNumber] = useState(state.userToken.cardDetails?.cardNumber ? state.userToken.cardDetails.cardNumber : '');
  const [cardName, setCardName] = useState(state.userToken.cardDetails?.cardName ? state.userToken.cardDetails.cardName : '');
  const [cardExpiry, setCardExpiry] = useState(state.userToken.cardDetails?.expiredDate ? state.userToken.cardDetails.expiredDate : '');
  const [cardCVV, setCardCVV] = useState(state.userToken.cardDetails?.cvv ? state.userToken.cardDetails.cvv : '');

  const [selectedDate, setSelectedDate] = useState(state.userToken.birthDate ? state.userToken.birthDate : '');
  const [isDataPickerClicked, setIsDataPickerClicked] = useState(false);
  const [gender, setGender] = useState(state.userToken.gender ? state.userToken.gender : '');

  useEffect(() => {
    if (isFocused) {
      getUser();
    }
  }, [getUser, isFocused, state.userToken, updateFormWhenRefresh]);

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

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const updateFormWhenRefresh = useCallback(() => {
    setName(state.userToken.fullName ? state.userToken.fullName : '');
    setUsername(state.userToken.userName ? state.userToken.userName : '');
    setEmail(state.userToken.email ? state.userToken.email : '');
    setPhoneNumber(state.userToken.phoneNumber ? state.userToken.phoneNumber : '');
    setSelectedDate(state.userToken.birthDate ? state.userToken.birthDate : '');
    setGender(state.userToken.gender ? state.userToken.gender : '');
    setAddress(state.userToken.address ? state.userToken.address : '');
    setCardNumber(state.userToken.cardDetails?.cardNumber ? state.userToken.cardDetails.cardNumber : '');
    setCardName(state.userToken.cardDetails?.cardName ? state.userToken.cardDetails.cardName : '');
    setCardExpiry(state.userToken.cardDetails?.expiredDate ? state.userToken.cardDetails.expiredDate : '');
    setCardCVV(state.userToken.cardDetails?.cvv ? state.userToken.cardDetails.cvv : '');
  }, [state.userToken]);

  const getUser = useCallback(() => {
    const getFetchUrl = () => {
      return `https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users/${state.userToken.id}.json`;
    };
    const fetchData = async () => {
      const response = await axios.get(getFetchUrl());
      const data = response.data;
      await AsyncStorage.setItem('userToken', JSON.stringify({ ...data, id: state.userToken.id }));
      dispatch({ type: 'RESTORE_TOKEN', payload: { ...data, id: state.userToken.id } });
    };
    fetchData();
  }, [dispatch, state.userToken.id]);

  const handleUpdateProfile = async () => {
    if (name === '') {
      Alert.alert('Warning', 'Please enter your name');
      return;
    }
    try {
      const updatedUser = {
        address,
        gender,
        phoneNumber,
        birthDate: selectedDate,
        fullName: name,
        userName: username,
        cardDetails: {
          cardName,
          cardNumber,
          expiredDate: cardExpiry,
          cvv: cardCVV,
        },
      };
      await axios.patch(`https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/users/${state.userToken.id}.json`, updatedUser);
      await AsyncStorage.setItem('userToken', JSON.stringify({
        ...state.userToken,
        ...updatedUser,
      }));
      dispatch({ type: 'UPDATE_USER_TOKEN', payload: updatedUser });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await wait(2000);
              getUser();
              updateFormWhenRefresh();
              setRefreshing(false);
            }}
          />
        }
      >
        <View style={styles.formWrapper}>
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Full Name</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="Enter your full name" value={name} onChangeText={setName} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Username</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="Enter your username" value={username} onChangeText={setUsername} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Email</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} value={email} editable={false} selectTextOnFocus={false} />
          <Text style={[styles.label, GlobalStyles.setFont, { marginTop: -5, fontSize: 12 }]}>Change email can only in Accouunt Menu.</Text>
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Phone Number</Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text.replace(/[^0-9]/g, ''));
            }}
            maxLength={15}
            keyboardType="numeric"
          />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Birth Date</Text>
          <TouchableOpacity
            onPress={() => {
              if (isDataPickerClicked) {
                setIsDataPickerClicked(false);
              } else {
                setIsDataPickerClicked(true);
              }
            }}
          >
            <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="yyyy-mm-dd" value={selectedDate} editable={false} selectTextOnFocus={false} />
          </TouchableOpacity>
          {isDataPickerClicked && (
            <DatePicker
              options={{
                mainColor: 'orange',
              }}
              mode="calendar"
              onSelectedChange={date => {
                const dateString = date.toString().replace(/\//g, '-');
                setSelectedDate(dateString);
                isDataPickerClicked && setIsDataPickerClicked(false);
              }}
            />)
          }
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Gender</Text>
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButtonGroup}>
              <RadioButton
                value="Male"
                status={gender !== 'Male' ? 'unchecked' : 'checked'}
                onPress={() => setGender('Male')}
                uncheckedColor="orange"
                color="orange"
              />
              <Text style={[styles.label, styles.RadioButtonText, GlobalStyles.setFont]}>Male</Text>
            </View>
            <View style={styles.radioButtonGroup}>
              <RadioButton
                value="Female"
                status={gender !== 'Female' ? 'unchecked' : 'checked'}
                onPress={() => setGender('Female')}
                uncheckedColor="orange"
                color="orange"
              />
              <Text style={[styles.label, styles.RadioButtonText, GlobalStyles.setFont]}>Female</Text>
            </View>
            <View style={styles.radioButtonGroup}>
              <RadioButton
                value="Other"
                status={gender !== 'Other' ? 'unchecked' : 'checked'}
                onPress={() => setGender('Other')}
                uncheckedColor="orange"
                color="orange"
              />
              <Text style={[styles.label, styles.RadioButtonText, GlobalStyles.setFont]}>Other</Text>
            </View>
          </View>
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Address</Text>
          <Text style={[styles.label, GlobalStyles.setFont]}>Include your country, city, state, and zip code</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="Enter your address" value={address} onChangeText={setAddress} />
        </View>
        <View style={styles.divider} />
        <View style={styles.cardWrapper}>
          <Text
            style={[styles.label, GlobalStyles.setFontBold]}>Card Number</Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChangeText={(text) => {
              setCardNumber(text.replace(/[^0-9]/g, ''));
            }}
            maxLength={12}
            keyboardType="numeric"
          />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Name on Card</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="John Doe" value={cardName} onChangeText={setCardName} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Expiration Date</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="MM / YY" value={cardExpiry} onChangeText={setCardExpiry} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>CVV</Text>
          <TextInput
            style={[styles.input, GlobalStyles.setFont]}
            placeholder="123"
            value={cardCVV}
            onChangeText={(text) => {
              setCardCVV(text.replace(/[^0-9]/g, ''));
            }}
            maxLength={3}
            keyboardType="numeric"
          />
        </View>
      </ScrollView >
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={[styles.buttonText, GlobalStyles.setFontBold]}>UPDATE PROFILE</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  formWrapper: {
    padding: 20,
  },
  divider: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
    margin: 20,
  },
  cardWrapper: {
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
  radioButtonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  RadioButtonText: {
    marginLeft: 3,
    paddingTop: 6,
  },
  buttonWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
