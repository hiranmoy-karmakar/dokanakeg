import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  Button,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from '../../components/HomeHeader';
import { initialCart } from '../../../StaticDataset';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../../redux/reducer/AuthReducer';

const Menu = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const menuItems = [
    { id: 1, label: 'Home', screen: 'Tab5', image: IMAGES.home },
    { id: 2, label: 'My Account', screen: 'OrderList', image: IMAGES.profile },
    { id: 3, label: 'Grocery Order', screen: 'Faq', image: IMAGES.grocery },
    {
      id: 4,
      label: 'Restaurant Order',
      screen: 'AboutUs',
      image: IMAGES.restaurantorder,
    },
    {
      id: 5,
      label: 'Customer Support',
      screen: 'ContactUs',
      image: IMAGES.customersupport,
    },
    // {id: 6, label: 'Refer App', screen: 'Tab5', image: IMAGES.referapp},
    // {
    //   id: 7,
    //   label: 'Rate Application',
    //   screen: 'OrderList',
    //   image: IMAGES.rating,
    // },
    {
      id: 8,
      label: 'Terms and Condition',
      screen: 'Faq',
      image: IMAGES.document,
    },
    {
      id: 9,
      label: 'Privacy Policy',
      screen: 'AboutUs',
      image: IMAGES.document,
    },
  ];
  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HomeHeader />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: normalize(320),
              backgroundColor: COLORS.white,
              borderRadius: normalize(10),
              alignSelf: 'center',
              marginTop: normalize(20),
            }}
          >
            {menuItems.map(item => (
              <>
                <TouchableOpacity
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: normalize(13),
                    paddingHorizontal: normalize(15),
                  }}
                  onPress={() => {
                    // if (AuthReducer?.getTokenResponse == null) {
                    //   Alert.alert('⚠️', 'You have to login for Access', [
                    //     {
                    //       text: 'Cancel',
                    //       onPress: () => console.log('Cancel Pressed'),
                    //       style: 'cancel',
                    //     },
                    //     {
                    //       text: 'Login',
                    //       onPress: () => navigation.navigate('Login'),
                    //       textStyle: {fontWeight: 'bold'},
                    //     },
                    //   ]);
                    // } else {
                    //   if (item.id === 1) {
                    //     navigation.navigate('BottomTab', {
                    //       screen: 'Tab5StackScreen',
                    //       params: {
                    //         screen: 'Tab5',
                    //       },
                    //     });
                    //   } else if (item.id === 4) {
                    //     navigation.navigate('BottomTab', {
                    //       screen: 'Tab4StackScreen',
                    //       params: {
                    //         screen: 'Tab4',
                    //       },
                    //     });
                    //   } else {
                    //     navigation.navigate(item.screen);
                    //   }
                    // }
                  }}
                >
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{
                      height: normalize(18),
                      width: normalize(18),
                      tintColor: COLORS.blue,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: normalize(12),
                      fontSize: normalize(14),
                      color: COLORS.themeViolet,
                      fontFamily: FONTS.PoppinsRegular,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {item.id === 10 ? null : (
                  <View
                    style={{
                      width: normalize(290),
                      alignSelf: 'center',
                      borderWidth: 0.5,
                      borderColor: COLORS.bordergrey,
                    }}
                  ></View>
                )}
              </>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(logoutRequest());
            }}
            style={{
              height: normalize(30),
              width: normalize(100),
              // backgroundColor: COLORS.white,
              marginLeft: normalize(20),
              marginTop: normalize(20),
              borderRadius: normalize(10),

              // shadowColor: '#000',
              // shadowOffset: {
              //   width: 0,
              //   height: 2,
              // },
              // shadowOpacity: 0.25,
              // shadowRadius: 4,
              // elevation: 5, // For Android
            }}
          >
            <View
              style={{
                height: normalize(30),
                width: normalize(100),
                borderRadius: normalize(10),
                backgroundColor: COLORS.white,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: normalize(10),
                borderWidth: normalize(1),
                borderColor: COLORS.bordergrey,
                ...Platform.select({
                  ios: {
                    shadowColor: COLORS.black,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 3,
                    shadowColor: COLORS.black,
                  },
                }),
              }}
            >
              <Image
                source={IMAGES.power}
                resizeMode="contain"
                style={{ height: normalize(15), width: normalize(15) }}
              />
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLORS.lightBlack,
                  fontFamily: FONTS.PoppinsRegular,
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>

          {/* <T
            style={{
              height: normalize(30),
              width: normalize(100),
              backgroundColor: COLORS.white,
              marginLeft: normalize(20),
              marginTop: normalize(20),
              borderRadius: normalize(10),
            }}> */}
          {/* <View
            style={{
              height: normalize(30),
              width: normalize(100),
              // padding: normalize(10), // padding to show shadow all around
              borderRadius: normalize(25),
              // backgroundColor: 'transparent', // ensure it's transparent
              backgroundColor: COLORS.white,
              marginLeft: normalize(20),
              marginTop: normalize(20),
              ...Platform.select({
                ios: {
                  shadowColor: COLORS.black,
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 14,
                  shadowColor: COLORS.black,
                },
              }),
            }}>
            <View style={{height: normalize(30), width: normalize(100)}}></View>
          </View> */}
          {/* </T> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default Menu;
