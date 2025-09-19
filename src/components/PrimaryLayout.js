import React from 'react';
import { StatusBar, Animated } from 'react-native';

import { Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { getStatusBarHeight } from '../utils/platformUtils';

import BackIcon from '../../assets/left_arrow.svg';

export default function PrimaryLayout({ title, scrollOffsetY, children }) {
  const navigation = useNavigation();

  // Animation constants
  const Header_Max_Height = 200;
  const Header_Min_Height = 120;
  const Scroll_Distance = Header_Max_Height - Header_Min_Height;

  // Animated header height
  const animatedHeaderHeight = scrollOffsetY?.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar backgroundColor="#7F4DFF" translucent barStyle="light-content" />
      {/* <StatusBar barStyle="light-content" backgroundColor="" translucent /> */}
      <Animated.View style={{
        paddingTop: getStatusBarHeight() + 22,
        paddingHorizontal: 16,
        paddingBottom: 16,
        height: animatedHeaderHeight,
        backgroundColor: "#7F4DFF",
        overflow: 'hidden',
      }}>
        <TouchableRipple
          borderless
          rippleColor={`rgba(197, 184, 184, 0.12)`}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 100,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BackIcon />
        </TouchableRipple>

        <Text style={{
          fontSize: 30,
          fontFamily: 'clash-display-700',
          color: '#FFFFFF',
          marginTop: 9.5,
          marginBottom: 23
        }}>
          {title}
        </Text>
      </Animated.View>
      {children}
    </>
  )
}
