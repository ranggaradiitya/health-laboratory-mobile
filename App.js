import React, { createContext, useEffect, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Image, StatusBar } from 'react-native';
import { initialState } from './src/context/initialState';
import { reducer } from './src/context/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/SplashScreen';
import StartScreen from './src/screens/StartScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartDetailsScreen from './src/screens/CartDetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';

import ProductIcon from './src/assets/images/outline_inventory_2_black_24dp.png';
import LogoutIcon from './src/assets/images/outline_logout_black_24dp.png';

export const Context = createContext();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  const { dispatch } = React.useContext(Context);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => {
          const removeUserToken = async () => {
            try {
              await AsyncStorage.removeItem('userToken');
            }
            catch (error) {
              console.log(error);
            }
          };
          removeUserToken();
          dispatch({ type: 'RESET_PRODUCT_IN_CART' });
          dispatch({ type: 'SIGN_OUT' });
        }}
        icon={({ focused }) => (
          <Image source={LogoutIcon} style={{ tintColor: focused ? 'orange' : 'black' }} />
        )}
      />
    </DrawerContentScrollView>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: 'orange',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ProductList"
        component={MenuScreen}
        options={{
          title: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          drawerLabel: 'Product List',
          drawerIcon: ({ focused }) => (
            <Image source={ProductIcon} style={{ tintColor: focused ? 'orange' : 'black' }} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }, 2000);
    const getUserToken = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        // console.log(userToken);
      }
      catch (error) {
        console.log(error);
      }
      if (userToken) {
        dispatch({ type: 'RESTORE_TOKEN', payload: JSON.parse(userToken) });
      }
    };
    getUserToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <Stack.Navigator
          initialRouteName="StartScreen">
          {state.isLoading ? (
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          ) : state.userToken === null ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};

export default App;

