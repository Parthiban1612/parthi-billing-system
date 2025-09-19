import React, { useCallback } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import SubscriptionIcon from '../../assets/subscription-badge.svg';
import CheckIcon from '../../assets/tick.svg';
import Button from './Button';
import { useSelector } from 'react-redux';
import SkeletonLoader from './SkeletonLoader';
import { RightArrowIcon } from '../../assets';

const BuySheet = ({ ref, loading, handleTestPayment, setIsSheetExpanded, onClose }) => {

  const { planData } = useSelector((state) => state.payment);

  const planDetails = planData?.plans?.[0]

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <>
      <BottomSheet
        onClose={onClose || (() => setIsSheetExpanded(false))}
        ref={ref}
        enableDynamicSizing
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={{ paddingHorizontal: 20, backgroundColor: '#FFFFFF' }}>
            <View style={{ backgroundColor: "#5212C5", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginHorizontal: 'auto' }}>
                <SubscriptionIcon />
                <Text style={{ fontSize: 13, fontFamily: 'instrument-sans-600', color: '#EBE7FF' }}>
                  Upgrade to Trundle+
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#F288D1", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 16 }}>
              {!planDetails ? (
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <SkeletonLoader width={180} height={20} borderRadius={4} backgroundColor="rgba(255,255,255,0.2)" shimmerColor="rgba(255,255,255,0.4)" />
                  <SkeletonLoader width={80} height={36} borderRadius={4} backgroundColor="rgba(255,255,255,0.2)" shimmerColor="rgba(255,255,255,0.4)" />
                  <SkeletonLoader width={60} height={14} borderRadius={4} backgroundColor="rgba(255,255,255,0.2)" shimmerColor="rgba(255,255,255,0.4)" />
                </View>
              ) : (
                <>
                  <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#FFFFFF', textAlign: "center", marginbotom: 4 }}>
                    Unlock premium benefits{'\n'}for just
                  </Text>
                  <Text style={{ fontSize: 30, fontFamily: 'clash-display-700', color: '#FFFFFF', textAlign: "center" }}>
                    ${parseInt(planDetails?.price, 10)}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: 'instrument-sans-500', color: '#FFFFFF', textAlign: "center" }}>
                    per trip
                  </Text>
                </>
              )}
            </View>
            <View style={{ gap: 12, padding: 24 }}>
              {!planDetails ? (
                // Skeleton for list items
                <>
                  {[1, 2, 3, 4].map((_, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <SkeletonLoader width={24} height={24} borderRadius={12} />
                      <SkeletonLoader width={'80%'} height={18} borderRadius={4} />
                    </View>
                  ))}
                </>
              ) : (
                planDetails?.description && Object.values(planDetails.description).map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CheckIcon />
                    <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#3B3842' }}>
                      {item}
                    </Text>
                  </View>
                ))
              )}
            </View>
            <Button
              iconPosition="right"
              icon={() => <RightArrowIcon />}
              style={{ marginHorizontal: 24, marginBottom: 16 }}
              theme="dark"
              text="Proceed to pay"
              onPress={handleTestPayment}
              disabled={loading}
              loading={loading}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  renderBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});


export default BuySheet