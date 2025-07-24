// import React from 'react';
// import {StatusBar, Platform, StyleSheet, SafeAreaView} from 'react-native';
// import propTypes, {bool} from 'prop-types';
// import {COLORS} from '../themes/Themes';
// import normalize from './helpers/normalize';
// const STATUSBAR_HEIGHT = StatusBar.currentHeight;

// const MyStatusBar = ({backgroundColor, barStyle, ...props}) => (
//   <SafeAreaView
//     style={Platform.OS === 'ios' && [styles.statusBar, {backgroundColor}]}>
//     <StatusBar
//       translucent={false}
//       backgroundColor={backgroundColor}
//       barStyle={barStyle}
//       hidden={false}
//     />
//   </SafeAreaView>
// );

// export default MyStatusBar;
// MyStatusBar.propTypes = {
//   backgroundColor: propTypes.string,
//   barStyle: propTypes.string,
//   height: propTypes.number,
//   //hidden:propTypes.bool,
// };

// MyStatusBar.defaultProps = {
//   backgroundColor: COLORS.white,
//   barStyle: 'light-content',
//   height: normalize(20),
// };

// const styles = StyleSheet.create({
//   statusBar: {
//     height: STATUSBAR_HEIGHT,
//   },
// });
import React from 'react';
import { StatusBar, Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../themes/Themes';
import normalize from './helpers/normalize';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? normalize(50) : StatusBar.currentHeight;

const MyStatusBar = ({ backgroundColor, barStyle }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar
      translucent={false}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      hidden={false}
    />
  </View>
);

MyStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.string,
};

MyStatusBar.defaultProps = {
  backgroundColor: COLORS.white,
  barStyle: 'light-content',
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default MyStatusBar;
