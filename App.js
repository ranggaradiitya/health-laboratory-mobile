import React, { createContext, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, StatusBar, Text, View } from 'react-native';
import { initialState } from './src/context/initialState';
import { reducer } from './src/context/reducer';
import StartScreen from './src/screens/StartScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartDetailsScreen from './src/screens/CartDetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';

import MenuIcon from './src/assets/images/outline_menu_black_24dp.png';

export const Context = createContext();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: 'orange',
      }}>
      <Drawer.Screen
        name="ProductList"
        component={MenuScreen}
        options={{
          title: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          drawerLabel: 'Product List',
          drawerIcon: ({ focused }) => (
            <Image source={MenuIcon} style={{ tintColor: focused ? 'orange' : 'black' }} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <Stack.Navigator
          initialRouteName="StartScreen">
          <Stack.Screen
            name="StartScreen"
            component={StartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{
              title: '',
              headerStyle: { backgroundColor: '#f2f2f2' },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              title: '',
              headerStyle: { backgroundColor: '#f2f2f2' },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={MyDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CartDetailsScreen"
            component={CartDetailsScreen}
            options={{
              title: 'My Cart',
              headerStyle: { backgroundColor: '#f2f2f2' },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
              title: 'Payment',
              headerStyle: { backgroundColor: '#f2f2f2' },
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};

export default App;

