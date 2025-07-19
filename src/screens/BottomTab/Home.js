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
import VerticalRestaurantList from '../../components/VerticalRestaurantList';
import HomeBottomBanner from '../../components/HomeBottomBanner';
import {
  groceryCategoryDataHome,
  foodCategoryDataHome,
  groceryItemsHome,
  restaurentItemsHome,
  groceryCrouselHome,
  foodCrouselHome,
  nearbyRestaurentItemsHome,
} from '../../../StaticDataset';
import { useDispatch, useSelector } from 'react-redux';
import {
  bannerRequest,
  groceryCategoryRequest,
  hotSellingFoodRequest,
  popularRestaurantRequest,
  restaurentCategoryRequest,
} from '../../redux/reducer/ProfileReducer';
import ShowAlert from '../../utils/helpers/ShowAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import connectionrequest from '../../utils/helpers/NetInfo';

let status = '';
const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  const [local_cartData, setlocal_CartData] = useState([]);
  const [foodCategory, setfoodCategory] = useState([]);
  const [groceryCategory, setgroceryCategory] = useState([]);
  const [restaurentItemsHome, setrestaurentItemsHome] = useState([]);
  const [banner, setbanner] = useState([]);
  const [nearbyRestaurentItemsHome, setnearbyRestaurentItemsHome] = useState(
    [],
  );

  const mainRestaurantCategories = foodCategory?.filter(
    item => item?.parent_id === null,
  );
  const mainGroceryCategories = groceryCategory?.filter(
    item => item?.parent_id === null,
  );

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

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(restaurentCategoryRequest());
        dispatch(groceryCategoryRequest());
        dispatch(bannerRequest());
        dispatch(popularRestaurantRequest());
        dispatch(hotSellingFoodRequest());
        // dispatch(
        //   nearbyRestaurantRequest({
        //     pincode: itemId,
        //     store_category_flag: 'restaurant',
        //   }),
        // );
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  const topBannerImageLinksArray = banner?.header_banner?.map(
    (item, index) => ({
      id: index + 1,
      image: `${item?.image_link}`,
    }),
  );
  const bottomBannerImageLinksArray = banner?.footer_banner?.map(
    (item, index) => ({
      id: index + 1,
      image: `${item?.image_link}`,
    }),
  );

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/restaurentCategoryRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/restaurentCategorySuccess':
        status = ProfileReducer.status;
        setfoodCategory(ProfileReducer?.restaurentCategoryResponse);
        break;
      case 'Profile/restaurentCategoryFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
      /////
      case 'Profile/groceryCategoryRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/groceryCategorySuccess':
        status = ProfileReducer.status;
        setgroceryCategory(ProfileReducer?.groceryCategoryResponse);
        break;
      case 'Profile/groceryCategoryFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
      /////
      case 'Profile/bannerRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/bannerSuccess':
        status = ProfileReducer.status;
        setbanner(ProfileReducer?.bannerResponse?.data);
        break;
      case 'Profile/bannerFailure':
        status = ProfileReducer.status;
        break;
      /////
      case 'Profile/popularRestaurantRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/popularRestaurantSuccess':
        status = ProfileReducer.status;
        setnearbyRestaurentItemsHome(
          ProfileReducer?.popularRestaurantResponse?.data,
        );
        break;
      case 'Profile/popularRestaurantFailure':
        status = ProfileReducer.status;
        break;
      /////
      case 'Profile/hotSellingFoodRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/hotSellingFoodSuccess':
        status = ProfileReducer.status;
        setrestaurentItemsHome(ProfileReducer?.hotSellingFoodResponse?.data);
        break;
      case 'Profile/hotSellingFoodFailure':
        status = ProfileReducer.status;
        break;
    }
  }

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HomeHeader />
        <TouchableOpacity style={styles.searchContainer}>
          <Image
            source={IMAGES.search}
            resizeMode="contain"
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search For</Text>
        </TouchableOpacity>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.crouselVw}>
            <CustomCarousel originalData={topBannerImageLinksArray} />
          </View>
          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Categories
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('GroceryCategory');
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
              dataSet={mainGroceryCategories}
              type="grocery"
            />
          </View>

          <View style={{ backgroundColor: COLORS.loghtYellow }}>
            <View style={styles.categoryVw}>
              <Text numberOfLines={1} style={styles.categoryTxt}>
                Best value
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('GroceryProductList');
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
              <GroceryItemsVerticalScroll fullData={groceryItemsHome} />
            </View>
          </View>

          <View style={{ backgroundColor: COLORS.loghtYellow }}>
            <View style={styles.categoryVw}>
              <Text numberOfLines={1} style={styles.categoryTxt}>
                Food category
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
              Hot Selling Items
            </Text>
            <TouchableOpacity>
              <Text numberOfLines={1} style={styles.seeall}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: normalize(15) }}>
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
            {/* <TouchableOpacity>
              <Image
                source={IMAGES.backarrow}
                resizeMode="contain"
                style={{height: normalize(22), width: normalize(22)}}
              />
            </TouchableOpacity> */}
          </View>
          <View style={{ marginTop: normalize(15) }}>
            <VerticalRestaurantList fullData={nearbyRestaurentItemsHome} />
          </View>

          <HomeBottomBanner />
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
                tintColor: COLORS.themeViolet,
                transform: [{ rotate: '270deg' }],
              }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default Home;

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
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(13),
    color: COLORS.themeViolet,
  },
  seeall: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: normalize(11),
    color: COLORS.themeViolet,
  },
  crouselVw: {
    marginTop: normalize(15),
    height: normalize(180),
    width: normalize(320),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
  },
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
