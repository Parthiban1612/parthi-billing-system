import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { getStatusBarHeight } from '../utils/platformUtils';

const PrimaryHeader = ({ title, isFullHeight, children, headerHeight = 310, text1, text2 }) => {

  return (
    <View style={styles.root}>
      <View style={[styles.headerContainer, { height: headerHeight }]}>
        <Text style={styles.title}>{title}</Text>
        {text1 ? <Text style={styles.subtitle}>{text1}</Text> : null}
        {text2 &&
          <Text style={styles.subtitle}>{text2}</Text>
        }
      </View>

      <View style={styles.bodyBackground}>
        <Surface style={[styles.card, isFullHeight && { flex: 1 }]}>
          {children}
        </Surface>
        <View style={{ backgroundColor: '#F5F6F9', height: 100, width: '100%', position: 'absolute', top: -20, borderRadius: 24 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#7F4DFF',
    width: '100%',
    marginBottom: 32,
  },
  title: {
    marginTop: getStatusBarHeight() + 43,
    fontSize: 30,
    fontFamily: 'clash-display-700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: '#DAD8DF',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'instrument-sans-400',
    lineHeight: 24,
  },
  bodyBackground: {
    flex: 1,
    backgroundColor: '#F5F6F9',
    alignItems: 'center',
    paddingTop: 0,
    width: '100%',
  },
  card: {
    width: '90%',
    marginTop: -150, // Overlap the header
    backgroundColor: '#fff',
    marginBottom: 40,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
    justifyContent: 'flex-start',
  },
});

export default PrimaryHeader; 