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
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import MyStatusBar from '../../utils/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { signinRequest } from '../../redux/reducer/AuthReducer';
import ShowAlert from '../../utils/helpers/ShowAlert';
import connectionrequest from '../../utils/helpers/NetInfo';

let status = '';
const Login = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const { width, height } = Dimensions.get('window');
  console.log('width', width, 'height', height);

  const [rawPhone, setRawPhone] = useState('');

  const formatPhoneNumber = value => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10); // max 10 digits

    let formatted = '';
    if (cleaned.length === 0) {
      formatted = '';
    } else if (cleaned.length <= 3) {
      formatted = `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 8) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6,
      )}-${cleaned.slice(6)}`;
    } else {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6,
      )}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
    }

    return formatted;
  };

  function onpresssignin() {
    if (rawPhone == '') {
      ShowAlert('Please enter your phone number ⚠️');
    } else {
      let obj = {
        phone: rawPhone,
      };
      console.log('objobj', obj);
      connectionrequest()
        .then(() => {
          dispatch(signinRequest(obj));
        })
        .catch(err => {
          console.log(err);
          ShowAlert('Please connect to internet');
        });
    }
  }

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/signinRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/signinSuccess':
        status = AuthReducer.status;
        // ShowAlert(AuthReducer?.signinResponse?.message);
        ShowAlert(String(AuthReducer?.signinResponse?.otp));
        props?.navigation.navigate('Otp', {
          phone: rawPhone,
        });
        break;
      case 'Auth/signinFailure':
        status = AuthReducer.status;
        // ShowAlert(AuthReducer?.signinResponse?.message);
        break;
    }
  }

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={IMAGES.loginbg}
          resizeMode="stretch"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(320),
          }}
        >
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={normalize(-120)}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: normalize(210),
                width: normalize(280),
                backgroundColor: COLORS.themeViolet,
                borderRadius: normalize(20),
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingHorizontal: normalize(20),
              }}
            >
              <Image
                source={IMAGES.logo}
                resizeMode="contain"
                style={{ height: normalize(50), width: normalize(50) }}
              />

              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLORS.white,
                  fontFamily: FONTS.PoppinsMedium,
                }}
              >
                We will send you a verification code
              </Text>

              <View
                style={{
                  height: '18%',
                  width: '100%',

                  borderRadius: normalize(12),
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.themeViolet,
                }}
              >
                <View
                  style={{
                    height: '90%',
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Text
                    style={{
                      fontSize: normalize(16),
                      color: COLORS.blue,
                      fontFamily: FONTS.PoppinsMedium,
                    }}
                  >
                    +20
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: COLORS.blue,
                    height: '50%',
                    width: 1,
                  }}
                ></View>
                <TextInput
                  placeholder="(000) 000-00-00"
                  placeholderTextColor={COLORS.white}
                  style={{
                    height: '100%',
                    width: '75%',
                    fontSize: normalize(16),
                    fontFamily: FONTS.PoppinsRegular,
                    color: COLORS.white,
                    paddingHorizontal: normalize(10),
                  }}
                  keyboardType="phone-pad"
                  value={formatPhoneNumber(rawPhone)} // show formatted
                  onChangeText={text => {
                    const cleaned = text.replace(/\D/g, ''); // store only digits
                    setRawPhone(cleaned);
                  }}
                  maxLength={18} // max length of formatted value
                  autoFocus={true}
                  returnKeyType="done"
                  marginTop={Platform.OS == 'android' ? 5 : 0}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                onpresssignin();
              }}
              style={{
                height: normalize(45),
                width: normalize(270),
                borderRadius: normalize(50),
                backgroundColor: COLORS.themeGreen,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(20),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLORS.white,
                  fontFamily: FONTS.PoppinsMedium,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: normalize(12),
                color: COLORS.themeViolet,
                fontFamily: FONTS.PoppinsMedium,
                marginTop: normalize(20),
              }}
            >
              By clicking on “Continue” you are
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLORS.themeViolet,
                  fontFamily: FONTS.PoppinsMedium,
                }}
              >
                agreeing to our
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLORS.white,
                  fontFamily: FONTS.PoppinsMedium,
                  textDecorationLine: 'underline',
                }}
              >
                {'  '}terms of use
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
