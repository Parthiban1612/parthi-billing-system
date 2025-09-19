import React, { useEffect, useState, useCallback } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import logger from '../utils/logger';

export default function CountdownTimer({ duration = 120, onFinish, onResend, canResend = true }) {
  const [seconds, setSeconds] = useState(duration);
  const [isFinished, setIsFinished] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Memoize the format time function
  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setIsFinished(true);
      onFinish?.();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    // Cleanup interval on unmount or when seconds change
    return () => {
      clearInterval(interval);
    };
  }, [seconds, onFinish]);

  // Reset timer when duration changes
  useEffect(() => {
    setSeconds(duration);
    setIsFinished(false);
  }, [duration]);

  const handleResend = useCallback(async () => {
    if (canResend && onResend) {
      try {
        setIsResending(true);
        setSeconds(duration);
        setIsFinished(false);
        await onResend();
      } catch (error) {
        logger.error('Resend error:', error);
      } finally {
        setIsResending(false);
      }
    }
  }, [canResend, onResend, duration]);

  return (
    <View style={{
      alignItems: 'center',
      marginTop: 12,
      margin: 32,
    }}>
      {!isFinished ? (
        <Text style={{
          fontSize: 16,
          color: '#111',
          textAlign: 'center',
        }}>
          {formatTime(seconds)}
        </Text>
      ) : (
        <Button
          onPress={handleResend}
          disabled={!canResend || isResending}
          loading={isResending}
          rippleColor={`rgba(60,60,60,0.12)`}
          borderless
          labelStyle={{
            color: "#7F4DFF",
            fontFamily: "instrument-sans-500"
          }}
        >
          <Text>
            Resend Code
          </Text>
        </Button>
      )}
    </View>
  );
}
