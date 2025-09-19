import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { RadioButton, Text as PaperText } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';

const GenderModal = ({
  visible,
  onClose,
  onSelectGender,
  selectedGender,
  loading = false,
}) => {
  const flatListRef = useRef(null);

  const genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
    { label: 'Other', value: 3 },
  ];

  const handleSelectGender = (gender) => {
    onSelectGender(gender);
    onClose();
  };

  // Scroll to selected gender when modal opens
  useEffect(() => {
    if (visible && selectedGender) {
      const selectedIndex = genderOptions.findIndex(gender => gender.value === selectedGender);
      if (selectedIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: false,
            viewPosition: 0.1,
          });
        }, 300);
      }
    }
  }, [visible, selectedGender]);

  const renderGenderItem = ({ item, index }) => {
    const isSelected = selectedGender === item.value;

    return (
      <TouchableOpacity
        style={[styles.genderItem, isSelected && styles.selectedGenderItem]}
        onPress={() => handleSelectGender(item)}
      >
        <View style={styles.genderItemContent}>
          <RadioButton
            value={item.value}
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => handleSelectGender(item)}
            color="#8B5CF6"
          />
          <Text style={[styles.genderName, isSelected && styles.selectedGenderName]}>
            {item.label}
          </Text>
        </View>
        {isSelected && (
          <AntDesign name="check" size={20} color="#8B5CF6" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Gender</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="#111013" />
          </TouchableOpacity>
        </View>

        {/* Gender List */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : genderOptions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No gender options available</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={genderOptions}
              renderItem={renderGenderItem}
              keyExtractor={(item, index) => `gender-${item.value}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              getItemLayout={(data, index) => ({
                length: 64,
                offset: 64 * index,
                index,
              })}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={10}
              onScrollToIndexFailed={(info) => {
                const fallbackIndex = Math.min(info.index, genderOptions.length - 1);
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: fallbackIndex,
                    animated: false,
                    viewPosition: 0.1,
                  });
                }, 100);
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  selectedGenderItem: {
    backgroundColor: '#F8F5FF',
  },
  genderItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderName: {
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    marginLeft: 12,
  },
  selectedGenderName: {
    fontFamily: 'instrument-sans-600',
    color: '#8B5CF6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    color: '#999',
  },
});

export default GenderModal; 