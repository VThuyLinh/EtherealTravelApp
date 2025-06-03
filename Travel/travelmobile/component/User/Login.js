// import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Button, Icon, TextInput } from "react-native-paper";
// import React, { useContext, useState, useCallback } from "react"; 
// import APIs, { authApi, endpoints } from "../../config/APIs";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { MyDispatchContext } from "../../config/context";
// import StyleAll from "../../style/StyleAll";
// import { useNavigation, useFocusEffect } from "@react-navigation/native"; 


// const Login1 = () => {
//   const [user, setUser] = React.useState({});
//   const [username, setUsername] = useState(''); 
//   const [password, setPassword] = useState(''); 
//   const navigation = useNavigation();
//   const [loading, setLoading] = React.useState(false);
//   const dispatch = useContext(MyDispatchContext);
//   const [loginFailed, setLoginFailed] = useState(false); 

//   const updateSate = (field, value) => {
//     setUser(current => {
//       return {...current, [field]: value}
//     });
//   }

//   const login = async () => {
//     let formData={
//       username:username,
//       password:password,
//       grant_type:'password',
//       client_id:'6jeYQgqQQJ1r9WFuuqFMs3WHAQ0QT0IzHFjHscG8',
//       client_secret:'K0Bu3iC7IZkSWgK4XO9fzJWuyQUzRlWhmQOGHum8IAatEDA7AdH88Xd4YfpGZNlKmgbuLexewerwvkKPsaaSAtIjPg408e7xgisQFtXkTNcLeN7CcsXn3gftMTuzO7El',
//     }
//     setLoading(true);
//     setLoginFailed(false); 
//     try {
//       console.info(user)
//       let res = await APIs.post(endpoints['login'],formData,{
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.info(res.data);

//       await AsyncStorage.setItem("token", res.data.access_token);

//       setTimeout(async () => {
//         let user = await authApi(res.data.access_token).get(endpoints['current-user']);
//         console.info(user.data);

//         dispatch({
//           'type': "login",
//           'payload': user.data
//         })
//       }, 100);


//      if (currentUser.data.vaitro === 'Admin') {
//         navigation.navigate("AdminScreen"); // Chuyển đến màn hình AdminDashboard
//         Alert.alert("Thành công", `Chào mừng Admin ${currentUser.data.username}!`);
//       } else {
//         navigation.navigate("Home"); // Chuyển đến màn hình Home cho Customer
//         Alert.alert("Thành công", `Chào mừng ${currentUser.data.first_name || currentUser.data.username}!`);
//       }


//     } catch (ex) {
//       setLoginFailed(true); 
//     } finally {
//       setLoading(false);
//     }
//   }

//   const resetForm = () => {
//     setUsername('');
//     setPassword('');
//   };

//   useFocusEffect(
//     useCallback(() => {
//       resetForm();
//       return () => {
      
//       };
//     }, []) 
//   );


//   return (
//     <View style={[StyleAll.container]}>
//       <View style={styles.center}>
//         <Text style={styles.tieude}>Ethereal_Travel</Text>
//       </View>
//       <View style={styles.center}>
//         <Text style={styles.title}>Đăng nhập</Text>
//       </View>
//       {loginFailed && (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>Sai tên đăng nhập hoặc mật khẩu.</Text>
//         </View>
//       )}

//       <View style={{marginTop:20, marginLeft:25, marginRight:25,marginBottom:10}}>
//         <TextInput placeholder="Tên đăng nhập" style={styles.input} left={<TextInput.Icon icon='id-card' />} onChangeText={(value)=>setUsername(value)} value={username}></TextInput>
//       </View>

//       <View >

//         <View style={{ marginLeft:25, marginRight:25}}>

//           <TextInput placeholder="Mật khẩu" secureTextEntry={true} style={styles.input} left={<TextInput.Icon icon='lock' />} onChangeText={(value)=>setPassword(value)} value={password}></TextInput>
//         </View>
//         <TouchableOpacity
//           style={styles.forgotPasswordContainer}
//           onPress={() => navigation.navigate("Forgot")}
//         >
//           <Text style={styles.forgotPasswordText}>Quên mật khẩu <Icon source="lock-reset" size={17} color="#007bff"/></Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
//         {loading ? <Text style={{fontSize:17, fontWeight:'bold', marginTop:4, marginLeft:30}}><Icon source="fish" size={40}></Icon><Icon source="fish" size={40}></Icon><Icon source="fish" size={40}></Icon></Text> :  <Text style={{fontSize:17, fontWeight:'bold', marginTop:10, marginLeft:50}}>Đăng nhập</Text>}
          
//         </TouchableOpacity>
//       </View>

//       <View>
//         <Image style={styles.tinyLogo} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132381/Ethereal_Travel_1_ysgitt.png'}}/>
//       </View>
//       <View>
//         <Image style={styles.tinyLogo1} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132424/Ethereal_Travel_2_wc4hjg.png'}}/>
//       </View>

//     </View>

//   );

// }
// const styles= StyleSheet.create({
//   container:{
//     flex:1,
//     backgroundColor:'white',
//     paddingHorizontal:30
//   },tinyLogo: {
//     marginTop:20,
//     marginLeft:5,
//     width: 400,
//     height: 200,
//   },tinyLogo1: {
//     marginTop:5,
//     marginLeft:5,
//     width: 400,
//     height: 200,
//   },
//   tieude:{
//     fontWeight:'bold',
//     fontSize:30,
//     marginTop:10,
//     color:'black',
//   },
//   button:{
//     backgroundColor:"#b2dbbf",
//     color:"white",
//     textAlign:"center",
//     marginTop:20,
//     height:45,
//     width:180,
//     marginLeft:220,
//     borderRadius:20
//   },
//   center:{alignItems:'center'},
//   title:{
//     fontWeight:'bold',
//     fontSize:30,
//     color:'black'
//   },form:{
//     marginTop:30
//   },input: {
//     marginBottom: 15,
//     backgroundColor: 'white',
//   },alertTitle: {
//     color: 'red', 
//   },
//   alertMessage: {
//     color: 'blue', 
//   },
//   alertButton: {
//     color: 'green', 
//   },
//   forgotPasswordContainer: {
//     alignItems: 'flex-end', 
//     marginRight: 25,
//     marginTop: 5,
//     marginBottom: 15, 
//   },
//   forgotPasswordText: {
//     color: '#007bff', 
//     fontSize: 14,
//   },
//   errorContainer: {
//     backgroundColor: '#ffebee',
//     padding: 10,
//     borderRadius: 5,
//     marginHorizontal: 25,
//     marginTop: 10,
//   },
//   errorText: {
//     color: '#d32f2f',
//     textAlign: 'center',
//   },
// });

// export default Login1;


import { View, Text, Alert, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Button, Icon, TextInput } from "react-native-paper";
import React, { useContext, useState, useCallback } from "react";
import APIs, { authApi, endpoints } from "../../config/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MyDispatchContext } from "../../config/context";
import StyleAll from "../../style/StyleAll";
import { useNavigation, useFocusEffect } from "@react-navigation/native";


const Login1 = () => {
  // const [user, setUser] = React.useState({}); // Có thể bỏ state này nếu không dùng
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useContext(MyDispatchContext);
  const [loginFailed, setLoginFailed] = useState(false);

  // const updateSate = (field, value) => { // Có thể bỏ hàm này nếu không dùng user state
  //   setUser(current => {
  //     return {...current, [field]: value}
  //   });
  // }

  const login = async () => {
    let formData = {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: '6jeYQgqQQJ1r9WFuuqFMs3WHAQ0QT0IzHFjHscG8',
      client_secret: 'K0Bu3iC7IZkSWgK4XO9fzJWuyQUzRlWhmQOGHum8IAatEDA7AdH88Xd4YfpGZNlKmgbuLexewerwvkKPsaaSAtIjPg408e7xgisQFtXkTNcLeN7CcsXn3gftMTuzO7El',
    }
    setLoading(true);
    setLoginFailed(false); // Reset trạng thái lỗi khi bắt đầu đăng nhập

    try {
      // 1. Gửi yêu cầu đăng nhập để lấy access_token
      let res = await APIs.post(endpoints['login'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.info("Login Response Data:", res.data);

      // 2. Lưu access_token vào AsyncStorage
      await AsyncStorage.setItem("token", res.data.access_token);

      // 3. Lấy thông tin người dùng hiện tại
      // Thay đổi tên biến từ 'user' thành 'currentUser' để tránh nhầm lẫn và dễ đọc hơn
      let currentUserRes = await authApi(res.data.access_token).get(endpoints['current-user']);
      const currentUser = currentUserRes.data; // Lấy trực tiếp dữ liệu người dùng
      console.info("Current User Data:", currentUser);

      // 4. Dispatch hành động login vào context
      dispatch({
        'type': "login",
        'payload': currentUser // Gửi đối tượng user đã lấy được
      });

      // 5. Logic chuyển hướng dựa trên vai trò
      if (currentUser.vaitro === 'Admin') {
        navigation.navigate("Admin"); // Đảm bảo tên màn hình chính xác là "AdminDashboard"
        
      } else {
        navigation.navigate("Home");
        
      }

    } catch (ex) {
      console.error("Login Error:", ex.response?.data || ex.message);
      setLoginFailed(true); // Đặt trạng thái lỗi là true
      Alert.alert("Lỗi đăng nhập", "Tên đăng nhập hoặc mật khẩu không đúng."); // Thông báo lỗi rõ ràng
    } finally {
      setLoading(false); // Dù thành công hay thất bại, đều tắt loading
    }
  }

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {
        // cleanup if needed
      };
    }, [])
  );


    return (
    <View style={[StyleAll.container]}>
      <View style={styles.center}>
        <Text style={styles.tieude}>Ethereal_Travel</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>Đăng nhập</Text>
      </View>
      {loginFailed && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Sai tên đăng nhập hoặc mật khẩu.</Text>
        </View>
      )}

      <View style={{marginTop:20, marginLeft:25, marginRight:25,marginBottom:10}}>
        <TextInput placeholder="Tên đăng nhập" style={styles.input} left={<TextInput.Icon icon='id-card' />} onChangeText={(value)=>setUsername(value)} value={username}></TextInput>
      </View>

      <View >

        <View style={{ marginLeft:25, marginRight:25}}>

          <TextInput placeholder="Mật khẩu" secureTextEntry={true} style={styles.input} left={<TextInput.Icon icon='lock' />} onChangeText={(value)=>setPassword(value)} value={password}></TextInput>
        </View>
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("Forgot")}
        >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu <Icon source="lock-reset" size={17} color="#007bff"/></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
        {loading ? <Text style={{fontSize:17, fontWeight:'bold', marginTop:4, marginLeft:30}}><Icon source="fish" size={40}></Icon><Icon source="fish" size={40}></Icon><Icon source="fish" size={40}></Icon></Text> :  <Text style={{fontSize:17, fontWeight:'bold', marginTop:10, marginLeft:50}}>Đăng nhập</Text>}
          
        </TouchableOpacity>
      </View>

      <View>
        <Image style={styles.tinyLogo} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132381/Ethereal_Travel_1_ysgitt.png'}}/>
      </View>
      <View>
        <Image style={styles.tinyLogo1} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132424/Ethereal_Travel_2_wc4hjg.png'}}/>
      </View>

    </View>

  );

}
const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    paddingHorizontal:30
  },tinyLogo: {
    marginTop:20,
    marginLeft:5,
    width: 400,
    height: 200,
  },tinyLogo1: {
    marginTop:5,
    marginLeft:5,
    width: 400,
    height: 200,
  },
  tieude:{
    fontWeight:'bold',
    fontSize:30,
    marginTop:10,
    color:'black',
  },
  button:{
    backgroundColor:"#b2dbbf",
    color:"white",
    textAlign:"center",
    marginTop:20,
    height:45,
    width:180,
    marginLeft:220,
    borderRadius:20
  },
  center:{alignItems:'center'},
  title:{
    fontWeight:'bold',
    fontSize:30,
    color:'black'
  },form:{
    marginTop:30
  },input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },alertTitle: {
    color: 'red', 
  },
  alertMessage: {
    color: 'blue', 
  },
  alertButton: {
    color: 'green', 
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end', 
    marginRight: 25,
    marginTop: 5,
    marginBottom: 15, 
  },
  forgotPasswordText: {
    color: '#007bff', 
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 25,
    marginTop: 10,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default Login1;
