import {
    TouchableOpacity, View, Text, StyleSheet, Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SliderImage from "../../../assets/sliderProfile.svg";
import CountrySelectionGrid from '../../components/CountrySelectionGrid';
import { Surface } from 'react-native-paper';
import { getSafeAreaTop } from '../../utils/platformUtils';
import { useNavigation } from '@react-navigation/native';

const PageTwo = ({ scrollRef, indicator }) => {

    const navigation = useNavigation();

    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.headerTopRow}>
                    <View style={styles.sideContainer} />
                    <View />
                    <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.sideContainer}>
                        <SliderImage width="40" height="40" />
                    </TouchableOpacity>
                </View>
                {indicator}
            </View>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                contentContainerStyle={{ paddingBottom: 80, backgroundColor: '#F5F6F9' }}
            >
                <View style={styles.imageSection}>
                    <Image source={require('../../../assets/new-trip.png')} style={styles.mainImage} />
                    <View style={styles.textOverlayContainer}>
                        <Text style={styles.titleText}>Add New {'\n'}Trip</Text>
                    </View>
                    <Image source={require('../../../assets/dashed.png')} style={styles.dashedOverlay} />
                </View>
                <View style={styles.bodyBackground}>
                    <Surface style={[styles.card]}>
                        <CountrySelectionGrid />
                    </Surface>
                </View>
            </ScrollView>
        </>
    );
};

export default PageTwo;

const styles = StyleSheet.create({
    card: {
        width: '90%',
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
    bodyBackground: {
        flex: 1,
        backgroundColor: '#F5F6F9',
        alignItems: 'center',
        paddingTop: 0,
        width: '100%',
        paddingTop: 17,
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: '#938EA2',
        paddingVertical: 10,
        paddingTop: getSafeAreaTop(true)
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContentContainer: { paddingBottom: 40 },
    imageSection: { position: 'relative' },
    mainImage: { width: '100%', height: 260, resizeMode: 'cover' },
    dashedOverlay: { width: '100%', height: 10, position: 'absolute', bottom: 0, resizeMode: 'stretch' },
    textOverlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    titleText: { color: '#FFFFFF', fontSize: 30, fontWeight: "600", textAlign: 'center', fontFamily: "clash-display-700" },
    selectorSection: { elevation: 9, shadowColor: '#B9B7B7', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 2, backgroundColor: "#fff", borderRadius: 24, padding: 16 },
    row: { flex: 1, justifyContent: 'space-around', gap: 10, marginBottom: 16 },
    radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D1D6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    selectedRadio: { width: 12, height: 12, borderRadius: 6 },
    countryName: { fontSize: 16, flexShrink: 1, fontFamily: "ClashDisplay-Variable", fontSize: 18 },
    cardContainer: { flex: 1, maxWidth: '48%', backgroundColor: '#F5F6F9', borderRadius: 20, padding: 10, borderColor: "#EFEDF1", borderWidth: 1 },
    cardImage: { width: '100%', height: 164, borderRadius: 12, marginBottom: 12 },
    selectionContainer: { flexDirection: 'row', alignItems: 'center' },
    cardContainerEmpty: { flex: 1, maxWidth: '48%', backgroundColor: 'transparent' },
});