import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import StackNav from './src/navigators/StackNav';
import {COLORS} from './src/themes/Themes';
import {useDispatch} from 'react-redux';
import {getTokenRequest} from './src/redux/reducer/AuthReducer';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTokenRequest());
  }, []);
  return (
    <>
      <StatusBar animated={true} backgroundColor={COLORS.red} />
      <StackNav />
    </>
  );
};

export default App;
