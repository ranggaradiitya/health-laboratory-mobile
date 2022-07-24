import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import SearchIcon from '../assets/images/outline_search_black_24dp.png';
import GlobalStyles from '../../styles';
import { Context } from '../../App';

export default function SearchBar() {
  const { dispatch } = React.useContext(Context);
  return (
    <View style={styles.searchWrapper}>
      <Image source={SearchIcon} style={styles.icon} />
      <TextInput
        placeholder="Search product"
        style={[styles.input, GlobalStyles.setFont]}
        onChangeText={(text) => {
          dispatch({ type: 'SET_SEARCH_TEXT', payload: text });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 15,
    elevation: 5,
    width: 280,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
    tintColor: 'orange',
  },
  input: {
    paddingTop: 5,
    paddingBottom: 3,
    width: '75%',
  },
});
