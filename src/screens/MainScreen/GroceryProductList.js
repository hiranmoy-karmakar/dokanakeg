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
import OtherHeader from '../../components/OtherHeader';

const GroceryProductList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('1');

  const categoryList = [
    {id: '1', name: 'Fresh Fruits', icon: IMAGES.smallCate1},
    {id: '2', name: 'Seasonal Fruits', icon: IMAGES.smallCate2},
    {id: '3', name: 'Exotic Fruits', icon: IMAGES.smallCate3},
    {id: '4', name: 'Festive Essentials', icon: IMAGES.smallCate4},
    {id: '5', name: 'Combos', icon: IMAGES.smallCate1},
    {id: '6', name: 'Fresh Vegetables', icon: IMAGES.smallCate2},
    {id: '7', name: 'Organic Vegetables', icon: IMAGES.smallCate3},
    {id: '8', name: 'Herbs & Spices', icon: IMAGES.smallCate4},
    {id: '9', name: 'Gourmet Vegetables', icon: IMAGES.smallCate1},
    {id: '10', name: 'Vegetable Combos', icon: IMAGES.smallCate2},
  ];
  const allProducts = {
    1: [
      {
        id: 'p1',
        name: 'Pomegranate',
        price: '₹200',
        actualPrice: '₹250',
        image: IMAGES.itemfruit1,
        weight: '1kg',
      },
      {
        id: 'p2',
        name: 'Premium Orange',
        price: '₹51',
        actualPrice: '₹60',
        image: IMAGES.itemfruit2,
        weight: '3 pieces',
      },
      {
        id: 'p3',
        name: 'Dragon Fruit',
        price: '₹90',
        actualPrice: '₹100',
        image: IMAGES.itemfruit3,
        weight: '1 piece',
      },
      {
        id: 'p4',
        name: 'Grapes Mix',
        price: '₹149',
        actualPrice: '₹180',
        image: IMAGES.itemfruit1,
        weight: '450gms',
      },
      {
        id: 'p5',
        name: 'Apple',
        price: '₹100',
        actualPrice: '₹120',
        image: IMAGES.itemfruit4,
        weight: '1kg',
      },
    ],
    2: [
      {
        id: 'p3',
        name: 'Dragon Fruit',
        price: '₹90',
        actualPrice: '₹100',
        image: IMAGES.itemfruit3,
        weight: '1 piece',
      },
      {
        id: 'p4',
        name: 'Grapes Mix',
        price: '₹149',
        actualPrice: '₹180',
        image: IMAGES.itemfruit1,
        weight: '450gms',
      },
    ],
    3: [
      {
        id: 'p5',
        name: 'Apple',
        price: '₹100',
        actualPrice: '₹120',
        image: IMAGES.itemfruit4,
        weight: '1kg',
      },
      {
        id: 'p6',
        name: 'Banana',
        price: '₹30',
        actualPrice: '₹40',
        image: IMAGES.itemfruit5,
        weight: '6 pieces',
      },
    ],
    4: [
      {
        id: 'p7',
        name: 'Mango',
        price: '₹80',
        actualPrice: '₹100',
        image: IMAGES.itemfruit1,
        weight: '1kg',
      },
      {
        id: 'p8',
        name: 'Papaya',
        price: '₹60',
        actualPrice: '₹70',
        image: IMAGES.itemfruit2,
        weight: '1 piece',
      },
    ],
    5: [
      {
        id: 'p9',
        name: 'Mixed Fruit Basket',
        price: '₹250',
        actualPrice: '₹300',
        image: IMAGES.itemfruit3,
        weight: '1kg',
      },
      {
        id: 'p10',
        name: 'Fruit Salad Combo',
        price: '₹300',
        actualPrice: '₹350',
        image: IMAGES.itemfruit4,
        weight: '1kg',
      },
    ],
    6: [
      {
        id: 'p11',
        name: 'Fresh Spinach',
        price: '₹40',
        actualPrice: '₹50',
        image: IMAGES.itemfruit1,
        weight: '250gms',
      },
      {
        id: 'p12',
        name: 'Broccoli',
        price: '₹60',
        actualPrice: '₹70',
        image: IMAGES.itemfruit2,
        weight: '500gms',
      },
    ],
  };

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      onPress={() => setSelectedCategoryId(item.id)}
      style={[styles.categoryItem]}>
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text
        numberOfLines={1}
        style={[
          styles.categoryText,
          {color: selectedCategoryId === item.id ? COLORS.themeViolet : COLORS.themeGreen},
        ]}>
        {item.name}
      </Text>
      <View
        style={{
          height: normalize(1),
          width: normalize(30),
          backgroundColor:
            selectedCategoryId === item.id ? COLORS.themeViolet : COLORS.themeGreen,
          marginTop: normalize(3),
        }}></View>
    </TouchableOpacity>
  );

  const renderProductItem = ({item}) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />

      <Text numberOfLines={1} style={styles.productName}>
        {item.name}
      </Text>
      <Text
        numberOfLines={2}
        style={[styles.description, {paddingHorizontal: normalize(5)}]}>
        Tangy citrus, perfect for fresh juice or snacks.Tangy citrus, perfect
      </Text>
      <View
        style={{
          height: normalize(1),
          width: normalize(100),
          backgroundColor: COLORS.bordergrey,
          marginTop: normalize(5),
          alignSelf: 'center',
        }}></View>
      <Text style={[styles.productWeight]}>{item.weight}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.actualproductPrice}>{item.actualPrice}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
     <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.offwhite}}>
        <OtherHeader pagename="Fresh Fruits" totalitems="505" />
        <View style={styles.container}>
          <View style={styles.leftVw}>
            {/* Left Category List */}
            <FlatList
              data={categoryList}
              keyExtractor={item => item.id}
              renderItem={renderCategoryItem}
              showsVerticalScrollIndicator={false}
              style={styles.leftList}
            />
          </View>

          {/* Right Product List */}
          <View style={styles.rightVw}>
            <FlatList
              data={allProducts[selectedCategoryId]}
              keyExtractor={item => item.id}
              renderItem={renderProductItem}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              style={styles.rightList}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default GroceryProductList;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: normalize(580),
    height: '100%',
    width: normalize(320),
    alignSelf: 'center',
    marginTop: normalize(10),
  },
  leftVw: {
    height: Platform.OS == 'android' ? normalize(580) : normalize(570),
    width: normalize(90),
    alignItems: 'center',
    backgroundColor: COLORS.bgGrey,
  },
  rightVw: {
    height: Platform.OS == 'android' ? normalize(580) : normalize(570),
    width: normalize(230),
   backgroundColor: COLORS.bgGrey,
  },
  leftList: {
    width: normalize(75),
   backgroundColor: COLORS.bgGrey,
  },
  rightList: {
    width: normalize(230),
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: normalize(10),
    backgroundColor: COLORS.white,
  },
  categoryIcon: {
    width: normalize(50),
    height: normalize(50),
    backgroundColor: COLORS.bgGrey,
    resizeMode: 'contain',
    borderRadius: normalize(8),
  },
  categoryText: {
    fontSize: normalize(8),
    textAlign: 'center',
    marginTop: normalize(5),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeGreen,
  },
  productCard: {
    width: normalize(115),
    backgroundColor: '#fff',
    // margin: normalize(5),
    // padding: normalize(10),
    // alignItems: 'center',
    // elevation: 3,
    alignSelf: 'center',
    height: Platform.OS == 'ios' ? normalize(240) : normalize(250),
    borderBottomWidth: normalize(1),
    borderBottomColor: COLORS.bordergrey,
    borderLeftWidth: normalize(1),
    borderLeftColor: COLORS.bordergrey,
    borderRightWidth: normalize(1),
    borderRightColor: COLORS.bordergrey,
  },
  productImage: {
    width: normalize(100),
    height: normalize(100),
    resizeMode: 'contain',
    borderRadius: normalize(10),
    alignSelf: 'center',
    marginTop: normalize(8),
  },
  productName: {
    fontSize: normalize(12),
    fontFamily: FONTS.PoppinsMedium,
    textAlign: 'center',
    marginVertical: normalize(4),
    color: COLORS.themeViolet
  },
  description: {
    fontSize: normalize(9),
    color: COLORS.themeGreen,
    fontFamily: FONTS.PoppinsLight,
  },
  productWeight: {
    fontSize: normalize(11),
    color: COLORS.deepGrey,
    fontFamily: FONTS.PoppinsSemiBold,
    marginLeft: normalize(5),
  },
  productPrice: {
    fontSize: normalize(12),
    color: COLORS.themeGreen,
    fontFamily: FONTS.PoppinsSemiBold,
    marginLeft: normalize(5),
  },
  actualproductPrice: {
    fontSize: normalize(12),
    color: COLORS.deepGrey,
    fontFamily: FONTS.PoppinsSemiBold,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: COLORS.themeViolet,
    marginLeft: normalize(5),
  },
  addButton: {
    width: normalize(100),
    height: normalize(25),
    borderRadius: normalize(4),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(5),
    borderWidth: normalize(1),
    borderColor: COLORS.themeViolet,
  },
  addButtonText: {
    color: COLORS.themeViolet,
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsSemiBold,
    textTransform: 'capitalize',
  },
});
