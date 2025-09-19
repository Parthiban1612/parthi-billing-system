import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // For the icons
import Weather from '../../../assets/weather.svg'
import { useDispatch, useSelector } from 'react-redux';
import SkeletonLoader from '../../components/SkeletonLoader';
import { resetUpdates, updateReaded } from '../../redux/updateSlices';

export default function Updates() {

    const iconColor = '#7F4DFF';

    const dispatch = useDispatch();

    const { updates, updatesLoading } = useSelector((state) => state.updates);

    const [readedIds, setReadedIds] = useState([]);

    useEffect(() => {
        setReadedIds(updates?.data?.map((update) => update?.is_seen === false ? update?.id : null).filter(id => id !== null));
    }, [updates?.data]);

    useEffect(() => {
        return () => {
            if (readedIds && readedIds.length > 0) {
                console.log('called inside');
                const formData = new FormData();
                readedIds.forEach((id) => {
                    formData.append('update_id', id);
                });
                dispatch(updateReaded(formData));
                dispatch(resetUpdates());
            }
        };
    }, [readedIds]);

    if (updatesLoading) {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.container}>
                    {/* Weather card skeleton */}
                    <View style={styles.card}>
                        <SkeletonLoader width={24} height={24} borderRadius={12} />
                        <View style={styles.textContainer}>
                            <SkeletonLoader width={60} height={18} borderRadius={4} style={{ marginBottom: 4 }} />
                            <SkeletonLoader width={80} height={11} borderRadius={4} />
                        </View>
                    </View>

                    {/* Season card skeleton */}
                    <View style={styles.card}>
                        <SkeletonLoader width={24} height={24} borderRadius={12} />
                        <View style={styles.textContainer}>
                            <SkeletonLoader width={60} height={18} borderRadius={4} style={{ marginBottom: 4 }} />
                            <SkeletonLoader width={80} height={11} borderRadius={4} />
                        </View>
                    </View>
                </View>

                {/* Location cards skeleton */}
                {[1, 2, 3].map((_, index) => (
                    <View style={styles.locatioCard} key={index}>
                        <SkeletonLoader width="100%" height={17} borderRadius={4} />
                    </View>
                ))}
            </View>
        );
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.card}>
                    <Weather />
                    <View style={styles.textContainer}>
                        <Text style={styles.mainText}>{updates?.weather?.temperature}</Text>
                        <Text style={styles.subText}>Today's Weather </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <Icon name="sun" size={24} color={iconColor} />
                    <View style={styles.textContainer}>
                        <Text style={styles.mainText}>{updates?.weather?.season}</Text>
                        <Text style={styles.subText}>Current Season</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {updates?.data?.map((update, index) => {
                const isRead = update?.is_seen;
                return (
                    <View style={styles.locatioCard} key={index}>
                        <Text style={[styles.locationDesc, { fontFamily: isRead ? "instrument-sans-400" : "instrument-sans-600" }]}>{update?.message}</Text>
                    </View>
                )
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#f7f7fa',
    },
    headerContainer: {
        padding: 20,
        paddingBottom: 100
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        // marginHorizontal: 8,
        elevation: 5,
        shadowColor: '#a5a5a5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    textContainer: {
        marginLeft: 12,
        flexShrink: 1
    },
    mainText: {
        fontSize: 18,
        color: '#1c1c1e',
        fontFamily: "clash-display-600"
    },
    subText: {
        fontSize: 11,
        color: '#938EA2',
        marginTop: 2,
        flexShrink: 1,
        fontFamily: "instrument-sans-600",

    },
    locatioCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 24,
        elevation: 5,
        shadowColor: '#a5a5a5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        marginTop: 20
    },
    indicatorDot: {
        width: 15,
        height: 15,
        borderRadius: 12,
        backgroundColor: '#F87171',

        position: 'absolute',
        top: -5,
        left: 0,
    },
    locationText: {
        fontSize: 17,
        color: '#1c1c1e',
        fontFamily: "instrument-sans-700",
    },
    locationDesc: {
        fontSize: 17,
        color: '#1c1c1e',
    }
});