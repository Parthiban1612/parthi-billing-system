// TripCarousel.js

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Animated,
  StatusBar,
} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import PageOne from "./Home";
import PageTwo from "./NewTrip";

import { setActiveIndex } from '../../redux/carouselSlice';

const PAGES = [
  { id: '1', component: PageOne, barStyle: 'dark-content' },
  { id: '2', component: PageTwo, barStyle: 'dark-content' },
];
const PAGE_ONE_ACTIVE_COLOR = '#333';
const PAGE_ONE_INACTIVE_COLOR = '#CCCCCC';
const PAGE_TWO_ACTIVE_COLOR = '#FFFFFF';
const PAGE_TWO_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.5)';


const TripCarousel = () => {

  const { width } = useWindowDimensions();

  const navigation = useNavigation();

  // const { questions, questionsLoading } = useSelector((state) => state.travelCountries);

  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  // // Fetch questions if not already loaded
  // useEffect(() => {
  //   if (isAuthenticated && !questionsLoading && (!questions?.data || questions.data.length === 0)) {
  //     dispatch(fetchQuestions());
  //   }
  // }, [isAuthenticated, dispatch]);

  const activeIndex = useSelector((state) => state.carousel.activeIndex);

  const scrollX = useRef(new Animated.Value(0)).current;

  const parentFlatListRef = useRef(null);

  const childScrollViewRef = useRef(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      dispatch(setActiveIndex(viewableItems[0].index));
    }
  }).current;

  // // Add navigation listener to handle focus events
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset to first page when screen comes into focus
      if (parentFlatListRef.current) {
        try {
          parentFlatListRef.current.scrollToIndex({
            index: 0,
            animated: true
          });
          dispatch(setActiveIndex(0));
        } catch (error) {
          console.log('Error scrolling to index on focus:', error);
        }
      }
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const PageIndicator = (
    <View style={styles.indicatorContainer}>
      {PAGES.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
        const activeColor = activeIndex === 1 ? PAGE_TWO_ACTIVE_COLOR : PAGE_ONE_ACTIVE_COLOR;
        const inactiveColor = activeIndex === 1 ? PAGE_TWO_INACTIVE_COLOR : PAGE_ONE_INACTIVE_COLOR;
        const dotColor = scrollX.interpolate({ inputRange, outputRange: [inactiveColor, activeColor, inactiveColor], extrapolate: 'clamp' });
        return <Animated.View key={`indicator-${index}`} style={[styles.indicator, { width: dotWidth, backgroundColor: dotColor }]} />;
      })}
    </View>
  );

  const renderItem = ({ item }) => {
    const PageComponent = item.component;
    return (
      <View style={{ width: width, height: '100%' }}>
        <PageComponent
          scrollRef={childScrollViewRef}
          indicator={PageIndicator}
          parentFlatListRef={parentFlatListRef}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={PAGES[activeIndex].barStyle}
      />
      <FlatList
        ref={parentFlatListRef}
        data={PAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={100}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        waitFor={childScrollViewRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

export default TripCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "red",
    marginTop: 8
  },
});