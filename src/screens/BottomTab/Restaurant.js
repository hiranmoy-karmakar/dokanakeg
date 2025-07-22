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
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from '../../components/HomeHeader';
import CategoryVerticalScroll from '../../components/CategoryVerticalScroll';
import GroceryItemsVerticalScroll from '../../components/GroceryItemsVerticalScroll';
import CustomCarousel from '../../components/CustomCarousel';
import FoodItemsVerticalScroll from '../../components/FoodItemsVerticalScroll';
import { groceryCategoryData } from '../../components/StaticData';
import VerticalRestaurantList from '../../components/VerticalRestaurantList';
import HomeBottomBanner from '../../components/HomeBottomBanner';
import PopularRestaurantScroll from '../../components/PopularRestaurantScroll';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchSuggestion from '../../components/SearchSuggestion';

const Restaurant = () => {
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const restaurentItemsHome = ProfileReducer?.hotSellingFoodResponse?.data;
  const nearbyRestaurentItemsHome =
    ProfileReducer?.popularRestaurantResponse?.data;
  const bannerData =
    ProfileReducer?.bannerResponse?.data?.restaurant_header_banner;
  const bottombannerData =
    ProfileReducer?.bannerResponse?.data?.restaurant_footer_banner;
  const restaurentItems = ProfileReducer?.popularRestaurantResponse?.data;
  const topBannerImageLinksArray = bannerData?.map((item, index) => ({
    id: index + 1,
    image: `${item?.image_link}`,
  }));
  const bottomBannerImageLinksArray = bottombannerData?.map((item, index) => ({
    id: index + 1,
    image: `${item?.image_link}`,
  }));

  const foodCategory = ProfileReducer?.restaurentCategoryResponse;
  const mainRestaurantCategories = foodCategory?.filter(
    item => item?.parent_id === null,
  );

  const [local_cartData, setlocal_CartData] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await AsyncStorage.getItem('cart');
        if (data !== null) {
          const parsed = JSON.parse(data);
          setlocal_CartData(parsed);
        } else {
          setlocal_CartData([]);
        }
      } catch (err) {
        console.error('Error reading cart:', err);
      }
    };

    fetchCartData();
  }, []);

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HomeHeader />
         <SearchSuggestion />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.crouselVw}>
            <CustomCarousel originalData={topBannerImageLinksArray} />
          </View>

          <View style={{ backgroundColor: COLORS.lightYellow }}>
            <View style={styles.categoryVw}>
              <Text numberOfLines={1} style={styles.categoryTxt}>
                Order Food by Category
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RestaurantCategory', {
                    mainRestaurantCategories: mainRestaurantCategories,
                  });
                }}
              >
                <Text numberOfLines={1} style={styles.seeall}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: normalize(320),
                alignSelf: 'center',
                marginTop: normalize(15),
              }}
            >
              <CategoryVerticalScroll
                dataSet={mainRestaurantCategories}
                type="restaurant"
              />
            </View>
          </View>

          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Popular Restaurants
            </Text>
            {/* <TouchableOpacity>
              <Image
                source={IMAGES.backarrow}
                resizeMode="contain"
                style={{height: normalize(22), width: normalize(22)}}
              />
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <PopularRestaurantScroll fullData={restaurentItems} />
          </View>
          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Hot Selling Items
            </Text>
            {/* <TouchableOpacity>
              <Image
                source={IMAGES.backarrow}
                resizeMode="contain"
                style={{height: normalize(22), width: normalize(22)}}
              />
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <FoodItemsVerticalScroll
              fullData={restaurentItemsHome}
              onCartUpdate={setlocal_CartData}
            />
          </View>
          <View style={styles.crouselVw}>
            <CustomCarousel originalData={bottomBannerImageLinksArray} />
          </View>

          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Order Food From Nearby Restaurant
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <VerticalRestaurantList fullData={nearbyRestaurentItemsHome} />
          </View>
          <HomeBottomBanner marginBottom={15} />
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* Floating View Cart */}
      {local_cartData?.length != 0 ? (
        <View style={styles.floatingCart}>
          <View style={styles.cartDetails}>
            <View style={styles.imagePlaceholder}>
              <Image
                source={{ uri: local_cartData[0]?.image }}
                resizeMode="contain"
                style={{ height: '100%', width: '100%' }}
              />
            </View>
            {local_cartData?.length != 1 ? (
              <View
                style={[
                  styles.imagePlaceholder,
                  {
                    position: 'absolute',
                    right: normalize(50),
                  },
                ]}
              >
                <Image
                  source={{ uri: local_cartData[1]?.image }}
                  resizeMode="contain"
                  style={{ height: '100%', width: '100%' }}
                />
              </View>
            ) : null}
            <Text style={styles.cartText}>
              View cart{'\n'}
              {local_cartData?.length}{' '}
              {local_cartData?.length == 1 ? 'Item' : 'Items'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation?.navigate('BottomTab', {
                screen: 'Tab4StackScreen',
                params: {
                  screen: 'Tab4',
                },
              });
            }}
            style={styles.cartButton}
          >
            <Image
              source={IMAGES.downarrow}
              resizeMode="contain"
              style={{
                height: normalize(10),
                width: normalize(10),
                tintColor: COLORS.white,
                transform: [{ rotate: '270deg' }],
              }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default Restaurant;
const styles = StyleSheet.create({
  categoryVw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: normalize(20),
    marginTop: normalize(10),
    paddingHorizontal: normalize(15),
  },
  categoryTxt: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: normalize(13),
    color: COLORS.themeViolet,
  },
  crouselVw: {
    marginTop: normalize(10),
    height: normalize(180),
    width: normalize(320),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
  },
  seeall: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: normalize(11),
    color: COLORS.themeViolet,
  },
  ///////////////
   ///////////////
    floatingCart: {
      position: 'absolute',
      bottom: normalize(20),
      // left: normalize(50),
      // right: normalize(50),
      width: normalize(130),
      backgroundColor: COLORS.blue,
      borderRadius: normalize(50),
      flexDirection: 'row',
      alignItems: 'center',
      padding: normalize(5),
      elevation: normalize(10),
      alignSelf: 'center',
    },
    cartDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    imagePlaceholder: {
      width: normalize(35),
      height: normalize(35),
      borderRadius: normalize(20),
      marginRight: normalize(10),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: COLORS.bordergrey,
    },
    cartText: {
      color: COLORS.themeViolet,
  
      fontSize: normalize(10),
      fontFamily: FONTS.PoppinsSemiBold,
    },
    cartButton: {
      backgroundColor: COLORS.themeGreen,
      borderRadius: normalize(20),
      padding: normalize(5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartButtonText: {
      color: COLORS.themeGreen,
      fontSize: normalize(16),
    },
});
