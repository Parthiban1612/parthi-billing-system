import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import SkeletonLoader from '../../components/SkeletonLoader';
import BackIcon from '../../../assets/left_arrow.svg';
import AnimatedHeaderPage from '../../components/AnimatedHeaderPage';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;
const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HEIGHT = 60 + STATUS_BAR_HEIGHT;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Skeleton component for favorites that matches the actual FavCard
const FavoriteSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTextContainer}>
        <SkeletonLoader
          width={200}
          height={17}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        {new Array(4).fill(0).map((_, index) => (
          <SkeletonLoader
            key={index}
            width={`100%`}
            height={15}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
        ))}
      </View>
    </View>
  </View>
);

// Animated Header Component
const AnimatedHeader = ({ title, scrollY }) => {
  const navigation = useNavigation();

  const headerHeight = useDerivedValue(() =>
    interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], 'clamp')
  );

  const statusBarPadding = useDerivedValue(() =>
    interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [0, STATUS_BAR_HEIGHT], 'clamp')
  );

  const titleOpacity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE / 2], [1, 0], 'clamp')
  );

  const smallTitleOpacity = useDerivedValue(() =>
    interpolate(scrollY.value, [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE], [0, 1], 'clamp')
  );

  const shadowOpacity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [0.25, 0.4], 'clamp')
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
    paddingTop: statusBarPadding.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const backButtonExpandedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const backButtonCollapsedStyle = useAnimatedStyle(() => ({
    opacity: smallTitleOpacity.value,
  }));

  return (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      {/* Expanded back button */}
      <Animated.View style={[styles.backButtonExpanded, backButtonExpandedStyle]}>
        <TouchableRipple
          borderless
          rippleColor={`rgba(197, 184, 184, 0.12)`}
          onPress={() => navigation.goBack()}
          style={styles.backButtonExpandedRipple}
        >
          <BackIcon />
        </TouchableRipple>
      </Animated.View>

      {/* Large Title */}
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>

      {/* Collapsed State */}
      <Animated.View style={[styles.collapsedRowContainer, backButtonCollapsedStyle]}>
        <TouchableRipple
          borderless
          rippleColor={`rgba(197, 184, 184, 0.12)`}
          onPress={() => navigation.goBack()}
          style={styles.collapsedBackButton}
        >
          <BackIcon />
        </TouchableRipple>
        <Text style={styles.collapsedTitle}>{title}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default function CMSContent({ title, html, loading }) {
  const scrollY = useSharedValue(0);
  const [webViewHeight, setWebViewHeight] = useState(800);
  const webViewRef = useRef(null);

  // Native scroll handler - much more reliable than WebView scroll tracking
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Handle WebView message to get content height
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'contentHeight') {
        setWebViewHeight(Math.max(data.height, 800)); // Minimum 800px height
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  // Create HTML content with proper styling and height detection
  const styledHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      ${html}
    </body>
    <style>
      body {
        margin: 0;
        padding-left: 6px;
        padding-right: 6px;
        // padding-top: 10px;
      }
    </style>
    <script>
      // Send content height to React Native
      function sendHeight() {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'contentHeight',
          height: height-50
        }));
      }
      
      // Send height when content loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendHeight);
      } else {
        sendHeight();
      }
      
      // Send height when content changes
      window.addEventListener('resize', sendHeight);
      
      // Send height after a short delay to ensure all content is loaded
      setTimeout(sendHeight, 100);
    </script>
  </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7F4DFF" translucent />

      <AnimatedHeaderPage title={title} >

        <View style={styles.contentContainer}>
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                {new Array(5).fill(0).map((_, index) => (
                  <FavoriteSkeleton key={index} />
                ))}
              </View>
            ) : (
              <WebView
                ref={webViewRef}
                source={{ html: styledHtml }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                javaScriptEnabled={true}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                bounces={false}
                overScrollMode="never"
                style={[{ height: webViewHeight }]}
                onMessage={handleWebViewMessage}
              />
            )}
          </Animated.ScrollView>
        </View>
      </AnimatedHeaderPage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7F4DFF',
    zIndex: 1000,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButtonExpanded: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    zIndex: 1001,
  },
  backButtonExpandedRipple: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 36,
    left: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'clash-display-700',
    color: '#FFFFFF',
  },
  collapsedRowContainer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
  },
  collapsedBackButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collapsedTitle: {
    fontSize: 22,
    fontFamily: 'clash-display-600',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  webViewWrapper: {
    minHeight: 800, // Minimum height
  },
  webView: {
    // flex: 1,
  },
  skeletonContainer: {
    width: '95%',
    marginHorizontal: 'auto',
    marginVertical: 7,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    width: '100%',
  },
  skeletonTextContainer: {
    flex: 1,
  },
});
