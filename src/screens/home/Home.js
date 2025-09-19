import React, { useState, useMemo, useCallback } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

import Tabs from './Tabs';
import Favourites from "./Favourites";
import Tips from "./Tips";
import Updates from "./Updates";

import { getSafeAreaTop } from '../../utils/platformUtils';
import { getUpdates } from '../../redux/updateSlices';

const PageOne = ({ scrollRef, indicator }) => {

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('Favourites');

    const [imageLoading, setImageLoading] = useState(true);

    const navigation = useNavigation();

    const { submittedCountry } = useSelector((state) => state.travelCountries);

    const renderTabContent = useMemo(() => {
        switch (activeTab) {
            case 'Tips': return <Tips />;
            case 'Updates': return <Updates />;
            case 'Favourites':
            default: return <Favourites />;
        }
    }, [activeTab]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageLoadStart = () => {
        setImageLoading(true);
    };

    useFocusEffect(
        useCallback(() => {
            dispatch(getUpdates());
        }, [dispatch])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F6F9' }}>
            <View style={[styles.headerContainer, { backgroundColor: submittedCountry?.background_color }]}>
                <View style={styles.headerTopRow}>
                    <View style={styles.sideContainer} />
                    <View>
                        <Text numberOfLines={1} style={styles.title}>
                            {submittedCountry?.name}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.sideContainer} onPress={() => navigation.navigate('Account')}>
                        <Icon name="user" size={26} color="#938EA2" />
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
                    {imageLoading && (
                        <View style={[styles.mainImage, styles.loadingContainer, { backgroundColor: submittedCountry?.background_color }]} >
                            <View style={styles.textOverlayContainer}>
                                <Text style={styles.titleText}>Your trip to{'\n'}{submittedCountry?.name}</Text>
                            </View>
                            <Image source={require('../../../assets/dashed.png')} style={styles.dashedOverlay} />
                        </View>
                    )}
                    <Image
                        source={{ uri: submittedCountry?.background_image }}
                        style={[styles.mainImage, { opacity: imageLoading ? 0 : 1 }]}
                        onLoad={handleImageLoad}
                        onLoadStart={handleImageLoadStart}
                    />
                    <View style={styles.textOverlayContainer}>
                        <Text style={styles.titleText}>Your trip to{'\n'}{submittedCountry?.name}</Text>
                    </View>
                    <Image source={require('../../../assets/dashed.png')} style={styles.dashedOverlay} />
                </View>
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <View style={styles.contentSection}>
                    {renderTabContent}
                </View>
            </ScrollView>
        </View>
    );
};

export default PageOne;

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: getSafeAreaTop(true) + 11
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        color: '#3B3842',
        textAlign: 'center',
        fontFamily: "instrument-sans-600",
    },
    sideContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSection: { position: 'relative', height: 260 },
    mainImage: { width: '100%', height: 260, resizeMode: 'cover' },
    dashedOverlay: { width: '100%', height: 10, position: 'absolute', bottom: 0, resizeMode: 'stretch' },
    textOverlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 20 },
    titleText: { color: '#3B3842', fontSize: 30, fontWeight: "600", textAlign: 'center', fontFamily: "clash-display-700" },
    daysHeaderContainer: { flexDirection: "row", backgroundColor: "#fff", gap: 5, padding: 16, borderRadius: 16, width: "100%", alignItems: "center", justifyContent: "center", marginTop: 24, },
    daysTextContainer: { fontFamily: "clash-display-600", fontSize: 17 },
    daysTextContent: { color: "##757087", fontSize: 15, fontFamily: "instrument-sans-400", },
    container: { flexDirection: 'row', width: '100%', paddingVertical: 15 },
    card: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderColor: "#F8D2E9", borderWidth: 1 },
    countText: { fontSize: 18, color: '#374151', fontFamily: "clash-display-600", },
    labelText: { fontSize: 13, color: '#6B7280', marginTop: 4, fontFamily: "instrument-sans-400", },
    contentSection: { flex: 1 },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    loadingText: {
        marginTop: 10,
        color: '#3B3842',
        fontSize: 16,
        fontFamily: 'instrument-sans-600',
    },
});