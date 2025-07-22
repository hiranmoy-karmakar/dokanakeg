import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, LOTTIE } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from '../../components/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {
  activeAddressRequest,
  allAddressListRequest,
  placeOrderRequest,
} from '../../redux/reducer/ProfileReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import { useDispatch, useSelector } from 'react-redux';

let status = '';
const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [cart, setCart] = useState([]);
  const [deliveryCheck, setdeliveryCheck] = useState('delivery');
  const [paymentMethod, setpaymentMethod] = useState('COD');
  const [activeAddress, setactiveAddress] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    type: '',
    landmark: '',
  });
  console.log('jajajajajajaja', cart);

  const fetchCartData = async () => {
    try {
      const data = await AsyncStorage.getItem('cart');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setCart(parsedData);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error reading cart data:', error);
    }
  };

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(activeAddressRequest());
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  useEffect(() => {
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

  const onPressPlaceOrder = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const subtotal = cart.reduce((acc, item) => acc + item.total_price, 0);

      const obj = {
        order_type: 'food',
        store_id: cart.length > 0 ? cart[0].store_id : null, // assuming all items are from same store
        cart: cart,
        subtotal: subtotal,
        tax_amount: taxes, // Update if needed
        shipping_cost: deliveryCharge, // Update if needed
        discount_amount: discount, // Update if needed
        total: totalPayable, // subtotal + tax/shipping - discount
        delivery_address:
          deliveryCheck === 'pickup'
            ? null
            : {
                name: activeAddress?.name,
                phone: activeAddress?.phone,
                address: activeAddress?.address,
                landmark: activeAddress?.landmark,
                pincode: activeAddress?.pincode,
              },
        delivery_type: deliveryCheck, // 'pickup' or 'delivery'
        payment: {
          payment_method: paymentMethod.toLowerCase(), // 'cod' or 'online'
          payment_reference: null, // You can add Razorpay ref here if online
        },
      };
      console.log('youuuu', obj);

      connectionrequest()
        .then(() => {
          dispatch(placeOrderRequest(obj)); // Dispatch the structured payload
        })
        .catch(err => {
          console.log(err);
          ShowAlert('Please connect to internet');
        });
    } catch (error) {
      console.error('Error placing order:', error);
      ShowAlert('Something went wrong while placing the order');
    }
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/placeOrderRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/placeOrderSuccess':
        status = ProfileReducer.status;
        clearCart();
        navigation.navigate('SuccessScreen');
        break;
      case 'Profile/placeOrderFailure':
        status = ProfileReducer.status;
      ////
      case 'Profile/activeAddressRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/activeAddressSuccess':
        status = ProfileReducer.status;
        const data = ProfileReducer?.activeAddressResponse?.data[0];

        setactiveAddress({
          name: data?.name || '',
          phone: data?.phone || '',
          address: data?.address || '',
          pincode: data?.pincode || '',
          type: data?.type || '',
          landmark: data?.landmark || '',
        });
        break;
      case 'Profile/activeAddressFailure':
        status = ProfileReducer.status;
      ////
    }
  }

  const updateQty = async (entry, type) => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cartData = existingCart ? JSON.parse(existingCart) : [];

      const index = cartData.findIndex(
        item =>
          item.food_item_id === entry.food_item_id &&
          JSON.stringify(item.addon_items) ===
            JSON.stringify(entry.addon_items),
      );

      if (index !== -1) {
        if (type === 'inc') {
          cartData[index].quantity += 1;
        } else {
          cartData[index].quantity -= 1;
          if (cartData[index].quantity <= 0) {
            cartData.splice(index, 1);
          }
        }

        if (cartData[index]) {
          cartData[index].total_price =
            (cartData[index].base_price + cartData[index].addon_price) *
            cartData[index].quantity;
        }
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
      setCart(cartData);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.total_price || 0), 0);
  const deliveryCharge = 0;
  const discount = 0;
  const taxes = 0;
  const packaging = 30;
  const convenience = 30;
  const platformFee = 30;

  const totalPayable =
    subtotal +
    deliveryCharge +
    taxes +
    packaging +
    convenience +
    platformFee -
    discount;

  const PriceRow = ({ label, value }) => (
    <>
      <View style={styles.priceRowBox}>
        <Text style={styles.priceLabel}>{label}</Text>
        <Text style={styles.priceValue}>{value}</Text>
      </View>
      <View style={[styles.dottline, { marginVertical: normalize(2) }]}></View>
    </>
  );

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
        <HomeHeader />

        {cart.length == 0 ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <LottieView
              source={LOTTIE.nodatafound2} // path to your JSON file
              autoPlay
              loop
              style={{ width: normalize(200), height: normalize(200) }}
            />
          </View>
        ) : (
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cartVw}>
              {cart.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.details}>
                    <Text numberOfLines={1} style={styles.name}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      onPress={() => updateQty(item, 'dec')}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQty(item, 'inc')}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.original}>
                      ₹
                      {(
                        (item.mrp_price + item.addon_price) *
                        item.quantity
                      ).toFixed(2)}
                    </Text>
                    <Text style={styles.discounted}>
                      ₹{item.total_price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.cartVw}>
              <Text style={styles.sectionHeader}>Price Details</Text>
              <PriceRow label="Subtotal" value={`₹${subtotal}`} />
              <PriceRow label="Delivery Charges" value={`₹${deliveryCharge}`} />
              <PriceRow label="Discounts" value={`-₹${discount}`} />
              <PriceRow label="Taxes (GST/VAT)" value={`₹${taxes}`} />
              <PriceRow label="Packaging Charges" value={`₹${packaging}`} />
              <PriceRow label="Convenience Fee" value={`₹${convenience}`} />
              <PriceRow label="Platform Fee" value={`₹${platformFee}`} />
              <PriceRow label="Total Payable" value={`₹${totalPayable}`} />
            </View>

            <View style={styles.deliveryVw}>
              <Text style={styles.sectionHeader}>Select Delivery Option</Text>

              <View style={styles.smallVw}>
                <TouchableOpacity
                  onPress={() => setdeliveryCheck('pickup')}
                  style={styles.delType}
                >
                  <Image
                    source={
                      deliveryCheck === 'pickup'
                        ? IMAGES.checkon
                        : IMAGES.checkoff
                    }
                    resizeMode="contain"
                    style={styles.btn}
                  />
                  <Text
                    style={[styles.priceLabel, { marginLeft: normalize(10) }]}
                  >
                    Pick up from restaurant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setdeliveryCheck('delivery')}
                  style={styles.delType}
                >
                  <Image
                    source={
                      deliveryCheck === 'delivery'
                        ? IMAGES.checkon
                        : IMAGES.checkoff
                    }
                    resizeMode="contain"
                    style={styles.btn}
                  />
                  <Text
                    style={[styles.priceLabel, { marginLeft: normalize(10) }]}
                  >
                    Home delivery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.deliveryVw}>
              <Text style={styles.sectionHeader}>Payment Method</Text>

              <View style={styles.smallVw}>
                <TouchableOpacity
                  onPress={() => setpaymentMethod('COD')}
                  style={styles.delType}
                >
                  <Image
                    source={
                      paymentMethod === 'COD' ? IMAGES.checkon : IMAGES.checkoff
                    }
                    resizeMode="contain"
                    style={styles.btn}
                  />
                  <Text
                    style={[styles.priceLabel, { marginLeft: normalize(10) }]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setpaymentMethod('online')}
                  style={styles.delType}
                >
                  <Image
                    source={
                      paymentMethod === 'online'
                        ? IMAGES.checkon
                        : IMAGES.checkoff
                    }
                    resizeMode="contain"
                    style={styles.btn}
                  />
                  <Text
                    style={[styles.priceLabel, { marginLeft: normalize(10) }]}
                  >
                    Online Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {deliveryCheck == 'pickup' ? null : (
              <View style={styles.deliveryVw}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.sectionHeader}>
                    Selected Delivery Address
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddressChange');
                    }}
                  >
                    <Text
                      style={[
                        styles.priceLabel,
                        {
                          color: COLORS.themeGreen,
                          marginRight: normalize(10),
                        },
                      ]}
                    >
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={
                      activeAddress?.type == 'home'
                        ? IMAGES.homeaddress
                        : activeAddress?.type == 'work'
                        ? IMAGES.workaddress
                        : IMAGES.otheraddress
                    }
                    resizeMode="contain"
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                    }}
                  />
                  {/* <Text
                    style={[
                      styles.priceLabel,
                      {
                        color: COLORS.red,
                        marginRight: normalize(10),
                        marginLeft: normalize(5),
                      },
                    ]}>
                    Work
                  </Text> */}
                </View>
                <Text style={[styles.nameLabel]}>{activeAddress?.name}</Text>
                <Text style={[styles.phoneLabel]}>{activeAddress?.phone}</Text>
                <Text style={[styles.priceLabel, { color: COLORS.deepGrey }]}>
                  {activeAddress?.address}
                </Text>
                {activeAddress?.landmark ? (
                  <Text style={[styles.priceLabel, { color: COLORS.deepGrey }]}>
                    Near, {activeAddress?.landmark}
                  </Text>
                ) : null}
              </View>
            )}

            <View style={styles.bottomPrice}>
              <View
                style={{
                  height: normalize(60),
                  width: normalize(130),
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.moneyTxt}>{`₹${totalPayable}`}</Text>
                <Text style={styles.amountTxt}>All total amount</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  paymentMethod === 'online' ? null : onPressPlaceOrder();
                }}
                style={styles.procedBtn}
              >
                <Text
                  style={[
                    styles.moneyTxt,
                    { color: COLORS.themeViolet, fontSize: normalize(15) },
                  ]}
                >
                  {paymentMethod === 'online'
                    ? 'Proceed to Pay'
                    : 'Place Order'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({
  cartVw: {
    padding: normalize(10),
    borderRadius: normalize(10),
    backgroundColor: COLORS.white,
    marginTop: normalize(20),
    marginHorizontal: normalize(10),
  },
  dottline: {
    height: normalize(1),
    borderWidth: normalize(1),
    borderColor: COLORS.blue,
    borderStyle: 'dashed',
    marginVertical: normalize(8),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  image: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(5),
  },
  details: { width: normalize(140) },
  name: {
    color: COLORS.themeGreen,
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsMedium,
  },
  priceRow: {
    height: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  original: {
    textDecorationLine: 'line-through',
    color: COLORS.deepGrey,
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsSemiBold,
    top: normalize(2),
  },
  discounted: {
    color: COLORS.themeViolet,
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsSemiBold,
    bottom: normalize(2),
  },
  qtyContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.themeViolet,
    borderRadius: normalize(8),
    alignItems: 'center',
    width: normalize(60),
    justifyContent: 'space-evenly',
    height: normalize(25),
    backgroundColor: COLORS.blue,
  },
  qtyBtn: {
    height: normalize(20),
    width: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: normalize(14),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
  },
  qty: {
    fontSize: normalize(12),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
  },
  sectionHeader: {
    fontSize: normalize(14),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
    marginBottom: normalize(10),
  },
  priceRowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(4),
  },
  priceLabel: {
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.themeGreen,
  },
  nameLabel: {
    fontSize: normalize(13),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
  },
  phoneLabel: {
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
  },
  priceValue: {
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.themeViolet,
  },
  deliveryVw: {
    // height: normalize(110),
    width: normalize(300),
    backgroundColor: COLORS.white,
    borderRadius: normalize(10),
    alignSelf: 'center',
    marginTop: normalize(20),
    paddingLeft: normalize(10),
    paddingVertical: normalize(10),
  },
  smallVw: {
    height: normalize(60),
    width: normalize(200),
  },
  delType: {
    flexDirection: 'row',
    height: normalize(25),
    width: normalize(180),
    alignItems: 'center',
  },
  btn: {
    height: normalize(15),
    width: normalize(15),
  },
  bottomPrice: {
    height: normalize(60),
    width: normalize(300),
    backgroundColor: COLORS.themeGreen,
    borderRadius: normalize(10),
    alignSelf: 'center',
    marginTop: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: normalize(20),
  },
  moneyTxt: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(20),
    color: COLORS.themeViolet,
  },
  amountTxt: {
    color: COLORS.blue,
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(13),
  },
  procedBtn: {
    height: normalize(40),
    width: normalize(140),
    backgroundColor: COLORS.blue,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
