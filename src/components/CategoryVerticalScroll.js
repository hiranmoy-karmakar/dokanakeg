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
import React from 'react';
import { COLORS, FONTS } from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import { useNavigation } from '@react-navigation/native';

const CategoryVerticalScroll = ({ dataSet = [], type = '', itemId = '' }) => {
  const navigation = useNavigation();
console.log('gfgfgfgfgfgfgfgfgffg', dataSet);

  return (
    <View>
      <FlatList
        horizontal
        data={dataSet}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: subItem }) => (
          <TouchableOpacity
            onPress={() => {
              type == 'restaurant'
                ? navigation.navigate('RestaurantListByCategory', {
                    categoryName: subItem?.name,
                    itemId: subItem?.id,
                  })
                : navigation.navigate('GroceryProductList', {
                    categoryName: subItem?.name,
                    itemId: subItem?.id,
                  });
            }}
            key={subItem.id}
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
                source={{ uri: subItem.image_url }}
                style={styles.image}
              />
            </View>
            <Text numberOfLines={1} style={styles.title}>
              {subItem.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryVerticalScroll;
const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    marginLeft: normalize(5),
    width: normalize(68),
    height: normalize(90),
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
