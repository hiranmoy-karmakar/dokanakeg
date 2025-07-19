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
  FlatList,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { COLORS, FONTS, IMAGES } from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const CustomCarousel = ({ originalData = [] }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  const carouselItems = [
    originalData[originalData.length - 1],
    ...originalData,
    originalData[0],
  ];

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    flatListRef.current.scrollToIndex({ index: 1, animated: false });

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let nextIndex = prevIndex + 1;
        if (nextIndex >= carouselItems.length) {
          nextIndex = 1;
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: false,
          });
        } else {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleScrollEnd = e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);

    if (index === 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: originalData.length,
          animated: false,
        });
        setCurrentIndex(originalData.length);
      }, 50);
    } else if (index === carouselItems.length - 1) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: 1, animated: false });
        setCurrentIndex(1);
      }, 50);
    }
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={carouselItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={[styles.imageContainer, { width }]}>
            <Image
              source={{uri: item?.image}}
              style={[styles.image]}
              resizeMode="stretch"
            />
          </View>
        )}
      />
      <View style={styles.dotsContainer}>
        {originalData.map((_, index) => {
          const isActive = index === (currentIndex - 1) % originalData.length;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: isActive ? 1 : 0.1,
                  width: isActive ? normalize(16) : normalize(8),
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomCarousel;

const styles = StyleSheet.create({
  imageContainer: {
    width: normalize(300),
    height: normalize(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: normalize(300),
    height: normalize(150),
  },
  dotsContainer: {
    // position: 'absolute',
    // bottom: 10,
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: normalize(8),
    // width: normalize(3),
    borderRadius: normalize(4),
    backgroundColor: COLORS.themeViolet,
    marginHorizontal: normalize(2),
    marginTop: normalize(10),
  },
});
