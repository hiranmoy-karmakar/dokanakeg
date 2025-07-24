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
import {useNavigation} from '@react-navigation/native';

const OtherHeader = ({pagename = '', totalitems = '', backPress}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: normalize(40),
        width: normalize(330),
        flexDirection: 'row',
        marginTop: normalize(15),
      }}>
      <View
        style={{
          height: normalize(40),
          width: normalize(230),

          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              backPress();
            }}>
            <Image
              source={IMAGES.backarrow}
              resizeMode="contain"
              style={{
                height: normalize(22),
                width: normalize(22),
                marginLeft: normalize(10),
                transform: [{rotate: '180deg'}],
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.PoppinsMedium,
                fontSize: normalize(16),
                color: COLORS.themeViolet,
                marginLeft: normalize(10),
              }}>
              {pagename}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.PoppinsRegular,
                fontSize: normalize(10),
                color: COLORS.themeViolet,
                marginLeft: normalize(10),
              }}>
              {totalitems} items
            </Text>
          </View>
        </View>
      </View>
      <View
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
      </View>
    </View>
  );
};

export default OtherHeader;
