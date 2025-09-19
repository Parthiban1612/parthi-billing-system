import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Tips from '../../../assets/tips.svg';
import { trackFirebaseEvent } from '../../lib/analyics';

const FilterTabs = ({ activeTab, setActiveTab }) => {

    const { updates } = useSelector((state) => state.updates);

    const hasNotification = updates?.data?.some((update) => update?.is_seen === false);

    const ACTIVE_COLOR = '#7F4DFF';

    const INACTIVE_COLOR = '#938EA2';

    const ACTIVE_BORDER_COLOR = '#D8D2FF';

    const INACTIVE_BORDER_COLOR = '#DAD8DF';

    const renderTab = (name, IconComponent) => {

        const isActive = activeTab === name;

        const iconColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        const renderTheIcon = () => {
            if (typeof IconComponent === 'string') {
                return <Icon name={IconComponent} size={15} color={iconColor} />;
            } else {
                const CustomIcon = IconComponent;
                return <CustomIcon fill={iconColor} />;
            }
        };

        return (
            <View style={styles.tabWrapper}>
                <TouchableRipple
                    rippleColor="#E0E0E0"
                    style={[
                        styles.tabButton,
                        {
                            borderColor: isActive ? ACTIVE_BORDER_COLOR : INACTIVE_BORDER_COLOR,
                            backgroundColor: isActive ? '#fff' : '#F5F6F9',
                        },
                    ]}
                    onPress={() => {
                        trackFirebaseEvent('home_tab_selected', {
                            tab: name,
                        });
                        setActiveTab(name);
                    }}>
                    <>
                        {renderTheIcon()}
                        <Text
                            style={[
                                styles.tabText,
                                { color: isActive ? '#111013' : INACTIVE_COLOR },
                            ]}>
                            {name}
                        </Text>
                    </>
                </TouchableRipple>
                {hasNotification && name === 'Updates' && <View style={styles.notificationDotWrapper} />}
            </View>
        );
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
        >
            {renderTab('Favourites', 'star')}
            {renderTab('Tips', Tips)}
            {renderTab('Updates', 'bell', true)}
        </ScrollView>
    );
};


export default function Tabs({ activeTab, setActiveTab }) {
    return (
        <View style={styles.container}>
            <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
    );
}


const styles = StyleSheet.create({
    tabWrapper: {
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 12,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.90,
    },
    tabText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: "InstrumentSans-Regular",
        fontWeight: "700"
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
    tabsContainer: {
        flexDirection: 'row',
        padding: 11,
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.90,
    },
    tabText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: "InstrumentSans-Regular",
        fontWeight: "700"
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FF6363',
        borderWidth: 1,
        borderColor: '#F5F6F9',
    },

})