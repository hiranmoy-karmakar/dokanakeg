import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import AddButton from './AddButton';
import {COLORS, FONTS, IMAGES} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';


const ProductModal = ({visible, setVisible, data}) => {
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={visible}
        // onBackdropPress={handleClose}
        style={styles.modalContainer}
        swipeDirection="down"
        onSwipeComplete={handleClose}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop
        propagateSwipe>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Image
              source={IMAGES.close}
              style={{width: normalize(20), height: normalize(20)}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {data?.main_image?.large_image ? (
            <Image
              source={{uri: data.main_image.large_image}}
              style={styles.image}
              resizeMode="stretch"
            />
          ) : (
            <Image
              source={IMAGES.imagebreak}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <ScrollView style={styles.detailsContainer}>
            <View
              style={{
                width: normalize(300),
                alignSelf: 'center',
              }}>
              <Text numberOfLines={2} style={styles.title}>
                {data?.title}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.price}>₹{data?.sale_price}</Text>
                <Text style={styles.strikePrice}>₹{data?.mrp}</Text>
              </View>
              <View style={styles.ratingBox}>
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
              <AddButton />
            </View>

            <Text style={styles.description}>{data?.description}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ProductModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(15),
    borderTopRightRadius: normalize(15),
    maxHeight: '90%',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  image: {
    width: '110%',
    height: normalize(200),
    alignSelf: 'center',
    marginBottom: normalize(10),
  },
  detailsContainer: {
    paddingHorizontal: normalize(15),
    paddingBottom: normalize(20),
  },
  title: {
    fontSize: normalize(15),
    marginBottom: normalize(10),
    color: COLORS.black,
    fontFamily: FONTS.PoppinsSemiBold,
    textAlign: 'left',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  strikePrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 10,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  description: {
    color: COLORS.lightBlack,
    fontSize: normalize(11),
    fontFamily: FONTS.PoppinsRegular,
  },
});
