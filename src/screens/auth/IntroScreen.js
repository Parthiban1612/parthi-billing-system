import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { getStatusBarHeight } from '../../utils/platformUtils';

const IntroScreen = ({ onNext, onSkip, currentIndex, totalScreens, introData }) => {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(100);
  const scaleAnim = useSharedValue(0.8);
  const buttonAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
    buttonAnim.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 100 }));
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));
  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slideAnim.value }] }));

  const { title, backgroundColor, image } = introData;

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: getStatusBarHeight() + 13 }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Skip button */}
      <Button textColor="#FFFFFF" style={styles.skipButton} onPress={onSkip}>
        Skip
      </Button>

      {/* Progress dots */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalScreens }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentIndex && styles.activeProgressDot,
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <Animated.View style={[styles.content, fadeStyle]}>
        {/* Title */}
        <Animated.View style={[slideStyle, { width: '100%' }]}>
          <Text variant="headlineLarge" style={styles.title}>{title}</Text>
        </Animated.View>
        {/* Circular image with Surface */}
        {image}
        {/* Action button */}
        <TouchableRipple
          // borderless
          style={{ width: '100%', height: 42, backgroundColor: '#F5F6F9', borderRadius: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: '#F5F6F9', borderLeftWidth: 0, borderRightWidth: 0 }}
          rippleColor={`rgba(60,60,60,0.12)`}
          onPress={onNext}
        >
          <Text style={{ color: '#111013', fontFamily: 'instrument-sans-500', fontSize: 14, lineHeight: 24, }}>Next</Text>
        </TouchableRipple>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  skipButton: {
    position: 'absolute',
    right: 30,
    top: getStatusBarHeight() + 10,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'instrument-sans-500',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
  progressContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 10,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  activeProgressDot: {
    opacity: 1,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'left',
    paddingHorizontal: 8,
    marginTop: 40,
    width: '90%',
    lineHeight: 42,
    fontFamily: 'clash-display-700',
  },
  imageContainer: {
    width: 330,
    height: 330,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 165,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 165,
    resizeMode: 'cover',
  },
  imageWrapper: {
    width: 330,
    height: 330,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 165,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default IntroScreen; 