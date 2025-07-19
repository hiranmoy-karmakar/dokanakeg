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
import React from 'react';
import normalize from '../utils/helpers/normalize';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';

const RestaurantInfoCard = ({data}) => {
  return (
    <View
      style={{
        // height: normalize(135),
        width: normalize(300),
        alignSelf: 'center',
        borderRadius: normalize(10),
        backgroundColor: COLORS.themeGreen,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: normalize(300),

          flexDirection: 'row',
        }}>
        <View
          style={{
            height: normalize(90),
            width: normalize(240),
            justifyContent: 'space-between',
            paddingVertical: normalize(6),
            paddingLeft: normalize(10),
          }}>
          <Text
          numberOfLines={1}
            style={{
              fontFamily: FONTS.PoppinsSemiBold,
              fontSize: normalize(15),
              color: COLORS.themeViolet,
            }}>
            {data?.name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.PoppinsMedium,
              fontSize: normalize(10),
              color: COLORS.themeViolet,
            }}>
            40-45 mins{'   '}•{'   '}2.2 km
          </Text>
          <Text
          numberOfLines={1}
            style={{
              fontFamily: FONTS.PoppinsMedium,
              fontSize: normalize(10),
              color: COLORS.deepGrey,
            }}>
            {data?.address}
          </Text>
          <View
            style={{
              height: normalize(20),
              width: normalize(50),
              borderRadius: normalize(5),
              backgroundColor: COLORS.lightGreen,
              borderWidth: 1,
              borderColor: COLORS.themeGreen,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONTS.PoppinsSemiBold,
                fontSize: normalize(10),
                color: COLORS.themeGreen,
              }}>
             {data?.is_open == true ? 'Open' : 'Close'} 
            </Text>
          </View>
        </View>
        <View
          style={{
            height: normalize(90),
            width: normalize(60),
            paddingVertical: normalize(8),
          }}>
          <View
            style={{
              height: normalize(20),
              width: normalize(45),
              backgroundColor: COLORS.themeGreen,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(5),
            }}>
            <Image
              source={IMAGES.smallstar}
              style={{
                height: normalize(9),
                width: normalize(9),
                marginRight: normalize(3),
                tintColor: COLORS.themeViolet,
              }}
            />
            <Text
              style={{
                fontFamily: FONTS.PoppinsSemiBold,
                fontSize: normalize(12),
                color: COLORS.themeViolet,
              }}>
              4.2
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FONTS.PoppinsMedium,
              fontSize: normalize(7),
              color: COLORS.themeViolet,
              marginTop: normalize(5),
            }}>
            50k Ratings
          </Text>
        </View>
      </View>
      <View
        style={{
          height: normalize(35),
          width: normalize(300),
          backgroundColor: COLORS.blue,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: normalize(10),
        }}>
        <Image
          source={IMAGES.smallclock}
          resizeMode="contain"
          style={{
            height: normalize(14),
            width: normalize(14),
            tintColor: COLORS.themeViolet,
          }}
        />
        <Text
          style={{
            fontFamily: FONTS.PoppinsSemiBold,
            fontSize: normalize(10),
            color: COLORS.themeViolet,
            marginLeft: normalize(5),
          }}>
          30-35 mins
        </Text>
        <Text
          style={{
            fontFamily: FONTS.PoppinsRegular,
            fontSize: normalize(10),
            color: COLORS.themeViolet,
            marginLeft: normalize(5),
          }}>
          Delivery time
        </Text>
      </View>
    </View>
  );
};

export default RestaurantInfoCard;
