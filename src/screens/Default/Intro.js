import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInput,
  Button,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import { useNavigation } from '@react-navigation/native';
import MyStatusBar from '../../utils/MyStatusBar';
import normalize from '../../utils/helpers/normalize';

const Intro = () => {
  const navigation = useNavigation();
  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={IMAGES.introbg}
          resizeMode="stretch"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(320),
          }}
        >
          <View
            style={{
              flex: 2,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={IMAGES.introdots}
              resizeMode="contain"
              style={{
                height: normalize(150),
                width: normalize(150),
                position: 'absolute',
                alignSelf: 'flex-end',
                top: normalize(-10),
              }}
            />
            <View
              style={{
                flex: 0.6,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Image
                source={IMAGES.logo}
                resizeMode="contain"
                style={{ height: normalize(50), width: normalize(50) }}
              />
              <Text
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(18),
                  color: COLORS.themeViolet,
                }}
              >
                Shop Smart, Shop Dokanak
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}
                style={{
                  height: normalize(45),
                  width: normalize(150),
                  backgroundColor: COLORS.themeViolet,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: normalize(30),
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.PoppinsSemiBold,
                    fontSize: normalize(12),
                    color: COLORS.white,
                  }}
                >
                  Shop now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 2,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ height: '100%', width: '100%' }}
              resizeMode="stretch"
              source={IMAGES.intro}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
};

export default Intro;
