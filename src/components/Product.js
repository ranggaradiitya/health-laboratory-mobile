import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import globalStyles from '../../styles';
import {Context} from '../../App';

export default function Product(props) {
  const {state, dispatch} = useContext(Context);
  const {id, name, price, stock} = props;

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

  const formatRupiah = money => {
    return 'Rp' + money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAddToCartButton = key => {
    const newProduct = {
      id: key,
      name: state.products[key].name,
      price: state.products[key].price,
      stock: state.products[key].stock,
      quantity: '1',
      totalPrice: `${Number(state.products[key].price) * 1}`,
    };

    // check if product is already in cart
    let isAlreadyInCart = false;
    for (const i in state.productInCart) {
      if (state.productInCart[i].id === newProduct.id) {
        isAlreadyInCart = true;
        break;
      }
    }

    if (isAlreadyInCart) {
      Alert.alert('Warning', 'Product already in cart');
    } else {
      dispatch({type: 'ADD_TO_CART', payload: newProduct});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={getImageUrl()} style={styles.image} />
      </View>
      <Text style={[styles.name, globalStyles.setFontBold]}>
        {name.length > 14 ? name.slice(0, 14) + '..' : name}
      </Text>
      <View>
        <Text style={globalStyles.setFont}>{formatRupiah(price)}</Text>
        <Text style={[styles.stock, globalStyles.setFont]}>Stock: {stock}</Text>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => handleAddToCartButton(id)}>
          <Text style={[styles.button, globalStyles.setFontBold]}>
            Add product
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 18,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
    width: '47%',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    backgroundColor: '#e8e9e9',
    borderRadius: 5,
    width: 156,
    height: 93,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: 117,
    height: 63,
  },
  name: {
    fontSize: 16,
    marginVertical: 10,
    color: 'orange',
  },
  stock: {
    marginBottom: 10,
  },
  buttonWrapper: {
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  button: {
    color: 'white',
  },
});
