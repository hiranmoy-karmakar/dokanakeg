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
import React, {useState} from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, FONTS, IMAGES} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import {useNavigation} from '@react-navigation/native';

const GroceryCategory = props => {
  const navigation = useNavigation();
  const initialData = [
    {
      id: 1,
      name: 'Vegetables',
      image: IMAGES.vegetables,
    },
    {
      id: 2,
      name: 'Fruits',
      image: IMAGES.vegetables,
    },
    {
      id: 3,
      name: 'Dairy',
      image: IMAGES.vegetables,
    },
    {
      id: 4,
      name: 'Bakery',
      image: IMAGES.vegetables,
    },
    {
      id: 5,
      name: 'Snacks',
      image: IMAGES.vegetables,
    },
    {
      id: 6,
      name: 'Beverages',
      image: IMAGES.vegetables,
    },
    {
      id: 7,
      name: 'Frozen Foods',
      image: IMAGES.vegetables,
    },
    {
      id: 8,
      name: 'Condiments',
      image: IMAGES.vegetables,
    },
    {
      id: 9,
      name: 'Canned Goods',
      image: IMAGES.vegetables,
    },
    {
      id: 10,
      name: 'Grains',
      image: IMAGES.vegetables,
    },
    {
      id: 11,
      name: 'Meat & Seafood',
      image: IMAGES.vegetables,
    },
    {
      id: 12,
      name: 'Spices & Herbs',
      image: IMAGES.vegetables,
    },
    {
      id: 13,
      name: 'Sauces & Dressings',
      image: IMAGES.vegetables,
    },
    {
      id: 14,
      name: 'Pasta & Rice',
      image: IMAGES.vegetables,
    },
    {
      id: 15,
      name: 'Baby Food',
      image: IMAGES.vegetables,
    },
    {
      id: 16,
      name: 'Pet Supplies',
      image: IMAGES.vegetables,
    },
  ];
  const [listData, setListData] = useState(initialData);
  const handleEndReached = () => {
    // Append a copy of the initial data to the end
    setListData(prev => [
      ...prev,
      ...initialData.map(item => ({...item, id: prev.length + item.id})),
    ]);
  };
  return (
    <>
     <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <HomeHeader />

          <View
            style={{
              height: normalize(540),
              width: normalize(320),
              alignSelf: 'center',
              marginTop: normalize(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              data={listData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('GroceryProductList');
                  }}
                  style={styles.item}>
                  <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                  </View>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default GroceryCategory;
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
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginTop: normalize(5),
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.black,
  },
});
