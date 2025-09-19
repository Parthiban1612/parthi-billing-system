import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';

const CountryModal = ({
  visible,
  onClose,
  countries,
  onSelectCountry,
  selectedCountry,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);

  // Filter countries based on search query - optimized
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries || [];
    }
    const filtered = countries?.filter(country =>
      country.label.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    return filtered;
  }, [countries, searchQuery]);

  const handleSelectCountry = (country) => {
    onSelectCountry(country);
    setSearchQuery('');
    onClose();
  };

  // Scroll to selected country when modal opens
  useEffect(() => {
    if (visible && selectedCountry && countries?.length > 0) {
      const selectedIndex = countries.findIndex(country => country.value === selectedCountry.value);
      if (selectedIndex !== -1) {
        // Longer delay to ensure modal and search input are fully rendered
        setTimeout(() => {
          // Calculate if the selected item is in the first few items
          const isNearTop = selectedIndex < 5;
          const viewPosition = isNearTop ? 0 : 0.15; // Different positioning based on location

          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: false,
            viewPosition: viewPosition,
          });
        }, 500);
      }
    }
  }, [visible, selectedCountry, countries]);

  const renderCountryItem = ({ item, index }) => {
    const isSelected = selectedCountry && selectedCountry.value === item.value;

    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.selectedCountryItem]}
        onPress={() => handleSelectCountry(item)}
      >
        <View style={styles.countryItemContent}>
          <Image source={item.image} style={styles.countryFlag} />
          <Text style={[styles.countryName, isSelected && styles.selectedCountryName]}>
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
          <Text style={styles.headerTitle}>Select Country</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="#111013" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search countries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchQuery.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setSearchQuery('')}
                />
              ) : null
            }
            autoFocus={true}
            style={styles.searchInput}
            contentStyle={styles.searchInputContent}
            outlineStyle={styles.searchInputOutline}
          />
        </View>

        {/* Countries List */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading countries...</Text>
            </View>
          ) : filteredCountries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No countries found' : 'No countries available'}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              getItemLayout={(data, index) => ({
                length: 64, // height of each item
                offset: 64 * index,
                index,
              })}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={20}
              onScrollToIndexFailed={(info) => {
                // Fallback if scroll fails - try scrolling to a nearby index
                const fallbackIndex = Math.min(info.index, countries.length - 1);
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
  },
  searchInputContent: {
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
  },
  searchInputOutline: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  selectedCountryItem: {
    backgroundColor: '#F8F5FF',
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    flex: 1,
  },
  selectedCountryName: {
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

export default CountryModal; 