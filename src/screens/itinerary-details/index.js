import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, Linking, Dimensions, ScrollView } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';

import { Hr, ImageSlider, Button, SkeletonLoader } from '../../components';
import { addFavourite, removeFavourite, updateFavourite, getFavourite } from '../../redux/favouriteSlice';
import { updateFavouriteInItineraries } from '../../redux/travelCountriesSlice';
import { ClockIcon, HiddenGemIcon, LocationIcon, NavigationIcon } from "../../../assets";
import { useBuySheet } from '../../context/BuySheetContext';
import { trackFirebaseEvent } from '../../lib/analyics';

// Dimensions
const { width: screenWidth } = Dimensions.get('window');

// Skeleton component for LocationDetails
const LocationDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6F9' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Image skeleton */}
      <SkeletonLoader
        width={screenWidth}
        height={300}
        borderRadius={0}
        style={{ marginBottom: 0 }}
      />

      {/* Content card skeleton */}
      <View style={{
        position: "absolute",
        bottom: 130,
        padding: 16,
        margin: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        width: screenWidth - 32
      }}>
        {/* Title skeleton */}
        <SkeletonLoader
          width={250}
          height={24}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />

        {/* Category skeleton */}
        <SkeletonLoader
          width={120}
          height={16}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />

        <Hr />

        {/* Description skeleton */}
        <View style={{ paddingVertical: 16 }}>
          <SkeletonLoader
            width="100%"
            height={16}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <SkeletonLoader
            width="90%"
            height={16}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <SkeletonLoader
            width="70%"
            height={16}
            borderRadius={4}
          />
        </View>

        <Hr />

        {/* Timing section skeleton */}
        <View style={{ marginVertical: 16 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <SkeletonLoader
              width={40}
              height={40}
              borderRadius={16}
            />
            <View style={{ flex: 1 }}>
              <SkeletonLoader
                width={60}
                height={11}
                borderRadius={4}
                style={{ marginBottom: 8 }}
              />
              <SkeletonLoader
                width={150}
                height={20}
                borderRadius={4}
              />
            </View>
          </View>
        </View>

        <Hr />

        {/* Address section skeleton */}
        <View style={{ marginVertical: 16 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <SkeletonLoader
              width={40}
              height={40}
              borderRadius={16}
            />
            <View style={{ flex: 1 }}>
              <SkeletonLoader
                width={60}
                height={11}
                borderRadius={4}
                style={{ marginBottom: 8 }}
              />
              <SkeletonLoader
                width="100%"
                height={16}
                borderRadius={4}
                style={{ marginBottom: 8 }}
              />
              <SkeletonLoader
                width="90%"
                height={16}
                borderRadius={4}
                style={{ marginBottom: 12 }}
              />
              <SkeletonLoader
                width={144}
                height={40}
                borderRadius={8}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom button skeleton */}
      <View style={{
        padding: 16,
        bottom: insets.bottom,
        position: "absolute",
        width: "100%"
      }}>
        <SkeletonLoader
          width="100%"
          height={48}
          borderRadius={8}
        />
      </View>
    </View>
  );
};

export default function LocationDetails({ route }) {

  const { locationId } = route?.params;

  const { favourite, getFavouriteLoading } = useSelector((state) => state.favourite);

  const { openBuySheet } = useBuySheet();

  const { isPurchase } = useSelector((state) => state.payment);

  const isFavourite = favourite?.data?.is_favorite;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFavourite(locationId));
  }, []);

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const handleGetDirections = () => {
    if (favourite?.data?.google_map_link) {
      Linking.openURL(favourite?.data?.google_map_link);
    }
  };

  // Show skeleton loading state
  if (getFavouriteLoading) {
    return <LocationDetailsSkeleton />;
  }

  // Show no data found when favourite is null or doesn't have data
  if (!favourite || !favourite.data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6F9' }}>
        <Icon name="emoji-sad" size={64} color="#938EA2" />
        <Text style={{ marginTop: 16, fontFamily: "clash-display-600", fontSize: 20, color: "#4F4A5A", textAlign: 'center' }}>
          No Data Found
        </Text>
        <Text style={{ marginTop: 8, fontFamily: "instrument-sans-400", fontSize: 14, color: "#938EA2", textAlign: 'center', paddingHorizontal: 32 }}>
          The location details you're looking for could not be found.
        </Text>
        <Button
          style={{ marginTop: 24, width: 200 }}
          theme='dark'
          text='Go Back'
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ImageSlider images={favourite?.data?.images} />
        <View style={{ position: "absolute", top: 320, left: 0, right: 0, bottom: 0 }}>
          <View style={{ margin: 16, padding: 16, borderRadius: 16, backgroundColor: "#FFFFFF", elevation: 1 }}>
            <Text style={{
              fontFamily: "clash-display-700",
              fontSize: 24,
              color: "#4F4A5A",
              marginBottom: 8
            }}>{favourite?.data?.name}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{
                backgroundColor: "#EFEDF1",
                padding: 8,
                borderRadius: 8,
                marginBottom: 18,
                alignSelf: "flex-start"
              }}>
                <Text style={{
                  fontFamily: "instrument-sans-500",
                  fontSize: 11,
                  color: "#605A6F",
                }}>
                  {favourite?.data?.category}
                </Text>
              </View>
              {favourite?.data?.is_hidden_gem && (
                <View style={{
                  backgroundColor: "#FDE3E3",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 18,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center"
                }}>
                  <HiddenGemIcon />
                  <Text style={{
                    fontFamily: "instrument-sans-500",
                    fontSize: 11,
                    color: "#605A6F",
                  }}>
                    Hidden Gem
                  </Text>
                </View>
              )}
            </View>
            <Hr style={{ marginBottom: 16 }} />
            <Text style={{
              fontFamily: "instrument-sans-400",
              fontSize: 15,
              lineHeight: 24,
              color: "#757087",
              marginBottom: 16
            }}>{favourite?.data?.description}</Text>
            <Hr />
            <View style={{ marginVertical: 16 }}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{
                  height: 40,
                  width: 40,
                  padding: 10,
                  backgroundColor: "#EFEDF1",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <ClockIcon />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: "instrument-sans-500",
                    fontSize: 11,
                    marginBottom: 8,
                    color: "#938EA2"
                  }}>Timing</Text>
                  <Text style={{
                    fontFamily: "instrument-sans-400",
                    fontSize: 15,
                    lineHeight: 20,
                    color: "#4F4A5A"
                  }}>{favourite?.data?.opening_hours || 'Not available'}</Text>
                </View>
              </View>
            </View>
            <Hr />
            <View style={{ marginVertical: 16 }}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{
                  height: 40,
                  width: 40,
                  padding: 10,
                  backgroundColor: "#EFEDF1",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <LocationIcon />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: "instrument-sans-500",
                    fontSize: 11,
                    marginBottom: 8,
                    color: "#938EA2"
                  }}>Address</Text>
                  <Text style={{
                    fontFamily: "instrument-sans-400",
                    fontSize: 15,
                    lineHeight: 20,
                    color: "#4F4A5A",
                    paddingBottom: 12
                  }}>{favourite?.data?.address}</Text>
                  <Button
                    style={{ width: 144 }}
                    theme='light'
                    text='Get Direction'
                    icon={() => <NavigationIcon />}
                    onPress={handleGetDirections}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{
        padding: 16,
        bottom: insets.bottom,
        position: "absolute",
        width: "100%",
        backgroundColor: "#FFFFFF"
      }}>
        <Button
          loading={loading}
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            try {
              if (isFavourite) {
                // Optimistic update - immediately remove from UI
                // dispatch(optimisticRemoveFavourite(favourite?.data?.id));

                const response = await dispatch(removeFavourite(favourite?.data?.id));

                if (response.payload?.status === true || response.payload?.data?.status === true) {
                  Toast.show({
                    text1: response.payload?.message || 'Removed from favourites',
                    type: "success"
                  });
                  dispatch(updateFavourite({ isFavorite: false, favouriteId: favourite?.data?.favorite_id }));
                  dispatch(updateFavouriteInItineraries({ isFavorite: false, favouriteId: favourite?.data?.id }));

                  trackFirebaseEvent('favourite_button_clicked', {
                    itinerary_id: favourite?.data?.id,
                    itinerary_name: favourite?.data?.name,
                    method: 'remove',
                  });

                  // navigation.navigate("MainTabs");
                } else {
                  // Revert optimistic update on failure
                  // dispatch(optimisticAddFavourite(favourite?.data));
                  Toast.show({
                    text1: response.payload?.message || 'Failed to remove from favourites',
                    type: "error"
                  });
                }
              } else {
                if (!isPurchase) {
                  openBuySheet();
                  return;
                }

                // Optimistic update - immediately add to UI
                // dispatch(optimisticAddFavourite(favourite?.data));

                const response = await dispatch(addFavourite(favourite?.data?.id));

                trackFirebaseEvent('favourite_button_clicked', {
                  itinerary_id: favourite?.data?.id,
                  itinerary_name: favourite?.data?.name,
                  method: 'add',
                });

                if (response.payload?.status === true) {
                  dispatch(updateFavourite({ isFavorite: true, favouriteId: response?.payload?.favorite_id }));
                  dispatch(updateFavouriteInItineraries({ isFavorite: true, favouriteId: favourite?.data?.id }));
                  Toast.show({
                    text1: response.payload?.message || 'Added to favourites',
                    type: "success"
                  });
                  // navigation.navigate("MainTabs");
                } else {
                  // Revert optimistic update on failure
                  // dispatch(optimisticRemoveFavourite(favourite?.data?.id));
                  Toast.show({
                    text1: response.payload?.message || 'Failed to add to favourites',
                    type: "error"
                  });
                }
              }
            } catch (error) {
              // console.error('Error:', error);
              // // Revert optimistic update on error
              // if (isFavourite) {
              //   dispatch(optimisticAddFavourite(favourite?.data));
              // } else {
              //   dispatch(optimisticRemoveFavourite(favourite?.data?.id));
              // }
              // Toast.show({
              //   text1: 'Something went wrong',
              //   type: "error"
              // });
            } finally {
              setLoading(false);
            }
          }}
          theme={isFavourite ? 'danger' : 'dark'} text={isFavourite ? 'Remove' : 'Save to favourites'} icon={() => <Icon
            name={isFavourite ? "trash" : "star-outlined"}
            size={16}
            color={isFavourite ? "#FFFFFF" : "#938EA2"}
          />} />
      </View>
    </>
  )
} 