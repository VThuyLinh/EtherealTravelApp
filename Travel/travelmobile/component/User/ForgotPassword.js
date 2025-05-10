import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon, TextInput } from 'react-native-paper';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const nav= useNavigation();
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://thuylinh.pythonanywhere.com/forgot/forgot_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        nav.navigate('Reset',{ uid: data.uid, token: data.token });
        setEmail('');
      } else {
        Alert.alert('Lỗi', data.message || 'Đã có lỗi xảy ra khi gửi yêu cầu.');
      }
    } catch (error) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QUÊN MẬT KHẨU</Text>
      <TextInput style={styles.input}
        placeholder="Nhập địa chỉ email của bạn"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        right={<TextInput.Icon icon='email-outline' />}
      />
      <Button style={styles.Button}
        onPress={handleForgotPassword}
        disabled={loading}
        icon={() => <Icon name="door" size={20} color="white" />}
      > 
      {loading?<>
        <Text style={{fontSize:14, color:'white'}}>Đang gửi</Text>
      </>:<>
      <Text style={{fontSize:14, color:'white'}}>Gửi yêu cầu đặt lại mật khẩu</Text>
     
      </>}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  Button:{
    marginHorizontal: 40,
    paddingVertical: 5,
    backgroundColor:'#008080',
    borderRadius:5,
  },
  container: {
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:"#008080"
  },
  input: {
    height: 45,
    borderColor: 'gray',
    marginBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default ForgotPasswordScreen;