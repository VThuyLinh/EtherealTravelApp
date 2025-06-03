import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from './ChatBubble.js';
import InputBar from './InputBar.js';
import axios from 'axios';
import { MyUserContext } from '../../config/context.js';
import { Icon } from 'react-native-paper';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();
  const scrollViewRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const user = React.useContext(MyUserContext);
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    setMessages([]);
  }, []);

 
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    if (showGreeting) {
      setShowGreeting(false);
      setMessages([]);
    }

    const newUserMessage = { text: inputText, isUser: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    console.log('Sending question:', inputText, 'with userId:', `${user.id}`);

    try {
      const response = await axios.post(
        `https://thuylinhsyn.pythonanywhere.com/Conversations/${user.id}/send_message/`,
        { message: inputText },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status != 200) {
        console.error('Lỗi khi gọi API:', response.request);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Đã có lỗi xảy ra khi gửi tin nhắn.', isUser: false },
        ]);
        setIsLoading(false);
        return;
      }

      const data = response.data;
      let botResponseMessage = '';
      if (data && data.text) { // Đã sửa thành data.text
        botResponseMessage = String(data.text);
        const newBotMessage = { text: data.text, isUser: false }; // Đã sửa thành data.text
        setMessages(prevMessages => [...prevMessages, newBotMessage]);
      } else {
        console.warn('Phản hồi API không có trường "text" hợp lệ.'); // Đã sửa thông báo lỗi
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Không nhận được phản hồi hợp lệ từ chatbot.', isUser: false },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.request);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Đã có lỗi xảy ra khi kết nối đến chatbot.', isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
    setShowGreeting(true);
  };

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current && !showGreeting) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, showGreeting]);

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
      style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
            <Text style={{ fontSize: 30, color: 'white' }}> +<Icon source="pen" size={30} color="white" /></Text>
          </TouchableOpacity>
        </View>
        {showGreeting ? (
          <View style={styles.greetingContainer}>
            {user ? (
              <>
                <Text style={styles.greetingText}>
                  Xin chào {`${user.last_name + ' ' + user.first_name}`}!
                </Text>
              </>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ChatBubble message={item.text} isUser={item.isUser} />}
            contentContainerStyle={styles.messageList}
            inverted={false}
          />
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )}
        <InputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSendMessage}
          isDisabled={isLoading}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexGrow: 1,
  },
  header: {
    width: 70,
    marginLeft: 325,
  },
  newChatButton: {
    backgroundColor: 'darkgreen',
    borderRadius: 50,
    padding: 5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default ChatScreen;