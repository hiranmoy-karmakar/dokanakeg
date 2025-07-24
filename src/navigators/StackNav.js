import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

/* AUTH PAGES */
import Splash from '../screens/Default/Splash';

// MAIN PAGES
import Login from '../screens/Auth/Login';
import Otp from '../screens/Auth/Otp';
import BottomTab from './BottomTab';
import RestaurantCategory from '../screens/MainScreen/RestaurantCategory';
import GroceryCategory from '../screens/MainScreen/GroceryCategory';
import GroceryProductList from '../screens/MainScreen/GroceryProductList';
import RestaurantListByCategory from '../screens/MainScreen/RestaurantListByCategory';
import Details from '../screens/MainScreen/Details';
import {useSelector} from 'react-redux';
import Intro from '../screens/Default/Intro';
import RestaurantFoodList from '../screens/MainScreen/RestaurantFoodList';
import AddressChange from '../screens/MainScreen/AddressChange';
import RestaurentOrder from '../screens/MainScreen/RestaurentOrder';
import GroceryOrder from '../screens/MainScreen/GroceryOrder';
import MyAccount from '../screens/MainScreen/MyAccount';
import SearchPage from '../screens/MainScreen/SearchPage';
import SuccessScreen from '../components/SuccessScreen';
import RestaurantOrderDetails from '../screens/MainScreen/RestaurantOrderDetails';
import AboutUs from '../screens/MainScreen/AboutUs';
import PrivacyPolicy from '../screens/MainScreen/PrivacyPolicy';
import TermsAndCondition from '../screens/MainScreen/TermsAndCondition';
import RefundPolicy from '../screens/MainScreen/RefundPolicy';
import CustomerSupport from '../screens/MainScreen/CustomerSupport';

export default function StackNav() {
  const [showSplash, setShowSplash] = useState(true);

  const AuthReducer = useSelector(state => state.AuthReducer);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const authScreens = {
    // Splash: Splash,
    Intro: Intro,
       Login: Login,
       Otp: Otp,
  };

  const allScreens = {
    BottomTab: BottomTab,
    RestaurantCategory: RestaurantCategory,
    GroceryCategory: GroceryCategory,
    GroceryProductList: GroceryProductList,
    RestaurantListByCategory: RestaurantListByCategory,
    Details: Details,
    RestaurantFoodList: RestaurantFoodList,
    AddressChange: AddressChange,
    RestaurentOrder: RestaurentOrder,
    GroceryOrder: GroceryOrder,
    RestaurantOrderDetails: RestaurantOrderDetails,
    MyAccount: MyAccount,
    SearchPage: SearchPage,
    SuccessScreen: SuccessScreen,
    AboutUs: AboutUs,
    PrivacyPolicy: PrivacyPolicy,
    TermsAndCondition: TermsAndCondition,
    RefundPolicy: RefundPolicy,
    CustomerSupport: CustomerSupport,
  };

  if (showSplash || AuthReducer?.isLoading) {
    return <Splash />;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          {AuthReducer.getTokenResponse == null ? (
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName={'Splash'}>
              {Object.entries(authScreens).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
              ))}
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {Object.entries(allScreens).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
              ))}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
