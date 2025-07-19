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

const VerticalRestaurantList = ({fullData = []}) => {
  const navigation = useNavigation();
  //   const infiniteData = Array(100).fill(fullData).flat();
  //   const listRef = useRef(null);
  console.log('ihuhuhuhuhuhuhuhuh', fullData);

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
          width: normalize(95),
          borderRadius: normalize(12),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri : item.image_link}}
          style={styles.image}
          imageStyle={{borderRadius: normalize(12)}}
          resizeMode="cover"
        />

        {/* Top Gradient */}
        {/* <LinearGradient
                   colors={['rgba(255,0,0,0.6)', 'pink']}
                   style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   right: 0,
                   height: normalize(50),
                   borderTopLeftRadius: normalize(12),
                   borderTopRightRadius: normalize(12),
                   }}
                   /> */}

        {/* Bottom Gradient */}
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

        <View style={styles.dealVw}>
          <Text style={styles.dealTxt}>FLAT DEAL</Text>
          <Text style={styles.dealTxt2}>10% OFF</Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'space-evenly',
          marginLeft: normalize(5),
          paddingVertical: normalize(7),
        }}>
        <View style={{width: normalize(210)}}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
        </View>
        <View style={styles.rvwTime}>
          <Image
            source={IMAGES.star}
            resizeMode="contain"
            style={{height: normalize(13), width: normalize(13)}}
          />
          <Text numberOfLines={1} style={[styles.timeTxt]}>
            10% ◎ 30-35 mins
          </Text>
        </View>

        <View
          style={{
            width: normalize(210),
            flexDirection: 'row',
          }}>
          <Image
            source={IMAGES.maps}
            resizeMode="contain"
            style={{
              height: normalize(12),
              width: normalize(12),
              marginLeft: normalize(2),
            }}
          />
          <Text numberOfLines={1} style={styles.address}>
            {item.address}
          </Text>
        </View>

        <View
          style={{
            width: normalize(210),
            height: normalize(30),
            flexDirection: 'row',
          }}>
          <Text numberOfLines={2} style={styles.detailsTxt}>
            {item.details}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        // ref={listRef}
        data={fullData}
        // horizontal
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        // onEndReached={() => {
        //   listRef.current.scrollToOffset({offset: 0, animated: false});
        // }}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default VerticalRestaurantList;

const styles = StyleSheet.create({
  card: {
    height: normalize(110),
    marginVertical: normalize(4),
    marginHorizontal: normalize(6),
    flexDirection: 'row',
  },
  image: {
    height: normalize(110),
    width: normalize(95),
    borderRadius: normalize(12),
  },
  title: {
    fontSize: normalize(13),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
  },
  timeTxt: {
    textAlign: 'left',
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.themeViolet,
    marginLeft: normalize(5),
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
    color: COLORS.white,
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(3),
  },
  rvwTime: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // height: normalize(15),
    width: normalize(210),
    marginLeft: normalize(2),
  },
  detailsTxt: {
    textAlign: 'left',
    fontSize: normalize(8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    marginLeft: normalize(2),
  },
  address: {
    textAlign: 'left',
    fontSize: normalize(8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.deepGrey,
    maxWidth: normalize(190),
  },
  dealVw: {
    height: normalize(35),
    width: normalize(70),
    position: 'absolute',
    alignSelf: 'flex-start',
    bottom: normalize(7),
    paddingLeft: normalize(10),
  },
  dealTxt: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: normalize(10),
    color: COLORS.white,
  },
  dealTxt2: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: normalize(11),
    color: COLORS.blue,
  },
});
