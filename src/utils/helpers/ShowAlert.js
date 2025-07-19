import {View, Text} from 'react-native';
import React from 'react';
import {Platform, ToastAndroid, Alert} from 'react-native';
import Toast from 'react-native-simple-toast';

const ShowAlert = (message, isLong = false) => {
  if (Platform.OS == 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Toast.showWithGravity(message, Toast.LONG, Toast.BOTTOM);
  }
};

export default ShowAlert;
