
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { database, ref, push, onValue } from '../ChatRoom/firebaseConfig1.js';
import { MyUserContext } from '../../config/context.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useContext(MyUserContext);
  const nav = useNavigation();
  const route = useRoute();
  const { chatRoomId } = route.params;

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() !== '' && chatRoomId) {
      const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
      push(messagesRef, {
        text: newMessage,
        timestamp: new Date().getTime(),
        userId: user.id,
        userName: user.username,
        userAvatar: user.Avatar,
      });
      setNewMessage('');
    } else {
      console.warn('Không thể gửi tin nhắn vì ID phòng chat không hợp lệ.');
    }
  }, [newMessage, user.id, user.username, user.Avatar, chatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key],
            }))
            .sort((a, b) => a.timestamp - b.timestamp); // Sắp xếp theo thời gian tăng dần
          setMessages(messageList);
        } else {
          setMessages([]);
        }
      });
      return () => unsubscribe();
    }
  }, [chatRoomId]);

  const navigateToCreateChatRoom = () => {
    nav.navigate('CreateChatRoom', { userlogin: user });
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.userId === user.id;
    const date = new Date(item.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      ]}>
        {item.userAvatar && (
          <Image source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.userAvatar}` }} style={styles.avatar} />
        )}
        <View style={styles.messageContent}>
          <Text style={styles.username}>{item.userName || 'Người dùng'}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>{timeString}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        // Loại bỏ thuộc tính inverted
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity onPress={handleSendMessage}><Icon source="send" size={30} color='black'/></TouchableOpacity>
          
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  currentUserMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherUserMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageContent: {
    marginLeft: 10,
    marginRight: 10,
    flexShrink: 1,
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});

export default ChatScreen;