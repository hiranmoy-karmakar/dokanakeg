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
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import MyStatusBar from '../../utils/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ShowAlert from '../../utils/helpers/ShowAlert';
import { useDispatch } from 'react-redux';
import connectionrequest from '../../utils/helpers/NetInfo';
import { otpRequest } from '../../redux/reducer/AuthReducer';

const Otp = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [finalOtp, setfinalOtp] = useState('');
  const phone = props.route.params;
  const input2 = useRef();
  const input1 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const input6 = useRef();

  const [resendtiming, setResendtiming] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendtiming > 0) {
        setResendtiming(prevTime => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendtiming]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (Platform.OS == 'ios') {
        input1.current.focus();
      } else {
        input2.current.focus();
        input1.current.focus();
      }
    });
  }, []);

  const [PhoneNumbers, setPhoneNumbers] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
  });

  const _SetPhoneNumberHandler = (flag, text) => {
    switch (flag) {
      case '1':
        setPhoneNumbers({ ...PhoneNumbers, input1: text });
        break;
      case '2':
        setPhoneNumbers({ ...PhoneNumbers, input2: text });
        break;
      case '3':
        setPhoneNumbers({ ...PhoneNumbers, input3: text });
        break;
      case '4':
        setPhoneNumbers({ ...PhoneNumbers, input4: text });
        break;
      case '5':
        setPhoneNumbers({ ...PhoneNumbers, input5: text });
        break;
      case '6':
        setPhoneNumbers({ ...PhoneNumbers, input6: text });
        break;
      default:
        break;
    }
    _FoucsCheck();
  };

  const InputArray = [
    {
      value: PhoneNumbers.input1,
      onChangeText: text => _SetPhoneNumberHandler('1', text),
      onKeyPress: _EmptyCheck,
      placeHolder: 'X',
      ref: input1,
    },
    {
      value: PhoneNumbers.input2,
      placeHolder: 'X',
      onChangeText: text => _SetPhoneNumberHandler('2', text),
      onKeyPress: _EmptyCheck,

      ref: input2,
    },
    {
      value: PhoneNumbers.input3,
      placeHolder: 'X',
      onChangeText: text => _SetPhoneNumberHandler('3', text),
      onKeyPress: _EmptyCheck,
      ref: input3,
    },
    {
      value: PhoneNumbers.input4,
      placeHolder: 'X',
      onChangeText: text => _SetPhoneNumberHandler('4', text),
      onKeyPress: _EmptyCheck,
      ref: input4,
    },
    {
      value: PhoneNumbers.input5,
      placeHolder: 'X',
      onChangeText: text => _SetPhoneNumberHandler('5', text),
      onKeyPress: _EmptyCheck,
      ref: input5,
    },
    {
      value: PhoneNumbers.input6,
      placeHolder: 'X',
      onChangeText: text => _SetPhoneNumberHandler('6', text),
      onKeyPress: _EmptyCheck,
      ref: input6,
    },
  ];

  const _FoucsCheck = () => {
    if (PhoneNumbers.input5.length === 1) {
      return input6.current.focus();
    }
    if (PhoneNumbers.input4.length === 1) {
      return input5.current.focus();
    }
    if (PhoneNumbers.input3.length === 1) {
      return input4.current.focus();
    }
    if (PhoneNumbers.input2.length === 1) {
      return input3.current.focus();
    }
    if (PhoneNumbers.input1.length === 1) {
      return input2.current.focus();
    }
    return input1.current.focus();
  };

  useLayoutEffect(() => {
    let EnterOtp = `${PhoneNumbers.input1}${PhoneNumbers.input2}${PhoneNumbers.input3}${PhoneNumbers.input4}${PhoneNumbers.input5}${PhoneNumbers.input6}`;
    if (EnterOtp.length == 6) {
      // onpressotp(EnterOtp); /////// after last digit it will hit, or write a function and call
      setfinalOtp(EnterOtp);
    } else {
      setfinalOtp('');
    }
    _FoucsCheck();
    //   }, [PhoneNumbers, confirm]);
  }, [PhoneNumbers]);

  function onpressotp(EnterOtp) {
    if (EnterOtp == '') {
      ShowAlert('Please enter your otp');
    } else {
      console.log('done');
    }
  }

  function onpressotp() {
    if (finalOtp == '') {
      ShowAlert('Please enter your otp');
    } else {
      let obj = {
        phone: phone?.phone,
        otp: finalOtp,
      };
      console.log('objobj', obj);
      connectionrequest()
        .then(() => {
          dispatch(otpRequest(obj));
        })
        .catch(err => {
          console.log(err);
          ShowAlert('Please connect to internet');
        });
    }
  }

  const _EmptyCheck = e => {
    if (PhoneNumbers.input2 === '') return _SetPhoneNumberHandler('1', '');
    if (PhoneNumbers.input3 === '') return _SetPhoneNumberHandler('2', '');
    if (PhoneNumbers.input4 === '') return _SetPhoneNumberHandler('3', '');
    if (PhoneNumbers.input5 === '') return _SetPhoneNumberHandler('4', '');
    if (PhoneNumbers.input6 === '') return _SetPhoneNumberHandler('5', '');
  };

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
                Enter your verification code here
              </Text>
              <View
                style={{
                  height: '20%',
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                {InputArray.map((item, index) => (
                  <TextInput
                    mode="outlined"
                    key={'dsaasdas' + index}
                    // editable={true}
                    textColor={'#101010'}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        _EmptyCheck();
                      }
                    }}
                    keyboardType={'phone-pad'}
                    onChangeText={item.onChangeText}
                    value={item.value}
                    ref={item.ref}
                    style={{
                      width: normalize(37),
                      height: normalize(43),
                      textAlign: 'center',
                      backgroundColor: COLORS.white,
                      color: COLORS.deepGrey,
                      fontSize: normalize(15),
                      borderRadius: normalize(10),
                      borderWidth: normalize(1),
                      borderColor: COLORS.themeGreen,
                      shadowColor: COLORS.themeGreen,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2.8,
                      elevation: 8,
                    }}
                    maxLength={1}
                    theme={{
                      roundness: 10,
                      colors: {},
                    }}
                    outlineColor={COLORS.themeGreen}
                    activeOutlineColor={COLORS.themeGreen}
                    placeholderTextColor={COLORS.deepGrey}
                    placeholder="_"
                  />
                ))}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                // navigation?.navigate('BottomTab', {
                //   screen: 'Tab1StackScreen',
                //   params: {
                //     screen: 'Tab1',
                //   },
                // });
                onpressotp();
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
          </KeyboardAwareScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
};

export default Otp;
