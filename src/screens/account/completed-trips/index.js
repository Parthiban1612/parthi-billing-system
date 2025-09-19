import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { TestSheet, SkeletonLoader } from '../../../components';
import { getStatusBarHeight } from '../../../utils/platformUtils';

import { useDispatch, useSelector } from 'react-redux';
import { getCompletedTrips } from '../../../redux/paymentSlice';
import AnimatedHeaderPage from '../../../components/AnimatedHeaderPage.js';

// Completed Trip Card Skeleton
const CompletedTripCardSkeleton = ({ isPortrait }) => (
  <View style={[
    styles.card,
  ]}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width="70%" height={24} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="50%" height={16} />
    </View>
  </View>
);

// Completed Trip Card
const CompletedTripCard = ({ item, isPortrait }) => (
  <View style={[
    styles.card,
    {
      marginHorizontal: isPortrait ? 16 : 32,
      paddingHorizontal: isPortrait ? 24 : 36
    }
  ]}>
    <View style={styles.cardHeader}>
      <Text style={styles.tripNameText}>{item.country}</Text>
      <Text style={styles.tripDateText}>{item.expiry_date}</Text>
    </View>
  </View>
);

// Completed Trips Screen
const CompletedTripsScreen = () => {

  const { width, height } = useWindowDimensions();

  const isPortrait = height >= width;

  useEffect(() => {
    dispatch(getCompletedTrips());
  }, []);

  const { getCompletedTripsLoading, completedTripsData } = useSelector((state) => state.payment);

  const dispatch = useDispatch();

  return (
    <>
      <AnimatedHeaderPage title="Completed Trips">
        <View style={{ paddingTop: 10 }}>
          {getCompletedTripsLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 20 }).map((_, index) => (
              <CompletedTripCardSkeleton key={index} isPortrait={isPortrait} />
            ))
          ) : completedTripsData?.data?.length > 0 ? (
            // Show actual trip cards when data is loaded
            completedTripsData?.data?.map((item, index) => (
              <CompletedTripCard key={index} item={item} isPortrait={isPortrait} />
            ))
          ) : (
            // Show no data message when there are no completed trips
            <View style={styles.noDataContainer}>
              <Icon name="map" size={64} color="#C7C7CC" />
              <Text style={styles.noDataTitle}>No Completed Trips</Text>
              <Text style={styles.noDataSubtitle}>
                Your completed trips will appear here once you finish your travels
              </Text>
            </View>
          )}
        </View>
      </AnimatedHeaderPage>
      <TestSheet />
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#8B5CF6',
    paddingBottom: 20,
    paddingTop: getStatusBarHeight() + 22,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: 'clash-display-600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 0,
  },
  tripNameText: {
    fontFamily: 'instrument-sans-600',
    fontSize: 17,
    color: '#3B3842',
    marginBottom: 5,
  },
  tripDateText: {
    fontFamily: 'instrument-sans-400',
    fontSize: 13,
    color: '#757087',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    height: 400,
  },
  noDataTitle: {
    fontSize: 20,
    fontFamily: 'clash-display-600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataSubtitle: {
    fontSize: 16,
    color: '#8A8A8E',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default CompletedTripsScreen; 