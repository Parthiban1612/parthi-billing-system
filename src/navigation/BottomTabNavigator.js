import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import ExplorerScreen from '../screens/explorer';
import CustomTabBar from '../components/CustomTabBar';
import FullPageScroller from '../screens/home';
import SvgComponent from '../common/CustomMegaphoneIcon';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#6E6E73',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={FullPageScroller}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <SvgComponent fill={color} width={size} height={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExplorerTab"
        component={ExplorerScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name="compass" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 