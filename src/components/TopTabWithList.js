import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import {foodData} from '../../StaticDataset';
import normalize from '../utils/helpers/normalize';
import AddButton from './AddButton';
import {useNavigation} from '@react-navigation/native';

let status = '';
const TopTabWithList = ({
  setcategories,
  categories,
  foods,
  setfoods,
  selectedCategoryId,
  setSelectedCategoryId,
}) => {
  const navigation = useNavigation();

  const renderTab = cat => (
    <TouchableOpacity
      key={cat.id}
      onPress={() => {
        setSelectedCategoryId(cat.id);
        setfoods(cat.food_items);
      }}
      style={[
        styles.tabButton,
        selectedCategoryId === cat.id && styles.activeTab,
      ]}>
      <Text
        style={[
          styles.tabText,
          selectedCategoryId === cat.id && styles.activeTabText,
        ]}>
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text
          numberOfLines={1}
          style={[styles.title, {marginTop: normalize(10)}]}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.title}>₹{item.sale_price}</Text>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.deepGrey,
                textDecorationLine: 'line-through',
                textDecorationColor: COLORS.red,
                marginLeft: normalize(5),
              },
            ]}>
            ₹{item.mrp}
          </Text>
          <Image
            source={IMAGES.star}
            resizeMode="contain"
            style={{
              height: normalize(11),
              width: normalize(11),
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: normalize(10),
              fontFamily: FONTS.PoppinsBold,
              color: COLORS.black,
              marginLeft: normalize(2),
            }}>
            {/* {item.rating} */}4.4(98k+)
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>
      </View>
      <View
        style={{
          height: normalize(80),
          width: normalize(100),
          justifyContent: 'center',
          marginTop: normalize(5),
        }}>
        <Image
          source={{uri: item?.main_image?.large_image}}
          style={styles.image}
        />
        <AddButton />
      </View>
    </View>
  );

  return (
    <View style={{}}>
      <View
        style={{
          height: '10%',
          width: normalize(300),
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}>
          {categories?.map(renderTab)}
        </ScrollView>
      </View>
      <View
        style={{
          height: '90%',
          width: normalize(300),
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={foods}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{padding: 10}}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items in this category</Text>
          }
        />
      </View>

      {/* Floating View Cart */}
      <View style={styles.floatingCart}>
        <View style={styles.cartDetails}>
          <View style={styles.imagePlaceholder} />
          <Text style={styles.cartText}>View cart{'\n'}1 Item</Text>
        </View>

        <TouchableOpacity style={styles.cartButton}>
          <Image
            source={IMAGES.downarrow}
            resizeMode="contain"
            style={{
              height: normalize(10),
              width: normalize(10),
              tintColor: COLORS.white,
              transform: [{rotate: '270deg'}],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopTabWithList;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: normalize(5),
    marginHorizontal: normalize(7),
  },
  tabButton: {
    paddingHorizontal: normalize(4),
    marginRight: normalize(8),
    borderBottomWidth: normalize(2),
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'red',
  },
  tabText: {
    color: COLORS.black,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(10),
  },
  activeTabText: {
    color: COLORS.red,
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(10),
  },
  ////////////////
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bordergrey,
    // paddingVertical: normalize(7),
  },
  image: {
    width: normalize(100),
    height: normalize(75),
    borderRadius: normalize(12),
  },
  cardContent: {
    // flex: 1,
    height: normalize(105),
    width: normalize(180),
  },
  title: {
    fontSize: normalize(12),
    marginBottom: 4,
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 6,
  },
  rating: {
    color: '#333',
    fontSize: 12,
  },
  desc: {
    fontSize: normalize(9),
    color: COLORS.deepGrey,
    fontFamily: FONTS.PoppinsRegular,
  },
  addButton: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notAvailable: {
    color: 'gray',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  ///////////////
  floatingCart: {
    position: 'absolute',
    bottom: normalize(20),
    // left: normalize(50),
    // right: normalize(50),
    width: normalize(130),
    backgroundColor: COLORS.deepGreen,
    borderRadius: normalize(50),
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(5),
    elevation: normalize(10),
    alignSelf: 'center',
  },
  cartDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePlaceholder: {
    width: normalize(35),
    height: normalize(35),
    backgroundColor: '#fff',
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  cartText: {
    color: COLORS.white,
    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsSemiBold,
  },
  cartButton: {
    backgroundColor: '#1b5e20',
    borderRadius: normalize(20),
    padding: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: normalize(16),
  },
});