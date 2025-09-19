import { useCallback } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';

const ConfirmSheet = ({ ref, handleSheetChanges, title, message, iconName, iconColor, confirmText, confirmColor, onConfirm, onClose, showCloseButton = true, showUploadButton = false, onUpload, uploadText = "Upload" }) => {

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

  // renders
  return (
    <BottomSheet
      ref={ref}
      index={-1}
      onClose={onClose}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleComponent={() => {
        return (
          <View style={styles.handleIndicator} />
        )
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Icon name="x" size={20} color="#666" />
                </TouchableOpacity>
              )}
              <View style={[styles.modalHeader, !showCloseButton && styles.modalHeaderNoClose]}>
                <Icon name={iconName} size={17} color={iconColor} />
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <Text style={styles.modalMessage}>
                {message}
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={showUploadButton ? onUpload : onClose}
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonText}
                  rippleColor={`rgba(60,60,60,0.12)`}
                >
                  {showUploadButton ? uploadText : "Cancel"}
                </Button>
                <Button
                  mode="contained"
                  onPress={onConfirm}
                  style={styles.confirmButton}
                  labelStyle={styles.confirmButtonText}
                  buttonColor={confirmColor}
                >
                  {confirmText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    minWidth: 280,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  modalHeaderNoClose: {
    marginTop: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'instrument-sans-600',
    color: '#222',
    marginLeft: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  handleIndicator: {
    width: 32,
    height: 4,
    backgroundColor: '#B9B6C3',
    borderRadius: 2,
    marginBottom: 12,
    marginTop: 8,
    alignSelf: 'center',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#DAD8DF',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#3B3842',
    fontFamily: 'instrument-sans-500',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'instrument-sans-600',
    fontSize: 14,
  },
});

export default ConfirmSheet;