import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import {COLORS, FONTS} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import DetailsHeader from '../../components/DetailsHeader';
import {
  orderDetailsRequest,
  orderListRequest,
} from '../../redux/reducer/ProfileReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

let status = '';
const RestaurantOrderDetails = props => {
  const id = props?.route?.params?.id;
  const name = props?.route?.params?.name;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [data, setdata] = useState('');

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(orderDetailsRequest(id));
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

    if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/orderDetailsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/orderDetailsSuccess':
        status = ProfileReducer.status;
        setdata(ProfileReducer?.orderDetailsResponse?.data)
        break;
      case 'Profile/orderDetailsFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
    }
  }
  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.offwhite}}>
        <DetailsHeader pagename={name} />
        <ScrollView contentContainerStyle={{padding: normalize(15)}}>
          {/* Order Info */}
          <View style={styles.card}>
            <Text style={styles.orderId}>
              Order No:{' '}
              {data?.order_number}
            </Text>
            <Text style={styles.status}>
              Status:{' '}
              {
                data?.latest_status
                  ?.status
              }
            </Text>
            <Text style={styles.label}>
              Placed on:{' '}
              {moment(
                data?.created_at,
              ).format('DD MMM YYYY, hh:mm A')}
            </Text>
            <Text style={styles.label}>
              Delivery type:{' '}
              {data?.delivery_type?.toUpperCase()}
            </Text>
            <Text style={styles.label}>
              Payment:{' '}
              {data?.payment_method?.toUpperCase()}
            </Text>
            <Text style={[styles.label, {color: COLORS.themeViolet}]}>
              Payment Status:{' '}
              {data?.payment_status?.toUpperCase()}
            </Text>
          </View>

          {/* Store Info */}
          <View style={styles.card}>
            <Text style={styles.heading}>Store:</Text>
            <Text style={styles.label}>
              {data?.store?.name}
            </Text>
            <Text style={styles.subText}>
              {data?.store?.address}
            </Text>
          </View>

          {/* Ordered Items */}
          <Text style={styles.heading}>Items</Text>
          {data?.order_items?.map(
            (item, index) => {
              const food = item?.item?.main_item;
              return (
                <View key={index} style={styles.itemCard}>
                  <Image
                    source={{uri: food?.main_image?.small_image}}
                    style={styles.foodImage}
                  />
                  <View style={{flex: 1, marginLeft: normalize(10)}}>
                    <Text style={styles.itemTitle}>{food?.title}</Text>
                    <Text style={styles.itemQty}>Qty: {item?.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{item?.total_price}</Text>
                    {item?.item?.addons?.length > 0 && (
                      <View style={{marginTop: normalize(5)}}>
                        <Text
                          style={{
                            fontFamily: FONTS.PoppinsSemiBold,
                            color: COLORS.themeGreen,
                          }}>
                          Addons:
                        </Text>
                        {item?.item?.addons.map((addon, i) => (
                          <Text key={i} style={styles.subText}>
                            • {addon?.name} - ₹{addon?.price}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            },
          )}

          {/* Billing & Shipping */}
          <Text style={styles.heading}>Delivery Address</Text>
          <View style={styles.card}>
            {data?.delivery_type ==
            'delivery' ? (
              <>
                <Text style={styles.label}>
                  {
                    data?.shipping_address
                      ?.name
                  }
                </Text>
                <Text style={styles.subText}>
                  {
                    data?.shipping_address
                      ?.address
                  }
                </Text>
                <Text style={styles.subText}>
                  Landmark:{' '}
                  {
                    data?.shipping_address
                      ?.landmark
                  }
                </Text>
                <Text style={styles.subText}>
                  Phone:{' '}
                  {
                    data?.shipping_address
                      ?.phone
                  }
                </Text>
                <Text style={styles.subText}>
                  Pincode:{' '}
                  {
                    data?.shipping_address
                      ?.pincode
                  }
                </Text>
              </>
            ) : (
              <Text style={styles.label}>Pickup From Store</Text>
            )}
          </View>

          {/* Price Summary */}
          <View style={styles.priceCard}>
            <Text style={styles.label}>
              Subtotal: ₹{data?.subtotal}
            </Text>
            <Text style={styles.label}>
              Total: ₹{data?.total}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default RestaurantOrderDetails;
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: normalize(12),
    borderRadius: normalize(10),
    marginBottom: normalize(15),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
    elevation: 1,
  },
  foodImage: {
    height: normalize(70),
    width: normalize(70),
    borderRadius: normalize(10),
  },
  heading: {
    fontSize: normalize(16),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
    marginBottom: normalize(5),
  },
  label: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(14),
    color: COLORS.themeGreen,
    marginBottom: 2,
  },
  subText: {
    fontSize: normalize(12),
    color: COLORS.blue,
    fontFamily: FONTS.PoppinsRegular,
  },
  orderId: {
    fontSize: normalize(15),
    fontWeight: '700',
    marginBottom: 4,
    color: COLORS.themeGreen,
  },
  status: {
    fontSize: normalize(14),
    color: COLORS.themeViolet,
    fontFamily: FONTS.PoppinsRegular,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: normalize(14),
    color: COLORS.themeGreen,
    fontFamily: FONTS.PoppinsMedium,
  },
  itemQty: {
    fontSize: normalize(12),
    color: COLORS.blue,
    fontFamily: FONTS.PoppinsRegular,
  },
  itemPrice: {
    fontSize: normalize(13),
    fontWeight: '700',
    marginTop: 4,
    color: COLORS.themeViolet,
  },
  priceCard: {
    backgroundColor: COLORS.white,
    padding: normalize(15),
    borderRadius: normalize(10),
    marginTop: normalize(10),
    marginBottom: normalize(20),
    elevation: 2,
  },
});
