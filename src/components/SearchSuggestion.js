import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, FONTS, IMAGES } from '../themes/Themes'; // adjust path as needed
import normalize from '../utils/helpers/normalize'; // adjust path as needed
import { useNavigation } from '@react-navigation/native';

const SearchSuggestion = () => {
    const navigation = useNavigation();
  const [searchIndex, setSearchIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;

  const searchItems = [
    'Milk',
    'Biscuit',
    'Harpic',
    'Mustard Oil',
    'Bread',
    'Toothpaste',
    'Soap',
    'Shampoo',
    'Rice',
    'Wheat Flour',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(translateY, {
        toValue: -normalize(40),
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSearchIndex(prev => (prev + 1) % searchItems.length);
        translateY.setValue(normalize(40));
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SearchPage');
      }}
      style={styles.searchContainer}
    >
      <Image
        source={IMAGES.search}
        resizeMode="contain"
        style={styles.searchIcon}
      />
      <View
        style={{
          height: normalize(40),
          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        <Animated.Text
          style={[
            styles.searchText,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          Search For "{searchItems[searchIndex]}"
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  searchContainer: {
    height: normalize(40),
    width: normalize(300),
    alignSelf: 'center',
    marginTop: normalize(5),
    borderRadius: normalize(30),
    backgroundColor: COLORS.themeGreen,
    shadowColor: COLORS.deepGrey,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS == 'ios' ? 0.2 : 0.7,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
  },
  searchText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(11),
    color: COLORS.white,
    marginLeft: normalize(10),
  },
  searchIcon: {
    height: normalize(18),
    width: normalize(18),
    tintColor: COLORS.themeViolet,
  },
};

export default SearchSuggestion;
