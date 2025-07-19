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
  foodCrousel,
  foodCategoryData,
  restaurentItems,
  nearbyRestaurentItems,
} from '../../../StaticDataset';

const Restaurant = () => {
  const navigation = useNavigation();

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
            <CustomCarousel originalData={foodCrousel} />
          </View>

          <View style={{ backgroundColor: COLORS.lightYellow }}>
            <View style={styles.categoryVw}>
              <Text numberOfLines={1} style={styles.categoryTxt}>
                Order Food by Category
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RestaurantCategory');
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
              <CategoryVerticalScroll dataSet={foodCategoryData} />
            </View>
          </View>

          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Popular Restaurants
            </Text>
            <TouchableOpacity>
              <Text numberOfLines={1} style={styles.seeall}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: normalize(15) }}>
            <PopularRestaurantScroll fullData={restaurentItems} />
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
            <FoodItemsVerticalScroll fullData={restaurentItems} />
          </View>
          <View style={styles.crouselVw}>
            <CustomCarousel originalData={foodCrousel} />
          </View>

          <View style={styles.categoryVw}>
            <Text numberOfLines={1} style={styles.categoryTxt}>
              Order Food From Nearby Restaurant
            </Text>
          </View>

          <VerticalRestaurantList fullData={nearbyRestaurentItems} />
          <HomeBottomBanner marginBottom={15} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default Restaurant;
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
});
