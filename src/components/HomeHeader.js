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
} from 'react-native';
import React from 'react';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const HomeHeader = () => {
  return (
    <View
      style={{
        height: normalize(35),
        width: normalize(330),
        flexDirection: 'row',
        marginTop: normalize(10),
      }}>
      <View
        style={{
          height: normalize(35),
          width: normalize(230),

          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <Image
            source={IMAGES.navigation}
            resizeMode="contain"
            style={{
              height: normalize(20),
              width: normalize(20),
              marginLeft: normalize(10),
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.PoppinsMedium,
              fontSize: normalize(12),
              color: COLORS.themeViolet,
              marginLeft: normalize(10),
            }}>
            Deliver to My Flat
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.PoppinsRegular,
              fontSize: normalize(10),
              color: COLORS.black,
              marginLeft: normalize(10),
            }}>
            BN Block, Sector V, Bidhannagar, Kolkata, West Bengal
          </Text>
        </View> */}
      </View>
      {/* <View
        style={{
          height: normalize(30),
          width: normalize(90),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingHorizontal: normalize(10),
        }}>
        <Image
          source={IMAGES.notification}
          resizeMode="contain"
          style={{
            height: normalize(20),
            width: normalize(20),
            marginLeft: normalize(10),
          }}
        />
        <Image
          source={IMAGES.user}
          resizeMode="contain"
          style={{
            height: normalize(20),
            width: normalize(20),
            marginLeft: normalize(10),
          }}
        />
      </View> */}
    </View>
  );
};

export default HomeHeader;
