import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ImageBackground } from 'react-native';

import { TouchableRipple } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

import Button from './Button';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';

import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, submitUserPreference } from '../redux/travelCountriesSlice';

import HeaderFire from '../../assets/header.svg';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Test Sheet Component with Dynamic Question Logic
 * Handles all question types: DATE, BOOL, TEXT, MOD_MULTI
 */

const QuestionRenderer = ({ question, onAnswer, currentAnswer }) => {
  const { question_type, text, choices } = question;

  switch (question_type) {
    case 'DATE':
      return <DateQuestion question={question} onAnswer={onAnswer} currentAnswer={currentAnswer} />;

    case 'BOOL':
      return <BoolQuestion question={question} onAnswer={onAnswer} currentAnswer={currentAnswer} />;

    case 'TEXT':
      return <TextQuestion question={question} onAnswer={onAnswer} currentAnswer={currentAnswer} />;

    case 'MOD_MULTI':
      return <MultiChoiceQuestion question={question} onAnswer={onAnswer} currentAnswer={currentAnswer} />;

    default:
      return <Text>Unsupported question type: {question_type}</Text>;
  }
};

const DateQuestion = ({ onAnswer, currentAnswer }) => {
  const [selectedDate, setSelectedDate] = useState(currentAnswer || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    setShowCalendar(false);
    onAnswer(dateString);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(new Date(month.timestamp));
  };

  const handleVisibleMonthsChange = (months) => {
    if (months && months.length > 0) {
      const visibleMonth = months[0];
      setCurrentMonth(new Date(visibleMonth.timestamp));
    }
  };

  const formatSelectedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleDropdownPress = () => {
    setShowCalendar(!showCalendar);
  };

  const handleChangeDate = () => {
    setShowCalendar(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.dateDropdownContainer}
        onPress={selectedDate ? handleChangeDate : handleDropdownPress}
      >
        <View style={styles.dateDropdownContent}>
          <Text style={styles.dateDropdownText}>
            {selectedDate ? formatSelectedDate(selectedDate) : 'Select a date'}
          </Text>
          <Icon
            name={showCalendar ? "chevron-up" : "chevron-down"}
            size={16}
            color="#938EA2"
          />
        </View>
      </TouchableOpacity>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            startDate={new Date().toISOString().split('T')[0]}
            onDayPress={handleDateSelect}
            minDate={new Date().toISOString().split('T')[0]}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#8B7FD1',
                selectedTextColor: '#FFFFFF'
              }
            }}
            current={currentMonth.toISOString().split('T')[0]}
            disableArrowLeft={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
            onMonthChange={handleMonthChange}
            onVisibleMonthsChange={handleVisibleMonthsChange}
            theme={{
              backgroundColor: '#FFFFFF',
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: '#938EA2',
              selectedDayBackgroundColor: '#8B7FD1',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#8B7FD1',
              dayTextColor: '#2D3748',
              textDisabledColor: '#CBD5E0',
              dotColor: '#8B7FD1',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#8B7FD1',
              monthTextColor: '#2D3748',
              indicatorColor: '#8B7FD1',
              textDayFontFamily: 'instrument-sans-500',
              textMonthFontFamily: 'clash-display-600',
              textDayHeaderFontFamily: 'instrument-sans-500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            style={styles.calendar}
          />
        </View>
      )}
    </View>
  );
};

const BoolQuestion = ({ onAnswer, currentAnswer }) => {
  return (
    <View style={styles.optionsContainer}>
      <TouchableRipple
        rippleColor="#E0E0E0"
        style={[
          styles.optionButton,
          currentAnswer === 'yes' && styles.selectedOption
        ]}
        onPress={() => onAnswer('yes')}
        borderless
      >
        <Text style={[
          styles.optionText,
          currentAnswer === 'yes' && styles.selectedOptionText
        ]}>
          Yes
        </Text>
      </TouchableRipple>
      <TouchableRipple
        rippleColor="#E0E0E0"
        style={[
          styles.optionButton,
          currentAnswer === 'no' && styles.selectedOption
        ]}
        onPress={() => onAnswer('no')}
        borderless
      >
        <Text style={[
          styles.optionText,
          currentAnswer === 'no' && styles.selectedOptionText
        ]}>
          No
        </Text>
      </TouchableRipple>
    </View>
  );
};

const TextQuestion = ({ onAnswer, currentAnswer }) => {
  // Parse currentAnswer if it's an object, otherwise use empty strings
  const parsedAnswer = typeof currentAnswer === 'object' ? currentAnswer : {};
  const [text, setText] = useState(parsedAnswer.name || '');
  const [pincode, setPincode] = useState(parsedAnswer.pincode || '');

  const handleTextChange = (value) => {
    setText(value);
    // Send both values as an object
    onAnswer({
      name: value,
      pincode: pincode
    });
  };

  const handlePincodeChange = (value) => {
    setPincode(value);
    // Send both values as an object
    onAnswer({
      name: text,
      pincode: value
    });
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        value={text}
        onChangeText={handleTextChange}
        placeholderTextColor="#938EA2"
        placeholderStyle={styles.textInputPlaceholder}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Pincode"
        value={pincode}
        onChangeText={handlePincodeChange}
        placeholderTextColor="#938EA2"
        placeholderStyle={styles.textInputPlaceholder}
        keyboardType="numeric"
      />
    </View>
  );
};

const MultiChoiceQuestion = ({ question, onAnswer, currentAnswer }) => {
  const { choices } = question;
  const selectedValues = currentAnswer || [];

  const handleChoiceToggle = (choice) => {
    const newSelectedValues = [...selectedValues];
    const index = newSelectedValues.findIndex(item =>
      typeof item === 'object' ? item.id === choice.id : item === choice.id
    );

    if (index > -1) {
      newSelectedValues.splice(index, 1);
    } else {
      newSelectedValues.push(choice.id);
    }

    onAnswer(newSelectedValues);
  };

  const isChoiceSelected = (choice) => {
    return selectedValues.includes(choice.id);
  };

  return (
    <ScrollView style={{ flex: 1, maxHeight: 400 }} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
      {choices.map((choice) => (
        <TouchableRipple
          key={choice.id}
          rippleColor="#E0E0E0"
          style={[
            styles.listOption,
            isChoiceSelected(choice) && styles.selectedListOption
          ]}
          onPress={() => handleChoiceToggle(choice)}
          borderless
        >
          <>
            <Text style={[
              styles.listOptionText,
              isChoiceSelected(choice) && styles.selectedListOptionText
            ]}>
              {choice.text}
            </Text>
            {isChoiceSelected(choice) ? (
              <View style={[styles.checkbox, { backgroundColor: '#6F27FF', alignItems: "center", justifyContent: "center" }]}>
                <Icon name="check" size={10} style={{ padding: 2 }} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.checkbox} />
            )}
          </>
        </TouchableRipple>
      ))}
      {/* {choices.map((choice) => (
        <TouchableRipple
          key={choice.id}
          rippleColor="#E0E0E0"
          style={[
            styles.listOption,
            isChoiceSelected(choice) && styles.selectedListOption
          ]}
          onPress={() => handleChoiceToggle(choice)}
          borderless
        >
          <>
            <Text style={[
              styles.listOptionText,
              isChoiceSelected(choice) && styles.selectedListOptionText
            ]}>
              {choice.text}
            </Text>
            {isChoiceSelected(choice) ? (
              <View style={[styles.checkbox, { backgroundColor: '#6F27FF', alignItems: "center", justifyContent: "center" }]}>
                <Icon name="check" size={10} style={{ padding: 2 }} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.checkbox} />
            )}
          </>
        </TouchableRipple>
      ))} */}
      {/* {choices.map((choice) => (
        <TouchableRipple
          key={choice.id}
          rippleColor="#E0E0E0"
          style={[
            styles.listOption,
            isChoiceSelected(choice) && styles.selectedListOption
          ]}
          onPress={() => handleChoiceToggle(choice)}
          borderless
        >
          <>
            <Text style={[
              styles.listOptionText,
              isChoiceSelected(choice) && styles.selectedListOptionText
            ]}>
              {choice.text}
            </Text>
            {isChoiceSelected(choice) ? (
              <View style={[styles.checkbox, { backgroundColor: '#6F27FF', alignItems: "center", justifyContent: "center" }]}>
                <Icon name="check" size={10} style={{ padding: 2 }} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.checkbox} />
            )}
          </>
        </TouchableRipple>
      ))} */}
    </ScrollView>
  );
};

const DynamicQuestionContent = ({ questions = [], onComplete, onSkip, ref }) => {
  const { closeBottomSheet, setQuestionType } = useGlobalBottomSheet();
  const dispatch = useDispatch();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Reset state when component mounts or questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
  }, [questions.length]);

  // Close modal if no questions available
  useEffect(() => {
    if (questions.length === 0) {
      closeBottomSheet();
    }
  }, [questions.length, closeBottomSheet]);

  // Update question type when current question changes
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setQuestionType(currentQuestion.question_type);
    }
  }, [currentQuestionIndex, questions, setQuestionType]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const hasAnswer = (() => {
    const answer = answers[currentQuestion?.id];
    if (answer === undefined || answer === null) return false;

    // Handle different question types
    switch (currentQuestion?.question_type) {
      case 'TEXT':
        // For TEXT questions, check if it's an object with both name and pincode
        if (typeof answer === 'object' && answer !== null) {
          return (answer.name && answer.name.trim() !== '') || (answer.pincode && answer.pincode.trim() !== '');
        }
        return answer.trim() !== '';
      case 'MOD_MULTI':
        return Array.isArray(answer) && answer.length > 0;
      case 'DATE':
      case 'BOOL':
        return answer !== '';
      default:
        return answer !== '';
    }
  })();

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!hasAnswer) {
      Toast.show({
        text1: 'Please provide an answer',
        text2: 'You need to answer this question before continuing',
        type: 'info',
      });
      return;
    }

    const formatAnswer = () => {
      const answer = answers[currentQuestion.id];
      switch (currentQuestion.question_type) {
        case 'BOOL':
          return answer === 'yes';
        case 'TEXT':
          return `${answer.name},${answer.pincode}`;
        case 'MOD_MULTI':
          return answer.map(Number);
        default:
          return answer;
      }
    };

    const data = {
      question_id: currentQuestion.id,
      answer: formatAnswer(),
    };

    setLoading(true);

    try {
      const response = await dispatch(submitUserPreference(data));

      if (response.meta?.requestStatus === 'fulfilled') {
        if (isLastQuestion) {
          onComplete?.(answers);
          ref?.current?.close();
          setTimeout(() => {
            dispatch(fetchQuestions());
          }, 500);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else {
        console.log('API call failed:', response);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (loading) return; // Prevent skipping while loading
    if (isLastQuestion) {
      onSkip?.();
      closeBottomSheet();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (!currentQuestion) {
    return null; // Return null instead of showing message
  }

  return (
    <>
      <View style={[styles.container, currentQuestion.question_type !== "BOOL" && { flex: 1 }]}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </View>
      <View style={styles.actionButtons}>
        <View style={styles.clearButton}>
          <TouchableRipple
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>
              Skip
            </Text>
          </TouchableRipple>
        </View>

        <View style={styles.confirmButton}>
          <Button
            text='Next'
            theme="dark"
            onPress={handleNext}
            loading={loading}
            disabled={!hasAnswer}
          />
        </View>
      </View>
    </>
  );
};

const TestSheet = ({ onComplete, onSkip }) => {

  const ref = useRef(null);

  const dispatch = useDispatch();

  const { questions } = useSelector((state) => state.travelCountries);

  const { isPaidUser } = useSelector((state) => state.auth);

  useFocusEffect(
    useCallback(() => {
      const getQuestions = async () => {
        const response = await dispatch(fetchQuestions());
        if (response?.payload?.data && response?.payload?.data?.length > 0) {
          ref.current.expand(); // Only expands if API returns questions
        }
      };

      if (isPaidUser) {
        getQuestions();
      }
    }, [dispatch])
  );

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

  if (questions?.data?.length === 0) {
    return null;
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing
      onClose={() => { }}
      onChange={() => { }}
      backdropComponent={renderBackdrop}
      style={{
        backgroundColor: '#F5F6F9',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleComponent={() => {
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
              <HeaderFire />
              <Text style={styles.headerTitle}>Help us personalised your recommendations</Text>
            </View>
          </ImageBackground>
        )
      }}
      enableContentPanningGesture={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <DynamicQuestionContent
          ref={ref}
          questions={questions?.data || []}
          onComplete={onComplete}
          onSkip={onSkip}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  container: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    elevation: 1,
    padding: 16,
    borderRadius: 24,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'clash-display-600',
    marginBottom: 16,
    lineHeight: 22,
    color: '#111013',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '48%',
  },
  selectedOption: {
    backgroundColor: '#F3F0FF',
    borderColor: '#8B7FD1',
  },
  optionText: {
    fontSize: 17,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
  },
  selectedOptionText: {
    fontFamily: 'instrument-sans-600',
    fontSize: 17,
  },
  dateDropdownContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  dateDropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateDropdownText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#2D3748',
    flex: 1,
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 12,
  },
  inputContainer: {
    flex: 1,
    gap: 12,
  },
  textInput: {
    color: 'black',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    fontSize: 16,
    fontFamily: 'instrument-sans-400',
    textAlignVertical: 'top',
  },
  listOption: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedListOption: {
    backgroundColor: '#F4F2FF',
    borderColor: '#6F27FF',
  },
  listOptionText: {
    fontSize: 17,
    fontFamily: 'instrument-sans-400',
    color: '#3B3842',
    flex: 1,
  },
  selectedListOptionText: {
    color: '#3B3842',
    fontFamily: 'instrument-sans-600',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 18,
  },
  clearButton: {
    width: '35%',
  },
  confirmButton: {
    width: '63%',
  },
  skipButton: {
    padding: 10,
    borderRadius: 48,
    backgroundColor: "#DAD8DF",
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    fontFamily: "instrument-sans-500",
    color: '#111013',
  },
  handleIndicator: {
    backgroundColor: '#B9B6C3',
    width: 44,
    height: 5,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 8
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
});

export default TestSheet;
