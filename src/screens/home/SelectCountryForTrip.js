import { View, StyleSheet, StatusBar } from 'react-native';
import PrimaryHeader from '../../components/PrimaryHeader';
import CountrySelectionGrid from '../../components/CountrySelectionGrid';

export default function SelectCountryForTrip() {


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#7F4DFF" translucent barStyle="light-content" />
      <PrimaryHeader
        isFullHeight={false}
        title="Start a trip"
        text1="Please select the country you're"
        text2="travelling to"
      >
        <View style={styles.content}>
          <CountrySelectionGrid />
        </View>
      </PrimaryHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9FF',
  },
  content: {
    paddingTop: 20,
  },
});
