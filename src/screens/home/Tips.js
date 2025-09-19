import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import { useDispatch, useSelector } from 'react-redux';
import { getTips } from '../../redux/updateSlices';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function TipsTab() {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { tips, tipsLoading } = useSelector((state) => state.updates);

    useEffect(() => {
        dispatch(getTips());
    }, []);

    // Tips skeleton component
    const TipsSkeleton = () => (
        <View style={styles.container}>
            {[1, 2, 3].map((_, index) => (
                <View style={styles.card} key={index}>
                    <SkeletonLoader
                        width="100%"
                        height={20}
                        borderRadius={4}
                        style={{ marginBottom: 16 }}
                    />
                    <SkeletonLoader
                        width={120}
                        height={36}
                        borderRadius={20}
                    />
                </View>
            ))}
        </View>
    );

    if (tipsLoading) {
        return <TipsSkeleton />;
    }

    return (
        <View style={styles.container}>
            {tips?.data?.length > 0 ? (
                tips.data.map((tip, index) => (
                    <View style={styles.card} key={index}>
                        <Text style={styles.cardTitle}>{tip?.message}</Text>
                        <TouchableRipple
                            mode="text"
                            rippleColor={`rgba(60,60,60,0.12)`}
                            borderless
                            onPress={() => {
                                navigation.navigate('LocationDetails', { locationId: tip?.itinerary_id });
                            }} style={styles.button}>
                            <>
                                <Icon name="external-link" size={16} color="#555" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>View details</Text>
                            </>
                        </TouchableRipple>
                    </View>
                ))
            ) : (
                <View style={styles.noDataContainer}>
                    <Icon name="lightbulb" size={64} color="#C7C7CC" />
                    <Text style={styles.noDataTitle}>No Tips Available</Text>
                    <Text style={styles.noDataSubtitle}>
                        Travel tips and recommendations will appear here to help you plan better trips
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 9,
        shadowColor: '#B9B7B7',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 17,
        color: '#1c1c1e',
        marginBottom: 16,
        fontFamily: "instrument-sans-700",
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DAD8DF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
        fontFamily: "instrument-sans-700",
        flexShrink: 1

    },
    paragraphText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#333',
        fontFamily: "instrument-sans-600",
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
        minHeight: 300,
    },
    noDataTitle: {
        fontSize: 20,
        fontFamily: "instrument-sans-700",
        color: '#1C1C1E',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    noDataSubtitle: {
        fontSize: 16,
        color: '#8A8A8E',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: "instrument-sans-400",
    },
});