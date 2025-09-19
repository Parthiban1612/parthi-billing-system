import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PaymentSuccessExample() {
  const navigation = useNavigation();

  const handlePaymentSuccess = () => {
    // Example payment data - replace with actual payment data from your payment flow
    const paymentData = {
      amount: '$50.00',
      transactionId: '#03201232232',
      paymentMethod: 'Debit card',
      date: 'Wed 03, 2022',
      time: '16:32',
      tax: '$0.00',
      total: '$50.00'
    };

    // Navigate to PaymentSuccess screen with payment data
    navigation.navigate('PaymentSuccess', { paymentData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Success Example</Text>
      <TouchableOpacity style={styles.button} onPress={handlePaymentSuccess}>
        <Text style={styles.buttonText}>Simulate Payment Success</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6116EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
