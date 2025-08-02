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
  Alert,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let status = '';
const GroceryProductList = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  // cart
  const [local_cartData, setlocal_CartData] = useState([]);

  // console.log('allProductsallProducts', allProducts);
  // console.log('categoryListcategoryList', categoryList);
  console.log('dataaaaaaaaa', local_cartData);

  const getProductQuantity = (cart, productId, variantId = null) => {
    const item = cart.find(
      i => i.id === productId && i.variantId === variantId,
    );
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    AsyncStorage.getItem('cart').then(cart => {
      if (cart) setlocal_CartData(JSON.parse(cart));
    });
  }, []);

  const addToCart = async (
    product,
    variant = null,
    addon_items = [],
    quantity = 1,
  ) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];

      const base_price = variant
        ? parseFloat(variant.price)
        : parseFloat(product.sale_price);

      const addon_total = addon_items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) || 0);
      }, 0);

      const total_price = (base_price + addon_total) * quantity;

      const itemToAdd = {
        id: product.id,
        name: product.title,
        image: product?.images?.[0]?.main_image || '',
        base_price: base_price,
        mrp_price: parseInt(variant ? variant.mrp : product.mrp),
        variation: variant ? variant.options : null,
      total_price: Number(parseFloat(total_price).toFixed(2)),
        quantity: quantity,
        variantId: variant ? variant.id : null,
        addon_items: addon_items,
        type: 'grocery',
      };

      const isSameItem = (a, b) => a.id === b.id && a.variantId === b.variantId;

      const matchingItems = cartItems.filter(item =>
        isSameItem(item, itemToAdd),
      );
      const hasPreviousAddon = matchingItems.find(
        item => item.addon_items && item.addon_items.length > 0,
      );

      if (hasPreviousAddon) {
        Alert.alert(
          'Item Already in Cart',
          'This item already exists in the cart with addons. Do you want to replace it?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                cartItems = cartItems.filter(
                  item => !isSameItem(item, itemToAdd),
                );
                cartItems.push(itemToAdd);
                await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
                setlocal_CartData(cartItems);
                ShowAlert('Updated cart with new addons!');
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        const index = cartItems.findIndex(item => isSameItem(item, itemToAdd));

        if (index >= 0) {
          cartItems[index].quantity += quantity;
          const currentAddonTotal = cartItems[index].addon_items.reduce(
            (sum, item) => sum + (parseFloat(item.price) || 0),
            0,
          );
          const base = parseFloat(cartItems[index].price);
          const qty = cartItems[index].quantity;
          cartItems[index].total_price = (
            (base + currentAddonTotal) *
            qty
          ).toFixed(2);
        } else {
          cartItems.push(itemToAdd);
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        setlocal_CartData(cartItems);
        ShowAlert('Added to cart!');
      }
    } catch (err) {
      console.log('Add to cart error:', err);
      ShowAlert('Error adding to cart');
    }
  };

  const increment = async (product, variant = null) => {
    const cart = await AsyncStorage.getItem('cart');
    let cartItems = cart ? JSON.parse(cart) : [];

    const index = cartItems.findIndex(
      item =>
        item.id === product.id &&
        item.variantId === (variant ? variant.id : null),
    );

    if (index >= 0) {
      cartItems[index].quantity += 1;
      const base = parseFloat(cartItems[index].base_price);
      const addonTotal = cartItems[index].addon_items.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0),
        0,
      );
      const qty = cartItems[index].quantity;
      cartItems[index].total_price = ((base + addonTotal) * qty).toFixed(2);

      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setlocal_CartData(cartItems);
    }
  };

  const decrement = async (product, variant = null) => {
    const cart = await AsyncStorage.getItem('cart');
    let cartItems = cart ? JSON.parse(cart) : [];

    const index = cartItems.findIndex(
      item =>
        item.id === product.id &&
        item.variantId === (variant ? variant.id : null),
    );

    if (index >= 0) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        const base = parseFloat(cartItems[index].base_price);
        const addonTotal = cartItems[index].addon_items.reduce(
          (sum, item) => sum + (parseFloat(item.price) || 0),
          0,
        );
        const qty = cartItems[index].quantity;
        cartItems[index].total_price = ((base + addonTotal) * qty).toFixed(2);
      } else {
        cartItems.splice(index, 1);
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setlocal_CartData(cartItems);
    }
  };

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

  const renderProductItem = ({ item }) => {
    const quantity = getProductQuantity(local_cartData, item.id, null);
    return (
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
          <Text style={styles.productPrice}>EGP {item.sale_price}</Text>
          <Text style={styles.actualproductPrice}>{item.mrp}</Text>
        </View>
        {quantity === 0 ? (
          <TouchableOpacity
            onPress={() => {
              if (item.variations && item.variations.length > 0) {
                setSelectedProduct(item);
                setIsModalVisible(true);
              } else {
                addToCart(item); // Add simple product directly
              }
            }}
            style={{
              height: normalize(22),
              width: normalize(80),
              borderRadius: normalize(5),
              borderWidth: normalize(1),
              borderColor: COLORS.themeViolet,
              backgroundColor: COLORS.blue,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: normalize(5),
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
              {item.variations && item.variations.length > 0
                ? 'EXPLORE'
                : 'ADD'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              height: normalize(22),
              width: normalize(80),
              borderRadius: normalize(5),
              borderWidth: normalize(1),
              borderColor: COLORS.themeViolet,
              backgroundColor: COLORS.blue,
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: normalize(5),
            }}
          >
            <TouchableOpacity
              onPress={() => decrement(item)}
              style={{
                height: normalize(22),
                width: normalize(22),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.addButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.addButtonText}>{quantity}</Text>

            <TouchableOpacity
              onPress={() => increment(item)}
              style={{
                height: normalize(22),
                width: normalize(22),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
                {selectedProduct?.variations?.map((variant, index) => {
                  return (
                    <Fragment key={index}>
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
                            <View key={idx}>
                              <Text
                                style={{
                                  fontFamily: FONTS.PoppinsSemiBold,
                                  color: COLORS.themeViolet,
                                  fontSize: normalize(11),
                                }}
                              >
                                {option?.attribute} : {option?.value}
                              </Text>
                              <View style={{ flexDirection: 'row' }}>
                                <Text
                                  style={{
                                    fontFamily: FONTS.PoppinsSemiBold,
                                    color: COLORS.themeViolet,
                                    fontSize: normalize(11),
                                  }}
                                >
                                  EGP {variant?.price}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FONTS.PoppinsSemiBold,
                                    color: COLORS.themeViolet,
                                    fontSize: normalize(9),
                                    marginLeft: normalize(5),
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: COLORS.themeViolet,
                                  }}
                                >
                                  {variant?.mrp}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>

                        {getProductQuantity(
                          local_cartData,
                          selectedProduct?.id,
                          variant.id,
                        ) === 0 ? (
                          <TouchableOpacity
                            onPress={() => {
                              addToCart(selectedProduct, variant);
                            }}
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
                        ) : (
                          <View
                            style={{
                              height: normalize(22),
                              width: normalize(80),
                              borderRadius: normalize(5),
                              borderWidth: normalize(1),
                              borderColor: COLORS.themeViolet,
                              backgroundColor: COLORS.blue,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                decrement(selectedProduct, variant)
                              }
                              style={{
                                height: normalize(22),
                                width: normalize(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={styles.addButtonText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.addButtonText}>
                              {getProductQuantity(
                                local_cartData,
                                selectedProduct?.id,
                                variant.id,
                              )}
                            </Text>

                            <TouchableOpacity
                              onPress={() =>
                                increment(selectedProduct, variant)
                              }
                              style={{
                                height: normalize(22),
                                width: normalize(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: COLORS.themeViolet,
                        }}
                      ></View>
                    </Fragment>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating View Cart */}
      {local_cartData?.length != 0 ? (
        <View style={styles.floatingCart}>
          <View style={styles.cartDetails}>
            <View style={styles.imagePlaceholder}>
              <Image
                source={{ uri: local_cartData[0]?.image }}
                resizeMode="contain"
                style={{ height: '100%', width: '100%' }}
              />
            </View>
            {local_cartData?.length != 1 ? (
              <View
                style={[
                  styles.imagePlaceholder,
                  {
                    position: 'absolute',
                    right: normalize(50),
                  },
                ]}
              >
                <Image
                  source={{ uri: local_cartData[1]?.image }}
                  resizeMode="contain"
                  style={{ height: '100%', width: '100%' }}
                />
              </View>
            ) : null}
            <Text style={styles.cartText}>
              View cart{'\n'}
              {local_cartData?.length}{' '}
              {local_cartData?.length == 1 ? 'Item' : 'Items'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation?.navigate('BottomTab', {
                screen: 'Tab4StackScreen',
                params: {
                  screen: 'Tab4',
                },
              });
            }}
            style={styles.cartButton}
          >
            <Image
              source={IMAGES.downarrow}
              resizeMode="contain"
              style={{
                height: normalize(10),
                width: normalize(10),
                tintColor: COLORS.white,
                transform: [{ rotate: '270deg' }],
              }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
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
    fontSize: normalize(11),
    color: COLORS.themeGreen,
    fontFamily: FONTS.PoppinsSemiBold,
    marginLeft: normalize(5),
  },
  actualproductPrice: {
    fontSize: normalize(10),
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
  ///////////////
  floatingCart: {
    position: 'absolute',
    bottom: normalize(50),
    // left: normalize(50),
    // right: normalize(50),
    width: normalize(130),
    backgroundColor: COLORS.blue,
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
    borderRadius: normalize(20),
    marginRight: normalize(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.bordergrey,
  },
  cartText: {
    color: COLORS.themeViolet,

    fontSize: normalize(10),
    fontFamily: FONTS.PoppinsSemiBold,
  },
  cartButton: {
    backgroundColor: COLORS.themeGreen,
    borderRadius: normalize(20),
    padding: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    color: COLORS.themeGreen,
    fontSize: normalize(16),
  },
});
