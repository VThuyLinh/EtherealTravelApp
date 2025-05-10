import axios from "axios";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Alert, StyleSheet } from "react-native";
import { Button,Text, View } from "react-native";
import {  Icon, TextInput } from "react-native-paper";

const ResetPasswordVerificationScreen = ({ route, navigation }) => {
    const uid= route.params?.uid;
    const token= route.params?.token; 
    console.warn("token",token)
    const [verificationCode, setVerificationCode] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  
    // const handleResetPassword = async () => {
    //   setLoading(true);
    //   if (newPassword !== confirmNewPassword) {
    //     Alert.alert('Lỗi', 'Mật khẩu mới và mật khẩu xác nhận không khớp.');
    //     setLoading(false);
    //     return;
    //   }
  
    //   try {
    //     let formData={
    //         uid:uid,
    //         token:token,
    //         new_password: newPassword, confirm_new_password: confirmNewPassword
    //     }

    //     axios.post('https://thuylinh.pythonanywhere.com/forgot/reset-password/',formData)
    //     .then((respone)=>console.log(respone))
    //     .catch((err)=>console.error(err.request))
        
  
    //     if (response.status === 200) {
    //       Alert.alert(
    //         'Thành công',
    //         data.message, 
    //         [{ text: 'OK', onPress: () => navigation.navigate('login') }] // Chuyển đến màn hình đăng nhập
    //       );
    //     } else {
    //       Alert.alert('Lỗi', data.message || 'Đã có lỗi xảy ra khi đặt lại mật khẩu.');
    //     }
    //   } catch (error) {
    //     Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
    //     console.error('Lỗi:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    const handleResetPassword = async () => {
        setLoading(true);
        if (newPassword !== confirmNewPassword) {
          Alert.alert('Lỗi', 'Mật khẩu mới và mật khẩu xác nhận không khớp.');
          setLoading(false);
          return;
        }
          let formData={
              uid:uid,
              token:token,
              new_password: newPassword, confirm_new_password: confirmNewPassword
          }
  
          axios.post('https://thuylinh.pythonanywhere.com/forgot/reset-password/', formData)
          .then((response) => {
                console.log("res",response); // Kiểm tra response từ axios
                if (response.status === 200) {
                    Alert.alert(
                        'Thành công',
                        response.data.message, // Lấy message từ response.data
                        [{ text: 'OK', onPress: () => navigation.navigate('login') }],
                        setNewPassword(''),
                        setConfirmNewPassword('')
                    );
                } else {
                    Alert.alert('Lỗi', response.data.message || 'Đã có lỗi xảy ra khi đặt lại mật khẩu.');
                }
            })
            .catch((err) => {
                console.error(err.request);
                Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
            })
            .finally(() => {
                setLoading(false);
            })}


    return (
      <View style={styles.container}>
        <Text style={styles.title}>ĐẶT LẠI MẬT KHẨU</Text>
        {uid && token ? (
          <Text style={styles.instruction} >Vui lòng nhập mật khẩu mới của bạn.</Text>
        ) : (
          <Text >Vui lòng kiểm tra email của bạn để lấy mã và nhập vào đây.</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry={true}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
        <Button
          title={loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          onPress={handleResetPassword}
          disabled={loading}
        />
      </View>
    );
  };
  
  const styles= StyleSheet.create({
      container:{
          flex:1,
          backgroundColor:'white',
          paddingHorizontal:30
      },
      title: {
        marginTop:20,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color:"#008080"
      },instruction: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color:"gray",
        fontStyle:'italic'
      },input: {
          marginBottom: 15,
          backgroundColor: 'white',
      },alertTitle: {
          color: 'red', // Change the title color
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            marginBottom: 15,
          },
        alertMessage: {
          color: 'blue', // Change the message color
        },
        alertButton: {
          color: 'green', // Change the button color
        },
        forgotPasswordContainer: {
          alignItems: 'flex-end', // Đặt "Quên mật khẩu?" ở bên phải
          marginRight: 25,
          marginTop: 5, // Khoảng cách nhỏ giữa input mật khẩu và dòng chữ
          marginBottom: 15, // Khoảng cách giữa dòng chữ và nút đăng nhập
      },
      forgotPasswordText: {
          color: '#007bff', // Màu xanh dương (thường dùng cho link)
          fontSize: 14,
      },
      });
  
  export default ResetPasswordVerificationScreen;