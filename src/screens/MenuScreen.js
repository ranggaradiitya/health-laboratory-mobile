import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Context } from '../../App';
import Product from '../components/Product';
import FloatingButton from '../components/FloatingButton';
import HeaderBar from '../components/HeaderBar';

export default function MenuScreen({ navigation }) {
  const { state, dispatch } = useContext(Context);

  // state untuk refresh screen
  const [refreshing, setRefreshing] = useState(false);

  // kebutuhan untuk scroll to top button
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 100;
  const ref = useRef();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getFetchUrl = () => {
        return 'https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/products.json';
      };
      const fetchData = async () => {
        const response = await axios.get(getFetchUrl());
        const data = response.data;
        dispatch({ type: 'SET_PRODUCTS', payload: data });
      };
      fetchData();
      dispatch({ type: 'SET_MENU_SCREEN_NAVIGATION', payload: navigation });
    }
  }, [dispatch, isFocused, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBar />
      ),
    });
  }, [navigation]);

  const getProducts = () => {
    const getFetchUrl = () => {
      return 'https://health-laboratory-cc968-default-rtdb.asia-southeast1.firebasedatabase.app/products.json';
    };
    const fetchData = async () => {
      const response = await axios.get(getFetchUrl());
      const data = response.data;
      dispatch({ type: 'SET_PRODUCTS', payload: data });
    };
    fetchData();
  };

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  return (
    <View>
      <ScrollView
        ref={ref}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await wait(2000);
              getProducts();
              setRefreshing(false);
            }}
          />
        }
        onScroll={(event) => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={styles.container}>
          {Object.keys(state.products).map((key) => (
            <Product
              key={key}
              id={key}
              name={state.products[key].name}
              price={state.products[key].price}
              stock={state.products[key].stock}
            />
          ))}
        </View>
      </ScrollView>
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <FloatingButton onPress={() => ref.current.scrollTo({ x: 0, y: 0, animated: true })} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
});
