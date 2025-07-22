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
import {
  listData,
  milkItems,
  groceryItems,
  vegetablesCategoryData,
  groceryCrousel,
  icecreamItems,
  fruitItems,
  vegItems,
  healthyItems,
  fishItems,
  meatItems,
  bakedItems,
} from '../../../StaticDataset';
import { useDispatch, useSelector } from 'react-redux';
import SearchSuggestion from '../../components/SearchSuggestion';

const Grocery = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const bannerData =
    ProfileReducer?.bannerResponse?.data?.grocery_header_banner;
  const bottombannerData =
    ProfileReducer?.bannerResponse?.data?.grocery_footer_banner;
  const topBannerImageLinksArray = bannerData?.map((item, index) => ({
    id: index + 1,
    image: `${item?.image_link}`,
  }));
  const bottomBannerImageLinksArray = bottombannerData?.map((item, index) => ({
    id: index + 1,
    image: `${item?.image_link}`,
  }));

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HomeHeader />
        <SearchSuggestion />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bannerVw}>
            <Image
              source={IMAGES.offerbanner}
              resizeMode="contain"
              style={styles.offerbanner}
            />
          </View>
          <View style={{ backgroundColor: COLORS.loghtYellow }}>
            <View style={styles.categoryVw1}>
              <View
                style={{
                  height: normalize(60),
                  width: normalize(180),
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <Text numberOfLines={1} style={styles.categoryTxt}>
                  Hot Selling Grocery Items
                </Text>
                <Text numberOfLines={1} style={styles.smallcategoryTxt}>
                  Fresh produce, dairy, snacks,
                </Text>
                <Text numberOfLines={1} style={styles.smallcategoryTxt}>
                  and pantry staples sell fast.
                </Text>
              </View>
              <TouchableOpacity>
                <Image
                  source={IMAGES.grocerysmallbanner}
                  resizeMode="contain"
                  style={{ height: normalize(110), width: normalize(110) }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: normalize(320),
                alignSelf: 'center',
                marginTop: normalize(15),
              }}
            >
              <GroceryItemsVerticalScroll fullData={groceryItems} />
            </View>
            <TouchableOpacity style={styles.seeall}>
              <Text
                style={{
                  fontFamily: FONTS.PoppinsMedium,
                  fontSize: normalize(12),
                  color: COLORS.themeGreen,
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Shop Grocery by Category
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('GroceryCategory');
              }}
            >
              <Text numberOfLines={1} style={styles.seeall2}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groceryCat}>
            <FlatList
              data={listData}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('GroceryProductList');
                  }}
                  style={styles.item}
                >
                  <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                  </View>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              // onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
            />
          </View>

          <View style={{ backgroundColor: COLORS.lightGreen }}>
            <View style={styles.categoryVw}>
              <Text numberOfLines={1} style={styles.categoryTxt}>
                Fresh Vegetables
              </Text>
              <TouchableOpacity>
                <Text numberOfLines={1} style={styles.seeall2}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <CategoryVerticalScroll dataSet={vegetablesCategoryData} />
          </View>
          <View style={styles.crouselVw}>
            <CustomCarousel originalData={topBannerImageLinksArray} />
          </View>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Milk Shop
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Fresh milk, curd and more
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={milkItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Oils and Ghee
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Pure, healthy, and rich in taste!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={icecreamItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.crouselVw}>
            <CustomCarousel originalData={bottomBannerImageLinksArray} />
          </View>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Fresh Fruits
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Fresh, juicy, and naturally delicious!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={fruitItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Fresh Vegetables
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Farm-fresh, crisp, and full of goodness!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={vegItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Healthy Bites
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Nourishing your body, one bite at a time!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={healthyItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Fresh from the Sea
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Fresh flavors, straight from the sea!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={fishItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Farm Fresh Meat
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Premium quality, farm-fresh meat!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={meatItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <View style={styles.categoryVw2}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Freshly Baked
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.categoryTxt, { fontSize: normalize(8) }]}
            >
              Warm, delicious, and freshly baked!
            </Text>
          </View>

          <View
            style={{
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <GroceryItemsVerticalScroll fullData={bakedItems} />
          </View>
          <TouchableOpacity style={styles.seeall}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(12),
                color: COLORS.themeGreen,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>

          <HomeBottomBanner />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default Grocery;
const styles = StyleSheet.create({
  categoryVw1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: normalize(70),
    marginTop: normalize(20),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
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
  categoryVw2: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: normalize(20),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(1),
  },
  categoryTxt: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: normalize(13),
    color: COLORS.themeViolet,
  },
  smallcategoryTxt: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(10),
    color: COLORS.black,
  },
  crouselVw: {
    marginTop: normalize(10),
    height: normalize(180),
    width: normalize(320),
    marginTop: normalize(15),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
  },
  bannerVw: {
    height: normalize(140),
    width: normalize(300),
    alignSelf: 'center',
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerbanner: {
    height: '100%',
    width: '100%',
  },
  seeall: {
    height: normalize(35),
    width: normalize(300),
    alignSelf: 'center',
    marginTop: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: COLORS.themeViolet,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: COLORS.themeViolet,
    flexDirection: 'row',
    marginBottom: normalize(20),
  },
  seeall2: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: normalize(11),
    color: COLORS.themeViolet,
  },
  groceryCat: {
    height: normalize(300),
    width: normalize(320),
    marginTop: normalize(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: normalize(4),
    width: normalize(70),
  },
  imageContainer: {
    height: normalize(70),
    width: normalize(70),
    backgroundColor: COLORS.themeGreen,
    borderRadius: normalize(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: normalize(60),
    height: normalize(60),
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginTop: normalize(5),
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.black,
  },
});
