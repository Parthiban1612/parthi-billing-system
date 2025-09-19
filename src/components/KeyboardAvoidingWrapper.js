import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { getKeyboardAvoidingBehavior, getKeyboardVerticalOffset } from '../utils/platformUtils';

const KeyboardAvoidingWrapper = ({
  children,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = 100,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = "handled"
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={getKeyboardAvoidingBehavior()}
      style={[styles.container, style]}
      keyboardVerticalOffset={getKeyboardVerticalOffset(keyboardVerticalOffset)}
      enabled={keyboardVisible}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default KeyboardAvoidingWrapper; 