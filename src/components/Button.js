import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const Button = ({
  onPress,
  text = 'Next',
  style,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  theme = 'light', // 'light' or 'dark'
}) => {
  // Theme-based styles
  const getThemeStyles = () => {
    if (theme === 'dark' || theme === 'danger') {
      return {
        button: {
          backgroundColor: theme === 'danger' ? '#F57474' : '#222',
          borderWidth: 1,
          borderColor: theme === 'danger' ? '#F57474' : '#444',
          height: 42,
          borderRadius: 48,
          justifyContent: 'center',
          alignItems: 'center',
        },
        label: {
          fontFamily: 'instrument-sans-500',
          fontSize: 14,
          lineHeight: 18,
          letterSpacing: 0,
          color: '#fff',
          marginLeft: 10
        },
        // Enable ripple effect for dark theme
        rippleColor: 'rgba(255, 255, 255, 0.2)',
      };
    }
    // Light theme (default)
    return {
      button: {
        backgroundColor: '#F5F6F9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        height: 42,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: {
        fontFamily: 'instrument-sans-500',
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0,
        color: '#222',
        marginLeft: 10
      },
      // Enable ripple effect for light theme
      rippleColor: 'rgba(0, 0, 0, 0.1)',
    };
  };

  const Icon = icon;

  const themeStyles = getThemeStyles();

  return (
    <View style={[
      themeStyles.button,
      style,
      { overflow: 'hidden' },
      disabled && {
        opacity: 0.5,
        backgroundColor: theme === 'dark' || theme === 'danger' ? '#666' : '#E0E0E0'
      }
    ]}>
      <TouchableRipple
        onPress={onPress}
        style={{ width: '100%', height: '100%' }}
        disabled={disabled}
        rippleColor={themeStyles.rippleColor}
      >
        <View style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          paddingHorizontal: 16,
        }}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={theme === 'dark' || theme === 'danger' ? '#fff' : '#222'}
            />
          ) : (
            <>
              {Icon && iconPosition === 'left' && <Icon style={{ marginRight: Icon && text ? 8 : 0 }} />}
              <Text style={[
                themeStyles.label,
                disabled && { color: theme === 'dark' || theme === 'danger' ? '#ccc' : '#999' },
                { textAlign: 'center' },
                iconPosition === 'right' && { marginRight: Icon && text ? 8 : 0 }
              ]}>
                {text}
              </Text>
              {Icon && iconPosition === 'right' && <Icon />}
            </>
          )}
        </View>
      </TouchableRipple>
    </View>
  );
};

export default Button; 