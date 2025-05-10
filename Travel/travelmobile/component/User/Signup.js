
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import StyleAll from "../../style/StyleAll";
// import { Alert, StatusBar, TouchableOpacity, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from "react-native";
// import { Button, Icon, IconButton, TextInput } from "react-native-paper";

// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from 'expo-file-system';

// const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
// const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [cemail, setCEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [address, setAddress] = useState('');
//   const [sdt, setSDT] = useState('');
//   const [first_name, setFN] = useState('');
//   const [last_name, setLN] = useState('');
//   const nav = useNavigation();
//   const [image, setImage] = useState(null); // State cho đường dẫn ảnh
//   const [uploading, setUploading] = useState(false); // State cho trạng thái tải lên

//   const uploadImageToCloudinary = async (uri) => {
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', {
//         uri: uri,
//         name: 'avatar.jpg', // Tên file mặc định
//         type: 'image/jpeg', // Loại file mặc định
//       });
//       formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
//         headers: {
//           "Content-Type": 'multipart/form-data'
//         }
//       });

//       if (response.data && response.data.secure_url) {
//         const parts = response.data.secure_url.split(`/v${response.data.version}/`);
//         setImage(parts.length > 1 ? parts[1] : response.data.secure_url);
//         return response.data.secure_url;
//       } else {
//         Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên Cloudinary.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Lỗi tải ảnh lên Cloudinary:", error.request);
//       Alert.alert("Lỗi tải ảnh", "Đã có lỗi xảy ra khi tải ảnh lên.");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Quyền truy cập bị từ chối", "Ứng dụng cần quyền truy cập thư viện ảnh.");
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1], // Hình vuông cho avatar
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       uploadImageToCloudinary(result.assets[0].uri);
//     }
//   };

//   const onSubmit = () => {
//     let formData = {
//       email: email,
//       address: address,
//       sdt: sdt,
//       first_name: first_name,
//       last_name: last_name,
//       username: username,
//       password: password,
//       avatar: image, // Thêm đường dẫn ảnh vào form data
//     };

//     axios.post('https://thuylinh.pythonanywhere.com/Customer/', formData)
//       .then((response) => console.log(response))
//       .catch((err) => console.error(err.request));

//     setTimeout(() => {
//       nav.navigate('login');
//     }, 1000);
//   }
//   const log = () => {
//     nav.navigate("Home")
//   }

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 200, backgroundColor: 'white' }}>
//         <Image
//           style={styles.coverImage}
//           source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/image/upload/v1743611671/Screenshot_2025-04-02_233251_z71xq5.png` }}
//         />
//         <View style={styles.center}>
//           <Text style={styles.tieude}>Đăng ký</Text>
//         </View>
//         <SafeAreaView style={styles.container}>
//           <View style={StyleAll.container}>
//             <View style={styles.avatarContainer}>
//               {image ? (
//                 <Image source={{ uri: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${image}` }} style={styles.avatar} />
//               ) : (
//                 <View style={styles.defaultAvatar}>
//                   <Icon name="account-circle-outline" size={60} color="#777" />
//                 </View>
//               )}
//               <Button mode="outlined" onPress={pickImage} style={styles.pickAvatarButton} loading={uploading} disabled={uploading}>
//                 Chọn Avatar
//               </Button>
//               {uploading && <ActivityIndicator style={styles.uploadIndicator} size="small" />}
//             </View>

//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Email" style={styles.input} right={<TextInput.Icon icon='email-outline' />} onChangeText={(value) => setEmail(value)}></TextInput>
//             </View>
//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Địa chỉ" style={styles.input} right={<TextInput.Icon icon='home-city-outline' />} onChangeText={(value) => setAddress(value)}></TextInput>
//             </View>
//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Số điện thoại" right={<TextInput.Icon icon='cellphone-basic' />} style={styles.input} onChangeText={(value) => setSDT(value)}></TextInput>
//             </View>

//             <View style={[{ flexDirection: "row" }, StyleAll.container2]}>
//               <TextInput placeholder="Tên" style={[styles.input, { flex: 1, marginRight: 10 }]} right={<TextInput.Icon icon='card-account-details-outline' />} onChangeText={(value) => setFN(value)}></TextInput>
//               <TextInput placeholder="Họ" style={[styles.input, { flex: 1 }]} right={<TextInput.Icon icon='card-account-details-outline' />} onChangeText={(value) => setLN(value)}></TextInput>
//             </View>

//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Username" style={styles.input} right={<TextInput.Icon icon='account-check-outline' />} onChangeText={(value) => setUsername(value)}></TextInput>
//             </View>
//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Mật khẩu" style={styles.input} right={<TextInput.Icon icon='eye' />} secureTextEntry={true} onChangeText={(value) => setPassword(value)}>
//               </TextInput>
//             </View>
//             <View style={StyleAll.container1}>
//               <TextInput placeholder="Xác nhận mật khẩu" right={<TextInput.Icon icon='eye' />} style={styles.input} secureTextEntry={true} onChangeText={(value) => setPassword(value)}></TextInput>
//             </View>
//           </View>
//           <Button style={styles.Button}
//             icon={() => <Icon name="right-from-bracket" size={20} color="white" />}
//             mode="contained"
//             onPress={() => { onSubmit(), log }}>
//             <Text style={{ fontSize: 18 }}>Đăng ký</Text>
//           </Button>
//         </SafeAreaView>
//         <View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   )
// }
// const styles = StyleSheet.create({
//   coverImage: {
//     height: 200,
//     width: '120%',
//     resizeMode: 'cover',
//   },
//   container: {
//     backgroundColor: 'white',
//     paddingHorizontal: 20
//   },
//   input: {
//     marginBottom: 15,
//     backgroundColor: 'white',
//   },
//   tieude: {
//     fontWeight: 'bold',
//     fontSize: 35,
//     color: '#008080',
//     marginTop: 10
//   },
//   Button: {
//     marginHorizontal: 80,
//     paddingVertical: 8,
//   },
//   center: { alignItems: 'center' },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   defaultAvatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#ddd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pickAvatarButton: {
//     marginBottom: 10,
//   },
//   uploadIndicator: {
//     marginTop: 10,
//   }
// });
// export default Signup;


import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import axios from "axios";
import { useState, useCallback } from "react"; // Import useCallback
import { SafeAreaView } from "react-native-safe-area-context";
import StyleAll from "../../style/StyleAll";
import { Alert, StatusBar, TouchableOpacity, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from "react-native";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [cemail, setCEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [sdt, setSDT] = useState('');
  const [first_name, setFN] = useState('');
  const [last_name, setLN] = useState('');
  const nav = useNavigation();
  const [image, setImage] = useState(null); // State cho đường dẫn ảnh
  const [uploading, setUploading] = useState(false); // State cho trạng thái tải lên

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'avatar.jpg', // Tên file mặc định
        type: 'image/jpeg', // Loại file mặc định
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });

      if (response.data && response.data.secure_url) {
        const parts = response.data.secure_url.split(`/v${response.data.version}/`);
        setImage(parts.length > 1 ? parts[1] : response.data.secure_url);
        return response.data.secure_url;
      } else {
        Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên Cloudinary.");
        return null;
      }
    } catch (error) {
      console.error("Lỗi tải ảnh lên Cloudinary:", error.request);
      Alert.alert("Lỗi tải ảnh", "Đã có lỗi xảy ra khi tải ảnh lên.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền truy cập bị từ chối", "Ứng dụng cần quyền truy cập thư viện ảnh.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Hình vuông cho avatar
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      uploadImageToCloudinary(result.assets[0].uri);
    }
  };

  const onSubmit = () => {
    let formData = {
      email: email,
      address: address,
      sdt: sdt,
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
      avatar: image, // Thêm đường dẫn ảnh vào form data
    };

    axios.post('https://thuylinh.pythonanywhere.com/Customer/', formData)
      .then((response) => console.log(response))
      .catch((err) => console.error(err.request));

    setTimeout(() => {
      nav.navigate('login');
    }, 1000);
  }
  const log = () => {
    nav.navigate("Home")
  }

  const resetForm = () => {
    setEmail('');
    setCEmail('');
    setPassword('');
    setUsername('');
    setAddress('');
    setSDT('');
    setFN('');
    setLN('');
    setImage(null);
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
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 200, backgroundColor: 'white' }}>
        <Image
          style={styles.coverImage}
          source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/image/upload/v1743611671/Screenshot_2025-04-02_233251_z71xq5.png` }}
        />
        <View style={styles.center}>
          <Text style={styles.tieude}>Đăng ký</Text>
        </View>
        <SafeAreaView style={styles.container}>
          <View style={StyleAll.container}>
            <View style={styles.avatarContainer}>
              {image ? (
                <Image source={{ uri: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${image}` }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Icon name="account-circle-outline" size={60} color="#777" />
                </View>
              )}
              <Button mode="outlined" onPress={pickImage} style={styles.pickAvatarButton} loading={uploading} disabled={uploading}>
                Chọn Avatar
              </Button>
              {uploading && <ActivityIndicator style={styles.uploadIndicator} size="small" />}
            </View>

            <View style={StyleAll.container1}>
              <TextInput placeholder="Email" style={styles.input} right={<TextInput.Icon icon='email-outline' />} onChangeText={(value) => setEmail(value)} value={email}></TextInput>
            </View>
            <View style={StyleAll.container1}>
              <TextInput placeholder="Địa chỉ" style={styles.input} right={<TextInput.Icon icon='home-city-outline' />} onChangeText={(value) => setAddress(value)} value={address}></TextInput>
            </View>
            <View style={StyleAll.container1}>
              <TextInput placeholder="Số điện thoại" right={<TextInput.Icon icon='cellphone-basic' />} style={styles.input} onChangeText={(value) => setSDT(value)} value={sdt}></TextInput>
            </View>

            <View style={[{ flexDirection: "row" }, StyleAll.container2]}>
              <TextInput placeholder="Tên" style={[styles.input, { flex: 1, marginRight: 10 }]} right={<TextInput.Icon icon='card-account-details-outline' />} onChangeText={(value) => setFN(value)} value={first_name}></TextInput>
              <TextInput placeholder="Họ" style={[styles.input, { flex: 1 }]} right={<TextInput.Icon icon='card-account-details-outline' />} onChangeText={(value) => setLN(value)} value={last_name}></TextInput>
            </View>

            <View style={StyleAll.container1}>
              <TextInput placeholder="Username" style={styles.input} right={<TextInput.Icon icon='account-check-outline' />} onChangeText={(value) => setUsername(value)} value={username}></TextInput>
            </View>
            <View style={StyleAll.container1}>
              <TextInput placeholder="Mật khẩu" style={styles.input} right={<TextInput.Icon icon='eye' />} secureTextEntry={true} onChangeText={(value) => setPassword(value)} value={password}>
              </TextInput>
            </View>
            <View style={StyleAll.container1}>
              <TextInput placeholder="Xác nhận mật khẩu" right={<TextInput.Icon icon='eye' />} style={styles.input} secureTextEntry={true} onChangeText={(value) => setPassword(value)} value={password}></TextInput>
            </View>
          </View>
          <Button style={styles.Button}
            icon={() => <Icon name="right-from-bracket" size={20} color="white" />}
            mode="contained"
            onPress={() => { onSubmit(), log }}>
            <Text style={{ fontSize: 18 }}>Đăng ký</Text>
          </Button>
        </SafeAreaView>
        <View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  coverImage: {
    height: 200,
    width: '120%',
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  tieude: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#008080',
    marginTop: 10
  },
  Button: {
    marginHorizontal: 80,
    paddingVertical: 8,
  },
  center: { alignItems: 'center' },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickAvatarButton: {
    marginBottom: 10,
  },
  uploadIndicator: {
    marginTop: 10,
  }
});
export default Signup;