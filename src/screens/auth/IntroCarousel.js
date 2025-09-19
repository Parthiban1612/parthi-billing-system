import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setIntroSeen } from '../../redux/authSlice';
import { useSharedValue } from 'react-native-reanimated';
import IntroScreen from './IntroScreen';
import { SplashOneIcon, SplashTwoIcon, SplashThreeIcon } from "../../../assets";

const IMAGE_SIZE = Dimensions.get('window').width;

const { width } = Dimensions.get('window');

const IntroCarousel = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < introData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    } else {
      dispatch(setIntroSeen(true));
      // Let Redux state control navigation - don't navigate manually
    }
  };

  const handleSkip = () => {
    dispatch(setIntroSeen(true));
    // Let Redux state control navigation - don't navigate manually
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const introData = [
    {
      id: 1,
      title: 'Discover curated experiences for your trip',
      backgroundColor: '#5212C5',
      image: <SplashOneIcon height={IMAGE_SIZE} width={IMAGE_SIZE} />,
    },
    {
      id: 2,
      title: 'Get itinerary prepared by local travel experts just for you',
      backgroundColor: '#2E6C62',
      image: <SplashTwoIcon height={IMAGE_SIZE} width={IMAGE_SIZE} />,
    },

    {
      id: 3,
      title: 'Easy access to your favourite places on-the-go',
      backgroundColor: '#F57474',
      image: <SplashThreeIcon height={IMAGE_SIZE} width={IMAGE_SIZE} />,
    },
  ];

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <IntroScreen
        onNext={handleNext}
        onSkip={handleSkip}
        currentIndex={index}
        totalScreens={introData.length}
        introData={item}
      />
    </View>
  );

  const keyExtractor = (item) => item.id;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={introData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
});

export default IntroCarousel; 