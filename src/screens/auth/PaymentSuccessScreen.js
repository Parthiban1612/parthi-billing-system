import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { TickLightIcon, ThreeLinesIcon } from "../../../assets";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../redux/paymentSlice';
import { updateIsPaidUser } from '../../redux/authSlice';

const SIDES = 8; // Octagon for payment success
const SIZE = 120; // width/height of the SVG

function generateOctagonPoints(radius, sides) {
  const angle = (2 * Math.PI) / sides;
  const center = SIZE / 2;
  let points = [];
  for (let i = 0; i < sides; i++) {
    const x = center + radius * Math.cos(i * angle - Math.PI / 2);
    const y = center + radius * Math.sin(i * angle - Math.PI / 2);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

export default function PaymentSuccessScreen({ route }) {

  const { data } = route.params;

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const { orderData, orderLoading, orderError } = useSelector((state) => state.payment);

  useEffect(() => {
    if (data) {
      dispatch(createOrder(data));
      dispatch(updateIsPaidUser(true));
    }
  }, [data, dispatch]);

  useEffect(() => {
    // Handle order error
    if (orderError) {
      Alert.alert(
        'Order Creation Failed',
        orderError,
        [
          {
            text: 'Retry',
            onPress: () => dispatch(createOrder(data))
          },
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
            style: 'cancel'
          }
        ]
      );
    }
  }, [orderError, data, dispatch, navigation]);

  // Animation values
  const octagonScale = useRef(new Animated.Value(0.3)).current;
  const octagonOpacity = useRef(new Animated.Value(0)).current;
  const threeLinesScale = useRef(new Animated.Value(0.2)).current;
  const threeLinesOpacity = useRef(new Animated.Value(0)).current;
  const threeLinesRotate = useRef(new Animated.Value(0)).current;
  const tickScale = useRef(new Animated.Value(0.1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

  const radius = SIZE / 2 - 5;
  const points = generateOctagonPoints(radius, SIDES);

  useEffect(() => {
    // Only start animations when order is successfully created
    if (orderData && !orderLoading) {
      // Start animations sequence
      const startAnimations = () => {
        // 1. Octagon appears with scale and fade-in
        Animated.parallel([
          Animated.spring(octagonScale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(octagonOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        // 2. Three lines appear after octagon
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(threeLinesScale, {
              toValue: 1,
              tension: 120,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(threeLinesOpacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.spring(threeLinesRotate, {
              toValue: 1,
              tension: 150,
              friction: 10,
              useNativeDriver: true,
            }),
          ]).start();
        }, 300);

        // 3. Tick appears after three lines
        setTimeout(() => {
          Animated.spring(tickScale, {
            toValue: 1,
            tension: 180,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }, 600);

        // 4. Text appears
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(textScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.spring(textTranslateY, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        }, 900);

        // 5. Card appears last
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(cardOpacity, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.spring(cardTranslateY, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        }, 1200);
      };

      // Start animations immediately
      startAnimations();

      const timer = setTimeout(() => {
        navigation.navigate('MainTabs');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderData, orderLoading, navigation]);

  const TransactionDetailRow = ({ label, value, isLast = false }) => (
    <View style={[styles.detailRow, isLast && styles.lastDetailRow]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  // Show loading state while order is being created
  if (orderLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={[styles.successText, { marginTop: 20 }]}>Processing...</Text>
        <Text style={styles.subText}>Please wait while</Text>
        <Text style={[styles.subText, { marginBottom: 20 }]}>we process your payment</Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Only show success screen if order is created successfully
  if (!orderData) {
    return null;
  }

  return (
    <>
      <StatusBar backgroundColor="#6F27FF" translucent barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Octagon + Tick */}
        <Animated.View
          style={[
            styles.shapeWrapper,
            {
              transform: [{ scale: octagonScale }],
              opacity: octagonOpacity
            }
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Polygon
              points={points}
              fill="#f57373"
              transform={`rotate(0, ${SIZE / 2}, ${SIZE / 2})`}
            />
          </Svg>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 70,
                bottom: 95,
                transform: [
                  { scale: threeLinesScale },
                  { rotate: "-15deg" },
                  {
                    rotate: threeLinesRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-15deg', '0deg']
                    })
                  }
                ],
                opacity: threeLinesOpacity
              }
            ]}
          >
            <ThreeLinesIcon />
          </Animated.View>
          {/* Checkmark */}
          <Animated.View
            style={[
              styles.checkWrapper,
              {
                transform: [{ scale: tickScale }]
              }
            ]}
          >
            <TickLightIcon />
          </Animated.View>
        </Animated.View>

        {/* Text */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [
              { scale: textScale },
              { translateY: textTranslateY }
            ]
          }}
        >
          <Text style={styles.successText}>Payment</Text>
          <Text style={[styles.successText, { marginBottom: 8 }]}>successfully</Text>
          <Text style={styles.subText}>Your payment has been</Text>
          <Text style={[styles.subText, { marginBottom: 40 }]}>successfully done</Text>
        </Animated.View>

        {/* Transaction Details Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }]
            }
          ]}
        >
          <TransactionDetailRow
            label="Amount"
            value={`${orderData?.currency_symbol}${orderData?.amount}`}
          />
          <TransactionDetailRow
            label="Transaction ID"
            value={orderData?.transaction_id}
          />
          <TransactionDetailRow
            label="Payment method"
            value={orderData?.payment_method?.charAt(0).toUpperCase() + orderData?.payment_method?.slice(1)}
          />
          <TransactionDetailRow
            label="Date"
            value={orderData?.date}
          />
          <TransactionDetailRow
            label="Time"
            value={orderData?.time}
          />
          <TransactionDetailRow
            label="Tax"
            value={`${orderData?.currency_symbol}${orderData?.tax}`}
          />
          <TransactionDetailRow
            label="Total"
            value={`${orderData?.currency_symbol}${orderData?.total_amount}`}
            isLast
          />
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F27FF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeWrapper: {
    width: SIZE,
    height: SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkWrapper: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontFamily: 'instrument-sans-700',
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  subText: {
    color: 'white',
    fontFamily: 'instrument-sans-400',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontFamily: 'instrument-sans-500',
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontFamily: 'instrument-sans-600',
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
});
