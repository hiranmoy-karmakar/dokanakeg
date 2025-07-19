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
import React, {useEffect, useState} from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, FONTS, IMAGES} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import OtherHeader from '../../components/OtherHeader';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {
  getCurrentLocation,
  getStoredLocation,
} from '../../components/LocationService';

let status = '';
const RestaurantListByCategory = props => {
  const navigation = useNavigation();
  const {categoryName} = props?.route?.params;
  const itemId = props?.route?.params?.itemId;

  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation(); // to fetch and store
      // console.log('Current Location:', location);
    })();
  }, []);

  const location = getStoredLocation(); // access anytime later
  // console.log('Stored Location:', location);


  const nearbyRestaurentItems = [
    {
      id: '1',
      name: 'BawArchi Family Restaurant',
      image: IMAGES.foodMid3,
      price: '₹50',
      off: '10%',
      time: '30-35 mins',
      rateing: '4.5',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
    {
      id: '2',
      name: 'Tandoori Hut',
      image: IMAGES.foodMid3,
      price: '₹100',
      off: '15%',
      time: '25-30 mins',
      rateing: '4.0',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
    {
      id: '3',
      name: 'Spice Junction',
      image: IMAGES.foodMid1,
      price: '₹200',
      off: '20%',
      time: '20-25 mins',
      rateing: '4.8',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
    {
      id: '4',
      name: 'Tandoori Hut',
      image: IMAGES.foodMid2,
      price: '₹150',
      off: '10%',
      time: '30-35 mins',
      rateing: '4.5',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
    {
      id: '5',
      name: 'Spice Junction',
      image: IMAGES.foodMid1,
      price: '₹120',
      off: '15%',
      time: '25-30 mins',
      rateing: '4.0',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
    {
      id: '6',
      name: 'Khana Khazana',
      image: IMAGES.foodMid2,
      price: '₹80',
      off: '20%',
      time: '20-25 mins',
      rateing: '4.8',
      rateingAmount: '9.8+',
      details: `Mutton Kacchi Biryani, Nawabi Chicken, Rice
  Pudding, Masala Cold Drink, Kiwi Mojito, Chicken
  Reshmi Masala...`,
      address: 'Opp bijoygarh College, Jadavpur, 1.3 km',
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RestaurantFoodList', {
          nearbyRestaurentItems: item,
        });
      }}
      style={styles.card}>
      <View
        style={{
          height: normalize(110),
          width: normalize(95),
          borderRadius: normalize(12),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={IMAGES.foodMid2}
          style={styles.image}
          imageStyle={{borderRadius: normalize(12)}}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['transparent', COLORS.black]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: normalize(110),
          }}
        />

        <View style={styles.dealVw}>
          <Text style={styles.dealTxt}>FLAT DEAL</Text>
          <Text style={styles.dealTxt2}>{item.price} OFF</Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'space-evenly',
          marginLeft: normalize(5),
          paddingVertical: normalize(7),
        }}>
        <View style={{width: normalize(210)}}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
        </View>
        <View style={styles.rvwTime}>
          <Image
            source={IMAGES.star}
            resizeMode="contain"
            style={{height: normalize(13), width: normalize(13)}}
          />
          <Text numberOfLines={1} style={[styles.timeTxt]}>
            {item.off} ◎ {item.time}
          </Text>
        </View>

        <View
          style={{
            width: normalize(210),
            flexDirection: 'row',
          }}>
          <Image
            source={IMAGES.maps}
            resizeMode="contain"
            style={{
              height: normalize(12),
              width: normalize(12),
              marginLeft: normalize(2),
            }}
          />
          <Text numberOfLines={1} style={styles.address}>
            {item.address}
          </Text>
        </View>

        <View
          style={{
            width: normalize(210),
            height: normalize(30),
            flexDirection: 'row',
          }}>
          <Text numberOfLines={3} style={styles.detailsTxt}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
     <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <OtherHeader pagename={categoryName} />
          <View
            style={{
              height: normalize(590),
              width: normalize(320),
              alignSelf: 'center',
              marginTop:
                Platform.OS == 'android' ? normalize(10) : normalize(5),
            }}>
            <FlatList
              // ref={listRef}
              showsVerticalScrollIndicator={false}
              data={nearbyRestaurentItems}
              // horizontal
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              // onEndReached={() => {
              //   listRef.current.scrollToOffset({offset: 0, animated: false});
              // }}
              onEndReachedThreshold={0.5}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default RestaurantListByCategory;
const styles = StyleSheet.create({
  card: {
    height: normalize(110),
    margin: normalize(4),
    flexDirection: 'row',
  },
  image: {
    height: normalize(110),
    width: normalize(95),
    borderRadius: normalize(12),
    // opacity: 0.9,
    zIndex: 0,
  },
  title: {
    fontSize: normalize(13),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  timeTxt: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.black,
    marginLeft: normalize(5),
  },
  desc: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.black,
    marginLeft: normalize(5),
  },
  offpriceTxt: {
    fontSize: normalize(7),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.white,
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(3),
  },
  rvwTime: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // height: normalize(15),
    width: normalize(210),
    marginLeft: normalize(2),
  },
  detailsTxt: {
    textAlign: 'left',
    fontSize: normalize(8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    marginLeft: normalize(2),
  },
  address: {
    textAlign: 'left',
    fontSize: normalize(8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    paddingRight: normalize(20),
    paddingLeft: normalize(2),
  },
  dealVw: {
    height: normalize(35),
    width: normalize(70),
    position: 'absolute',
    alignSelf: 'flex-start',
    bottom: normalize(0),
    paddingLeft: normalize(10),
  },
  dealTxt: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: normalize(10),
    color: COLORS.white,
  },
  dealTxt2: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: normalize(11),
    color: COLORS.yellow,
  },
});
