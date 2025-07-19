import React from 'react';
import Tab4 from '../screens/BottomTab/Cart';
import Tab2 from '../screens/BottomTab/Restaurant';
import Tab3 from '../screens/BottomTab/Grocery';
import Tab1 from '../screens/BottomTab/Home';
import Tab5 from '../screens/BottomTab/Menu';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import normalize from '../utils/helpers/normalize';
import { COLORS, FONTS, ICONS, IMAGES } from '../themes/Themes';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const Tab1Stack =
  Platform?.OS == 'android'
    ? createNativeStackNavigator()
    : createStackNavigator();
const Tab2Stack =
  Platform?.OS == 'android'
    ? createNativeStackNavigator()
    : createStackNavigator();
const Tab3Stack =
  Platform?.OS == 'android'
    ? createNativeStackNavigator()
    : createStackNavigator();
const Tab4Stack =
  Platform?.OS == 'android'
    ? createNativeStackNavigator()
    : createStackNavigator();
const Tab5Stack =
  Platform?.OS == 'android'
    ? createNativeStackNavigator()
    : createStackNavigator();

function Tab1StackScreen() {
  return (
    <Tab1Stack.Navigator
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Tab1Stack.Screen
        name="Tab1"
        component={Tab1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tab1Stack.Navigator>
  );
}

function Tab2StackScreen() {
  return (
    <Tab2Stack.Navigator
      unmountOnBlur={true}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        unmountOnBlur: true,
      }}
    >
      <Tab2Stack.Screen
        name="Tab2"
        component={Tab2}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tab2Stack.Navigator>
  );
}

function Tab3StackScreen() {
  return (
    <Tab3Stack.Navigator
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Tab3Stack.Screen
        name="Tab3"
        component={Tab3}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tab3Stack.Navigator>
  );
}
function Tab4StackScreen() {
  return (
    <Tab4Stack.Navigator
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Tab4Stack.Screen
        name="Tab4"
        component={Tab4}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tab4Stack.Navigator>
  );
}
function Tab5StackScreen() {
  return (
    <Tab5Stack.Navigator
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Tab5Stack.Screen
        name="Tab5"
        component={Tab5}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tab5Stack.Navigator>
  );
}
const BottomTab = props => {
  return (
    <Tab.Navigator
      unmountOnBlur={true}
      initialRouteName="Tab1StackScreen"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Tab1StackScreen"
        component={Tab1StackScreen}
        options={{
          tabBarButton: (props) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.accessibilityState?.selected
                    ? navigation?.navigate('BottomTab', {
                        screen: 'Tab1StackScreen',
                        params: { screen: 'Tab1' },
                      })
                    : navigation.navigate('Tab1StackScreen');
                }}
                style={styles.tabWrapper}
              >
                <Image
                  source={
                    props.accessibilityState?.selected
                      ? IMAGES.homeactive
                      : IMAGES.home
                  }
                  style={styles.tabBarButton}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tab2StackScreen"
        component={Tab2StackScreen}
        options={{
          tabBarButton: (props) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.accessibilityState?.selected
                    ? navigation?.navigate('BottomTab', {
                        screen: 'Tab2StackScreen',
                        params: { screen: 'Tab2' },
                      })
                    : navigation.navigate('Tab2StackScreen');
                }}
                style={styles.tabWrapper}
              >
                <Image
                  source={
                    props.accessibilityState?.selected
                      ? IMAGES.menuactive
                      : IMAGES.menu
                  }
                  style={styles.tabBarButton}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tab3StackScreen"
        component={Tab3StackScreen}
        options={{
          tabBarButton: (props) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.accessibilityState?.selected
                    ? navigation?.navigate('BottomTab', {
                        screen: 'Tab3StackScreen',
                        params: { screen: 'Tab3' },
                      })
                    : navigation.navigate('Tab3StackScreen');
                }}
                style={styles.tabWrapper}
              >
                <Image
                  source={
                    props.accessibilityState?.selected
                      ? IMAGES.groceryactive
                      : IMAGES.grocery
                  }
                  style={styles.tabBarButton}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tab4StackScreen"
        component={Tab4StackScreen}
        options={{
          tabBarButton: (props) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.accessibilityState?.selected
                    ? navigation?.navigate('BottomTab', {
                        screen: 'Tab4StackScreen',
                        params: { screen: 'Tab4' },
                      })
                    : navigation.navigate('Tab4StackScreen');
                }}
                style={styles.tabWrapper}
              >
                <Image
                  source={
                    props.accessibilityState?.selected
                      ? IMAGES.reportactive
                      : IMAGES.report
                  }
                  style={styles.tabBarButton}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tab5StackScreen"
        component={Tab5StackScreen}
        options={{
          tabBarButton: (props) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.accessibilityState?.selected
                    ? navigation?.navigate('BottomTab', {
                        screen: 'Tab5StackScreen',
                        params: { screen: 'Tab5' },
                      })
                    : navigation.navigate('Tab5StackScreen');
                }}
                style={styles.tabWrapper}
              >
                <Image
                  source={
                    props.accessibilityState?.selected
                      ? IMAGES.profileactive
                      : IMAGES.profile
                  }
                  style={styles.tabBarButton}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabText: {
    fontSize: normalize(8),
    marginTop: normalize(3),
    fontFamily: FONTS.PoppinsRegular,
  },
  tabBarButton: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
  },
  tabBarStyle: {
    backgroundColor: Platform.OS == 'android' ? 'transparent' : COLORS.white,
    height:
      Platform.OS == 'android'
        ? normalize(50)
        : Platform?.isPad
        ? normalize(60)
        : normalize(65),
    borderTopWidth: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    // borderTopLeftRadius: normalize(25),
    // borderTopRightRadius: normalize(25),
    paddingTop: Platform.OS == 'android' ? normalize(2) : normalize(25),
    width: Platform.OS == 'ios' ? 'auto' : normalize(330),
    left: Platform.OS == 'ios' ? normalize(0) : normalize(-5),
    elevation: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 }, // Negative y for top shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabWrapper: {
    alignItems: 'center',
    width: '20%',

    borderTopLeftRadius: normalize(25),
    borderTopRightRadius: normalize(25),
  },
});

export default BottomTab;
