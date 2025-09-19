import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Line, Rect } from 'react-native-svg';
import { ErrorIcon } from "../../assets";

export default function AlertBanner({ message }) {
  return (
    <View style={styles.wrapper}>
      {/* SVG Background - with proper bounds and clipping */}
      <View style={styles.svgBackground}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Rect width="100%" height="100%" fill="#f9f6ff" />
          <G rotation={9} origin="0,0">
            {Array.from({ length: 100 }).map((_, i) => (
              <Line
                key={i}
                x1={i * 9.94}
                y1={-100} // Make sure it starts above the visible area
                x2={i * 9.94}
                y2={500} // Extend to fully cover background
                stroke="#ede4ff"
                strokeWidth={1}
              />
            ))}
          </G>
        </Svg>
      </View>

      {/* Foreground content */}
      <View style={styles.container}>
        <ErrorIcon width={20.4} height={20.4} />
        <Text style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden', // 👈 clip children like SVG inside
    backgroundColor: '#F4EDFF', // Fallback background if SVG doesn't load
    borderWidth: 1,
    borderColor: '#E0CFFB', // soft border to match design
    marginBottom: 16,
  },
  svgBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  container: {
    flexDirection: 'row',
    padding: 11,
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  text: {
    lineHeight: 19,
    fontFamily: "instrument-sans-400",
    marginLeft: 10,
    flex: 1,
    color: '#2D0C57',
    fontSize: 15,
  },
});
