import React, { useState } from 'react';
import { View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import BackArrowBtn from './BackArrowBtn';

const { width } = Dimensions.get('window');

const ImageSlider = ({ images = [] }) => {
  const translateX = useSharedValue(0);

  const currentIndex = useSharedValue(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = (index) => {
    setActiveIndex(index);
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const offset = -currentIndex.value * width + e.translationX;
      translateX.value = offset;
    })
    .onEnd((e) => {
      const swipeThreshold = width / 4;
      const maxIndex = Math.max(0, images.length - 1);

      if (e.velocityX < -swipeThreshold && currentIndex.value < maxIndex) {
        currentIndex.value += 1;
      } else if (e.velocityX > swipeThreshold && currentIndex.value > 0) {
        currentIndex.value -= 1;
      }

      const newOffset = -currentIndex.value * width;
      translateX.value = withTiming(newOffset, { duration: 250 }, () => {
        runOnJS(updateActiveIndex)(currentIndex.value);
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // If no images provided, show a placeholder
  if (!images || images.length === 0) {
    return (
      <View style={styles.sliderWrapper}>
        <View style={styles.header}>
          <BackArrowBtn color="#333" />
          <Text className='ff-instrument-sans-500 fs-13 lh-16 text-#3B3842'>No images</Text>
          <View style={{ width: 18 }} />
        </View>
        <View style={[styles.image, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999' }}>No images available</Text>
        </View>
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.sliderWrapper}>
        <View style={styles.header}>
          <BackArrowBtn />
          <Text className='ff-instrument-sans-500 fs-13 lh-16 text-#3B3842'>{activeIndex + 1} of {images.length}</Text>
          <View style={{ width: 18 }} />
        </View>
        <Animated.View style={[styles.imageRow, animatedStyle, { width: width * images.length }]}>
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.image || img }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  sliderWrapper: {
    height: 400,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageRow: {
    flexDirection: 'row',
    width: width * 3, // This will be dynamic based on images length
  },
  image: {
    width: width,
    height: 400,
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ImageSlider;
