import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import GlobalStyles from '../../styles';
import { Context } from '../../App';

const ProductInCart = ({ id, name, price }) => {
  const { state, dispatch } = useContext(Context);

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

  const removeProduct = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const getProductQuantity = () => {
    for (const product of state.productInCart) {
      if (product.id === id) {
        return product.quantity;
      }
    }
  };

  const isQuantityExceedStock = (number) => {
    for (const product of state.productInCart) {
      if (product.id === id) {
        if (Number(number) > Number(product.stock)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleQuantityChange = (number) => {
    dispatch({ type: 'UPDATE_PRODUCT_IN_CART', payload: { id, quantity: number, totalPrice: `${Number(price) * Number(number)}` } });
  };

  return (
    <View style={styles.productContainer}>
      <View style={styles.productDetails}>
        <View style={styles.productImageWrapper}>
          <Image source={getImageUrl()} style={styles.productImage} />
        </View>
        <View style={styles.productDesc}>
          <Text style={GlobalStyles.setFont}>{name.length > 27 ? name.slice(0, 27) + '...' : name}</Text>
          <Text style={GlobalStyles.setFont}>{formatRupiah(price)}</Text>
          <TouchableOpacity onPress={removeProduct}>
            <Text style={[styles.remove, GlobalStyles.setFont]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.quantityWrapper}>
        <TextInput
          value={getProductQuantity()}
          defaultValue={`${getProductQuantity()}`}
          onChangeText={(number) => {
            number = number.replace(/[^0-9]/g, '');
            if (number === '') {
              number = '0';
            }
            if (number.length > 1 && number[0] === '0') {
              number = number.slice(1);
            }
            if (isQuantityExceedStock(number)) {
              Alert.alert('Quantity exceed stock', 'Please change the quantity to less than stock');
              return;
            }
            handleQuantityChange(number);
          }}
          onEndEditing={(number) => {
            number = number.nativeEvent.text;
            if (number === '0') {
              Alert.alert('Warning', 'Are you sure you want to remove this product from cart?', [
                { text: 'No', style: 'cancel', onPress: () => handleQuantityChange(1) },
                { text: 'Yes', onPress: removeProduct },
              ]);
            }
          }}
          style={styles.input}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
    </View>
  );
};

const TotalPrice = ({ navigation }) => {
  const { state } = useContext(Context);

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

  const handleCheckout = () => {
    if (state.productInCart.length === 0) {
      Alert.alert('Cart is empty');
      return;
    }
    navigation.navigate('PaymentScreen');
  };

  return (
    <View style={styles.totalPriceContainer}>
      <View style={styles.totalPriceWrapper}>
        <Text style={[styles.totalPrice, GlobalStyles.setFontBold]}>Total Price:</Text>
        <Text style={[styles.totalPrice, GlobalStyles.setFontBold]}>{getTotalPrice()}</Text>
      </View>
      <TouchableOpacity onPress={handleCheckout}>
        <Text style={[styles.checkout, GlobalStyles.setFontBold]}>CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CartDetailsScreen({ navigation }) {
  const { state } = useContext(Context);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {state.productInCart.length > 0 ? (
            state.productInCart.map((product) => (
              <ProductInCart
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
              />
            ))
          ) : <Text style={[styles.emptyCart, GlobalStyles.setFontBold]}>Your cart is empty 😔</Text>}
        </View>
      </ScrollView>
      <TotalPrice navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e9e9',
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#d1d1d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
  },
  productDesc: {
    marginLeft: 10,
  },
  remove: {
    color: 'red',
  },
  input: {
    width: 50,
    height: 35,
    borderWidth: 1,
    borderColor: '#cfd1d1',
    borderRadius: 5,
    paddingBottom: 8,
    marginRight: 10,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8e9e9',
  },
  totalPriceWrapper: {
  },
  totalPrice: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkout: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'orange',
    padding: 10,
    paddingBottom: 7,
    borderRadius: 5,
  },
  emptyCart: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 300,
  },
});
