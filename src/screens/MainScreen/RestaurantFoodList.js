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
import React, { useEffect, useState } from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import DetailsHeader from '../../components/DetailsHeader';
import RestaurantInfoCard from '../../components/RestaurantInfoCard';
import CustomToggle from '../../components/CustomToggle';
import TopTabWithList from '../../components/TopTabWithList';
import connectionrequest from '../../utils/helpers/NetInfo';
import { foodItemsListRequest } from '../../redux/reducer/ProfileReducer';
import ShowAlert from '../../utils/helpers/ShowAlert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let status = '';
const RestaurantFoodList = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const nearbyRestaurentItems = props?.route?.params?.nearbyRestaurentItems;
  console.log('gygygygygygygyg', nearbyRestaurentItems);

  const [vegToggle, setvegToggle] = useState(false);
  const [nonVegToggle, setnonVegToggle] = useState(false);
  const [eggToggle, seteggToggle] = useState(false);
  const [categories, setcategories] = useState([]);
  const [foods, setfoods] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const [visible, setVisible] = useState(false);
  const [addOnVisible, setaddOnVisible] = useState(false);
  const [local_cartData, setlocal_CartData] = useState([]);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        const types = [];
        if (vegToggle) types.push('veg');
        if (nonVegToggle) types.push('non-veg');
        if (eggToggle) types.push('egg');

        if (types.length > 0) {
          dispatch(
            foodItemsListRequest({
              id: nearbyRestaurentItems?.id,
              types: types.join(','),
            }),
          );
        } else {
          dispatch(foodItemsListRequest({ id: nearbyRestaurentItems?.id }));
        }
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, [vegToggle, nonVegToggle, eggToggle]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await AsyncStorage.getItem('cart');
        if (data !== null) {
          const parsedData = JSON.parse(data);
          console.log('local_cartData', parsedData); // Make sure this is being hit
          setlocal_CartData(parsedData);
        } else {
          console.log('Cart is empty');
        }
      } catch (error) {
        console.error('Error reading cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      console.log('Cart cleared successfully.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  useEffect(() => {
    if (ProfileReducer.status === 'Profile/foodItemsListSuccess') {
      const data = ProfileReducer?.foodItemsListResponse?.data || [];
      setcategories(data);
      if (data?.length > 0) {
        setSelectedCategoryId(data[0]?.id);
        setfoods(data[0]?.food_items || []);
      }
    }
  }, [ProfileReducer.status]);

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/foodItemsListRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/foodItemsListSuccess':
        status = ProfileReducer.status;
        break;
      case 'Profile/foodItemsListFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
    }
  }

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <DetailsHeader />
          <RestaurantInfoCard data={nearbyRestaurentItems} />
          <TouchableOpacity style={styles.searchContainer}>
            <Image
              source={IMAGES.search}
              resizeMode="contain"
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>Search For</Text>
          </TouchableOpacity>
          <View
            style={{
              height: normalize(25),
              width: normalize(150),
              marginLeft: normalize(10),
              marginTop: normalize(10),
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                height: normalize(25),
                width: normalize(50),
                borderWidth: 1,
                borderColor: COLORS.themeViolet,
                borderRadius: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomToggle
                initial={true}
                // onToggle={value => setvegToggle(value)}
                toggleImage={IMAGES.vegicon}
                onColor={COLORS.green}
                offColor={COLORS.bordergrey}
                isOn={vegToggle}
                setIsOn={setvegToggle}
              />
            </View>
            <View
              style={{
                height: normalize(25),
                width: normalize(50),
                borderWidth: 1,
                borderColor: COLORS.themeViolet,
                borderRadius: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: normalize(10),
              }}
            >
              <CustomToggle
                initial={true}
                // onToggle={value => setvegToggle(value)}
                toggleImage={IMAGES.nonveg}
                onColor={COLORS.red}
                offColor={COLORS.bordergrey}
                isOn={nonVegToggle}
                setIsOn={setnonVegToggle}
              />
            </View>
            <View
              style={{
                height: normalize(25),
                width: normalize(50),
                borderWidth: 1,
                borderColor: COLORS.themeViolet,
                borderRadius: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: normalize(10),
              }}
            >
              <CustomToggle
                initial={true}
                // onToggle={value => setvegToggle(value)}
                toggleImage={IMAGES.egg}
                onColor={COLORS.yellow}
                offColor={COLORS.bordergrey}
                isOn={eggToggle}
                setIsOn={seteggToggle}
              />
            </View>
          </View>
          <View
            style={{
              height: normalize(340),
              width: normalize(300),
              alignSelf: 'center',
              marginTop: normalize(5),
            }}
          >
            <TopTabWithList
              categories={categories}
              setcategories={setcategories}
              foods={foods}
              setfoods={setfoods}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              setVisible={setVisible}
              visible={visible}
              setaddOnVisible={setaddOnVisible}
              addOnVisible={addOnVisible}
              nearbyRestaurentItems={nearbyRestaurentItems}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default RestaurantFoodList;
const styles = StyleSheet.create({
  searchContainer: {
    height: normalize(40),
    width: normalize(300),
    alignSelf: 'center',
    marginTop: normalize(5),
    borderRadius: normalize(30),
    backgroundColor: COLORS.themeGreen,
    shadowColor: COLORS.deepGrey,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS == 'ios' ? 0.2 : 0.7,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
  },
  searchText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(11),
    color: COLORS.white,
    marginLeft: normalize(10),
  },
  searchIcon: {
    height: normalize(18),
    width: normalize(18),
    tintColor: COLORS.themeViolet,
  },
});
