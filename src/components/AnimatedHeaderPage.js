import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';
import BackIcon from '../../assets/left_arrow.svg';
import { useNavigation } from '@react-navigation/native';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;
const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HEIGHT = 60 + STATUS_BAR_HEIGHT;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedHeaderPage = ({ title = '', children, haveScroll = false, scrollY: externalScrollY }) => {
  const scrollY = useSharedValue(0);
  const navigation = useNavigation();

  // Use external scrollY if provided, otherwise use internal scrollY
  const currentScrollY = externalScrollY || scrollY;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (externalScrollY) {
        externalScrollY.value = event.contentOffset.y;
      } else {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  const headerHeight = useDerivedValue(() =>
    interpolate(currentScrollY.value, [0, HEADER_SCROLL_DISTANCE], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], 'clamp')
  );

  const statusBarPadding = useDerivedValue(() =>
    interpolate(currentScrollY.value, [0, HEADER_SCROLL_DISTANCE], [0, STATUS_BAR_HEIGHT], 'clamp')
  );

  const titleOpacity = useDerivedValue(() =>
    interpolate(currentScrollY.value, [0, HEADER_SCROLL_DISTANCE / 2], [1, 0], 'clamp')
  );

  const smallTitleOpacity = useDerivedValue(() =>
    interpolate(currentScrollY.value, [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE], [0, 1], 'clamp')
  );

  const shadowOpacity = useDerivedValue(() =>
    interpolate(currentScrollY.value, [0, HEADER_SCROLL_DISTANCE], [0.25, 0.4], 'clamp')
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
    paddingTop: statusBarPadding.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const backButtonExpandedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const backButtonCollapsedStyle = useAnimatedStyle(() => ({
    opacity: smallTitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7F4DFF" translucent />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Expanded back button */}
        <Animated.View style={[styles.backButtonExpanded, backButtonExpandedStyle]}>
          <TouchableRipple
            borderless
            rippleColor={`rgba(197, 184, 184, 0.12)`}
            onPress={() => navigation.goBack()}
            style={styles.backButtonExpandedRipple}
          >
            <BackIcon />
          </TouchableRipple>
        </Animated.View>

        {/* Large Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>

        {/* Collapsed State */}
        <Animated.View style={[styles.collapsedRowContainer, backButtonCollapsedStyle]}>
          <TouchableRipple
            borderless
            rippleColor={`rgba(197, 184, 184, 0.12)`}
            onPress={() => navigation.goBack()}
            style={styles.collapsedBackButton}
          >
            <BackIcon />
          </TouchableRipple>
          <Text style={styles.collapsedTitle}>{title}</Text>
        </Animated.View>
      </Animated.View>

      {/* Your scrollable content */}
      {!haveScroll ? <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 10 }}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Animated.ScrollView> : children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7F4DFF',
    zIndex: 1000,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButtonExpanded: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    zIndex: 1001,
  },
  backButtonExpandedRipple: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 36,
    left: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'clash-display-700',
    color: '#FFFFFF',
  },
  collapsedRowContainer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
  },
  collapsedBackButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collapsedTitle: {
    fontSize: 22,
    fontFamily: 'clash-display-600',
    color: '#FFFFFF',
  },
});

export default AnimatedHeaderPage;
