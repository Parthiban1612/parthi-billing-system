import analytics from "@react-native-firebase/analytics";

export async function trackFirebaseEvent(eventName, params = {}) {
  // console.log('trackFirebaseEvent', eventName, params);
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.error(error);
  }
}
