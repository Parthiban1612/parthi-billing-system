import React from 'react';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import { FilterContent } from './GlobalBottomSheetContent';
import { DynamicQuestionSheet } from './DynamicQuestionSheet';

// Question Modal Functions
export const useQuestionModals = () => {
  const { openBottomSheet } = useGlobalBottomSheet();

  const openFilterModal = ({ onConfirm, onClear }) => {
    openBottomSheet({
      content: (
        <FilterContent
          onConfirm={onConfirm}
          onClear={onClear}
        />
      ),
      headerTitle: 'Filter',
      // snapPoints: ['70%', '85%']
    });
  };


  const openDynamicQuestionSheet = ({ questions, onComplete, onSkip, headerTitle = 'Help us personalised your recommendations' }) => {
    // Get the first question type to determine initial snap point
    const firstQuestionType = questions?.[0]?.question_type || null;

    openBottomSheet({
      content: (
        <DynamicQuestionSheet
          key={Date.now()} // Force remount on each open
          questions={questions}
          onComplete={onComplete}
          onSkip={onSkip}
        />
      ),
      headerTitle: headerTitle,
      questionType: firstQuestionType,
    });
  };

  return {
    openFilterModal, openDynamicQuestionSheet
  };
}; 