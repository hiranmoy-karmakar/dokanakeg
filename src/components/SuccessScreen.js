import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, LOTTIE} from '../themes/Themes';

const SuccessScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background success animation (e.g., confetti) */}
      <LottieView
        source={LOTTIE.success}
        autoPlay
        loop={false}
        style={styles.backgroundLottie}
      />

      {/* Foreground congratulation animation */}
      <LottieView
        source={LOTTIE.congratulation}
        autoPlay
        loop={false}
        style={styles.foregroundLottie}
      />

      {/* Animated Text and Button */}
      <Animated.View style={[styles.textContainer, {opacity: fadeAnim}]}>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your delicious food is on its way 🍽️
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation?.navigate('BottomTab', {
              screen: 'Tab1StackScreen',
              params: {
                screen: 'Tab1',
              },
            })
          }>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLottie: {
    position: 'absolute',
    width: 150,
    height: 150,
    top: '40%',
    alignSelf: 'center',
    zIndex: 0,
  },
  foregroundLottie: {
    width: 250,
    height: 250,
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.green,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: COLORS.green,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
