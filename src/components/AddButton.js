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
import React, {useEffect, useState} from 'react';
import {COLORS, FONTS} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddButton = ({
  bottom = 0,
  position = 'relative',
  data = '',
  onPress,
  store_id,
  onCartUpdate,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [addOnItems, setaddOnItems] = useState([]);
  const [local_cartData, setlocal_CartData] = useState([]);

  const saveToCart = async newQuantity => {
    const basePrice = Number(data?.sale_price || 0);
    const totalPrice = newQuantity * basePrice;

    const cartItem = {
      food_item_id: data?.id,
      store_id: store_id ?? 0,
      quantity: newQuantity,
      addon_items: [],
      base_price: basePrice,
      addon_price: 0,
      total_price: totalPrice,
      image: data?.main_image?.large_image,
      name: data?.title,
      mrp_price: parseInt(data?.mrp),
    };

    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const isDifferentStore =
        cart.length > 0 && cart[0].store_id !== cartItem.store_id;

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
                const newCart = [cartItem];
                await AsyncStorage.setItem('cart', JSON.stringify(newCart));
                setlocal_CartData(newCart);
                onCartUpdate?.();
                setQuantity(newQuantity);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        // Item exists?
        const existingIndex = cart.findIndex(
          item => item.food_item_id === cartItem.food_item_id,
        );

        if (existingIndex >= 0) {
          cart[existingIndex] = cartItem;
        } else {
          cart.push(cartItem);
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        await AsyncStorage.setItem('cart_created_at', Date.now().toString());

        setlocal_CartData(cart);
        onCartUpdate?.();
        console.log('Item saved to cart:', cartItem);
      }
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  };

  useEffect(() => {
    const fetchInitialQuantity = async () => {
      try {
        const existingCart = await AsyncStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        const found = cart.find(item => item.food_item_id === data?.id);
        if (found) {
          setQuantity(found.quantity);
        }
      } catch (err) {
        console.error('Error loading initial cart quantity:', err);
      }
    };

    fetchInitialQuantity();
  }, []);

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

  const removeFromCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      cart = cart.filter(item => item.food_item_id !== data?.id);

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      await AsyncStorage.setItem('cart_created_at', Date.now().toString());

      setlocal_CartData(cart);
      console.log('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const increment = () => {
    setQuantity(prev => {
      const newQuantity = prev + 1;
      saveToCart(newQuantity); // ✅ Save on increment
      return newQuantity;
    });
  };

  const decrement = () => {
    setQuantity(prev => {
      if (prev > 1) {
        const newQuantity = prev - 1;
        saveToCart(newQuantity); // ✅ Save on decrement
        return newQuantity;
      } else if (prev === 1) {
        removeFromCart(); // ✅ Optional: remove when quantity becomes 0
        return 0;
      }
      return prev;
    });
  };

  return (
    <>
      {data?.addon_items?.length != 0 ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            height: normalize(22),
            width: normalize(80),
            borderRadius: normalize(5),
            borderWidth: normalize(1),
            borderColor: COLORS.red,
            backgroundColor: COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
            position: position,
            alignSelf: 'center',
            bottom: normalize(bottom),
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.PoppinsSemiBold,
              fontSize: normalize(10),
              color: COLORS.red,
            }}>
            ADD
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {quantity == 0 ? (
            <TouchableOpacity
              onPress={increment}
              style={{
                height: normalize(22),
                width: normalize(80),
                borderRadius: normalize(5),
                borderWidth: normalize(1),
                borderColor: COLORS.red,
                backgroundColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                position: position,
                alignSelf: 'center',
                bottom: normalize(bottom),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(10),
                  color: COLORS.red,
                }}>
                ADD
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                height: normalize(22),
                width: normalize(80),
                borderRadius: normalize(5),
                borderWidth: normalize(1),
                borderColor: COLORS.red,
                backgroundColor: COLORS.white,
                justifyContent: 'space-between',
                alignItems: 'center',
                position: position,
                alignSelf: 'center',
                bottom: normalize(bottom),
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={decrement}
                style={{
                  height: normalize(22),
                  width: normalize(22),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.PoppinsSemiBold,
                    fontSize: normalize(12),
                    color: COLORS.red,
                  }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(11),
                  color: COLORS.red,
                }}>
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={increment}
                style={{
                  height: normalize(22),
                  width: normalize(22),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.PoppinsSemiBold,
                    fontSize: normalize(12),
                    color: COLORS.red,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default AddButton;
