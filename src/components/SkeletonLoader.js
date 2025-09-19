import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const SkeletonLoader = ({
  width,
  height,
  borderRadius = 8,
  style,
  backgroundColor = '#F5F5F5',
  shimmerColor = '#E0E0E0'
}) => {
  // Convert percentage width to numeric value
  const getNumericWidth = (width) => {
    if (typeof width === 'string' && width.includes('%')) {
      const percentage = parseFloat(width.replace('%', '')) / 100;
      return screenWidth * percentage;
    }
    return typeof width === 'number' ? width : 0;
  };

  const numericWidth = getNumericWidth(width);
  const translateX = useSharedValue(-numericWidth);

  useEffect(() => {
    if (numericWidth > 0) {
      translateX.value = withRepeat(
        withTiming(screenWidth + numericWidth, { duration: 2000 }),
        -1,
        false
      );
    }
  }, [translateX, numericWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    if (numericWidth <= 0) {
      return { opacity: 0 };
    }

    const opacity = interpolate(
      translateX.value,
      [-numericWidth, 0, numericWidth, screenWidth + numericWidth],
      [0, 0.5, 0.5, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX: translateX.value }],
      opacity,
    };
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: shimmerColor,
            borderRadius,
            width: numericWidth * 0.3,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

// Specific skeleton components for different use cases
export const CategorySkeleton = () => (
  <SkeletonLoader
    width={100}
    height={36}
    borderRadius={12}
    style={{ marginRight: 8 }}
  />
);

export const ImageSkeleton = ({ width, height }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={12}
    style={{ marginRight: 8 }}
  />
);

export const TextSkeleton = ({ width, height, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={4}
    style={style}
  />
);

export const FilterButtonSkeleton = () => (
  <View style={styles.filterButtonContainer}>
    <SkeletonLoader width={20} height={20} borderRadius={4} />
    <SkeletonLoader width={40} height={16} borderRadius={4} />
  </View>
);

export const CardSkeleton = ({ screenWidth }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageContainer}>
      <ImageSkeleton width={'100%'} height={200} />
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.textContainer}>
        <TextSkeleton width={200} height={22} style={{ marginBottom: 8 }} />
        <TextSkeleton width={80} height={32} borderRadius={8} />
      </View>
      <SkeletonLoader
        width={34}
        height={34}
        borderRadius={17}
        style={{ borderWidth: 1, borderColor: '#E5E5E5' }}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: '#EAE8EF',
    borderRadius: 16,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 10,
  },
});

export { SkeletonLoader };
export default SkeletonLoader; 