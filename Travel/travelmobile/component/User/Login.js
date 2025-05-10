// import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Button, Icon, TextInput } from "react-native-paper";
// import React, { useContext } from "react";
// import APIs, { authApi, endpoints } from "../../config/APIs";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { MyDispatchContext } from "../../config/context";
// import StyleAll from "../../style/StyleAll";
// import StyleLogin from "../../style/StyleLogin";
// import { useNavigation } from "@react-navigation/native";


// const Login1 = () => {
//     const [user, setUser] = React.useState({});
//     const [username, setUsername] = React.useState('');
//     const [password, setPassword] = React.useState('');
//     const navigation = useNavigation();
//     const [loading, setLoading] = React.useState(false);
//     const dispatch = useContext(MyDispatchContext);

//     const updateSate = (field, value) => {
//         setUser(current => {
//             return {...current, [field]: value}
//         });
//     }

//     const login = async () => {
        
//             let formData={
//                 username:username,
//                 password:password,
//                 grant_type:'password',
//                 client_id:'6jeYQgqQQJ1r9WFuuqFMs3WHAQ0QT0IzHFjHscG8',
//                 client_secret:'K0Bu3iC7IZkSWgK4XO9fzJWuyQUzRlWhmQOGHum8IAatEDA7AdH88Xd4YfpGZNlKmgbuLexewerwvkKPsaaSAtIjPg408e7xgisQFtXkTNcLeN7CcsXn3gftMTuzO7El',
//             }
//         setLoading(true);
//         try {
//             console.info(user)
//             let res = await APIs.post(endpoints['login'],formData,{
//                 headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//             });
//             console.info(res.data);
            
//             await AsyncStorage.setItem("token", res.data.access_token);
            
//             setTimeout(async () => {
//                 let user = await authApi(res.data.access_token).get(endpoints['current-user']);
//                 console.info(user.data);

//                 dispatch({
//                     'type': "login",
//                     'payload': user.data
//                 })
//             }, 100);

          

            
//         } catch (ex) {
//             console.error("Lỗi cur",ex.request);
//         } finally {
//             setLoading(false);
//         }   
//     }
    


//     return (
//         <View style={[StyleAll.container]}>
//             <View style={styles.center}>
//                  <Text style={styles.tieude}>Ethereal_Travel</Text>
//             </View>
//             <View style={styles.center}>
//                  <Text style={styles.title}>Đăng nhập</Text>
//             </View>
            
//             <View style={{marginTop:20, marginLeft:25, marginRight:25,marginBottom:10}}>
//                    <TextInput placeholder="Tên đăng nhập" style={styles.input} left={<TextInput.Icon icon='id-card' />} onChangeText={(value)=>setUsername(value)}></TextInput>
//             </View>
           
//            <View >
                
//                  <View style={{ marginLeft:25, marginRight:25}}>
                    
//                      <TextInput placeholder="Mật khẩu" secureTextEntry={true} style={styles.input} left={<TextInput.Icon icon='lock' />} onChangeText={(value)=>setPassword(value)}></TextInput>
//                  </View>
//                  <TouchableOpacity
//                     style={styles.forgotPasswordContainer}
//                     onPress={() => navigation.navigate("Forgot")}
//                 >
//                     <Text style={styles.forgotPasswordText}>Quên mật khẩu <Icon source="lock-reset" size={17} color="#007bff"/></Text>
//                 </TouchableOpacity>
//                  <TouchableOpacity style={styles.button} onPress={()=>{login(), navigation.navigate("Home")}} >
//                      <Text style={{fontSize:18, fontWeight:'bold', marginTop:10, marginLeft:40}}>Đăng nhập</Text>
//                  </TouchableOpacity>
//             </View>
//             <View>
//                 <Image style={styles.tinyLogo} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132381/Ethereal_Travel_1_ysgitt.png'}}/>
//             </View>
//             <View>
//                 <Image style={styles.tinyLogo1} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132424/Ethereal_Travel_2_wc4hjg.png'}}/>
//             </View>
           
//         </View>
        
//     );

// }
// const styles= StyleSheet.create({
//     container:{
//         flex:1,
//         backgroundColor:'white',
//         paddingHorizontal:30
//     },tinyLogo: {
//         marginTop:20,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },tinyLogo1: {
//         marginTop:5,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },
//     tieude:{
//         fontWeight:'bold',
//         fontSize:30, 
//         marginTop:10, 
//         color:'black',
//     },
//     button:{
//         backgroundColor:"#b2dbbf",
//         color:"white",
//         textAlign:"center",
//         marginTop:20,
//         height:45,
//         width:160,
//         marginLeft:230,
//         borderRadius:20
//     },
//     center:{alignItems:'center'},
//     title:{
//         fontWeight:'bold',
//         fontSize:30, 
//         color:'black'
//     },form:{
//         marginTop:30
//     },input: {
//         marginBottom: 15,
//         backgroundColor: 'white',
//     },alertTitle: {
//         color: 'red', // Change the title color
//       },
//       alertMessage: {
//         color: 'blue', // Change the message color
//       },
//       alertButton: {
//         color: 'green', // Change the button color
//       },
//       forgotPasswordContainer: {
//         alignItems: 'flex-end', // Đặt "Quên mật khẩu?" ở bên phải
//         marginRight: 25,
//         marginTop: 5, // Khoảng cách nhỏ giữa input mật khẩu và dòng chữ
//         marginBottom: 15, // Khoảng cách giữa dòng chữ và nút đăng nhập
//     },
//     forgotPasswordText: {
//         color: '#007bff', // Màu xanh dương (thường dùng cho link)
//         fontSize: 14,
//     },
//     });
    
// export default Login1;



// import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Button, Icon, TextInput } from "react-native-paper";
// import React, { useContext, useState } from "react"; // Import useState
// import APIs, { authApi, endpoints } from "../../config/APIs";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { MyDispatchContext } from "../../config/context";
// import StyleAll from "../../style/StyleAll";
// import StyleLogin from "../../style/StyleLogin";
// import { useNavigation } from "@react-navigation/native";


// const Login1 = () => {
//     const [user, setUser] = React.useState({});
//     const [username, setUsername] = React.useState('');
//     const [password, setPassword] = React.useState('');
//     const navigation = useNavigation();
//     const [loading, setLoading] = React.useState(false);
//     const dispatch = useContext(MyDispatchContext);
//     const [loginFailed, setLoginFailed] = useState(false); // State để theo dõi lỗi đăng nhập

//     const updateSate = (field, value) => {
//         setUser(current => {
//             return {...current, [field]: value}
//         });
//     }

//     const login = async () => {
//         let formData={
//             username:username,
//             password:password,
//             grant_type:'password',
//             client_id:'6jeYQgqQQJ1r9WFuuqFMs3WHAQ0QT0IzHFjHscG8',
//             client_secret:'K0Bu3iC7IZkSWgK4XO9fzJWuyQUzRlWhmQOGHum8IAatEDA7AdH88Xd4YfpGZNlKmgbuLexewerwvkKPsaaSAtIjPg408e7xgisQFtXkTNcLeN7CcsXn3gftMTuzO7El',
//         }
//         setLoading(true);
//         setLoginFailed(false); // Reset trạng thái lỗi trước mỗi lần đăng nhập
//         try {
//             console.info(user)
//             let res = await APIs.post(endpoints['login'],formData,{
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.info(res.data);

//             await AsyncStorage.setItem("token", res.data.access_token);

//             setTimeout(async () => {
//                 let user = await authApi(res.data.access_token).get(endpoints['current-user']);
//                 console.info(user.data);

//                 dispatch({
//                     'type': "login",
//                     'payload': user.data
//                 })
//                 navigation.navigate("Home"); // Chuyển hướng khi đăng nhập thành công
//             }, 100);


//         } catch (ex) {
//             setLoginFailed(true); // Cập nhật trạng thái lỗi
//         } finally {
//             setLoading(false);
//         }
//     }


//     return (
//         <View style={[StyleAll.container]}>
//             <View style={styles.center}>
//                     <Text style={styles.tieude}>Ethereal_Travel</Text>
//             </View>
//             <View style={styles.center}>
//                     <Text style={styles.title}>Đăng nhập</Text>
//             </View>
//             {loginFailed && (
//                 <View style={styles.errorContainer}>
//                     <Text style={styles.errorText}>Sai tên đăng nhập hoặc mật khẩu.</Text>
//                 </View>
//             )}

//             <View style={{marginTop:20, marginLeft:25, marginRight:25,marginBottom:10}}>
//                     <TextInput placeholder="Tên đăng nhập" style={styles.input} left={<TextInput.Icon icon='id-card' />} onChangeText={(value)=>setUsername(value)}></TextInput>
//             </View>

//             <View >

//                     <View style={{ marginLeft:25, marginRight:25}}>

//                             <TextInput placeholder="Mật khẩu" secureTextEntry={true} style={styles.input} left={<TextInput.Icon icon='lock' />} onChangeText={(value)=>setPassword(value)}></TextInput>
//                     </View>
//                     <TouchableOpacity
//                         style={styles.forgotPasswordContainer}
//                         onPress={() => navigation.navigate("Forgot")}
//                     >
//                         <Text style={styles.forgotPasswordText}>Quên mật khẩu <Icon source="lock-reset" size={17} color="#007bff"/></Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
//                         <Text style={{fontSize:17, fontWeight:'bold', marginTop:10, marginLeft:50}}>{loading ? '...' : 'Đăng nhập'}</Text>
//                     </TouchableOpacity>
//             </View>
            
//             <View>
//                     <Image style={styles.tinyLogo} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132381/Ethereal_Travel_1_ysgitt.png'}}/>
//             </View>
//             <View>
//                     <Image style={styles.tinyLogo1} source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728132424/Ethereal_Travel_2_wc4hjg.png'}}/>
//             </View>

//         </View>

//     );

// }
// const styles= StyleSheet.create({
//     container:{
//         flex:1,
//         backgroundColor:'white',
//         paddingHorizontal:30
//     },tinyLogo: {
//         marginTop:20,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },tinyLogo1: {
//         marginTop:5,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },
//     tieude:{
//         fontWeight:'bold',
//         fontSize:30,
//         marginTop:10,
//         color:'black',
//     },
//     button:{
//         backgroundColor:"#b2dbbf",
//         color:"white",
//         textAlign:"center",
//         marginTop:20,
//         height:45,
//         width:180,
//         marginLeft:220,
//         borderRadius:20
//     },
//     center:{alignItems:'center'},
//     title:{
//         fontWeight:'bold',
//         fontSize:30,
//         color:'black'
//     },form:{
//         marginTop:30
//     },input: {
//         marginBottom: 15,
//         backgroundColor: 'white',
//     },alertTitle: {
//         color: 'red', // Change the title color
//       },
//       alertMessage: {
//         color: 'blue', // Change the message color
//       },
//       alertButton: {
//         color: 'green', // Change the button color
//       },
//       forgotPasswordContainer: {
//         alignItems: 'flex-end', // Đặt "Quên mật khẩu?" ở bên phải
//         marginRight: 25,
//         marginTop: 5, // Khoảng cách nhỏ giữa input mật khẩu và dòng chữ
//         marginBottom: 15, // Khoảng cách giữa dòng chữ và nút đăng nhập
//     },
//     forgotPasswordText: {
//         color: '#007bff', // Màu xanh dương (thường dùng cho link)
//         fontSize: 14,
//     },
//     errorContainer: {
//         backgroundColor: '#ffebee',
//         padding: 10,
//         borderRadius: 5,
//         marginHorizontal: 25,
//         marginTop: 10,
//     },
//     errorText: {
//         color: '#d32f2f',
//         textAlign: 'center',
//     },
//     });

// export default Login1;


import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button, Icon, TextInput } from "react-native-paper";
import React, { useContext, useState, useCallback } from "react"; // Import useCallback
import APIs, { authApi, endpoints } from "../../config/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MyDispatchContext } from "../../config/context";
import StyleAll from "../../style/StyleAll";
import StyleLogin from "../../style/StyleLogin";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect


const Login1 = () => {
  const [user, setUser] = React.useState({});
  const [username, setUsername] = useState(''); // Sử dụng useState
  const [password, setPassword] = useState(''); // Sử dụng useState
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useContext(MyDispatchContext);
  const [loginFailed, setLoginFailed] = useState(false); // State để theo dõi lỗi đăng nhập

  const updateSate = (field, value) => {
    setUser(current => {
      return {...current, [field]: value}
    });
  }

  const login = async () => {
    let formData={
      username:username,
      password:password,
      grant_type:'password',
      client_id:'6jeYQgqQQJ1r9WFuuqFMs3WHAQ0QT0IzHFjHscG8',
      client_secret:'K0Bu3iC7IZkSWgK4XO9fzJWuyQUzRlWhmQOGHum8IAatEDA7AdH88Xd4YfpGZNlKmgbuLexewerwvkKPsaaSAtIjPg408e7xgisQFtXkTNcLeN7CcsXn3gftMTuzO7El',
    }
    setLoading(true);
    setLoginFailed(false); // Reset trạng thái lỗi trước mỗi lần đăng nhập
    try {
      console.info(user)
      let res = await APIs.post(endpoints['login'],formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.info(res.data);

      await AsyncStorage.setItem("token", res.data.access_token);

      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(endpoints['current-user']);
        console.info(user.data);

        dispatch({
          'type': "login",
          'payload': user.data
        })
        navigation.navigate("Home"); // Chuyển hướng khi đăng nhập thành công
      }, 100);


    } catch (ex) {
      setLoginFailed(true); // Cập nhật trạng thái lỗi
    } finally {
      setLoading(false);
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
        // Không có cleanup đặc biệt
      };
    }, []) // Dependency array rỗng vì không phụ thuộc vào state nào để reset
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
          <Text style={{fontSize:17, fontWeight:'bold', marginTop:10, marginLeft:50}}>{loading ? '...' : 'Đăng nhập'}</Text>
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
    color: 'red', // Change the title color
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