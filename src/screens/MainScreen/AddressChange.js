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
import React, { lazy, useEffect, useState } from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS, IMAGES, LOTTIE } from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import DetailsHeader from '../../components/DetailsHeader';
import { addressList } from '../../../StaticDataset';
import Modal from 'react-native-modal';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {
  activeAddressRequest,
  addAddressRequest,
  allAddressListRequest,
  editAddressRequest,
} from '../../redux/reducer/ProfileReducer';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

let status = '';
const AddressChange = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [addressList, setaddressList] = useState([]);
  console.log('kwcgiydwgceiwygc', addressList);

  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, seteditModalVisible] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [setAsActiveTrigger, setsetAsActiveTrigger] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    type: 'home',
    landmark: '',
  });

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(allAddressListRequest());
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  const onPressEditAddress = () => {
    if (!editAddress?.name) {
      ShowAlert('Please enter a name');
    } else if (!editAddress?.phone) {
      ShowAlert('Please enter a phone number');
    } else if (!editAddress?.address) {
      ShowAlert('Please enter an address');
    } else if (!editAddress?.landmark) {
      ShowAlert('Please enter a landmark');
    } else if (!editAddress?.pincode) {
      ShowAlert('Please enter a pincode');
    } else {
      const obj = {
        id: editAddress.id, // required for PUT API url `user/addresses/${id}`
        name: editAddress.name,
        phone: editAddress.phone,
        address: editAddress.address,
        landmark: editAddress.landmark,
        pincode: editAddress.pincode,
        type: editAddress.type,
      };

      connectionrequest()
        .then(() => {
          dispatch(editAddressRequest(obj));
        })
        .catch(err => {
          console.log(err);
          ShowAlert('Please connect to internet');
        });
    }
  };

  const onPressSetAsActive = () => {
    const selectedAddress = addressList.find(item => item.id === selectedId);
    if (!selectedAddress) {
      ShowAlert('Please select an address');
      return;
    }

    const obj = {
      id: selectedAddress.id,
      name: selectedAddress.name,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      pincode: selectedAddress.pincode,
      type: selectedAddress.type,
      landmark: selectedAddress.landmark,
      is_default: 1,
    };

    connectionrequest()
      .then(() => {
        dispatch(editAddressRequest(obj));
        setsetAsActiveTrigger(true);
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  };

  const onPressAddAddress = () => {
    if (!newAddress.name) {
      ShowAlert('Please enter a name');
    } else if (!newAddress.phone) {
      ShowAlert('Please enter a phone number');
    } else if (!newAddress.address) {
      ShowAlert('Please enter an address');
    } else if (!newAddress.landmark) {
      ShowAlert('Please enter a landmark');
    } else if (!newAddress.pincode) {
      ShowAlert('Please enter a pincode');
    } else {
      const obj = {
        name: newAddress.name,
        phone: newAddress.phone,
        address: newAddress.address,
        pincode: newAddress.pincode,
        type: newAddress.type, // Make sure `type` exists in `newAddress`
        landmark: newAddress.landmark,
      };

      connectionrequest()
        .then(() => {
          dispatch(addAddressRequest(obj)); // Send JSON object directly
        })
        .catch(err => {
          console.log(err);
          ShowAlert('Please connect to internet');
        });
    }
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/allAddressListRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/allAddressListSuccess':
        status = ProfileReducer.status;
        setaddressList(ProfileReducer?.allAddressListResponse?.data);
        dispatch(activeAddressRequest());
        break;
      case 'Profile/allAddressListFailure':
        status = ProfileReducer.status;
      ////
      case 'Profile/addAddressRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/addAddressSuccess':
        status = ProfileReducer.status;
        setModalVisible(false);
        setNewAddress({
          name: '',
          phone: '',
          address: '',
          pincode: '',
          landmark: '',
          type: 'home',
        });
        dispatch(allAddressListRequest());
        dispatch(activeAddressRequest());
        break;
      case 'Profile/addAddressFailure':
        status = ProfileReducer.status;
      ////
      case 'Profile/editAddressRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/editAddressSuccess':
        status = ProfileReducer.status;
        seteditModalVisible(false);
        setEditAddress(null);
        dispatch(allAddressListRequest()); // refresh list
        dispatch(activeAddressRequest());
        setAsActiveTrigger == true ? navigation.goBack() : null;
        break;
      case 'Profile/editAddressFailure':
        status = ProfileReducer.status;
        break;
    }
  }

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[
          styles.itemContainer,
          {
            borderColor: COLORS.themeViolet,
            backgroundColor: item.is_default
              ? COLORS.themeGreen
              : isSelected
              ? COLORS.blue
              : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setEditAddress(item); // set current address to edit
            seteditModalVisible(true); // open modal
          }}
          style={{
            position: 'absolute',
            right: normalize(10),
            top: normalize(10),
          }}
        >
          <Image
            source={IMAGES.edit}
            resizeMode="contain"
            style={{
              height: normalize(18),
              width: normalize(18),
            }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={
              item?.type == 'home'
                ? IMAGES.homeaddress
                : item?.type == 'work'
                ? IMAGES.workaddress
                : IMAGES.otheraddress
            }
            resizeMode="contain"
            style={{ height: normalize(20), width: normalize(20) }}
          />
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.address}>{item.address}</Text>
        {item.landmark ? (
          <Text style={styles.address}>Near, {item.landmark}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <DetailsHeader />
        <View
          style={{
            height: '80%',
            width: '90%',
            alignSelf: 'center',
            backgroundColor: COLORS.bgGrey,
            borderRadius: normalize(10),
            padding: normalize(10),
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text
              style={{
                fontFamily: FONTS.PoppinsBold,
                color: COLORS.themeGreen,
                fontSize: normalize(15),
              }}
            >
              Add New Address{' '}
            </Text>
            <Image
              source={IMAGES.locationadd}
              resizeMode="contain"
              style={{
                height: normalize(20),
                width: normalize(20),
                marginLeft: normalize(5),
              }}
            />
          </TouchableOpacity>
          <View style={{ width: '100%', height: '95%' }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={addressList}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              extraData={selectedId}
              ListEmptyComponent={() => (
                <View
                  style={{
                    height: normalize(500),
                    width: normalize(250),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LottieView
                    source={LOTTIE.nodatafound2} // path to your JSON file
                    autoPlay
                    loop
                    style={{ width: normalize(200), height: normalize(200) }}
                  />
                </View>
              )}
            />
          </View>
        </View>
        {addressList?.length == 0 ? null : (
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(20),
              alignSelf: 'center',
            }}
          >
            <TouchableOpacity
              onPress={onPressSetAsActive}
              style={{
                height: normalize(35),
                width: normalize(120),
                backgroundColor: COLORS.themeGreen,
                borderRadius: normalize(10),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{ color: COLORS.white, fontFamily: FONTS.PoppinsMedium }}
              >
                Set as Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: normalize(35),
                width: normalize(120),
                backgroundColor: COLORS.red,
                borderRadius: normalize(10),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginLeft: normalize(20),
              }}
            >
              <Text
                style={{ color: COLORS.white, fontFamily: FONTS.PoppinsMedium }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          // justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: normalize(12),
            overflow: 'hidden',
            height: normalize(340),
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextInput
            placeholder="Name"
            value={newAddress.name}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text => setNewAddress({ ...newAddress, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.themeViolet}
            value={newAddress.phone}
            onChangeText={text => setNewAddress({ ...newAddress, phone: text })}
            style={styles.input}
            maxLength={10}
          />
          <TextInput
            placeholder="Address"
            value={newAddress.address}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text =>
              setNewAddress({ ...newAddress, address: text })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Landmark"
            value={newAddress.landmark}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text =>
              setNewAddress({ ...newAddress, landmark: text })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Pincode"
            keyboardType="number-pad"
            placeholderTextColor={COLORS.themeViolet}
            value={newAddress.pincode.toString()}
            onChangeText={text =>
              setNewAddress({ ...newAddress, pincode: text })
            }
            style={styles.input}
            maxLength={6}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: normalize(10),
              width: '80%',
            }}
          >
            {['home', 'work', 'other'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setNewAddress({ ...newAddress, type })}
                style={{
                  padding: normalize(8),
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor:
                    newAddress.type === type ? COLORS.themeViolet : COLORS.blue,
                  borderRadius: normalize(5),
                }}
              >
                <Image
                  source={
                    type == 'home'
                      ? IMAGES.homeaddress
                      : type == 'work'
                      ? IMAGES.workaddress
                      : IMAGES.otheraddress
                  }
                  resizeMode="contain"
                  style={{ height: normalize(15), width: normalize(15) }}
                />
                <Text
                  style={{
                    marginLeft: normalize(5),
                    fontFamily: FONTS.LatoRegular,
                    color: COLORS.themeGreen,
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(15),
            }}
          >
            <TouchableOpacity
              style={{
                height: normalize(30),
                width: normalize(60),
                backgroundColor: COLORS.red,
                borderRadius: normalize(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModalVisible(false);
                setNewAddress({
                  name: '',
                  phone: '',
                  address: '',
                  landmark: '',
                  pincode: '',
                  type: 'home', // default
                });
              }}
            >
              <Text style={{ color: COLORS.white }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: normalize(30),
                width: normalize(60),
                backgroundColor: COLORS.themeGreen,
                borderRadius: normalize(10),
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: normalize(10),
              }}
              onPress={() => {
                // you can push to addressList here or pass to parent via props
                console.log('Address added:', newAddress);
                onPressAddAddress();
              }}
            >
              <Text style={{ color: COLORS.white }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={editModalVisible}
        onBackdropPress={() => seteditModalVisible(false)}
        onBackButtonPress={() => seteditModalVisible(false)}
        backdropOpacity={0.5}
        style={{ margin: 0, alignItems: 'center' }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: normalize(12),
            overflow: 'hidden',
            height: normalize(340),
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextInput
            placeholder="Name"
            value={editAddress?.name}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text =>
              setEditAddress(prev => ({ ...prev, name: text }))
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.themeViolet}
            value={editAddress?.phone}
            onChangeText={text =>
              setEditAddress(prev => ({ ...prev, phone: text }))
            }
            style={styles.input}
            maxLength={10}
          />
          <TextInput
            placeholder="Address"
            value={editAddress?.address}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text =>
              setEditAddress(prev => ({ ...prev, address: text }))
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Landmark"
            value={editAddress?.landmark}
            placeholderTextColor={COLORS.themeViolet}
            onChangeText={text =>
              setEditAddress(prev => ({ ...prev, landmark: text }))
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Pincode"
            keyboardType="number-pad"
            placeholderTextColor={COLORS.themeViolet}
            value={editAddress?.pincode?.toString()}
            onChangeText={text =>
              setEditAddress(prev => ({ ...prev, pincode: text }))
            }
            style={styles.input}
            maxLength={6}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: normalize(10),
              width: '80%',
            }}
          >
            {['home', 'work', 'other'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setEditAddress(prev => ({ ...prev, type }))}
                style={{
                  padding: normalize(8),
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor:
                    editAddress?.type === type ? COLORS.themeViolet : COLORS.blue,
                  borderRadius: normalize(5),
                }}
              >
                <Image
                  source={
                    type == 'home'
                      ? IMAGES.homeaddress
                      : type == 'work'
                      ? IMAGES.workaddress
                      : IMAGES.otheraddress
                  }
                  resizeMode="contain"
                  style={{ height: normalize(15), width: normalize(15) }}
                />
                <Text
                  style={{
                    marginLeft: normalize(5),
                    fontFamily: FONTS.LatoRegular,
                    color: COLORS.themeGreen,
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(15),
            }}
          >
            <TouchableOpacity
              style={{
                height: normalize(30),
                width: normalize(60),
                backgroundColor: COLORS.red,
                borderRadius: normalize(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                seteditModalVisible(false);
                setEditAddress(null);
              }}
            >
              <Text style={{ color: COLORS.white }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: normalize(30),
                width: normalize(60),
                backgroundColor: COLORS.themeGreen,
                borderRadius: normalize(10),
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: normalize(10),
              }}
              onPress={() => {
                onPressEditAddress();
              }}
            >
              <Text style={{ color: COLORS.white }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddressChange;

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: normalize(1),
    borderRadius: normalize(10),
    padding: normalize(10),
    marginVertical: normalize(8),
  },
  name: {
    fontSize: normalize(15),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.themeViolet,
  },
  phone: {
    marginVertical: normalize(2),
    fontSize: normalize(11),
    color: COLORS.themeViolet,
    fontFamily: FONTS.PoppinsRegular,
  },
  address: {
    marginVertical: normalize(2),
    fontSize: normalize(11),
    color: COLORS.deepGrey,
    fontFamily: FONTS.PoppinsRegular,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.themeGreen,
    borderRadius: normalize(5),
    padding: normalize(10),
    marginTop: normalize(10),
    height: normalize(35),
    width: '90%',
    color: COLORS.deepGrey,
  },
});
