import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc icon bạn muốn dùng

const InputBar = ({ value, onChangeText, onSend }) => {
  return (
    <View style={styles.container}>
     <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập tin nhắn..."
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
       <Text><Icon name="send" size={30} color="green" /></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius:25,
    marginLeft:15,
    marginRight:15,
    marginBottom:15
   
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
    marginLeft:15,
    marginTop:8
  },
  sendButton: {
    padding: 10,
  },
});

export default InputBar;