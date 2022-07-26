import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import GlobalStyles from '../../styles';
import { Context } from '../../App';
import axios from 'axios';
import ExpandMoreIcon from '../assets/images/outline_expand_more_black_24dp.png';
import ExpandLessIcon from '../assets/images/outline_expand_less_black_24dp.png';

const Product = ({ name, totalPrice, quantity }) => {
  const getImageUrl = () => {
    const images = [
      {
        name: 'ONSITE Rapid Test',
        imageURL: require('../assets/images/onsite-rapid.png'),
      },
      {
        name: 'ONSITE Swab Test',
        imageURL: require('../assets/images/onsite-swab.png'),
      },
      {
        name: 'ZYBIO Rapid Test',
        imageURL: require('../assets/images/zybio-rapid.png'),
      },
      {
        name: 'ZYBIO Swab Antigen',
        imageURL: require('../assets/images/zybio-swab.png'),
      },
      {
        name: 'ZYBIO Neutralizing Antibody',
        imageURL: require('../assets/images/zybio-antibody.png'),
      },
      {
        name: 'Reagen Detection',
        imageURL: require('../assets/images/reagen.png'),
      },
      {
        name: 'KY-BIO Swab Antigen',
        imageURL: require('../assets/images/kybio-swab.png'),
      },
      {
        name: 'AEHEALTH Neutralizing Antibody',
        imageURL: require('../assets/images/aehealth-antibody.png'),
      },
      {
        name: 'Reagen Extraction',
        imageURL: require('../assets/images/reagen-extraction.png'),
      },
    ];
    let url = '';
    for (let i = 0; i < images.length; i++) {
      if (images[i].name === name) {
        url = images[i].imageURL;
      }
    }
    if (url === '') {
      url = require('../assets/images/blank.png');
    }
    return url;
  };

  const formatRupiah = (money) => {
    return 'Rp' + money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <View style={styles.productContainer}>
      <View style={styles.productImageWrapper}>
        <Image source={getImageUrl()} style={styles.productImage} />
      </View>
      <View style={styles.productInfoWrapper}>
        <Text style={GlobalStyles.setFont}>{name}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={GlobalStyles.setFont}>{formatRupiah(totalPrice)}</Text>
          <Text style={GlobalStyles.setFont}>{quantity} x</Text>
        </View>
      </View>
    </View>
  );
};

const SeeProduct = () => {
  const { state } = useContext(Context);
  const [isExpand, setIsExpand] = useState(false);

  const handleExpand = () => {
    if (isExpand) {
      setIsExpand(false);
    }
    else {
      setIsExpand(true);
    }
  };

  return (
    <View style={styles.seeProductContainer}>
      <View style={styles.seeProductWrapper}>
        <Text style={GlobalStyles.setFontBold}>See Product</Text>
        <TouchableOpacity onPress={handleExpand}>
          <Image source={isExpand ? ExpandLessIcon : ExpandMoreIcon} style={styles.seeProductIcon} />
        </TouchableOpacity>
      </View>
      {isExpand ? (
        state.productInCart.map((product, index) => {
          return (
            <Product
              key={index}
              name={product.name}
              totalPrice={product.totalPrice}
              quantity={product.quantity}
            />
          );
        })
      ) : null}
    </View>
  );
};

const TotalPayment = ({ name, email, phoneNumber, address, cardNumber, cardName, cardExpiry, cardCVV, navigation }) => {
  const dataPayment = [name, email, phoneNumber, address, cardNumber, cardName, cardExpiry, cardCVV];
  const { state, dispatch } = useContext(Context);

  const formatRupiah = (money) => {
    return 'Rp' + money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    for (const product of state.productInCart) {
      totalPrice += Number(product.totalPrice);
    }
    return formatRupiah(totalPrice);
  };

  const validation = () => {
    if (dataPayment.includes('')) {
      return false;
    }
    return true;
  };

  const addPaymentDetails = async () => {
    try {
      const paymentDetails = {
        userId: state.userToken.id,
        name,
        email,
        phoneNumber,
        address,
        cardNumber,
        cardName,
        expiryDate: cardExpiry,
        cvCode: cardCVV,
        totalPrice: getTotalPrice(),
        purchasedProducts: state.productInCart,
        status: 'PENDING',
      };
      await axios.post('https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/paymentDetails.json', paymentDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductStock = async () => {
    try {
      for (const key in state.products) {
        for (const product of state.productInCart) {
          if (product.id === key) {
            await axios.patch(`https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/products/${key}.json`, {
              stock: `${Number(state.products[key].stock) - Number(product.quantity)}`,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrder = async () => {
    if (!validation()) {
      Alert.alert('Warning', 'Please fill all the form');
      return;
    }

    Alert.alert('Confirmation', 'Are you sure to order this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            await addPaymentDetails();
            await updateProductStock();
            Alert.alert('Success', 'Your order has been placed');
            dispatch({ type: 'RESET_PRODUCT_IN_CART' });
            navigation.navigate('Home');
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.totalPaymentContainer}>
      <View>
        <Text style={[styles.totalPayment, GlobalStyles.setFontBold]}>Total Payment:</Text>
        <Text style={[styles.totalPayment, GlobalStyles.setFontBold]}>{getTotalPrice()}</Text>
      </View>
      <TouchableOpacity onPress={handleOrder}>
        <Text style={[styles.order, GlobalStyles.setFontBold]}>ORDER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function PaymentScreen({ navigation }) {
  const { state } = useContext(Context);
  const [name, setName] = useState(state.userToken.fullName ? state.userToken.fullName : '');
  const [email, setEmail] = useState(state.userToken.email);
  const [phoneNumber, setPhoneNumber] = useState(state.userToken.phoneNumber ? state.userToken.phoneNumber : '');
  const [address, setAddress] = useState(state.userToken.address ? state.userToken.address : '');
  const [cardNumber, setCardNumber] = useState(state.userToken.cardDetails?.cardNumber ? state.userToken.cardDetails.cardNumber : '');
  const [cardName, setCardName] = useState(state.userToken.cardDetails?.cardName ? state.userToken.cardDetails.cardName : '');
  const [cardExpiry, setCardExpiry] = useState(state.userToken.cardDetails?.expiredDate ? state.userToken.cardDetails.expiredDate : '');
  const [cardCVV, setCardCVV] = useState(state.userToken.cardDetails?.cvv ? state.userToken.cardDetails.cvv : '');

  return (
    <View style={styles.container}>
      <ScrollView>
        <SeeProduct />
        <View style={styles.addressWrapper}>
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Full Name</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="Enter your full name" value={name} onChangeText={setName} />
          <Text style={[styles.label, GlobalStyles.setFontBold]}>Email</Text>
          <TextInput style={[styles.input, GlobalStyles.setFont]} placeholder="Enter your email" value={email} onChangeText={setEmail} />
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
      <TotalPayment
        name={name}
        email={email}
        phoneNumber={phoneNumber}
        address={address}
        cardNumber={cardNumber}
        cardName={cardName}
        cardExpiry={cardExpiry}
        cardCVV={cardCVV}
        navigation={navigation}
      />
    </View >
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
  totalPaymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8e9e9',
  },
  totalPayment: {
    fontSize: 16,
    marginLeft: 10,
  },
  order: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'orange',
    padding: 10,
    paddingBottom: 7,
    borderRadius: 5,
  },
  seeProductContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  seeProductWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e9e9',
  },
  productImageWrapper: {
    backgroundColor: '#e8e9e9',
    borderRadius: 5,
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
  },
  productInfoWrapper: {
    flex: 1,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
