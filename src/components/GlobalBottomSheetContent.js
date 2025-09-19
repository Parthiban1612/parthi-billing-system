import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchSubCategories } from '../redux/subCategoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setSelectedCategory, setSelectedSubcategory, clearSelectedFilters } from '../redux/categoriesSlice';
import { TouchableRipple } from 'react-native-paper';
import Button from './Button';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import { getAllItineraries } from '../redux/travelCountriesSlice';
import { trackFirebaseEvent } from '../lib/analyics';

// Filter Content Component
export const FilterContent = ({ onConfirm, onClear }) => {

  const dispatch = useDispatch();

  const { closeBottomSheet } = useGlobalBottomSheet();

  const { categories, selectedCategoryId, selectedSubcategoryId } = useSelector((state) => state.categories);

  const { selectedCity } = useSelector((state) => state.travelCountries);

  const { subCategories } = useSelector((state) => state.subCategories);

  const { token } = useSelector((state) => state.auth);

  const handleCategoryPress = (categoryObj) => {
    dispatch(setSelectedCategory(categoryObj.id));
    dispatch(setSelectedSubcategory(null));
    dispatch(fetchSubCategories({ categoryId: categoryObj.id, token }));
  };

  const handleOptionPress = (option) => {
    dispatch(setSelectedSubcategory(option.id));
  };

  useEffect(() => {
    dispatch(fetchCategories(token));
  }, [token]);

  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      dispatch(fetchSubCategories({ categoryId: selectedCategoryId, token }));
    }
  }, [selectedCategoryId, categories, token]);

  // Get the selected category object from Redux state
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  return (
    <View style={{ flex: 1 }}>
      {/* Two Column Layout */}
      <View style={styles.twoColumnLayout}>
        {/* Left Column - Fixed Categories */}
        <View style={styles.leftColumn}>
          {categories.map((category, index) => {
            const isActive = selectedCategoryId === category.id;
            return (
              <View key={index}
                style={{ backgroundColor: isActive ? "#DAD8DF" : "white" }}
              >
                <TouchableRipple
                  style={[
                    styles.categoryItem,
                    isActive && styles.selectedCategory
                  ]}
                  onPress={() => handleCategoryPress(category)}
                  rippleColor="#DAD8DF"
                >
                  <Text style={[
                    styles.categoryText,
                    isActive && styles.selectedCategoryText
                  ]}>
                    {category?.name}
                  </Text>
                </TouchableRipple>
                {!isActive && index < categories.length - 1 && <View style={styles.separator} />}
              </View>
            )
          })}
        </View>

        {/* Right Column - Scrollable Options */}
        <View style={styles.rightColumn}>
          {selectedCategory ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsContainer}
              style={styles.scrollView}
            >
              {subCategories?.map((option, index) => {
                const isSelected = selectedSubcategoryId === option.id;
                return (
                  <TouchableRipple key={index} style={styles.optionItem} onPress={() => handleOptionPress(option)}>
                    <>
                      <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected
                      ]}>
                        <View style={[
                          styles.radioInner,
                          isSelected && styles.radioInnerSelected
                        ]}
                        />
                      </View>
                      <Text numberOfLines={2} style={[
                        styles.filterOptionText,
                        isSelected && styles.filterOptionTextSelected
                      ]}>{option?.name}</Text>
                    </>
                  </TouchableRipple>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.noSelectionContainer}>
              <Text style={styles.noSelectionText}>Please select a category to see options</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.clearButton}>
          <TouchableRipple onPress={() => {
            dispatch(clearSelectedFilters());
            dispatch(getAllItineraries({
              token,
              categoryId: null,
              subcategoryId: null,
              cityId: selectedCity || null,
            }));
            // Call the onClear callback if provided
            if (onClear) {
              onClear();
            }
            closeBottomSheet();
          }} style={{ padding: 10, borderRadius: 48, backgroundColor: "#DAD8DF", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "instrument-sans-500", color: "#111013" }}>Clear</Text>
          </TouchableRipple>
        </View>
        <View style={styles.confirmButton}>
          <Button text="Confirm" onPress={() => {
            dispatch(getAllItineraries({
              token,
              categoryId: selectedCategoryId || null,
              subcategoryId: selectedSubcategoryId || null,
              cityId: selectedCity || null,
            }));

            trackFirebaseEvent('filter_button_clicked', {
              button_name: 'confirm',
              category_id: selectedCategoryId || null,
              subcategory_id: selectedSubcategoryId || null,
              city_id: selectedCity || null,
            });

            // Call the onConfirm callback if provided
            if (onConfirm) {
              onConfirm(selectedCategoryId || null, selectedSubcategoryId || null);
            }
            closeBottomSheet();
          }} theme="dark" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#F3F0FF',
    borderColor: '#8B7FD1',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
  },
  selectedOptionText: {
    color: '#8B7FD1',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dateInputContainer: {
    position: 'relative',
    minWidth: 80,
  },
  dateInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    textAlign: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  optionsList: {
    gap: 12,
  },
  listOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  selectedListOption: {
    backgroundColor: '#F3F0FF',
    borderColor: '#8B7FD1',
  },
  listOptionText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
    textAlign: 'center',
  },
  selectedListOptionText: {
    color: '#8B7FD1',
  },
  customContainer: {
    flex: 1,
    padding: 20,
  },
  filterOptionsContainer: {
    paddingBottom: 20,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: "instrument-sans-400",
    color: "#111013",
    width: "80%",
  },
  twoColumnLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#DAD8DF',
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 16,
  },
  categoryItem: {
    padding: 16,
    backgroundColor: '#F5F6F9',
  },
  selectedCategory: {
    backgroundColor: '#DAD8DF',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "instrument-sans-400",
    color: '#111013',
  },
  selectedCategoryText: {
    fontFamily: "instrument-sans-500",
  },
  separator: {
    height: 1,
    backgroundColor: '#DAD8DF',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inputContainer: {
    gap: 12,
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    borderColor: '#4C0B26',
  },
  radioInnerSelected: {
    backgroundColor: '#4C0B26',
    borderRadius: 100,
  },
  filterOptionTextSelected: {
    color: '#4C0B26',
    fontFamily: 'instrument-sans-500',
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingBottom: 18,
  },
  clearButton: {
    width: '35%',
  },
  confirmButton: {
    width: '63%',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#111013',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#fff',
    textAlign: 'center',
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111013',
    borderRadius: 8,
  },
  scrollView: {
    height: 200, // Fixed height for the scrollable options
  },
  summaryContainer: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'instrument-sans-500',
    color: '#111013',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'instrument-sans-400',
    color: '#938EA2',
    flex: 1,
    textAlign: 'right',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#F3F0FF',
    borderColor: '#8B7FD1',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSelectionText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
    textAlign: 'center',
  },
}); 