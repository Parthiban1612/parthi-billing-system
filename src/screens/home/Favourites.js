import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from '@react-navigation/native';
import { fetchFavourites } from '../../redux/favouriteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createBoxShadow } from '../../lib/createBoxShadow';
import FavCard from './FavCard';
import SkeletonLoader from '../../components/SkeletonLoader';

const COLORS = {
    background: '#f2f2f7',
    card: '#ffffff',
    placeholderLight: '#D8D2FF',
    placeholderDark: '#BDAEFF',
    shadow: '#b0b0c0',
};

// Skeleton component for favorites that matches the actual FavCard
const FavoriteSkeleton = () => (
    <View style={styles.skeletonContainer}>
        <View style={styles.skeletonCard}>
            <SkeletonLoader
                width={70}
                height={70}
                borderRadius={12}
                style={{ marginRight: 16 }}
            />
            <View style={styles.skeletonTextContainer}>
                <SkeletonLoader
                    width={200}
                    height={17}
                    borderRadius={4}
                    style={{ marginBottom: 4 }}
                />
                <SkeletonLoader
                    width={150}
                    height={15}
                    borderRadius={4}
                    style={{ marginBottom: 12 }}
                />
                <SkeletonLoader
                    width={60}
                    height={27}
                    borderRadius={8}
                />
            </View>
        </View>
    </View>
);

export default function Favourites() {

    const dispatch = useDispatch();

    const navigation = useNavigation();

    const { favourites, favouritesLoading } = useSelector((state) => state.favourite);

    // Refresh favorites when component mounts
    useEffect(() => {
        dispatch(fetchFavourites());
    }, []);

    // Show skeleton loading when data is being fetched
    if (favouritesLoading) {
        return (
            <View style={{ flex: 1, paddingBottom: 100 }}>
                {[1, 2, 3].map((index) => (
                    <FavoriteSkeleton key={index} />
                ))}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, paddingBottom: 100 }}>
            {favourites?.data?.length === 0 ? (
                <>
                    <View style={styles.placeHolderContainer}>
                        <View style={[styles.card, styles.topCard]}>
                            <View style={[styles.imagePlaceholder, styles.topImagePlaceholder]} />
                            <View style={[styles.textPlaceholder, styles.topTextPlaceholder]} />
                        </View>
                        <View style={[styles.card, styles.bottomCard]}>
                            <View style={[styles.imagePlaceholder, styles.bottomImagePlaceholder]} />
                            <View style={[styles.textPlaceholder, styles.bottomTextPlaceholder]} />
                        </View>
                    </View>
                    <View style={[styles.exploreTextContainer]}>
                        <Text style={[styles.headingText]}>Let the planning begun</Text>
                        <Text style={[styles.descriptionText]}>Discover and start adding your favourite{'\n'} places for your trip</Text>
                    </View>
                    <View style={styles.exploreHeader}>
                        <View style={styles.exploreButtonContainer}>
                            <TouchableRipple
                                onPress={() => navigation.navigate("ExplorerTab")}
                                rippleColor="#938EA2"
                            >
                                <View style={styles.exploreButtonContent}>
                                    <SimpleLineIcons
                                        name="compass"
                                        size={22}
                                        color={"#938EA2"}
                                    />
                                    <Text style={[styles.exploreButtonText]}>Explore places</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
                </>
            ) : (
                <View style={{ marginTop: 14 }}>
                    {favourites?.data?.map((item, index) => (
                        <FavCard
                            key={index}
                            item={item}
                            onPress={() => navigation.navigate("LocationDetails", { locationId: item?.itinerary_id, favouriteId: item?.id })}
                            showBanner={index === 0}
                            gradientColors={['#F5F6F9', '#FBE314']}
                        />
                    ))}
                </View>
            )
            }
        </View >
    );
}


const styles = StyleSheet.create({
    bottomCard: {
        width: '80%',
        height: 100,
        paddingHorizontal: 20,
        borderColor: "#DAD8DF",
        borderWidth: 1,
        backgroundColor: "#F5F6F9",
        ...createBoxShadow(0, 4, 10, 0, "#000", 0.15),
    },
    topImagePlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.placeholderLight,
        borderRadius: 12,
        borderRadius: 14,
        marginRight: 16,
    },
    bottomTextPlaceholder: {
        width: 100,
        flexShrink: 1,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.placeholderDark,

    },
    bottomImagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.placeholderDark,
        borderRadius: 16,

    },
    textPlaceholder: {
        height: 14,
        borderRadius: 7,
    },
    topTextPlaceholder: {
        width: 60,
        flexShrink: 1,
        backgroundColor: COLORS.placeholderLight,
    },
    imagePlaceholder: {
        borderRadius: 14,
        marginRight: 16,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    topCard: {
        width: '60%',
        height: 80,
        paddingHorizontal: 16,
        borderRadius: 16,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderColor: "#DAD8DF",
        borderWidth: 1,
        backgroundColor: "#F5F6F9"
    },
    placeHolderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 24,
        marginTop: 51,
    },
    exploreTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 24
    },
    headingText: {
        fontSize: 18,
        fontFamily: "clash-display-600",
        color: "#000"
    },
    descriptionText: {
        fontSize: 15,
        color: "rgba(117, 112, 135, 1)",
        textAlign: "center",
        lineHeight: 20,
        fontFamily: "instrument-sans-400",

    },
    exploreHeader: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    exploreButtonContainer: {
        backgroundColor: "#000",
        borderRadius: 100,
        width: "50%",
        overflow: 'hidden', // This is crucial for border radius to work with ripple
    },
    rippleContainer: {
        // width: '100%',
        // height: '100%',
    },
    exploreButtonContent: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    exploreButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
        fontFamily: "instrument-sans-700",
    },
    containerBottomTabBar: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 2.5,
        backgroundColor: "#000",
        borderRadius: 100
    },
    buttonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: "#7F4DFF"
    },
    buttonTabText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    notificationDotWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FF6363',
        borderWidth: 2,
        borderColor: '#F9F9F9',
    },
    screen: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        padding: 20,
    },
    // Skeleton loading styles
    skeletonContainer: {
        width: '90%',
        marginHorizontal: 'auto',
        marginVertical: 7,
    },
    skeletonCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 8,
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 9,
        shadowColor: '#B9B7B7',
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    skeletonTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },

})