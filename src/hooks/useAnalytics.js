
import { useEffect } from 'react';
import analytics from '@react-native-firebase/analytics';

export default function useAnalytics(screenName) {
  useEffect(() => {
    analytics().logEvent('screen_view', {
      screen_name: screenName,
    });
  }, [screenName]);
}