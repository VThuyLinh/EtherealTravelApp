import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { MyUserContext } from '../../config/context';
import { Icon } from 'react-native-paper';

const ChatBubble = ({ message, isUser }) => {
  const user = useContext(MyUserContext);
  const messageContainerStyle = isUser ? styles.userMessageContainer : styles.botMessageContainer;
  const bubbleStyle = isUser ? styles.userBubble : styles.botBubble;
  const textStyle = styles.text;

  return (
    <View style={messageContainerStyle}>
      {!isUser ? (
        <View style={styles.avatarContainer}>
          <Text><Icon source="robot-happy" size={25} color="green" /></Text>
        </View>
      ) : (
        <View style={styles.emptyAvatar} />
      )}
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message}</Text>
      </View>
      {isUser && user && user.Avatar ? (
        <View style={styles.avatarContainerRight}>
          <Image source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${user.Avatar}` }} style={styles.userAvatar} />
        </View>
      ) : (
        !isUser && <View style={styles.emptyAvatarRight} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginVertical: 5,
    marginRight: 2,
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 5,
    marginLeft: 2,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    maxWidth: '80%',
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    maxWidth: '80%',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
    marginLeft:1,
    marginRight:1
  },
  avatarContainer: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainerRight: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  emptyAvatar: {
    width: 33,
  },
  emptyAvatarRight: {
    width: 33,
  },
});

export default ChatBubble;