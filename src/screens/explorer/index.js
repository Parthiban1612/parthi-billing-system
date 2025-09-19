import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

import { useQuestionModals } from '../../components/QuestionModals';
import { CardSkeleton, FilterButtonSkeleton } from '../../components/SkeletonLoader';
import Switch from '../../components/Switch';
import { useBuySheet } from '../../context/BuySheetContext';

import { getStatusBarHeight } from '../../utils/platformUtils';

import { getAllItineraries, setSelectedCity, clearSelectedCity, updateFavouriteInItineraries } from '../../redux/travelCountriesSlice';
import { addFavourite, removeFavourite, fetchFavourites } from '../../redux/favouriteSlice';
import { fetchCategories, setSelectedCategory, clearSelectedFilters, setSelectedSubcategory } from '../../redux/categoriesSlice';

import LocationImage from "../../../assets/city.jpg";
import { FilterIcon, FireLightIcon, ForYouBarTopIcon, ForYouBarBottomIcon, AddedFavIcon } from "../../../assets";
import { trackFirebaseEvent } from '../../lib/analyics';

export default function Explorer() {
  // ===== HOOKS =====
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { openFilterModal } = useQuestionModals();

  // ===== DIMENSIONS =====
  const screenWidth = Dimensions.get('window').width;

  // ===== HOOKS =====
  const { openBuySheet } = useBuySheet();

  // ===== REDUX STATE =====
  const { token } = useSelector((state) => state.auth);

  const { submittedCountry, selectedCity, itineraries, itinerariesLoading } = useSelector((state) => state.travelCountries);

  const [loading, setLoading] = useState(false);

  // Animation values for favorite button
  const [favoriteAnimations, setFavoriteAnimations] = useState({});

  // Function to create animation for a specific favorite button
  const createFavoriteAnimation = (id) => {
    if (!favoriteAnimations[id]) {
      favoriteAnimations[id] = {
        scale: useSharedValue(1),
        rotation: useSharedValue(0),
      };
    }
    return favoriteAnimations[id];
  };

  // Function to trigger favorite button animation
  const triggerFavoriteAnimation = (id) => {
    const animation = favoriteAnimations[id];
    if (animation) {
      // Scale up quickly, then back to normal with spring
      animation.scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );

      // Rotate slightly for added effect
      animation.rotation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withSpring(0, { damping: 10, stiffness: 100 })
      );
    }
  };

  // Function to trigger damping effect when loading finishes
  const triggerDampingEffect = (id) => {
    const animation = favoriteAnimations[id];
    if (animation) {
      // Add a subtle damping bounce effect
      animation.scale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );

      // Add a gentle rotation damping
      animation.rotation.value = withSequence(
        withTiming(3, { duration: 150 }),
        withSpring(0, { damping: 15, stiffness: 200 })
      );
    }
  };

  // Create animated favorite button component
  const AnimatedFavoriteButton = React.memo(({ data, isFavourite, onPress, loading }) => {




    const animation = createFavoriteAnimation(data?.id);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: animation.scale.value },
        { rotate: `${animation.rotation.value}deg` }
      ]
    }));

    return (
      <TouchableRipple
        rippleColor="#E0E0E0"
        borderless={true}
        onPress={onPress}
        style={{
          borderRadius: 17,
        }}
      >
        <View style={{
          borderRadius: 17,
          borderWidth: 1,
          borderColor: "#E5E5E5",
          width: 34,
          height: 34,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Animated.View style={animatedStyle}>
            {isFavourite ? (
              <AddedFavIcon width={34} height={34} />
            ) : (
              <View style={{
                width: 34,
                height: 34,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Icon
                  name="star"
                  size={16}
                  color="#938EA2"
                />
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableRipple>
    );
  });

  useEffect(() => {
    dispatch(getAllItineraries({ token, categoryId: null, subcategoryId: null }));
    dispatch(fetchCategories(token));
  }, [token]);

  const openFilterExample = () => {
    openFilterModal({
      onConfirm: (categoryId) => {
        dispatch(setSelectedCategory(categoryId || null));
      },
      onClear: () => {
        // Clear the selected category and reset to first category
        // setActiveCategory(0);
        dispatch(clearSelectedFilters());
        // Also clear the selected city
        dispatch(clearSelectedCity());
        // Fetch all itineraries without any filters
        dispatch(getAllItineraries({
          token,
          categoryId: null,
          subcategoryId: null,
          cityId: null
        }));
      }
    });
  };

  const [filterForYou, setFilterForYou] = useState(false);

  const filteredItineraries = itineraries?.data?.itineraries?.filter((data) => {
    if (filterForYou) {
      return data.for_you;
    }
    return true;
  });

  const isPurchase = itineraries?.data?.is_purchase;

  const { isPaidUser } = useSelector((state) => state.auth);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: submittedCountry?.background_color, paddingTop: getStatusBarHeight() + 11 }}>
          <Text style={{ textAlign: "center", fontSize: 17, fontFamily: "instrument-sans-600", lineHeight: 20, color: "#111013", paddingBottom: 10, paddingHorizontal: 16 }}>
            {submittedCountry?.name}
          </Text>
          {/* Cities Header Scroller */}
          {itineraries?.data?.cities && itineraries.data.cities.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 10 }}
              style={{ flexGrow: 0 }}
            >
              {itineraries.data.cities.map((city, index) => {
                const isActive = selectedCity === city.id || selectedCity === city;
                return (
                  <TouchableRipple
                    key={index}
                    rippleColor="#E0E0E0"
                    borderless={true}
                    onPress={() => {
                      dispatch(setSelectedCategory(null));
                      dispatch(setSelectedSubcategory(null));
                      dispatch(clearSelectedFilters());
                      setFilterForYou(false);
                      if (isActive) {
                        // If already selected, deselect it
                        dispatch(clearSelectedCity());
                        // Fetch all itineraries without city filter
                        dispatch(getAllItineraries({
                          token,
                          categoryId: null,
                          subcategoryId: null,
                          cityId: null
                        }));
                      } else {
                        // Select the new city
                        dispatch(setSelectedCity(city.id || city));
                        // Fetch itineraries for the selected city

                        dispatch(getAllItineraries({
                          token,
                          categoryId: null,
                          subcategoryId: null,
                          cityId: city.id || city
                        }));
                      }
                      trackFirebaseEvent('city_selected', {
                        city_id: city.id || city,
                        city_name: city.name || city,
                      });

                    }}
                    style={{
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isActive ? "#D8D2FF" : "#433F4D40",
                      opacity: isActive ? 1 : 0.6,
                      backgroundColor: isActive ? "#fff" : submittedCountry?.data?.background_color,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      marginRight: 8,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: "instrument-sans-500",
                      color: isActive ? "#111013" : "#938EA2",
                    }}>
                      {city.name || city}
                    </Text>
                  </TouchableRipple>
                );
              })}
            </ScrollView>
          )}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, marginHorizontal: 16, gap: 16 }}>
          {itinerariesLoading ? (
            <FilterButtonSkeleton />
          ) : (
            <View style={{ flexDirection: "row", justifyContent: `${isPaidUser ? "space-between" : "center"}`, alignItems: "center" }}>
              <TouchableRipple
                rippleColor="#E0E0E0"
                style={styles.exampleButton}
                labelStyle={{ fontSize: 13, fontFamily: "instrument-sans-500", color: "#938EA2", borderRadius: 10 }}
                onPress={openFilterExample}
                borderless={true}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <FilterIcon />
                  <Text style={styles.exampleButtonText}>Filter</Text>
                </View>
              </TouchableRipple>
              {isPaidUser && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 14, fontFamily: "instrument-sans-500", color: "#3B3842" }}>For you</Text>
                  <Switch value={filterForYou} onValueChange={() => setFilterForYou(!filterForYou)} />
                </View>
              )}
            </View>
          )}
          {itinerariesLoading ? (
            // Show skeleton loading for itineraries
            Array(3).fill().map((_, index) => (
              <CardSkeleton key={index} screenWidth={screenWidth} />
            ))
          ) : filteredItineraries?.length > 0 ? (
            filteredItineraries.map((data, index) => {
              const isFavourite = data.is_favorite;

              if (data?.images?.length === 0) {
                return null;
              }

              const content = (
                <View key={index} style={{ borderColor: "#EAE8EF", borderRadius: 16, padding: 10, backgroundColor: "#fff" }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 3 }}
                  >
                    {data?.images?.map((imageData, imageIndex) => {
                      if (!imageData?.image) {
                        return null;
                      }

                      // Determine width based on number of images
                      const imageWidth = data?.images?.length > 1 ? 297 : screenWidth - 40;

                      const imageHeight = data?.images?.length > 1 ? 300 : 200;

                      return (
                        <View style={{ width: imageWidth, height: imageHeight, marginRight: 8 }} key={imageIndex} >
                          <Image
                            style={{ width: imageWidth, height: imageHeight, borderRadius: 12 }}
                            source={{ uri: imageData?.image }}
                            resizeMode="cover"
                            onError={(error) => console.log('Image error:', error)}
                            defaultSource={LocationImage}
                          />
                        </View>
                      )
                    })}
                  </ScrollView>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("LocationDetails", { locationId: data?.id })}>
                      <Text style={{ fontSize: 17, fontFamily: "instrument-sans-600", lineHeight: 22, color: "#111013", marginBottom: 4, marginTop: 14 }}>
                        {data?.name}
                      </Text>
                      <View style={{
                        backgroundColor: "#F5F5F5",
                        padding: 8,
                        borderRadius: 8,
                        alignSelf: "flex-start"
                      }}>
                        <Text style={{ fontSize: 12, fontFamily: "instrument-sans-500", lineHeight: 16, color: "#938EA2" }}>
                          {data?.category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <AnimatedFavoriteButton
                      data={data}
                      isFavourite={isFavourite}
                      loading={loading}
                      onPress={async () => {

                        trackFirebaseEvent('favourite_button_clicked', {
                          itinerary_id: data?.id,
                          itinerary_name: data?.name,
                          method: isFavourite ? 'remove' : 'add',
                        });

                        if (loading) {
                          return;
                        }

                        if (!isPurchase) {
                          openBuySheet();
                          return;
                        }

                        // Trigger animation immediately
                        triggerFavoriteAnimation(data?.id);

                        setLoading(true);
                        let response;
                        if (isFavourite) {
                          response = await dispatch(removeFavourite(data?.id));
                          dispatch(updateFavouriteInItineraries({ isFavorite: false, favouriteId: data?.id }));
                        } else {
                          response = await dispatch(addFavourite(data?.id));
                          dispatch(updateFavouriteInItineraries({ isFavorite: true, favouriteId: data?.id }));
                        }
                        if (response.payload?.status === true || response.payload?.data?.status === true) {
                          Toast.show({
                            text1: response.payload?.message || 'Added to favourites',
                            type: "success"
                          });
                          dispatch(fetchFavourites());
                        } else {
                          Toast.show({
                            text1: response.payload?.message || 'Failed to add to favourites',
                            type: "error"
                          });
                        }
                        setLoading(false);

                        // Trigger damping effect when loading finishes
                        triggerDampingEffect(data?.id);
                      }}
                    />
                  </View>
                </View>
              )

              const isForYou = data.for_you;

              if (isForYou) {
                return (
                  <LinearGradient
                    colors={['#FFFFFF', '#7F4DFF']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.outerContainer]}
                    key={index}
                  >
                    <ForYouBarBottomIcon position="absolute" top={10} left={25} />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "center", paddingBottom: 10 }}>
                      <FireLightIcon />
                      <Text style={styles.bannerText}>For you</Text>
                    </View>
                    <ForYouBarTopIcon position="absolute" style={{ rotate: "90deg", top: 0, right: 25 }} />
                    {content}
                  </LinearGradient>
                )
              }
              return content;
            })
          ) : (
            // Show empty state when no itineraries are available
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No itineraries available</Text>
            </View>
          )}
        </ScrollView >
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 9,
    shadowColor: '#B9B7B7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exampleButtonsContainer: {
    paddingHorizontal: 16,
  },
  exampleTitle: {
    fontSize: 14,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
    marginBottom: 8,
  },
  exampleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  exampleButtonText: {
    fontSize: 12,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
  },
  customText: {
    fontSize: 18,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
    textAlign: 'center',
    marginBottom: 12,
  },
  customSubText: {
    fontSize: 14,
    fontFamily: 'instrument-sans-400',
    color: '#938EA2',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
    textAlign: 'center',
  },
  bannerText: {
    fontSize: 11,
    fontFamily: 'instrument-sans-500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
  },
  switch: {
    transform: [{ scale: 0.8 }], // Adjust scale for Switch component
  },
});
