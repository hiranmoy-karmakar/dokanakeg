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
import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import LinearGradient from 'react-native-linear-gradient';

const PopularRestaurantScroll = ({fullData = []}) => {
  const navigation = useNavigation();
  const infiniteData = Array(100).fill(fullData).flat();
  const listRef = useRef(null);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RestaurantFoodList', {
          nearbyRestaurentItems: item,
        });
      }}
      style={styles.card}>
      <View
        style={{
          height: normalize(110),
          width: normalize(92),
          borderRadius: normalize(10),
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: item.image_link}}
          style={styles.image}
          resizeMode="contain">
          <LinearGradient
            colors={['transparent', COLORS.black]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: normalize(110),
            }}
          />
          <Text numberOfLines={1} style={styles.offpriceTxt}>
            10% OFF UPTO 300
          </Text>
        </ImageBackground>
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {item.name}
      </Text>

      <View style={styles.rvwTime}>
        <Image
          source={IMAGES.star}
          resizeMode="contain"
          style={{height: normalize(10), width: normalize(10)}}
        />
        <Text numberOfLines={1} style={[styles.timeTxt]}>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
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
          listRef.current.scrollToOffset({offset: 0, animated: false});
        }}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default PopularRestaurantScroll;
const styles = StyleSheet.create({
  card: {
    width: normalize(95),
    height: normalize(150),
    marginHorizontal: normalize(4),
  },
  image: {
    height: normalize(110),
    width: normalize(95),
    borderRadius: normalize(12),
  },
  title: {
    textAlign: 'left',
    marginTop: normalize(5),
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
    marginLeft: normalize(2),
  },
  timeTxt: {
    textAlign: 'left',
    fontSize: normalize(7),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.themeViolet,
    marginLeft: normalize(2),
  },
  desc: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.black,
    marginLeft: normalize(5),
  },
  offpriceTxt: {
    fontSize: normalize(7),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.blue,
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(3),
  },
  rvwTime: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: normalize(15),
    width: normalize(85),
    marginLeft: normalize(2),
  },
  detailsTxt: {
    textAlign: 'left',
    fontSize: normalize(6),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    marginLeft: normalize(2),
  },
});
