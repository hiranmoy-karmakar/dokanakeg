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
import React, { useState } from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';

const RestaurantCategory = props => {
  const initialData = props?.route?.params?.mainRestaurantCategories;
  // const initialData = [
  //   {
  //     id: 1,
  //     name: 'Biriyani',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 2,
  //     name: 'Chinese',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 3,
  //     name: 'Indian',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 4,
  //     name: 'Italian',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 5,
  //     name: 'Mexican',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 6,
  //     name: 'Thai',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 7,
  //     name: 'Desserts',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 8,
  //     name: 'Biriyani',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 9,
  //     name: 'Chinese',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 10,
  //     name: 'Indian',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 11,
  //     name: 'Italian',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 12,
  //     name: 'Mexican',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 13,
  //     name: 'Thai',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 14,
  //     name: 'Desserts',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 15,
  //     name: 'Biriyani',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 16,
  //     name: 'Chinese',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 17,
  //     name: 'Indian',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 18,
  //     name: 'Italian',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 19,
  //     name: 'Mexican',
  //     image: IMAGES.food1,
  //   },
  //   {
  //     id: 20,
  //     name: 'Thai',
  //     image: IMAGES.food2,
  //   },
  //   {
  //     id: 21,
  //     name: 'Desserts',
  //     image: IMAGES.food1,
  //   },
  // ];
  const [listData, setListData] = useState(initialData);
  const handleEndReached = () => {
    // Append a copy of the initial data to the end
    setListData(prev => [
      ...prev,
      ...initialData.map(item => ({ ...item, id: prev.length + item.id })),
    ]);
  };
  return (
    <>
      <MyStatusBar backgroundColor={COLORS.red} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HomeHeader />

          <View
            style={{
              height: normalize(540),
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FlatList
              data={listData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('RestaurantListByCategory', {
                      categoryName: item.name,
                      itemId: item?.id,
                    });
                  }}
                  style={styles.item}
                >
                  <View
                    style={{
                      height: normalize(65),
                      width: normalize(65),
                      backgroundColor: COLORS.themeViolet,
                      borderRadius: normalize(65),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      source={{ uri: item.image_url }}
                      style={styles.image}
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default RestaurantCategory;
const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: normalize(4),
    width: normalize(70),
  },
  imageContainer: {
    height: normalize(70),
    width: normalize(70),
    backgroundColor: COLORS.bgGrey,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(60),
  },
  title: {
    textAlign: 'center',
    marginTop: normalize(2),
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.blue,
  },
});
