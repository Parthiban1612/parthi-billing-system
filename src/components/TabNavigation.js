import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Menu from '../../assets/menu.svg';
import MenuItem from '../../assets/menu-item.svg';
import SvgComponent from '../common/CustomMegaphoneIcon';

const TAB_CONTAINER_WIDTH = 130;

const TABS = [
    { id: 'home', icon: SvgComponent },
    { id: 'explore', icon: 'compass' },
];

const TAB_WIDTH = TAB_CONTAINER_WIDTH / TABS.length;
const ACTIVE_PILL_DIAMETER = 48;
const PILL_HORIZONTAL_MARGIN = (TAB_WIDTH - ACTIVE_PILL_DIAMETER) / 2;

const ModernBottomNav = () => {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const activeIndex = TABS.findIndex(tab => tab.id === activeTab);
        const toValue = activeIndex * TAB_WIDTH + PILL_HORIZONTAL_MARGIN;

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: true,
            bounciness: 8,
            speed: 14,
        }).start();
    }, [activeTab, slideAnim]);

    const renderIcon = (tab) => {
        const color = activeTab === tab.id ? '#FFFFFF' : '#6E6E73';
        const size = 19;

        if (typeof tab.icon === 'string') {
            return <Feather name={tab.icon} size={size} color={color} />;
        }


        const Icon = tab.icon;
        return <Icon fill={color} width={size} height={size} />;
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.tabContainer}>
                <Animated.View
                    style={[
                        styles.activePill,
                        {
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                />
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabButton}
                        onPress={() => setActiveTab(tab.id)}
                        activeOpacity={0.7}
                    >
                        {renderIcon(tab)}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.chatButtonContainer} activeOpacity={0.8}>
                <Menu width="24" height="24" />
                <View style={styles.badgeContainer}>
                    <MenuItem width="14" height="14" />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        width: TAB_CONTAINER_WIDTH,
        height: 58,
        backgroundColor: '#FFFFFF',
        borderRadius: 29,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,

    },
    tabButton: {
        width: TAB_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,

    },
    activePill: {
        position: 'absolute',
        width: ACTIVE_PILL_DIAMETER,
        height: ACTIVE_PILL_DIAMETER,
        backgroundColor: '#6A3DE8',
        borderRadius: ACTIVE_PILL_DIAMETER / 2,
        top: 5,
        zIndex: 0,
    },
    chatButtonContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
});

export default ModernBottomNav;