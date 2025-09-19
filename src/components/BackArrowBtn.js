import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

export default function BackArrowBtn({ color = "#FFFFFF", style }) {

  const navigation = useNavigation();

  return (
    <View style={{
      width: 35,
      height: 35,
      borderRadius: 17.5,
      overflow: 'hidden',
      ...style
    }}>
      <TouchableRipple
        rippleColor="#E0E0E0"
        onPress={() => {
          try {
            navigation.goBack();
          } catch (error) {
            console.log('Error going back, trying to navigate to MainTabs');
            // Fallback: navigate to the main tabs if goBack fails
            navigation.navigate('MainTabs');
          }
        }}
        style={{
          width: 35,
          height: 35,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Icon name="chevron-left" size={24} color={color} />
      </TouchableRipple>
    </View>
  );
}
