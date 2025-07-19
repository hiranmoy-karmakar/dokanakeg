import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import {COLORS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const CustomToggle = ({
  onToggle,
  initial = false,
  toggleImage,
  onColor,
  offColor,
  isOn,
  setIsOn,
}) => {
//   const [isOn, setIsOn] = useState(initial);
  const anim = useRef(new Animated.Value(initial ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOn ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const toggleSwitch = () => {
    setIsOn(prev => !prev);
    onToggle?.(!isOn);
  };

  const interpolatedTranslateX = anim.interpolate({
    inputRange: [0, 2],
    outputRange: [-2, 32], // knob movement
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View
        style={[
          styles.container,
          {backgroundColor: isOn ? onColor : offColor},
        ]}>
        <Animated.View
          style={[
            styles.knob,
            {transform: [{translateX: interpolatedTranslateX}]},
          ]}>
          <Image
            // source={isOn ? IMAGES.vegicon : IMAGES.vegicon}
            source={toggleImage}
            style={styles.icon}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: normalize(32),
    height: normalize(7),
    borderRadius: normalize(30),
    // padding: normalize(2),
    justifyContent: 'center',
  },
  knob: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: normalize(18),
    height: normalize(18),
  },
});

export default CustomToggle;
