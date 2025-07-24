import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../utils/MyStatusBar';
import { COLORS } from '../../themes/Themes';
import DetailsHeader from '../../components/DetailsHeader';
import {
  defaultPageRequest,
} from '../../redux/reducer/ProfileReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import ShowAlert from '../../utils/helpers/ShowAlert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';

let status = '';
const RefundPolicy = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [data, setdata] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(defaultPageRequest('cancellation-refund-policy'));
      })
      .catch(err => {
        console.log(err);
        ShowAlert('Please connect to internet');
      });
  }, []);

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/defaultPageRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/defaultPageSuccess':
        status = ProfileReducer.status;
        setdata(ProfileReducer?.defaultPageResponse?.data);
        break;
      case 'Profile/defaultPageFailure':
        status = ProfileReducer.status;
        break;
    }
  }

  return (
    <>
      <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
        <DetailsHeader pagename={'Cancellation & Refund Policy'} />
        <ScrollView contentContainerStyle={styles.container}>
          {data?.content ? (
            <RenderHtml
              contentWidth={width}
              source={{ html: data.content }}
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default RefundPolicy;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
