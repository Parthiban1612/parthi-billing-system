import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableRipple } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Button from './Button';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import { fetchQuestions, submitUserPreference } from '../redux/travelCountriesSlice';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

/**
 * Dynamic Question Sheet Component
 * Handles all question types: DATE, BOOL, TEXT, MOD_MULTI
 * 
 * Usage:
 * ```javascript
 * <DynamicQuestionSheet
 *   questions={questionsData}
 *   onComplete={(answers) => console.log('All answers:', answers)}
 *   onSkip={() => console.log('Skipped')}
 * />
 * ```
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
        // placeholderTextColor="#111013"
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
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
      ))
      }
    </ScrollView >
  );
};

export const DynamicQuestionSheet = ({ questions = [], onComplete, onSkip }) => {
  const { closeBottomSheet, setQuestionType } = useGlobalBottomSheet();

  const dispatch = useDispatch();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  // Reset state when component mounts or questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
  }, [questions.length]); // Only depend on the length, not the entire array

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
          closeBottomSheet();
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
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>No questions available</Text>
      </View>
    );
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
          // rippleColor="#E0E0E0"
          >
            <Text style={styles.skipButtonText}>
              {isLastQuestion ? 'Skip All' : 'Skip'}
            </Text>
          </TouchableRipple>
        </View>

        <View style={styles.confirmButton}>
          <Button
            text={isLastQuestion ? "Complete" : "Next"}
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

const styles = StyleSheet.create({
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
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
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
  optionsList: {
    gap: 12,
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'instrument-sans-500',
    color: '#938EA2',
  },
}); 