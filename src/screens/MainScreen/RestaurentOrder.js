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
import {orderListRequest} from '../../redux/reducer/ProfileReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

let status = '';
const RestaurentOrder = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [orderList, setorderList] = useState([]);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(orderListRequest());
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/orderListRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/orderListSuccess':
        status = ProfileReducer.status;
        setorderList(ProfileReducer?.orderListResponse?.data || []);
        break;
      case 'Profile/orderListFailure':
        status = ProfileReducer.status;
        break;
    }
  }

  const renderOrderCard = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RestaurantOrderDetails', {
            id: item.id,
            name: item.store.name,
          });
        }}
        style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.storeName}>{item?.store?.name}</Text>
          <Text
            style={[
              styles.status,
              item.latest_status.slug === 'pending'
                ? styles.pending
                : styles.completed,
            ]}>
            {item.latest_status.status}
          </Text>
        </View>

        <Text style={styles.orderId}>Order ID: {item.order_number}</Text>
        <Text style={[styles.orderId, {textTransform: 'capitalize'}]}>
          Delevery Type: {item.delivery_type}
        </Text>

        {item?.delivery_type == 'delivery' ? (
          <>
            <Text style={styles.address}>
              Name: {item.shipping_address.name}
            </Text>
            <Text style={[styles.address, {marginBottom: 6}]}>
              Delevery Address: {item.shipping_address.address}
            </Text>
          </>
        ) : (
          <Text style={[styles.address, {marginBottom: 6}]}>
            Pickup Address: {item.store.address}
          </Text>
        )}

        {item.order_items.map((orderItem, idx) => {
          const product = orderItem.item.main_item;
          return (
            <View key={idx} style={styles.itemRow}>
              <Image
                source={{uri: product?.main_image?.small_image}}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{product.title}</Text>
                <Text style={styles.itemPrice}>
                  {orderItem.quantity} × ₹
                  {parseFloat(orderItem.unit_price).toFixed(2)} = ₹
                  {parseFloat(orderItem.total_price).toFixed(2)}
                </Text>

                {orderItem.item.addons?.length > 0 && (
                  <View style={styles.addonBox}>
                    {orderItem.item.addons.map((addon, i) => (
                      <Text key={i} style={styles.addonText}>
                        + {addon.name} (₹{addon.price})
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.totalText}>Total: ₹{item.total}</Text>
            <Text style={styles.totalText}>
              Status: {item.latest_status.status}
            </Text>
          </View>
          <Text style={styles.payment}>
            Payment:{' '}
            <Text style={styles.paymentStatus}>{item.payment_status}</Text> (
            {item.payment_method.toUpperCase()})
          </Text>
          <Text style={styles.dateText}>
            Placed on:{' '}
            {moment(item.created_at).format('DD MMM, YYYY - hh:mm A')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.offwhite}}>
        <DetailsHeader pagename={'Restaurant Order List'} />
        <FlatList
          data={orderList}
          showsVerticalScrollIndicator={false}
          renderItem={renderOrderCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 10}}
          ListEmptyComponent={
            <Text
              style={{textAlign: 'center', marginTop: 50, color: COLORS.grey}}>
              No orders found
            </Text>
          }
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginVertical: 10,
    padding: 14,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.themeGreen,
    width:normalize(230),
  },
  status: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    color: COLORS.blue,
  },
  pending: {
    backgroundColor: COLORS.warning,
  },
  completed: {
    backgroundColor: COLORS.success,
  },
  orderId: {
    fontSize: 12,
    color: COLORS.themeViolet,
  },
  address: {
    fontSize: 12,
    color: COLORS.themeViolet,
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.themeViolet,
  },
  itemInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.themeGreen,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.themeViolet,
  },
  addonBox: {
    marginTop: 4,
  },
  addonText: {
    fontSize: 12,
    color: COLORS.themeViolet,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.themeViolet,
    marginTop: 10,
    paddingTop: 6,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.themeGreen,
  },
  payment: {
    fontSize: 13,
    color: COLORS.themeViolet,
  },
  paymentStatus: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.themeViolet,
  },
});

export default RestaurentOrder;
