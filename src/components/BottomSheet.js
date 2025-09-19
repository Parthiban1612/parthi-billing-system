import { useCallback, forwardRef, useMemo } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { setIsSheetOpen } from '../redux/travelCountriesSlice';
import { HeaderIcon } from "../../assets";

const CustomBottomSheet = forwardRef(({
  children,
  headerTitle = 'Custom Bottom Sheet',
  questionType = null,
  onSheetChanges,
}, ref) => {

  const dispatch = useDispatch();

  const snapPoints = useMemo(() => {
    switch (questionType) {
      case 'BOOL':
        return ['40%'];
      case 'PLAN':
        return ['50%'];
      default:
        return ['80%'];
    }
  }, [questionType]);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      dispatch(setIsSheetOpen(false));
    }
    if (onSheetChanges) {
      onSheetChanges(index);
    }
  }, [dispatch, onSheetChanges]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleComponent={
        () => {
          if (headerTitle === 'Filter') {
            return (
              <View style={{ backgroundColor: '#EFEDF1', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', height: 68 }}>
                <View style={styles.handleIndicator} />
                <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-600', color: '#111013', alignSelf: 'center', textAlign: 'center', marginTop: 19 }}>{headerTitle}</Text>
              </View>
            )
          }

          if (headerTitle && headerTitle.trim() !== '') {
            return (
              <ImageBackground
                source={require('../../assets/model-banner.png')}
                style={{
                  width: '100%',
                  height: 88,
                  paddingBottom: 16,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  overflow: 'hidden'
                }}
                imageStyle={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20
                }}
              >
                <View style={styles.handleIndicator} />
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>
                  <HeaderIcon />
                  <Text style={styles.headerTitle}>{headerTitle}</Text>
                </View>
              </ImageBackground>
            )
          }

          // Default header with just the drag handle
          return (
            <View style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 10
            }}>
              <View style={styles.handleIndicator} />
            </View>
          )
        }}
      backgroundStyle={styles.sheetBackground}
      contentPanningGestureEnabled={false}
      enableContentPanningGesture={false}
    >
      <BottomSheetScrollView style={styles.contentContainer} contentContainerStyle={{ flex: 1, bottom: 0 }}  >
        <View style={styles.content}>
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#EFEDF1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: '#EBE7FF',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#B9B6C3',
    width: 44,
    height: 5,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 8
  },
  contentContainer: {
    backgroundColor: '#F5F6F9',
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 19,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
});

export default CustomBottomSheet;
