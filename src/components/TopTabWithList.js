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
import connectionrequest from '../utils/helpers/NetInfo';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ShowAlert from '../utils/helpers/ShowAlert';
import ProductModal from './ProductModal';
import {foodDetailsRequest} from '../redux/reducer/ProfileReducer';
import AddOnModal from './AddOnModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

let status = '';
const TopTabWithList = ({
  setcategories,
  categories,
  foods,
  setfoods,
  selectedCategoryId,
  setSelectedCategoryId,
  visible,
  setVisible,
  nearbyRestaurentItems,
  props,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [foodDetails, setfoodDetails] = useState('');

  const [buttonSellect, setbuttonSellect] = useState('');
  const [visibleAddOnItemId, setVisibleAddOnItemId] = useState(null);
  const [visibleProductId, setVisibleProductId] = useState(null);
  // const [quantity, setQuantity] = useState(0);
  const [local_cartData, setlocal_CartData] = useState([]);
  const [activeAddModalItemId, setActiveAddModalItemId] = useState(null);
  const [matchingItems, setMatchingItems] = useState([]);

  console.log('foooooooood', foods);
  console.log('local_cartDatalocal_cartData', local_cartData);

  useEffect(() => {
    // const fetchCartData = async () => {
    //   try {
    //     const json = await AsyncStorage.getItem('cart');
    //     if (json) setlocal_CartData(JSON.parse(json));
    //   } catch (e) {
    //     console.error('Cart fetch error', e);
    //   }
    // };
    const fetchCartData = async () => {
      try {
        const data = await AsyncStorage.getItem('cart');
        if (data !== null) {
          const parsed = JSON.parse(data);
          setlocal_CartData(parsed);
        } else {
          setlocal_CartData([]);
        }
      } catch (err) {
        console.error('Error reading cart:', err);
      }
    };

    fetchCartData();
  }, [activeAddModalItemId]); // or add a callback when AddOnModal closes

  useEffect(() => {
    if (activeAddModalItemId !== null) {
      const fetchMatchingItems = async () => {
        const cartData = await AsyncStorage.getItem('cart');
        const parsedCart = cartData ? JSON.parse(cartData) : [];

        const matching = parsedCart
          .filter(entry => entry.food_item_id === activeAddModalItemId)
          .map(entry => {
            const base =
              foods.find(f => f.id === activeAddModalItemId)?.sale_price || 0;
            const addonPrice = entry.addon_items.reduce(
              (sum, a) => sum + Number(a.price),
              0,
            );
            return {
              ...entry,
              total_price: entry.quantity * (base + addonPrice),
            };
          });

        setMatchingItems(matching);
      };

      fetchMatchingItems();
    }
  }, [activeAddModalItemId]);

  const handleUpdateQty = async (entry, change) => {
    try {
      const cart = JSON.parse(await AsyncStorage.getItem('cart')) || [];

      const index = cart.findIndex(
        c =>
          c.food_item_id === entry.food_item_id &&
          JSON.stringify(c.addon_items) === JSON.stringify(entry.addon_items),
      );

      if (index !== -1) {
        const updatedQty = cart[index].quantity + change;
        if (updatedQty <= 0) {
          cart.splice(index, 1); // remove entry
        } else {
          cart[index].quantity = updatedQty;
          const basePrice = cart[index].base_price || 0;
          const addonTotal = cart[index].addon_items.reduce(
            (acc, a) => acc + a.price,
            0,
          );
          cart[index].total_price = updatedQty * (basePrice + addonTotal);
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        fetchCartData(); // reload cart to reflect changes
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      const existingCart = await AsyncStorage.getItem('cart');
      if (existingCart) {
        setlocal_CartData(JSON.parse(existingCart));
      }
    };
    fetchCart();
  }, []);

  const fetchCartData = async () => {
    try {
      const data = await AsyncStorage.getItem('cart');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setlocal_CartData(parsedData); // <- existing state update
      } else {
        setlocal_CartData([]);
      }
    } catch (error) {
      console.error('Error reading cart data:', error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const addToCartDirect = async (item, store_id, fetchCartData) => {
    const quantity = 1;
    const productPrice = Number(item?.sale_price || 0);
    const total_price = quantity * productPrice;

    const cartItem = {
      food_item_id: item?.id,
      store_id,
      quantity,
      addon_items: [],
      addon_price: 0,
      product_price: productPrice,
      total_price,
    };

    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];

      cart.push(cartItem);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log('Direct item added to cart:', cartItem);

      // ✅ Refresh UI
      if (typeof fetchCartData === 'function') {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error saving direct cart item:', error);
    }
  };

  const handlePressAdd = item => {
    if (item.addon_items && item.addon_items.length > 0) {
      setActiveAddModalItemId(item.id); // Open modal only if there are add-ons
    } else {
      // No addons, directly increase quantity
      updateCartQuantity(item, 1); // <-- This will increment quantity by 1
    }
  };

  const updateCartQuantity = async (item, incrementBy = 1) => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const index = cart.findIndex(i => i.food_item_id === item.id);

      if (index >= 0) {
        cart[index].quantity += incrementBy;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].total_price =
            cart[index].quantity * cart[index].base_price;
        }
      } else if (incrementBy > 0) {
        cart.push({
          food_item_id: item.id,
          store_id: item.store_id ?? 0,
          quantity: incrementBy,
          addon_items: [],
          base_price: Number(item.sale_price || 0),
          addon_price: 0,
          total_price: incrementBy * Number(item.sale_price || 0),
          image: item.main_image.large_image,
          name: item?.title,
          mrp_price: parseInt(item?.mrp),
        });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setlocal_CartData(cart); // ✅ make sure this function exists in the same component or is passed down
      console.log('Cart updated directly:', cart);
    } catch (err) {
      console.error('Error updating cart directly:', err);
    }
  };

  function foodDetailsFunc(foodID) {
    connectionrequest()
      .then(() => {
        dispatch(foodDetailsRequest(foodID));
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }
  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/foodDetailsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/foodDetailsSuccess':
        status = ProfileReducer.status;
        if (buttonSellect === 'readmore') {
          setVisible(true);
        }
        setfoodDetails(ProfileReducer.foodDetailsResponse?.data);
        break;
      case 'Profile/foodDetailsFailure':
        status = ProfileReducer.status;
        // dispatch(logoutRequest())
        break;
    }
  }

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

  const renderItem = ({item}) => {
    const isInCart = local_cartData?.some(
      cartItem => cartItem.food_item_id === item.id,
    );
    const matchingItems =
      local_cartData?.filter(c => c.food_item_id === item.id) || [];
    const quantity = matchingItems.reduce((sum, i) => sum + i.quantity, 0);

    const decrement = async () => {
      let updatedCart = [...local_cartData];
      const indexToRemove = updatedCart.findIndex(
        c => c.food_item_id === item.id,
      );

      if (indexToRemove !== -1) {
        if (updatedCart[indexToRemove].quantity > 1) {
          updatedCart[indexToRemove].quantity -= 1;
        } else {
          updatedCart.splice(indexToRemove, 1); // remove one instance
        }

        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setlocal_CartData(updatedCart);
      }
    };

    return (
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
                  textDecorationColor: COLORS.themeViolet,
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
                color: COLORS.themeGreen,
                marginLeft: normalize(2),
              }}>
              {/* {item.rating} */}4.4(98k+)
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.desc}>
            {item.description}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // setfoodID(item.id);
              setbuttonSellect('readmore');
              foodDetailsFunc(item.id);
              setVisibleProductId(item.id);
            }}>
            <Text numberOfLines={2} style={[styles.desc, {color: COLORS.blue}]}>
              Read More...
            </Text>
          </TouchableOpacity>
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

          {isInCart == true ? (
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
                position: 'absolute',
                alignSelf: 'center',
                bottom: normalize(-10),
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={decrement}
                style={{
                  height: normalize(22),
                  width: normalize(22),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.PoppinsSemiBold,
                    fontSize: normalize(12),
                    color: COLORS.themeViolet,
                  }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  fontSize: normalize(11),
                  color: COLORS.themeViolet,
                }}>
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  // increment();
                  setActiveAddModalItemId(item.id);
                  // open modal on + click
                }}
                style={{
                  height: normalize(22),
                  width: normalize(22),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.PoppinsSemiBold,
                    fontSize: normalize(12),
                    color: COLORS.themeViolet,
                  }}>
                  +
                </Text>
              </TouchableOpacity>

              <Modal
                isVisible={activeAddModalItemId === item.id}
                onBackdropPress={() => setActiveAddModalItemId(null)}
                onBackButtonPress={() => setActiveAddModalItemId(null)}
                backdropOpacity={0.5}
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.bgGrey,
                    borderRadius: normalize(10),
                    alignItems: 'center',
                    paddingVertical: normalize(20),
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: normalize(50),
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View style={{width: '75%'}}>
                      <Text
                        style={{
                          fontFamily: FONTS.LatoRegular,
                          color: COLORS.themeViolet,
                          fontSize: normalize(12),
                        }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.LatoBold,
                          color: COLORS.themeViolet,
                          fontSize: normalize(15),
                          textTransform: 'capitalize',
                        }}>
                        your customisations
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '10%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => setActiveAddModalItemId(null)}>
                        <Image
                          source={IMAGES.close}
                          resizeMode="contain"
                          style={{height: normalize(20), width: normalize(20)}}
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
                    }}>
                    <View style={{maxHeight: normalize(300)}}>
                      <ScrollView
                        contentContainerStyle={{paddingBottom: normalize(10)}}
                        showsVerticalScrollIndicator={false}>
                        {local_cartData
                          .filter(entry => entry.food_item_id === item.id)
                          .map((entry, index) => {
                            const quantity = entry.quantity;
                            const basePrice = entry.base_price || 0; // use stored base price in entry
                            const addonTotal =
                              entry.addon_items?.reduce(
                                (acc, addon) => acc + (addon.price || 0),
                                0,
                              ) || 0;
                            console.log('kakakakakkakakakak', entry);

                            const total =
                              entry.total_price ||
                              entry.quantity *
                                (entry.product_price +
                                  (entry.addon_price || 0));

                            return (
                              <View key={index}>
                                <Image
                                  source={
                                    item.type === 'veg'
                                      ? IMAGES.vegicon
                                      : IMAGES.nonveg
                                  }
                                  resizeMode="contain"
                                  style={{
                                    height: normalize(12),
                                    width: normalize(12),
                                    marginBottom: normalize(5),
                                  }}
                                />

                                {entry.addon_items.length !== 0 ? (
                                  entry?.addon_items?.map((addon, idx) => (
                                    <Text
                                      key={idx}
                                      style={{
                                        fontFamily: FONTS.LatoRegular,
                                        color: COLORS.themeViolet,
                                        fontSize: normalize(12),
                                        paddingVertical: normalize(2),
                                      }}>
                                      • {addon.title}
                                    </Text>
                                  ))
                                ) : (
                                  <Text
                                    style={{
                                      fontFamily: FONTS.LatoRegular,
                                      color: COLORS.themeViolet,
                                      fontSize: normalize(12),
                                      paddingVertical: normalize(2),
                                    }}>
                                    • No customization added
                                  </Text>
                                )}

                                <View
                                  style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: normalize(10),
                                    marginBottom:
                                      nearbyRestaurentItems?.addon_items != []
                                        ? normalize(10)
                                        : null,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: FONTS.LatoBold,
                                      color: COLORS.themeViolet,
                                      fontSize: normalize(14),
                                    }}>
                                    ₹{total}
                                  </Text>

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
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => handleUpdateQty(entry, -1)}
                                      style={{
                                        height: normalize(22),
                                        width: normalize(22),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontFamily: FONTS.PoppinsSemiBold,
                                          fontSize: normalize(12),
                                          color: COLORS.themeViolet,
                                        }}>
                                        -
                                      </Text>
                                    </TouchableOpacity>

                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontFamily: FONTS.PoppinsSemiBold,
                                        fontSize: normalize(11),
                                        color: COLORS.themeViolet,
                                      }}>
                                      {quantity}
                                    </Text>

                                    <TouchableOpacity
                                      onPress={() => handleUpdateQty(entry, +1)}
                                      style={{
                                        height: normalize(22),
                                        width: normalize(22),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontFamily: FONTS.PoppinsSemiBold,
                                          fontSize: normalize(12),
                                          color: COLORS.themeViolet,
                                        }}>
                                        +
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                      </ScrollView>
                    </View>

                    <>
                      <View
                        style={{
                          height: 1,
                          width: '95%',
                          backgroundColor: COLORS.themeViolet,
                          marginTop: normalize(10),
                          alignSelf: 'center',
                        }}></View>
                      <TouchableOpacity
                        onPress={() => {
                          item.addon_items.length == 0
                            ? ShowAlert('No customize items found ⚠️')
                            : setVisibleAddOnItemId(item.id); // Open AddOnModal
                        }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: normalize(15),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONTS.LatoBold,
                            color: COLORS.themeViolet,
                            fontSize: normalize(13),
                            textTransform: 'capitalize',
                          }}>
                          Add new customization
                        </Text>
                      </TouchableOpacity>
                    </>
                    {visibleAddOnItemId === item.id && (
                      <AddOnModal
                        addOnVisible={true}
                        setaddOnVisible={() => setVisibleAddOnItemId(null)}
                        fullData={item}
                        nearbyRestaurentItems={nearbyRestaurentItems}
                        onAddItem={() => fetchCartData()}
                      />
                    )}
                  </View>
                </View>
              </Modal>
            </View>
          ) : (
            <AddButton
              bottom={-10}
              position="absolute"
              data={item}
              store_id={nearbyRestaurentItems?.id}
              onCartUpdate={fetchCartData}
              onPress={() => {
                if (item?.addon_items?.length > 0) {
                  // Show modal for addon selection
                  foodDetailsFunc(item.id);
                  setbuttonSellect('add');
                  setVisibleAddOnItemId(item.id);
                } else {
                  // Directly add to cart
                  addToCartDirect(
                    item,
                    nearbyRestaurentItems?.id,
                    fetchCartData,
                  );
                }
              }}
            />
          )}
        </View>
        <ProductModal
          visible={visibleProductId === item.id}
          setVisible={() => setVisibleProductId(null)}
          data={item}
        />
        <AddOnModal
          addOnVisible={visibleAddOnItemId === item.id}
          setaddOnVisible={() => setVisibleAddOnItemId(null)}
          fullData={item}
          nearbyRestaurentItems={nearbyRestaurentItems}
          onAddItem={() => fetchCartData()}
        />
      </View>
    );
  };

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
          width: '99%',
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
      {local_cartData?.length != 0 ? (
        <View style={styles.floatingCart}>
          <View style={styles.cartDetails}>
            <View style={styles.imagePlaceholder}>
              <Image
                source={{uri: local_cartData[0]?.image}}
                resizeMode="contain"
                style={{height: '100%', width: '100%'}}
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
                ]}>
                <Image
                  source={{uri: local_cartData[1]?.image}}
                  resizeMode="contain"
                  style={{height: '100%', width: '100%'}}
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
            style={styles.cartButton}>
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
      ) : null}
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
    borderBottomColor: COLORS.themeViolet,
  },
  tabText: {
    color: COLORS.themeGreen,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(10),
  },
  activeTabText: {
    color: COLORS.themeViolet,
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
    color: COLORS.themeGreen,
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
    backgroundColor: COLORS.themeViolet,
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
