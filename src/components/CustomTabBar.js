import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, BackHandler, AppState } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import TestSheet from './TestSheet';
import ConfirmSheet from '../screens/account/ConfirmSheet';
import SvgComponent from '../common/CustomMegaphoneIcon';
import { useBuySheet } from '../context/BuySheetContext';

import { getPlans } from '../redux/paymentSlice';

import Menu from '../../assets/menu.svg';
import MenuItem from '../../assets/menu-item.svg';
import { TouchableRipple } from 'react-native-paper';
import { ZohoSalesIQ } from "react-native-zohosalesiq-mobilisten";
import { trackFirebaseEvent } from '../lib/analyics';

const TAB_CONTAINER_WIDTH = 130;

const TABS = [
  { id: 'HomeTab', icon: SvgComponent },
  { id: 'ExplorerTab', icon: 'compass' },
];

const TAB_WIDTH = TAB_CONTAINER_WIDTH / TABS.length;
const ACTIVE_PILL_DIAMETER = 48;
const PILL_HORIZONTAL_MARGIN = (TAB_WIDTH - ACTIVE_PILL_DIAMETER) / 2;

const CustomTabBar = ({ state, navigation }) => {

  const slideAnim = useRef(new Animated.Value(0)).current;

  const exitConfirmRef = useRef(null);

  const { isPaidUser } = useSelector((state) => state.auth);

  const { openBuySheet } = useBuySheet();

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPlans());
  }, [dispatch]);

  // Reset confirm sheet state on component mount
  useEffect(() => {
    // Ensure the sheet is closed when component mounts
    exitConfirmRef.current?.close();
  }, []);

  const { currentRouteName } = useSelector((state) => state.auth);

  const handleExitConfirm = () => {
    exitConfirmRef.current?.close();
    BackHandler.exitApp();
  };

  const handleExitConfirmClose = () => {
    exitConfirmRef.current?.close();
  };


  useEffect(() => {
    const backAction = () => {
      if (currentRouteName === 'HomeTab') {
        exitConfirmRef.current?.snapToIndex(0);
        return true;
      }
      return false; // Allow default back behavior for other routes
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentRouteName]);

  useEffect(() => {
    const activeIndex = state.index;
    const toValue = activeIndex * TAB_WIDTH + PILL_HORIZONTAL_MARGIN;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      bounciness: 8,
      speed: 14,
    }).start();
  }, [state.index, slideAnim]);

  // Reset confirm sheet state when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        exitConfirmRef.current?.close();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  const renderIcon = (tab, isFocused) => {
    const color = isFocused ? '#FFFFFF' : '#6E6E73';
    const size = 19;

    if (typeof tab.icon === 'string') {
      return <Feather name={tab.icon} size={size} color={color} />;
    }

    const Icon = tab.icon;
    return <Icon fill={color} width={size} height={size} />;
  };

  return (
    <>
      <View style={[styles.wrapper, { bottom: insets.bottom }]}>

        <View style={styles.tabContainer}>
          <Animated.View
            style={[
              styles.activePill,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          />
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const tab = TABS.find(t => t.id === route.name) || TABS[0];

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabButton}
                onPress={onPress}
                activeOpacity={0.7}
              >
                {renderIcon(tab, isFocused)}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ position: "relative", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {
            isPaidUser ?
              <TouchableRipple
                rippleColor={`rgba(60,60,60,0.12)`}
                borderless={true}
                onPress={() => {
                  trackFirebaseEvent('chat_button_clicked', {
                    isPaidUser: isPaidUser,
                  });
                  ZohoSalesIQ.openChat();
                }}
                style={styles.chatButtonContainer}
                activeOpacity={0.8}
              >
                <View style={{ position: "relative" }}>
                  <Menu width="24" height="24" />
                </View>
              </TouchableRipple> :
              <TouchableOpacity
                rippleColor={`rgba(60,60,60,0.12)`}
                onPress={() => {
                  openBuySheet();
                }}
                style={styles.chatButtonContainer}
                activeOpacity={1}
              >
                <View style={styles.badgeContainer}>
                  <MenuItem width="14" height="14" />
                </View>
                <Menu width="24" height="24" />
              </TouchableOpacity>
          }
        </View>
      </View>
      <TestSheet />
      {/* Exit confirmation sheet */}
      <ConfirmSheet
        ref={exitConfirmRef}
        title="Hold on!"
        message="Are you sure you want to go exit the app?"
        iconName="alert-triangle"
        iconColor="#FF6B6B"
        confirmText="Exit"
        confirmColor="#FF6B6B"
        onConfirm={handleExitConfirm}
        onClose={handleExitConfirmClose}
        showCloseButton={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    width: TAB_CONTAINER_WIDTH,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  tabButton: {
    width: TAB_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activePill: {
    position: 'absolute',
    width: ACTIVE_PILL_DIAMETER,
    height: ACTIVE_PILL_DIAMETER,
    backgroundColor: '#6A3DE8',
    borderRadius: ACTIVE_PILL_DIAMETER / 2,
    top: 5,
    zIndex: 0,
  },
  chatButtonContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  badgeContainer: {
    zIndex: 1000,
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default CustomTabBar;
