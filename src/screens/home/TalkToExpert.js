import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions, StatusBar, TextInput, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

function TalkToExpert({ visible, onClose }) {

  const { submittedCountry } = useSelector((state) => state.travelCountries);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message here
      setMessage('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={[styles.header, { backgroundColor: submittedCountry?.data?.background_color || '#FFE5E5' }]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Talk to expert</Text>
                <View style={styles.placeholder} />
              </View>

              {/* Main Content Area with KeyboardAwareScrollView */}
              <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                extraHeight={Platform.OS === 'ios' ? 0 : 20}
              >
                {/* Central Icon */}
                <View style={styles.iconContainer}>
                  <View style={styles.chatIcon}>
                    <Text style={styles.chatIconText}>💬✨</Text>
                  </View>
                </View>

                {/* Main Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>
                    <Text style={styles.boldText}>Talk to our travel expert</Text>
                    {'\n'}and get the curated{'\n'}
                    <Text style={styles.boldText}>itinerary for your japan trip</Text>
                  </Text>
                </View>

                {/* Chat Message */}
                <View style={styles.chatContainer}>
                  <View style={styles.chatBubble}>
                    <Text style={styles.chatText}>
                      Hi there! 👋 Ready to explore{'\n'}
                      something amazing? I can help you{'\n'}
                      discover hidden gems, and top{'\n'}
                      spots in japan —or right near you.{'\n'}
                      🗺️✈️What kind of trip are you in the{'\n'}
                      mood for?
                    </Text>
                  </View>
                </View>

                {/* Add some bottom padding for better scrolling */}
                <View style={styles.bottomPadding} />
              </KeyboardAwareScrollView>

              {/* Input Area */}
              <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!message.trim()}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.sendButtonText, !message.trim() && styles.sendButtonTextDisabled]}>
                      ➤
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width,
    height: height,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: StatusBar.currentHeight + 15,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  chatIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconText: {
    fontSize: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  chatContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  chatBubble: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 120,
    textAlignVertical: 'top',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
})

export default TalkToExpert
