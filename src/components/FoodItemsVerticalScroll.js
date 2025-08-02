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
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowAlert from '../utils/helpers/ShowAlert';

const FoodItemsVerticalScroll = ({fullData = [], onCartUpdate = () => {}}) => {
  const [local_cartData, setlocal_CartData] = useState([]);
  const infiniteData = Array(100).fill(fullData).flat();
  const listRef = useRef(null);
  const handleAddToCart = async item => {
    const quantity = 1;
    const productPrice = Number(item?.sale_price || 0);
    const total_price = quantity * productPrice;

    const newEntry = {
      food_item_id: item?.id,
      store_id: item?.store?.id ?? 0,
      quantity,
      addon_items: [],
      addon_price: 0,
      product_price: productPrice,
      base_price: productPrice,
      total_price,
      image: item?.main_image?.large_image,
      name: item?.title,
      mrp_price: parseInt(item?.mrp),
      type: 'restaurant',
    };

    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const isDifferentStore =
        cart.length > 0 && cart[0]?.store_id !== newEntry?.store_id;

      if (isDifferentStore) {
        Alert.alert(
          'Different Store',
          'Your cart contains items from another store. Do you want to clear the cart and add this item?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                const newCart = [newEntry];
                await AsyncStorage.setItem('cart', JSON.stringify(newCart));
                ShowAlert('Item added to cart successfully');
                fetchCartData();
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }

      // ✅ Proceed with add or update
      const index = cart.findIndex(
        c =>
          c.food_item_id === newEntry.food_item_id &&
          JSON.stringify(c.addon_items) ===
            JSON.stringify(newEntry.addon_items),
      );

      if (index !== -1) {
        cart[index].quantity += 1;
        cart[index].total_price =
          cart[index].quantity *
          (cart[index].base_price + cart[index].addon_price);
      } else {
        cart.push(newEntry);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      ShowAlert('Item added to cart successfully');
      fetchCartData();
    } catch (err) {
      console.error('Error adding item:', err);
      ShowAlert('Something went wrong while adding to cart');
    }
  };

  const fetchCartData = async () => {
    try {
      const data = await AsyncStorage.getItem('cart');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        console.log('local_cartData', parsedData); // Make sure this is being hit
        setlocal_CartData(parsedData);
        onCartUpdate(parsedData);
      } else {
        console.log('Cart is empty');
      }
    } catch (error) {
      console.error('Error reading cart data:', error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.card}>
      <View
        style={{
          height: normalize(110),
          width: normalize(92),
          borderRadius: normalize(10),
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: item?.main_image?.large_image}}
          style={styles.image}
          resizeMode="cover">
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
          <Text numberOfLines={1} style={styles.offpriceTxt}>
            20% OFF UPTO 200
          </Text>
        </ImageBackground>
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>

      <View style={styles.rvwTime}>
        <Image
          source={IMAGES.star}
          resizeMode="contain"
          style={{height: normalize(10), width: normalize(10)}}
        />
        <Text numberOfLines={1} style={[styles.timeTxt]}>
          {item.mrp}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.timeTxt, {textDecorationLine: 'line-through'}]}>
          ◎ {item.sale_price}
        </Text>
      </View>
      <Text numberOfLines={2} style={styles.detailsTxt}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        ref={listRef}
        data={infiniteData}
        horizontal
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onEndReached={() => {
          listRef.current.scrollToOffset({offset: 0, animated: false});
        }}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default FoodItemsVerticalScroll;
const styles = StyleSheet.create({
  card: {
    width: normalize(95),
    height: normalize(170),
    marginHorizontal: normalize(4),
  },
  image: {
    height: normalize(110),
    width: normalize(95),
    borderRadius: normalize(12),
  },
  title: {
    textAlign: 'left',
    marginTop: normalize(5),
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
    marginLeft: normalize(2),
  },
  timeTxt: {
    textAlign: 'left',
    fontSize: normalize(7),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.themeViolet,
    marginLeft: normalize(2),
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
    color: COLORS.blue,
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(3),
  },
  rvwTime: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: normalize(15),
    width: normalize(85),
    marginLeft: normalize(2),
  },
  detailsTxt: {
    textAlign: 'left',
    fontSize: normalize(6),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    marginLeft: normalize(2),
  },
});
