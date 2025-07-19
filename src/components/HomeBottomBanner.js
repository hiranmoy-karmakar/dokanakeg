import {View, Text, Image} from 'react-native';
import React from 'react';
import normalize from '../utils/helpers/normalize';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';

const HomeBottomBanner = ({marginBottom = 0}) => {
  return (
    <>
      <View
        style={{
          height: normalize(80),
          width: normalize(310),
          backgroundColor: COLORS.themeGreen,
          borderRadius: normalize(12),
          alignSelf: 'center',
          flexDirection: 'row',
          marginTop: normalize(15),
          marginBottom: normalize(marginBottom)
        }}>
        <View
          style={{
            height: '100%',
            width: normalize(220),
            justifyContent: 'space-evenly',
            paddingLeft: normalize(10),
            paddingVertical: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: normalize(20),
              width: normalize(200),
              alignItems: 'center',
            }}>
            <Image
              source={IMAGES.clock}
              resizeMode="contain"
              style={{height: normalize(14), width: normalize(14)}}
            />
            <Text
              style={{
                fontSize: normalize(12),
                color: COLORS.white,
                marginLeft: normalize(5),
                fontFamily: FONTS.PoppinsExtraBold,
                textTransform: 'uppercase',
              }}>
              expires in 3 hours
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: normalize(20),
              width: normalize(200),
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: normalize(12),
                color: COLORS.blue,
                marginLeft: normalize(5),
                fontFamily: FONTS.PoppinsSemiBold,
                textTransform: 'capitalize',
              }}>
              Hurry! Use your ₹100 Free Cash
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: normalize(20),
              width: normalize(200),
            }}>
            <Text
              style={{
                fontSize: normalize(10),
                color: COLORS.blue,
                marginLeft: normalize(5),
                fontFamily: FONTS.PoppinsMedium,
                textTransform: 'capitalize',
              }}>
              applied on your next order above ₹149
            </Text>
          </View>
        </View>

        <View
          style={{
            height: '100%',
            width: normalize(90),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={IMAGES.food1}
            resizeMode="contain"
            style={{height: normalize(70), width: normalize(70)}}
          />
        </View>
      </View>
    </>
  );
};

export default HomeBottomBanner;
