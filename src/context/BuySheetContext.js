import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import BuySheet from '../components/BuySheet';
import { RZP_TEST_KEY, ENDPOINTS } from '../redux/endpoints';
import { trackFirebaseEvent } from '../lib/analyics';

const BuySheetContext = createContext();

export const useBuySheet = () => {
  const context = useContext(BuySheetContext);
  if (!context) {
    throw new Error('useBuySheet must be used within a BuySheetProvider');
  }
  return context;
};

export const BuySheetProvider = ({ children }) => {
  const navigation = useNavigation();

  const buySheetRef = useRef(null);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  const { token, user } = useSelector((state) => state.auth);

  const { planData } = useSelector((state) => state.payment);

  const openBuySheet = useCallback(() => {
    buySheetRef.current?.expand();
    setIsSheetExpanded(true);
  }, []);

  const closeBuySheet = useCallback(() => {
    buySheetRef.current?.close();
    setIsSheetExpanded(false);
  }, []);

  const handleTestPayment = useCallback(async () => {
    // Track begin_checkout event when user initiates payment process
    trackFirebaseEvent('begin_checkout', {
      currency: planData?.currency || 'INR',
      value: planData?.price || 0,
      items: [{
        item_id: planData?.id?.toString(),
        item_name: planData?.name,
        item_category: 'subscription',
        price: planData?.price || 0,
        quantity: 1
      }]
    });

    setIsPaymentLoading(true);
    try {
      // Step 1: Initiate payment with backend
      let paymentData;

      try {
        const initiateResponse = await axios.post(ENDPOINTS.RZP_INITIATE_PAYMENT, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // Track add_payment_info event when payment initiation is successful
        trackFirebaseEvent('add_payment_info', {
          currency: planData?.currency || 'INR',
          value: planData?.price || 0,
          payment_type: 'razorpay',
          items: [{
            item_id: planData?.id?.toString(),
            item_name: planData?.name,
            item_category: 'subscription',
            price: planData?.price || 0,
            quantity: 1
          }]
        });

        if (initiateResponse.status !== 200) {
          throw new Error('Failed to initiate payment');
        }

        paymentData = initiateResponse.data;

      }
      catch (initiateError) {
        closeBuySheet();
        setIsPaymentLoading(false);
        return;
      }

      // Simple test payment with minimal options
      const paymentOptions = {
        description: paymentData?.plan_description,
        currency: 'INR',
        key: paymentData?.key_id,
        order_id: paymentData.order_id,
        amount: planData?.price,
        name: 'Trundle',
        prefill: {
          email: user?.data?.email,
          contact: `+${user?.data?.phone_code}${user?.data?.mobile_no}`,
          name: user?.data?.first_name + ' ' + user?.data?.last_name
        },
        theme: { color: '#7F4DFF' },
      };

      const paymentResult = await RazorpayCheckout.open(paymentOptions);

      // Track purchase event when payment is successful
      trackFirebaseEvent('purchase', {
        transaction_id: paymentResult.razorpay_order_id,
        currency: planData?.currency || 'INR',
        value: planData?.price || 0,
        payment_type: 'razorpay',
        items: [{
          item_id: planData?.id?.toString(),
          item_name: planData?.name,
          item_category: 'subscription',
          price: planData?.price || 0,
          quantity: 1
        }]
      });

      const data = {
        payment_id: paymentData.payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      }

      closeBuySheet();

      navigation.navigate('PaymentSuccess', { data });

    } catch (error) {
      // Handle Razorpay specific errors
      if (error.code === 'payment_cancelled') {
        Toast.show({
          text1: 'Payment was cancelled',
          type: "info"
        });
      } else {
        Toast.show({
          text1: 'Payment failed. Please try again.',
          type: "error"
        });
      }
    } finally {
      setIsPaymentLoading(false);
    }
  }, [token, user, planData, navigation, closeBuySheet]);

  const onClose = useCallback(() => {
    setIsSheetExpanded(false);
  }, []);

  const contextValue = {
    openBuySheet,
    closeBuySheet,
    isSheetExpanded,
    isPaymentLoading,
  };

  return (
    <BuySheetContext.Provider value={contextValue}>
      {children}
      <BuySheet
        ref={buySheetRef}
        loading={isPaymentLoading}
        handleTestPayment={handleTestPayment}
        setIsSheetExpanded={setIsSheetExpanded}
        onClose={onClose}
      />
    </BuySheetContext.Provider>
  );
}; 