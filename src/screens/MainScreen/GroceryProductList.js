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
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS, IMAGES } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import OtherHeader from '../../components/OtherHeader';
import connectionrequest from '../../utils/helpers/NetInfo';
import {
  productByCategoryRequest,
  productBySubCategoryRequest,
} from '../../redux/reducer/ProfileReducer';
import { useDispatch, useSelector } from 'react-redux';
import ShowAlert from '../../utils/helpers/ShowAlert';
import { useFocusEffect } from '@react-navigation/native';

let status = '';
const GroceryProductList = props => {
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const { categoryName } = props?.route?.params;
  const itemId = props?.route?.params?.itemId;
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [allProducts, setallProducts] = useState([]);
  const [categoryStack, setCategoryStack] = useState([]);
  // varient modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  console.log('allProductsallProducts', allProducts);
  console.log('categoryListcategoryList', categoryList);

  useEffect(() => {
    const { status, productByCategoryResponse, productBySubCategoryResponse } =
      ProfileReducer;

    if (!status) return;
    if (
      status === 'Profile/productByCategorySuccess' &&
      productByCategoryResponse
    ) {
      const subCats = productByCategoryResponse.sub_categories || [];
      const initialProducts = productByCategoryResponse.data || [];
      const rootCategoryId = productByCategoryResponse.category?.id;

      if (categoryList.length === 0 && allProducts.length === 0) {
        setCategoryList(subCats);
        setallProducts(initialProducts);

        // ✅ Initialize root category
        setSelectedCategoryId(rootCategoryId);
        setCategoryStack([rootCategoryId]);
      }
    }

    if (
      status === 'Profile/productBySubCategorySuccess' &&
      productBySubCategoryResponse
    ) {
      const subList = productBySubCategoryResponse.sub_categories || [];
      const products = productBySubCategoryResponse.data || [];

      setCategoryList(subList.length > 0 ? subList : categoryList);
      setallProducts(products);
    }

    if (
      status === 'Profile/productByCategoryFailure' ||
      status === 'Profile/productBySubCategoryFailure'
    ) {
      setallProducts([]);
    }
  }, [ProfileReducer.status]);

  const onSubCategoryPress = id => {
    setSelectedCategoryId(id);
    setCategoryStack(prev => [...prev, id]); // ✅ Push new subcategory to stack
    connectionrequest()
      .then(() => {
        dispatch(productBySubCategoryRequest(id));
      })
      .catch(() => ShowAlert('Please connect to internet'));
  };

  const handleBack = () => {
    if (categoryStack.length > 1) {
      const newStack = [...categoryStack];
      newStack.pop(); // Remove current
      const lastId = newStack[newStack.length - 1];

      setCategoryStack(newStack);
      setSelectedCategoryId(lastId);

      connectionrequest()
        .then(() => {
          dispatch(productBySubCategoryRequest(lastId));
        })
        .catch(() => ShowAlert('Please connect to internet'));
    } else {
      props.navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setCategoryStack([]);
      setSelectedCategoryId(null);
      setCategoryList([]);
      setallProducts([]);

      connectionrequest()
        .then(() => {
          dispatch(productByCategoryRequest(itemId));
        })
        .catch(() => ShowAlert('Please connect to internet'));
    }, [itemId]),
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSubCategoryPress(item.id)}
      style={[styles.categoryItem]}
    >
      <Image source={{ uri: item?.image_url }} style={styles.categoryIcon} />
      <Text
        numberOfLines={1}
        style={[
          styles.categoryText,
          {
            color:
              selectedCategoryId === item.id
                ? COLORS.themeViolet
                : COLORS.themeGreen,
          },
        ]}
      >
        {item.name}
      </Text>
      <View
        style={{
          height: normalize(1),
          width: normalize(30),
          backgroundColor:
            selectedCategoryId === item.id
              ? COLORS.themeViolet
              : COLORS.themeGreen,
          marginTop: normalize(3),
        }}
      ></View>
    </TouchableOpacity>
  );

  const onProductPress = item => {
    if (item.has_children) {
      const alreadyExists = categoryList.find(cat => cat.id === item.id);
      if (!alreadyExists) {
        const newCategory = {
          id: item.id,
          name: item.title,
          image_url: item.images[0]?.main_image,
        };
        setCategoryList(prev => [...prev, newCategory]);
      }

      setSelectedCategoryId(item.id);
      setCategoryStack(prev => [...prev, item.id]);
      connectionrequest()
        .then(() => {
          dispatch(productBySubCategoryRequest(item.id));
        })
        .catch(() => ShowAlert('Please connect to internet'));
    } else {
      // 👉 Check for variations
      if (item.variations && item.variations.length > 0) {
        setSelectedProduct(item);
        setIsModalVisible(true);
      } else {
        console.log('no varients');
      }
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item?.images[0]?.main_image }}
        style={styles.productImage}
      />
      <Text numberOfLines={2} style={styles.productName}>
        {item?.title}
      </Text>
      <Text
        numberOfLines={2}
        style={[styles.description, { paddingHorizontal: normalize(5) }]}
      >
        {item?.description}
      </Text>
      <View
        style={{
          height: normalize(1),
          width: normalize(100),
          backgroundColor: COLORS.bordergrey,
          marginTop: normalize(5),
          alignSelf: 'center',
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.productPrice}>E£ {item.sale_price}</Text>
        <Text style={styles.actualproductPrice}>{item.mrp}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onProductPress(item)}
      >
        <Text style={styles.addButtonText}>
          {item.has_children ? 'Explore' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
        <OtherHeader
          pagename={
            ProfileReducer?.productByCategoryResponse?.category?.name ?? ''
          }
          totalitems={
            ProfileReducer?.productByCategoryResponse?.data?.length || 0
          }
          backPress={handleBack}
        />
        <View style={styles.container}>
          <View style={styles.leftVw}>
            {/* Left Category List */}
            <FlatList
              data={categoryList}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategoryItem}
              showsVerticalScrollIndicator={false}
              style={styles.leftList}
            />
          </View>

          {/* Right Product List */}
          <View style={styles.rightVw}>
            <FlatList
              // data={allProducts[selectedCategoryId]}
              data={allProducts}
              keyExtractor={item => item.id.toString()}
              renderItem={renderProductItem}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              style={styles.rightList}
            />
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: COLORS.bgGrey,
            borderRadius: normalize(10),
            alignItems: 'center',
            paddingVertical: normalize(20),
          }}
        >
          <View
            style={{
              width: '100%',
              height: normalize(50),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <View style={{ width: '75%' }}>
              <Text
                style={{
                  fontFamily: FONTS.LatoRegular,
                  color: COLORS.themeViolet,
                  fontSize: normalize(12),
                }}
              >
                {selectedProduct?.title}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.LatoBold,
                  color: COLORS.blue,
                  fontSize: normalize(15),
                  textTransform: 'capitalize',
                }}
              >
                your variations
              </Text>
            </View>
            <View
              style={{
                width: '10%',
                alignItems: 'flex-end',
              }}
            >
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Image
                  source={IMAGES.close}
                  resizeMode="contain"
                  style={{ height: normalize(20), width: normalize(20) }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: '90%',
              backgroundColor: COLORS.themeGreen,
              paddingTop: normalize(10),
              borderRadius: normalize(10),
              paddingHorizontal: normalize(10),
            }}
          >
            <View style={{ maxHeight: normalize(300) }}>
              <ScrollView
                contentContainerStyle={{ paddingBottom: normalize(10) }}
                showsVerticalScrollIndicator={false}
              >
                {selectedProduct?.variations?.map((variant, index) => (
                  <>
                    <View
                      style={{
                        paddingVertical: normalize(10),
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    >
                      <Image
                        style={{
                          height: normalize(50),
                          width: normalize(50),
                          borderRadius: normalize(50),
                          borderWidth: normalize(1),
                          borderColor: COLORS.themeViolet,
                        }}
                        resizeMode="cover"
                        source={{ uri: variant?.main_image?.main_image }}
                      />
                      <View
                        style={{
                          width: '40%',
                          paddingVertical: normalize(5),
                        }}
                      >
                        {variant?.options?.map((option, idx) => (
                          <Text
                            key={idx}
                            style={{
                              fontFamily: FONTS.PoppinsSemiBold,
                              color: COLORS.themeViolet,
                              fontSize: normalize(11),
                            }}
                          >
                            {option?.attribute} : {option?.value}
                          </Text>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={{
                          height: normalize(22),
                          width: normalize(80),
                          borderRadius: normalize(5),
                          borderWidth: normalize(1),
                          borderColor: COLORS.themeViolet,
                          backgroundColor: COLORS.blue,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: FONTS.PoppinsSemiBold,
                            fontSize: normalize(10),
                            color: COLORS.themeViolet,
                          }}
                        >
                          ADD
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: COLORS.themeViolet,
                      }}
                    ></View>
                  </>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
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
    resizeMode: 'cover',
    borderRadius: normalize(50),
    borderWidth: normalize(1),
    borderColor: COLORS.themeViolet,
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
    resizeMode: 'cover',
    borderRadius: normalize(10),
    alignSelf: 'center',
    marginTop: normalize(8),
  },
  productName: {
    fontSize: normalize(12),
    fontFamily: FONTS.PoppinsMedium,
    textAlign: 'left',
    marginVertical: normalize(4),
    color: COLORS.themeViolet,
    marginHorizontal: normalize(5),
    height: normalize(35),
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
