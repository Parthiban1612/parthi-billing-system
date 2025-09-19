import React from 'react';
import { View } from 'react-native';

export default function Hr({ color = '#D9D9D9', width = '100%', thickness = 1, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          width: width,
          height: thickness,
        },
        style, // allow external overrides
      ]}
    />
  );
}
