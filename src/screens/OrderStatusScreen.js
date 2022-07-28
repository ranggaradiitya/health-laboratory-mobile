import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import MenuButton from '../components/MenuButton';

const StatusButton = () => {
  const [status, setStatus] = useState('Done');
  return (
    <View style={styles.statusButton}>
      <TouchableOpacity onPress={() => setStatus('Pending')}>
        <Text
          style={[
            styles.statusButtonText,
            {
              color: status === 'Pending' ? 'orange' : 'black',
              borderBottomWidth: status === 'Pending' ? 2 : 0,
              borderBottomColor: status === 'Pending' ? 'orange' : '',
              fontFamily: 'Poppins-Regular',
            },
          ]}>
          PENDING
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStatus('Delivery')}>
        <Text
          style={[
            styles.statusButtonText,
            {
              color: status === 'Delivery' ? 'orange' : 'black',
              borderBottomWidth: status === 'Delivery' ? 2 : 0,
              borderBottomColor: status === 'Delivery' ? 'orange' : '',
              fontFamily: 'Poppins-Regular',
            },
          ]}>
          ON DELIVERY
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStatus('Done')}>
        <Text
          style={[
            styles.statusButtonText,
            {
              color: status === 'Done' ? 'orange' : 'black',
              borderBottomWidth: status === 'Done' ? 2 : 0,
              borderBottomColor: status === 'Done' ? 'orange' : '',
              fontFamily: 'Poppins-Regular',
            },
          ]}>
          DONE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Product = () => {
  return (
    <View style={styles.product}>
      <View style={styles.productImage}>
        <Text>Product Image</Text>
      </View>
      <View style={styles.productInfo}>
        <Text>Product Name</Text>
        <Text>Product Price</Text>
      </View>
    </View>
  );
};

export default function OrderStatusScreen({navigation}) {
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

  return (
    <View style={styles.container}>
      <StatusButton />
      <ScrollView>
        <Product />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#000',
  },
});
