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
import DetailsHeader from '../../components/DetailsHeader';
import DetailsCarousel from '../../components/DetailsCarousel';
import { detailsCrousel } from '../../../StaticDataset';

const Details = props => {
  const itemDetails = props?.route?.params?.itemDetails;
  return (
    <>
     <MyStatusBar backgroundColor={COLORS.themeGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.offwhite}}>
        <DetailsHeader pagename={itemDetails?.name} />
        {/* <View style={styles.carouselVw}> */}
          <DetailsCarousel originalData={detailsCrousel}/>
        {/* </View> */}
      </SafeAreaView>
    </>
  );
};

export default Details;
const styles = StyleSheet.create({
carouselVw:{
height:normalize(300),
width:normalize(300),
backgroundColor:'pink',
alignSelf:'center',
marginTop:normalize(10),
borderWidth:normalize(1),
borderColor:COLORS.bordergrey,
borderRadius:normalize(20),
justifyContent:'center',
alignItems:'center'
}
});
