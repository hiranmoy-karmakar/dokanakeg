import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import {COLORS, FONTS, IMAGES} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import DetailsHeader from '../../components/DetailsHeader';
import {
  editAccountRequest,
  orderListRequest,
  profileDetailsRequest,
} from '../../redux/reducer/ProfileReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Modal from 'react-native-modal';

let status = '';
const MyAccount = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [profile, setprofile] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');

  const onPressEditaccount = () => {
    if (!editedName) {
      ShowAlert('Please give your name');
      return;
    }

    const obj = {
      name: editedName,
      // email: null,
      // address: null,
      // city: null,
      // country_id: null,
      // state_id: null,
      // pincode_id: null,
    };

    connectionrequest()
      .then(() => {
        dispatch(editAccountRequest(obj));
        setsetAsActiveTrigger(true);
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  };

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(profileDetailsRequest());
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/profileDetailsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/profileDetailsSuccess':
        status = ProfileReducer.status;
        setprofile(ProfileReducer?.profileDetailsResponse?.user || {});
        break;
      case 'Profile/profileDetailsFailure':
        status = ProfileReducer.status;
        break;
      /////
      case 'Profile/editAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/editAccountSuccess':
        status = ProfileReducer.status;
        setIsModalVisible(false);
        dispatch(profileDetailsRequest());
        break;
      case 'Profile/editAccountFailure':
        status = ProfileReducer.status;
        break;
    }
  }

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.offwhite}}>
        <DetailsHeader pagename={'Account Details'} />

        <ScrollView style={{padding: normalize(15)}}>
          {/* USER INFO CARD */}
          <View style={styles.card}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.sectionTitle}>👤 Profile</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditedName(profile?.name || '');
                  setIsModalVisible(true);
                }}>
                <Image
                  source={IMAGES.edit}
                  resizeMode="contain"
                  style={{height: normalize(15), width: normalize(15)}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>
              Name: <Text style={styles.value}>{profile?.name || 'N/A'}</Text>
            </Text>
            <Text style={styles.label}>
              Phone: <Text style={styles.value}>{profile?.phone || 'N/A'}</Text>
            </Text>
          </View>

          {/* DEFAULT ADDRESS */}
          {profile?.addresses?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🏠 Default Address</Text>
              {profile.addresses
                .filter(addr => addr.is_default)
                .map((item, index) => (
                  <View key={item.id}>
                    <Text style={styles.label}>
                      Name: <Text style={styles.value}>{item.name}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Phone: <Text style={styles.value}>{item.phone}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Address: <Text style={styles.value}>{item.address}</Text>
                    </Text>
                    {item.landmark ? (
                      <Text style={styles.label}>
                        Landmark:{' '}
                        <Text style={styles.value}>{item.landmark}</Text>
                      </Text>
                    ) : null}
                    <Text style={styles.label}>
                      Pincode: <Text style={styles.value}>{item.pincode}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Type: <Text style={styles.value}>{item.type}</Text>
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {/* OTHER ADDRESSES */}
          {profile?.addresses?.filter(addr => !addr.is_default)?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>📍 Other Addresses</Text>
              {profile.addresses
                .filter(addr => !addr.is_default)
                .map((item, index) => (
                  <View key={item.id} style={styles.otherAddress}>
                    <Text style={styles.label}>
                      Name: <Text style={styles.value}>{item.name}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Phone: <Text style={styles.value}>{item.phone}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Address: <Text style={styles.value}>{item.address}</Text>
                    </Text>
                    {item.landmark ? (
                      <Text style={styles.label}>
                        Landmark:{' '}
                        <Text style={styles.value}>{item.landmark}</Text>
                      </Text>
                    ) : null}
                    <Text style={styles.label}>
                      Pincode: <Text style={styles.value}>{item.pincode}</Text>
                    </Text>
                    <Text style={styles.label}>
                      Type: <Text style={styles.value}>{item.type}</Text>
                    </Text>
                    {index !== profile.addresses.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Name</Text>
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Enter your name"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                onPressEditaccount();
                // Replace this with your API logic if needed
                // setprofile(prev => ({...prev, name: editedName}));
              }}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MyAccount;
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: normalize(10),
    padding: normalize(15),
    marginBottom: normalize(15),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(16),
    color: COLORS.themeGreen,
    marginBottom: normalize(10),
  },
  label: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(13),
    color: COLORS.themeViolet,
    marginBottom: normalize(3),
  },
  value: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.blue,
  },
  otherAddress: {
    marginBottom: normalize(10),
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.themeGreen,
    marginVertical: normalize(10),
  },
  ////
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: normalize(20),
    borderRadius: normalize(10),
  },
  modalTitle: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: normalize(16),
    color: COLORS.themeGreen,
    marginBottom: normalize(10),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.themeViolet,
    borderRadius: normalize(8),
    padding: normalize(10),
    marginBottom: normalize(15),
    fontFamily: FONTS.PoppinsRegular,
    fontSize: normalize(12),
    color: COLORS.themeViolet,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: COLORS.themeGreen,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(5),
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(5),
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.PoppinsMedium,
  },
});
