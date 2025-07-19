import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS, IMAGES} from '../../themes/Themes';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {

  return (
   <View
      style={{
        flex: 1,
        backgroundColor: COLORS.defaultbgcolor,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={IMAGES.splash}
        resizeMode="cover"
        style={{height: '100%', width: '100%'}}
      />
    </View>
  );
};

export default Splash;
