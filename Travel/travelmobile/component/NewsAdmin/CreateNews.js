// // screens/CreateNewsScreen.js
// import React, { useContext, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Image,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker'; // hoặc import ImagePicker từ 'react-native-image-picker'
// import axios from 'axios';
// import { MyUserContext } from '../../config/context';

// // --- Cấu hình Cloudinary của bạn ---
// const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
// const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// // --- Cấu hình API Django của bạn ---

// const CreateNewsScreen = ({ navigation }) => {
//   const [newsName, setNewsName] = useState('');
//   const [content, setContent] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null); // Lưu URI ảnh đã chọn
//   const [isLoading, setIsLoading] = useState(false);
  

//   // Lấy ID Admin từ đâu đó (ví dụ: từ context/redux store sau khi đăng nhập)
//   // Đây là một giả định, bạn cần thay thế nó bằng cách lấy admin_id thực tế của bạn
//   const user= useContext(MyUserContext); // Thay bằng ID của admin đang tạo tin tức (ví dụ: từ user.id sau khi đăng nhập)

//   const pickImage = async () => {
//     // Yêu cầu quyền truy cập thư viện ảnh
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Quyền truy cập thư viện', 'Cần quyền truy cập thư viện ảnh để chọn ảnh.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const uploadImageToCloudinary = async (imageUri) => {
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append('file', {
//       uri: imageUri,
//       type: 'image/jpeg', // hoặc 'image/png' tùy định dạng
//       name: `news_image_${Date.now()}.jpg`,
//     });
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setIsLoading(false);
//       return response.data.secure_url; // Trả về URL ảnh an toàn từ Cloudinary
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Lỗi khi tải ảnh lên Cloudinary:', error.response?.data || error.message);
//       Alert.alert('Lỗi tải ảnh', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
//       return null;
//     }
//   };

//   const createNews = async () => {
//     if (!newsName || !content || !selectedImage) {
//       Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tên tin tức, nội dung và chọn ảnh.');
//       return;
//     }

//     setIsLoading(true);
//     let imageUrl = null;

//     try {
//       // 1. Tải ảnh lên Cloudinary trước
//       imageUrl = await uploadImageToCloudinary(selectedImage);
//       if (!imageUrl) {
//         // Lỗi tải ảnh đã được xử lý bên trong uploadImageToCloudinary
//         return;
//       }

//       // 2. Gửi dữ liệu News lên API Django
//       const newsData = {
//         Name_News: newsName,
//         image_thumbnail: imageUrl, // URL ảnh từ Cloudinary
//         content: content,
//         admin_id: user.id, // ID admin người tạo
//       };

    
//       const headers = {
//         'Content-Type': 'application/json',
//         // 'Authorization': `Bearer ${token}`, // Bỏ comment nếu cần auth
//       };

//       const response = await axios.post(`https://thuylinh.pythonanywhere.com/News/`, newsData, { headers });

//       setIsLoading(false);
//       if (response.status === 201) {
//         Alert.alert('Thành công', 'Tin tức đã được tạo thành công!');
//         setNewsName('');
//         setContent('');
//         setSelectedImage(null);
//         // navigation.goBack();
//       } else {
//         Alert.alert('Lỗi', 'Không thể tạo tin tức. Vui lòng thử lại.');
//         console.error('Lỗi API Django:', response.data);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Lỗi khi tạo tin tức:', error.response?.data || error.message);
//       Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.response?.data?.detail || error.message}`);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>Tên Tin tức:</Text>
//       <TextInput
//         style={styles.input}
//         value={newsName}
//         onChangeText={setNewsName}
//         placeholder="Nhập tên tin tức"
//       />

//       <Text style={styles.label}>Nội dung:</Text>
//       <TextInput
//         style={[styles.input, styles.textArea]}
//         value={content}
//         onChangeText={setContent}
//         placeholder="Nhập nội dung tin tức"
//         multiline
//         numberOfLines={5}
//       />

//       <Button title="Chọn Ảnh" onPress={pickImage} />
//       {selectedImage && (
//         <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
//       )}

//       {isLoading ? (
//         <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
//       ) : (
//         <Button title="Tạo Tin tức" onPress={createNews} />
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginTop: 15,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   loadingIndicator: {
//     marginTop: 20,
//   },
// });

// export default CreateNewsScreen;


// screens/CreateNewsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity, // Import TouchableOpacity để tạo nút tùy chỉnh
  Platform, // Dùng để xử lý shadow riêng cho iOS/Android
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MyUserContext } from '../../config/context';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icon để dùng trong nút chọn ảnh

// --- Cấu hình Cloudinary của bạn ---
const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// --- Cấu hình API Django của bạn ---
const API_BASE_URL = 'https://thuylinh.pythonanywhere.com'; // Đặt base URL ở đây để dễ quản lý

const CreateNewsScreen = ({ navigation }) => {
  const [newsName, setNewsName] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useContext(MyUserContext); // Lấy thông tin người dùng từ context

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập thư viện', 'Cần quyền truy cập thư viện ảnh để chọn ảnh.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // hoặc 'image/png' tùy định dạng
      name: `news_image_${Date.now()}.jpg`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);
      return response.data.secure_url; // Trả về URL ảnh an toàn từ Cloudinary
    } catch (error) {
      setIsLoading(false);
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error.response?.data || error.message);
      Alert.alert('Lỗi tải ảnh', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return null;
    }
  };

  const createNews = async () => {
    if (!newsName.trim() || !content.trim() || !selectedImage) { // Dùng .trim() để loại bỏ khoảng trắng thừa
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tên tin tức, nội dung và chọn ảnh.');
      return;
    }

    setIsLoading(true);
    let imageUrl = null;

    try {
      // 1. Tải ảnh lên Cloudinary trước
      imageUrl = await uploadImageToCloudinary(selectedImage);
      if (!imageUrl) {
        // Lỗi tải ảnh đã được xử lý bên trong uploadImageToCloudinary
        setIsLoading(false); // Đảm bảo isLoading được đặt lại
        return;
      }

      // 2. Gửi dữ liệu News lên API Django
      const newsData = {
        Name_News: newsName,
        image_thumbnail: imageUrl, // URL ảnh từ Cloudinary
        content: content,
        admin_id: user?.id, // ID admin người tạo (đảm bảo user và user.id tồn tại)
      };

      const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${user?.token}`, // Bỏ comment và thêm token nếu cần auth
      };

      const response = await axios.post(`${API_BASE_URL}/News/`, newsData, { headers });

      setIsLoading(false);
      if (response.status === 201) {
        Alert.alert('Thành công', 'Tin tức đã được tạo thành công!', [
          { text: "OK", onPress: () => navigation.goBack() } // Quay về màn hình trước sau khi tạo thành công
        ]);
        setNewsName('');
        setContent('');
        setSelectedImage(null);
      } else {
        Alert.alert('Lỗi', 'Không thể tạo tin tức. Vui lòng thử lại.');
        console.error('Lỗi API Django:', response.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Lỗi khi tạo tin tức:', error.response?.data || error.message);
      Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tạo Tin Tức Mới</Text>
        <Text style={styles.headerSubtitle}>Điền thông tin chi tiết về tin tức</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Tên Tin tức:</Text>
        <TextInput
          style={styles.input}
          value={newsName}
          onChangeText={setNewsName}
          placeholder="Ví dụ: Khám phá địa điểm du lịch mới..."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nội dung:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Viết nội dung chi tiết của tin tức ở đây..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={6} // Tăng số dòng mặc định
        />

        {/* Image Picker */}
        <Text style={styles.label}>Ảnh đại diện:</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} activeOpacity={0.8}>
          <MaterialCommunityIcons name="image-plus" size={24} color="#FFF" />
          <Text style={styles.imagePickerButtonText}>
            {selectedImage ? 'Thay đổi ảnh' : 'Chọn ảnh bìa cho tin tức'}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
              <MaterialCommunityIcons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={createNews}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.createButtonText}>Tạo Tin tức</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F9FC', // Nền tổng thể nhẹ nhàng, hiện đại
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#4CAF50', // Màu xanh lá cây nổi bật
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
    ...Platform.select({ // Shadow đẹp hơn cho header
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    opacity: 0.9,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // Đậm hơn một chút
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D9E6', // Viền màu sáng hơn
    borderRadius: 10, // Bo tròn nhiều hơn
    padding: 14, // Tăng padding
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF', // Nền input trắng
    ...Platform.select({ // Shadow nhẹ cho input
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textArea: {
    height: 150, // Tăng chiều cao textArea
    textAlignVertical: 'top', // Căn trên cho Android
    paddingTop: 14, // Đảm bảo text không bị sát mép trên
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF', // Màu xanh dương cho nút chọn ảnh
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imagePickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10, // Khoảng cách giữa icon và text
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden', // Đảm bảo ảnh không tràn ra ngoài bo tròn
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imagePreview: {
    width: '100%',
    height: 220, // Tăng chiều cao ảnh preview
    resizeMode: 'cover',
    borderRadius: 10, // Bo tròn ảnh preview
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng hơi trong suốt
    borderRadius: 20,
    padding: 2,
  },
  createButton: {
    backgroundColor: '#28A745', // Màu xanh lá cây cho nút tạo
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Khoảng cách với ảnh hoặc input cuối
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  createButtonDisabled: {
    backgroundColor: '#A5D6A7', // Màu nhạt hơn khi disabled
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CreateNewsScreen;