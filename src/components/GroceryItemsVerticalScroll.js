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
import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const GroceryItemsVerticalScroll = ({ fullData = [] }) => {
  const navigation = useNavigation();
  const infiniteData = Array(100).fill(fullData).flat();
  const listRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        // onPress={() => {
        //   navigation.navigate('Details', { itemDetails: item });
        // }}
      >
        <View
          style={{
            height: normalize(120),
            width: normalize(140),
            borderRadius: normalize(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <Text numberOfLines={1} style={styles.title}>
        {item.name}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          height: normalize(20),
          width: normalize(70),
          marginTop: normalize(5),
        }}
      >
        <Text numberOfLines={1} style={[styles.title, { color: COLORS.white }]}>
          {item.weight}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: COLORS.white, marginLeft: normalize(5) },
          ]}
        >
          {item.price}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          height: normalize(30),
          width: normalize(30),
          borderRadius: normalize(30),
          backgroundColor: COLORS.themeViolet,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: normalize(10),
          right: normalize(10),
        }}
      >
        <Image
          source={IMAGES.add}
          resizeMode="contain"
          style={{ height: normalize(15), width: normalize(15) }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <FlatList
        ref={listRef}
        data={infiniteData}
        horizontal
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onEndReached={() => {
          listRef.current.scrollToOffset({ offset: 0, animated: false });
        }}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default GroceryItemsVerticalScroll;
const styles = StyleSheet.create({
  card: {
    width: normalize(140),
    height: normalize(200),
    marginLeft: normalize(7),
    backgroundColor: COLORS.themeGreen,
    borderRadius: normalize(15),
    justifyContent: 'center',
  },
  image: {
    width: normalize(100),
    height: normalize(100),
  },
  title: {
    fontSize: normalize(13),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
    marginLeft: normalize(15),
  },
  desc: {
    textAlign: 'left',
    fontSize: normalize(8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.black,
    marginLeft: normalize(5),
  },
});
