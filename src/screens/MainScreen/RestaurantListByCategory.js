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
import {useDispatch, useSelector} from 'react-redux';
import {restaurentListRequest} from '../../redux/reducer/ProfileReducer';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {
  getCurrentLocation,
  getStoredLocation,
} from '../../components/LocationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

let status = '';
const RestaurantListByCategory = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const {categoryName} = props?.route?.params;
  const itemId = props?.route?.params?.itemId;
  const [nearbyRestaurentItems, setnearbyRestaurentItems] = useState([]);
  const [local_cartData, setlocal_CartData] = useState([]);

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
    (async () => {
      const location = await getCurrentLocation(); // to fetch and store
      // console.log('Current Location:', location);
    })();
  }, []);

  const location = getStoredLocation(); // access anytime later
  // console.log('Stored Location:', location);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(
          restaurentListRequest({
            category_id: itemId,
            store_category_flag: 'restaurant',
          }),
        );
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/restaurentListRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/restaurentListSuccess':
        status = ProfileReducer.status;
        setnearbyRestaurentItems(ProfileReducer?.restaurentListResponse?.data);
        break;
      case 'Profile/restaurentListFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
    }
  }

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
          <Text style={styles.dealTxt2}>{item.price}10% OFF</Text>
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
            10% ◎ 30-35 mins
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
      {/* Floating View Cart */}
      {local_cartData?.length != 0 ? (
        <View style={styles.floatingCart}>
          <View style={styles.cartDetails}>
            <View style={styles.imagePlaceholder}>
              <Image
                source={{uri: local_cartData[0]?.image}}
                resizeMode="contain"
                style={{height: '100%', width: '100%'}}
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
                ]}>
                <Image
                  source={{uri: local_cartData[1]?.image}}
                  resizeMode="contain"
                  style={{height: '100%', width: '100%'}}
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
            style={styles.cartButton}>
            <Image
              source={IMAGES.downarrow}
              resizeMode="contain"
              style={{
                height: normalize(10),
                width: normalize(10),
                tintColor: COLORS.white,
                transform: [{rotate: '270deg'}],
              }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
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
    color: COLORS.themeGreen,
  },
  timeTxt: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.themeViolet,
    marginLeft: normalize(5),
  },
  desc: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.themeViolet,
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
    color: COLORS.blue,
  },
  ///////////////
    floatingCart: {
       position: 'absolute',
       bottom: normalize(50),
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
