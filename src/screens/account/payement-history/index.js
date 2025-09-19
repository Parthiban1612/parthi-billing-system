import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AnimatedHeaderPage from '../../../components/AnimatedHeaderPage';


import { TestSheet, SkeletonLoader, Button } from '../../../components';

import { useDispatch, useSelector } from 'react-redux';
import { getPaymentHistory, downloadInvoice } from '../../../redux/paymentSlice';

// Activity Card Skeleton
const PaymentHistoryCardSkeleton = ({ isPortrait }) => (
  <View style={[
    styles.card,
    {
      marginHorizontal: isPortrait ? 16 : 32,
      paddingHorizontal: isPortrait ? 24 : 36
    }
  ]}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width="90%" height={20} style={{ marginBottom: 16 }} />
    </View>

    <View style={styles.cardRow}>
      <SkeletonLoader width={70} height={16} />
      <SkeletonLoader width={100} height={16} />
    </View>

    <View style={styles.cardRow}>
      <SkeletonLoader width={60} height={16} />
      <SkeletonLoader width={60} height={16} />
    </View>

    <View style={styles.cardRow}>
      <SkeletonLoader width={100} height={16} />
      <View style={styles.statusContainer}>
        <SkeletonLoader width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
        <SkeletonLoader width={60} height={16} />
      </View>
    </View>

    <View style={styles.cardRow}>
      <SkeletonLoader width={40} height={16} />
      <SkeletonLoader width={80} height={16} />
    </View>

    <SkeletonLoader width="100%" height={44} borderRadius={22} style={{ marginTop: 24 }} />
  </View>
);

// Activity Card
const PaymentHistoryCard = ({ dispatch, item, isPortrait, loading }) => (
  <View style={[
    styles.card,
    {
      marginHorizontal: isPortrait ? 16 : 32,
      paddingHorizontal: isPortrait ? 24 : 36
    }
  ]}>
    <View style={styles.cardHeader}>
      <Text style={styles.descriptionText}>
        Bought <Text style={styles.boldText}>'{item.plan}'</Text> for the <Text style={styles.boldText}>'{item.trip_country}'</Text> trip
      </Text>
    </View>

    <View style={styles.cardRow}>
      <Text style={styles.labelText}>Order ID</Text>
      <Text style={styles.valueText}>{item.id}</Text>
    </View>

    <View style={styles.cardRow}>
      <Text style={styles.labelText}>Amount</Text>
      <Text style={styles.amountText}>
        {item?.currency_symbol}{item?.amount?.toString().split('.')[0]}.00
      </Text>
    </View>

    <View style={styles.cardRow}>
      <Text style={styles.labelText}>Payment status</Text>
      <View style={styles.statusContainer}>
        {item.status === 'Success' ? (
          <View style={styles.statusIconCircle}>
            <Icon name="check" size={12} color="#FFFFFF" />
          </View>
        ) : item.status === 'failed' ? (
          <View style={[styles.statusIconCircle, { backgroundColor: '#FF4D4F' }]}>
            <Icon name="x" size={12} color="#FFFFFF" />
          </View>
        ) : (
          <View style={[styles.statusIconCircle, { backgroundColor: '#FF4D4F' }]}>
            <Icon name="x" size={12} color="#FFFFFF" />
          </View>
        )}
        <Text style={styles.statusText}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>

    <View style={styles.cardRow}>
      <Text style={styles.labelText}>Date</Text>
      <Text style={styles.valueText}>{item.created_at}</Text>
    </View>

    {/* use Button component from components */}
    <Button style={{ backgroundColor: '#FFFFFF' }} loading={loading} text="Download invoice" onPress={() => {
      dispatch(downloadInvoice(item.id));
    }} />
  </View>
);

// Activity Screen
const PaymentHistoryScreen = () => {

  const { width, height } = useWindowDimensions();

  const isPortrait = height >= width;

  useEffect(() => {
  }, [isPortrait]);

  const { getPaymentHistoryLoading, paymentHistoryData, downloadInvoiceLoading, downloadInvoiceData, downloadInvoiceError } = useSelector((state) => state.payment);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPaymentHistory());
  }, []);

  // Handle download success/error feedback
  useEffect(() => {
    if (downloadInvoiceData && downloadInvoiceData.success) {
      // console.log('Invoice downloaded successfully:', downloadInvoiceData.filename);
    }
    if (downloadInvoiceError) {
      console.log('Invoice download error:', downloadInvoiceError);
    }
  }, [downloadInvoiceData, downloadInvoiceError]);

  return (
    <>
      <AnimatedHeaderPage title="Payment History">
        <View style={{ paddingTop: 10 }}>
          {getPaymentHistoryLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 3 }).map((_, index) => (
              <PaymentHistoryCardSkeleton key={index} isPortrait={isPortrait} />
            ))
          ) : paymentHistoryData?.data?.length > 0 ? (
            // Show actual activity cards when data is loaded
            paymentHistoryData?.data?.map((item, index) => (
              <PaymentHistoryCard dispatch={dispatch} key={index} item={item} isPortrait={isPortrait} loading={downloadInvoiceLoading} />
            ))
          ) : (
            // Show no data message when there are no activities
            <View style={styles.noDataContainer}>
              <Icon name="credit-card" size={64} color="#C7C7CC" />
              <Text style={styles.noDataTitle}>No Payment History</Text>
              <Text style={styles.noDataSubtitle}>
                Your payment history will appear here once you make purchases
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 24,
  },
  descriptionText: {
    fontFamily: 'instrument-sans-400',
    fontSize: 17,
    color: '#3B3842',
    lineHeight: 24,
  },
  boldText: {
    fontFamily: 'instrument-sans-600',
    fontSize: 17,
    color: '#3B3842',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelText: {
    fontFamily: 'instrument-sans-400',
    fontSize: 15,
    color: '#757087',
    fontWeight: '400',
  },
  valueText: {
    fontFamily: 'instrument-sans-600',
    fontSize: 15,
    color: '#3B3842',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#52C41A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'instrument-sans-600',
    fontSize: 15,
    color: '#3B3842',
  },
  downloadButton: {
    backgroundColor: '#F5F6F9',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
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

export default PaymentHistoryScreen;