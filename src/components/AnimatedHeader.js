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
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60 + STATUS_BAR_HEIGHT;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedHeader = ({ 
  title = "Title",
  subtitle = "",
  onBackPress,
  children,
  scrollY,
  scrollHandler
}) => {
  const navigation = useNavigation();

  // Header height animation - becomes fixed at minimum height
  const headerHeight = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      'clamp'
    );
  });

  // Status bar padding animation - adds padding when header is fixed
  const statusBarPadding = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, STATUS_BAR_HEIGHT],
      'clamp'
    );
  });

  // Header background opacity - keep constant
  const headerOpacity = useDerivedValue(() => {
    return 1; // Always full opacity, no color changing
  });

  // Title opacity (fades out as header shrinks)
  const titleOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE / 2],
      [1, 0],
      'clamp'
    );
  });

  // Subtitle transform and opacity
  const subtitleTranslateY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -20],
      'clamp'
    );
  });

  const subtitleOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE / 3],
      [1, 0],
      'clamp'
    );
  });

  // Small title that appears when header is fixed/collapsed
  const smallTitleOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      [0, 1],
      'clamp'
    );
  });

  // Border shadow intensity when fixed
  const shadowOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0.25, 0.4], // Stronger shadow when fixed
      'clamp'
    );
  });

  // Animated styles using Reanimated
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
      opacity: headerOpacity.value,
      paddingTop: statusBarPadding.value,
      shadowOpacity: shadowOpacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [{ translateY: subtitleTranslateY.value }],
    };
  });

  const smallTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: smallTitleOpacity.value,
    };
  });

  // Back button animation for expanded state
  const backButtonExpandedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value, // Same as title - visible when expanded
    };
  });

  // Back button animation for collapsed state
  const backButtonCollapsedStyle = useAnimatedStyle(() => {
    return {
      opacity: smallTitleOpacity.value, // Same as small title - visible when collapsed
    };
  });

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" translucent={true} />
      {/* Animated Header - Fixed Position */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Back Button for Expanded State */}
        <Animated.View style={[styles.backButtonExpanded, backButtonExpandedStyle]}>
          <TouchableRipple
            borderless
            rippleColor={`rgba(197, 184, 184, 0.12)`}
            onPress={handleBackPress}
            style={styles.backButtonExpandedRipple}
          >
            <BackIcon />
          </TouchableRipple>
        </Animated.View>

        {/* Large Title (visible when expanded) */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>

        {/* Subtitle */}
        {subtitle && (
          <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </Animated.View>
        )}

        {/* Collapsed State - Single Row (Arrow + Title) */}
        <Animated.View style={[styles.collapsedRowContainer, backButtonCollapsedStyle]}>
          <TouchableRipple
            borderless
            rippleColor={`rgba(197, 184, 184, 0.12)`}
            onPress={handleBackPress}
            style={styles.collapsedBackButton}
          >
            <BackIcon />
          </TouchableRipple>
          <Text style={styles.collapsedTitle}>{title}</Text>
        </Animated.View>
      </Animated.View>

      {/* Content Area with Fixed Padding */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6366f1',
    zIndex: 1000,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25, // This will be animated
    shadowRadius: 4.65,
    elevation: 8, // Higher elevation for better fixed appearance
  },
  backButtonExpanded: {
    position: 'absolute',
    bottom: 80, // Above the title in expanded state
    left: 20,
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
    bottom: 20, // Move title lower to be below the back button
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'clash-display-700',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subtitleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    opacity: 0.9,
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
    marginRight: 12, // Space between arrow and title
  },
  collapsedTitle: {
    fontSize: 18,
    fontFamily: 'clash-display-600',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingTop: HEADER_MAX_HEIGHT,
  },
});

export default AnimatedHeader;
export { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE };
