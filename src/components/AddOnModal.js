import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import AddButton from './AddButton';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddOnModal = ({
  addOnVisible,
  setaddOnVisible,
  fullData,
  nearbyRestaurentItems,
  onAddItem,
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleSelection = itemId => {
    setSelectedAddOns(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  const increment = () => {
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const totalPrice = useMemo(() => {
    const productPrice = Number(fullData?.sale_price || 0);
    const selectedAddOnTotal = fullData?.addon_items
      ?.filter(addon => selectedAddOns.includes(addon.id))
      ?.reduce((sum, addon) => sum + Number(addon.price), 0);

    return quantity * (productPrice + selectedAddOnTotal);
  }, [quantity, selectedAddOns, fullData]);

  const cutPrice = useMemo(() => {
    const productPrice = Number(fullData?.mrp || 0);
    const selectedAddOnTotal = fullData?.addon_items
      ?.filter(addon => selectedAddOns.includes(addon.id))
      ?.reduce((sum, addon) => sum + Number(addon.price), 0);

    return quantity * (productPrice + selectedAddOnTotal);
  }, [quantity, selectedAddOns, fullData]);

  const handleAddToCart = async () => {
    const addonData = fullData?.addon_items
      ?.filter(addon => selectedAddOns.includes(addon.id))
      ?.map(addon => ({
        id: addon.id,
        title: addon.title,
        price: Number(addon.price),
      }));

    const productPrice = Number(fullData?.sale_price || 0);
    const selectedAddOnTotal = addonData.reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    const total_price = quantity * (productPrice + selectedAddOnTotal);

    const cartItem = {
      food_item_id: fullData?.id,
      store_id: nearbyRestaurentItems?.id,
      quantity,
      addon_items: addonData,
      base_price: productPrice,
      addon_price: selectedAddOnTotal,
      total_price,
      image: fullData?.main_image?.large_image,
      name: fullData?.title,
      mrp_price: parseInt(fullData?.mrp),
    };

    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];

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
                onAddItem?.();
                setaddOnVisible(false);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        // Add or update item
        const existingIndex = cart.findIndex(
          item =>
            item.food_item_id === cartItem.food_item_id &&
            item.store_id === cartItem.store_id &&
            JSON.stringify(item.addon_items) ===
              JSON.stringify(cartItem.addon_items),
        );

        if (existingIndex >= 0) {
          cart[existingIndex].quantity += cartItem.quantity;
          cart[existingIndex].total_price =
            cart[existingIndex].quantity *
            (cart[existingIndex].base_price + cart[existingIndex].addon_price);
        } else {
          cart.push(cartItem);
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        await AsyncStorage.setItem('cart_created_at', Date.now().toString());

        onAddItem?.();
        setaddOnVisible(false);
      }
    } catch (error) {
      console.error('Error saving cart item:', error);
    }
  };

  const handleClose = () => {
    onAddItem();
    setaddOnVisible(false);
  };
  return (
    <View style={styles.container}>
      <Modal
        isVisible={addOnVisible}
        // onBackdropPress={handleClose}
        style={styles.modalContainer}
        swipeDirection="down"
        // onSwipeComplete={handleClose}
        onSwipeComplete={setaddOnVisible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop
        propagateSwipe>
        <View
          style={{
            backgroundColor: COLORS.themeGreen,
            borderTopRightRadius: normalize(12),
            borderTopLeftRadius: normalize(12),
            overflow: 'hidden',
            maxHeight: normalize(450),
          }}>
          <View
            style={{
              height: normalize(50),
              backgroundColor: COLORS.blue,

              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: normalize(15),
              borderBottomWidth: 1,
              borderBottomColor: COLORS.bordergrey,
            }}>
            <View
              style={{
                height: normalize(50),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: fullData?.main_image?.large_image}}
                resizeMode="contain"
                style={{
                  height: normalize(35),
                  width: normalize(35),
                  borderRadius: normalize(5),
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: normalize(15),
                  color: COLORS.themeViolet,
                  fontFamily: FONTS.PoppinsMedium,
                  textTransform: 'capitalize',
                  marginLeft: normalize(10),
                  width: normalize(220),
                }}>
                {fullData?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Image
                source={IMAGES.close}
                resizeMode="contain"
                style={{height: normalize(20), width: normalize(20)}}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{paddingBottom: normalize(10)}}
            showsVerticalScrollIndicator={false}>
            {fullData?.addon_items?.map((item, index) => {
              const isSelected = selectedAddOns.includes(item.id);
              return (
                <TouchableOpacity
                  key={index}
                  style={{backgroundColor: COLORS.themeGreen}}
                  onPress={() => toggleSelection(item.id)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: normalize(15),
                      paddingVertical: normalize(5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={isSelected ? IMAGES.check : IMAGES.notcheck} // You need checkoff image
                        resizeMode="contain"
                        style={{height: normalize(14), width: normalize(14)}}
                      />
                      <Text
                        style={{
                          fontFamily: FONTS.PoppinsSemiBold,
                          fontSize: normalize(14),
                          color: COLORS.themeViolet,
                          marginLeft: normalize(10),
                        }}>
                        {item.title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: normalize(14),
                        color: COLORS.themeViolet,
                        marginLeft: normalize(10),
                      }}>
                      ₹ {item.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View
            style={{
              height: normalize(65),
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              backgroundColor: COLORS.themeGreen,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: normalize(22),
                width: normalize(80),
                borderRadius: normalize(5),
                borderWidth: normalize(1),
                borderColor: COLORS.themeViolet,
                backgroundColor: COLORS.blue,
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
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
                    color: COLORS.themeViolet,
                  }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(11),
                  color: COLORS.themeViolet,
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
                    color: COLORS.themeViolet,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleAddToCart}
              style={{
                height: normalize(35),
                backgroundColor: COLORS.blue,
                borderRadius: normalize(10),
                paddingHorizontal: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(12),
                  color: COLORS.themeViolet,
                }}>
                Add Item | {totalPrice}
              </Text>

              <Text
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(12),
                  color: COLORS.bgGrey,
                  textDecorationLine: 'line-through',
                  textDecorationColor: COLORS.themeViolet,
                  marginLeft: normalize(5),
                }}>
                {cutPrice}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddOnModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.themeGreen,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
