import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';

import CustomBottomSheet from '../components/BottomSheet';
import logger from '../utils/logger';

import { setIsSheetOpen } from '../redux/travelCountriesSlice';

const GlobalBottomSheetContext = createContext();

export const useGlobalBottomSheet = () => {
  const context = useContext(GlobalBottomSheetContext);
  if (!context) {
    throw new Error('useGlobalBottomSheet must be used within a GlobalBottomSheetProvider');
  }
  return context;
};

export const GlobalBottomSheetProvider = ({ children }) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('Custom Bottom Sheet');
  const [onSkip, setOnSkip] = useState(null);
  const [onConfirm, setOnConfirm] = useState(null);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [showConfirmButton, setShowConfirmButton] = useState(true);
  const [questionType, setQuestionType] = useState(null);

  const openBottomSheet = useCallback(({
    content: newContent,
    headerTitle: newHeaderTitle = 'Custom Bottom Sheet',
    onSkip: newOnSkip = null,
    onConfirm: newOnConfirm = null,
    showSkipButton: newShowSkipButton = true,
    showConfirmButton: newShowConfirmButton = true,
    questionType: newQuestionType = null,
  }) => {
    setContent(newContent);
    setHeaderTitle(newHeaderTitle);
    setOnSkip(newOnSkip);
    setOnConfirm(newOnConfirm);
    setShowSkipButton(newShowSkipButton);
    setShowConfirmButton(newShowConfirmButton);
    setQuestionType(newQuestionType);
    setIsOpen(true);
    dispatch(setIsSheetOpen(true));

    // Open the bottom sheet after a small delay to ensure content is set
    setTimeout(() => {
      if (bottomSheetRef.current) {
        try {
          bottomSheetRef.current.snapToIndex(0);
        } catch (error) {
          logger.error('Error opening bottom sheet:', error);
        }
      }
    }, 100);

  }, [dispatch]);

  const closeBottomSheet = useCallback(() => {
    if (bottomSheetRef.current) {
      const timer = setTimeout(() => {
        try {
          bottomSheetRef.current?.close();
          setIsOpen(false);
          dispatch(setIsSheetOpen(false));
        } catch (error) {
          logger.error('Error closing bottom sheet:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        dispatch(setIsSheetOpen(false));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      const timer = setTimeout(() => {
        onSkip();
      }, 0);
      return () => clearTimeout(timer);
    }
    closeBottomSheet();
  }, [onSkip, closeBottomSheet]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      const timer = setTimeout(() => {
        onConfirm();
      }, 0);
      return () => clearTimeout(timer);
    }
    closeBottomSheet();
  }, [onConfirm, closeBottomSheet]);

  const value = {
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    isOpen,
    setQuestionType
  };

  return (
    <GlobalBottomSheetContext.Provider value={value}>
      {children}
      <CustomBottomSheet
        ref={bottomSheetRef}
        headerTitle={headerTitle}
        questionType={questionType}
        onSkip={handleSkip}
        onConfirm={handleConfirm}
        showSkipButton={showSkipButton}
        showConfirmButton={showConfirmButton}
        onSheetChanges={handleSheetChanges}
      >
        {content}
      </CustomBottomSheet>
    </GlobalBottomSheetContext.Provider>
  );
};


























