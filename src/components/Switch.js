import React from 'react'
import OffIcon from '../../assets/off.svg';
import OnIcon from '../../assets/on.svg';
import { TouchableRipple } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';

export default function Switch({ value, onValueChange }) {

  // Shared values for animations
  const switchPosition = useSharedValue(0);
  const switchColor = useSharedValue(0);

  // Animated styles
  const animatedSwitchStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(switchPosition.value, {
            damping: 15,
            stiffness: 150,
          })
        }
      ]
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        switchColor.value,
        [0, 1],
        ['#DAD8DF', '#9D80FF']
      )
    };
  });

  const animatedOffIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(value ? 0 : 1, { duration: 200 }),
      transform: [
        {
          scale: withSpring(value ? 0.8 : 1, {
            damping: 15,
            stiffness: 150,
          })
        }
      ]
    };
  });

  const animatedOnIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(value ? 1 : 0, { duration: 200 }),
      transform: [
        {
          scale: withSpring(value ? 1 : 0.8, {
            damping: 15,
            stiffness: 150,
          })
        }
      ]
    };
  });

  const handleToggle = () => {
    const newValue = !value;

    // Animate switch position - ensure it stays within bounds
    // Container width: 51, thumb width: 25, padding: 3 on each side
    // Max translation: 51 - 25 - 6 = 20
    switchPosition.value = withSpring(newValue ? 20 : 0, {
      damping: 15,
      stiffness: 150,
    });

    // Animate background color
    switchColor.value = withTiming(newValue ? 1 : 0, {
      duration: 300,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        handleToggle();
        onValueChange(value);
      }}>
      <Animated.View
        style={[
          {
            width: 51,
            height: 32,
            borderRadius: 20,
            justifyContent: 'center',
            paddingHorizontal: 3,
            alignItems: 'flex-start'
          },
          animatedBackgroundStyle
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: '#FFFFFF',
              width: 25,
              height: 25,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            animatedSwitchStyle
          ]}
        >
          <Animated.View style={[animatedOffIconStyle, { position: 'absolute' }]}>
            <OffIcon />
          </Animated.View>
          <Animated.View style={[animatedOnIconStyle, { position: 'absolute' }]}>
            <OnIcon />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}
