// import React, { useContext, useState } from "react";
// import * as Permissions from 'expo-permissions'; // Đổi tên để tránh xung đột với Locationn
// import * as Locationn from 'expo-location';
// import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
// import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native"; // Thêm ActivityIndicator cho trạng thái tải ảnh
// import axios from "axios";
// import { MyUserContext } from "../../config/context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";

// // Cấu hình Cloudinary (THAY THẾ BẰNG THÔNG TIN CỦA BẠN)
// const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
// const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// const Location = () => {
//     const [location, setLocation] = React.useState('');
//     const [loc, setLoc] = React.useState([]);
//     const [loading, setLoading] = React.useState(false);
//     const [imageUri, setImageUri] = React.useState(null); // State để lưu URI của ảnh đã chọn
//     const [uploadingImage, setUploadingImage] = React.useState(false); // State cho trạng thái tải ảnh lên Cloudinary
//     const user = useContext(MyUserContext);
//     const [token, setToken] = React.useState('');
//     const nav = useNavigation();
//     const [content, setContent] = React.useState(''); // State cho nội dung kỷ niệm

//     let locc = '';

//     // Hàm chọn ảnh từ thư viện
//     const pickImage = async () => {
//         let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Quyền truy cập thư viện ảnh', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh.');
//             return;
//         }

//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         console.log(result);

//         if (!result.canceled) {
//             setImageUri(result.assets[0].uri);
//         }
//     };

//     // Hàm tải ảnh lên Cloudinary
//     const uploadImageToCloudinary = async (uri) => {
//         setUploadingImage(true);
//         const formData = new FormData();
//         formData.append('file', {
//             uri: uri,
//             type: 'image/jpeg', // Hoặc 'image/png' tùy loại ảnh
//             name: 'upload.jpg',
//         });
//         formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//         try {
//             const response = await axios.post(
//                 `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             setUploadingImage(false);
//             return response.data.secure_url; // Trả về URL an toàn của ảnh
//         } catch (error) {
//             setUploadingImage(false);
//             console.error("Lỗi khi tải ảnh lên Cloudinary:", error.response || error.message);
//             Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.");
//             return null;
//         }
//     };

//     const getLocationAndSaveMemory = async () => {
//         setLoading(true);
//         let imageUrl = null;

//         // BƯỚC 1: Tải ảnh lên Cloudinary nếu có ảnh được chọn
//         if (imageUri) {
//             imageUrl = await uploadImageToCloudinary(imageUri);
//             if (!imageUrl) {
//                 setLoading(false);
//                 return; // Dừng nếu tải ảnh thất bại
//             }
//         }

//         // BƯỚC 2: Lấy vị trí
//         let { status } = await Locationn.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//             setLocation({ errMsg: 'Quyền định vị chưa được cấp' });
//             Alert.alert('Lỗi quyền', 'Bạn cần cấp quyền truy cập vị trí để lưu kỷ niệm.');
//             setLoading(false);
//             return;
//         }

//         try {
//             const currentLocation = await Locationn.getCurrentPositionAsync({});
//             setLoc(currentLocation);
//             locc = currentLocation; // Gán giá trị để sử dụng trong formData nếu cần
//             setLocation(`${currentLocation.coords.longitude}-${currentLocation.coords.latitude}`);

//             const storedToken = await AsyncStorage.getItem("token");
//             setToken(storedToken);
//             console.warn("Token khi gửi vị trí:", storedToken);

//             let formData = {
//                 latitude: `${currentLocation.coords.latitude}`,
//                 longitude: `${currentLocation.coords.longitude}`,
//                 content: content,
//                 user: `${user.id}`,
//                 image: imageUrl, // Đưa URL ảnh từ Cloudinary vào trường image
//             };
            
//             // BƯỚC 3: Gửi dữ liệu kỷ niệm lên server của bạn
//             let res = await axios.post(`https://thuylinh.pythonanywhere.com/Memory/`, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${storedToken}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//             console.warn("Phản hồi từ server:", res.data);

//             Alert.alert('Thành công', 'Vị trí và kỷ niệm của bạn đã được lưu lại!');
//             setContent(''); // Reset nội dung
//             setImageUri(null); // Reset ảnh
//             nav.navigate('Memory');

//         } catch (ex) {
//             console.error("Lỗi khi lấy vị trí hoặc gửi dữ liệu kỷ niệm:", ex.response ? ex.response.data : ex.message);
//             Alert.alert('Lỗi', `Đã xảy ra lỗi khi lưu kỷ niệm: ${ex.response?.data?.detail || ex.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Lưu Khoảnh Khắc</Text>
//             <Text style={styles.description}>
//                 Lưu lại vị trí đặc biệt của bạn và một dòng ký ức tại nơi đó.
//                 Khi bạn quay lại, chúng tôi sẽ gợi nhớ kỷ niệm này!
//             </Text>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Nội dung kỷ niệm:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Nhập kỷ niệm tại đây..."
//                     value={content}
//                     onChangeText={setContent}
//                     multiline
//                     numberOfLines={3}
//                 />
//             </View>

//             {/* Nút chọn ảnh */}
//             <TouchableOpacity
//                 style={styles.pickImageButton}
//                 onPress={pickImage}
//                 disabled={loading || uploadingImage} // Không cho chọn ảnh khi đang xử lý
//             >
//                 <Text style={styles.pickImageButtonText}>
//                     {imageUri ? "Chọn ảnh khác" : "Chọn ảnh từ thư viện"}
//                 </Text>
//             </TouchableOpacity>

//             {/* Hiển thị ảnh đã chọn */}
//             {imageUri && (
//                 <View style={styles.imagePreviewContainer}>
//                     <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//                 </View>
//             )}

//             {/* Nút gửi */}
//             <TouchableOpacity
//                 style={[styles.button, (loading || uploadingImage) && styles.disabledButton]}
//                 onPress={getLocationAndSaveMemory}
//                 disabled={loading || uploadingImage} // Vô hiệu hóa khi đang gửi hoặc đang tải ảnh
//             >
//                 <Text style={styles.buttonText}>
//                     {loading ? 'Đang lưu kỷ niệm...' : (uploadingImage ? 'Đang tải ảnh...' : 'Lưu kỷ niệm')}
//                 </Text>
//                 {(loading || uploadingImage) && <ActivityIndicator size="small" color="#fff" style={styles.spinner} />}
//             </TouchableOpacity>

//             {/* <View style={{ marginTop: 10 }}>
//                 <Image width={400} height={400} source={{ uri: 'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728244487/Screenshot_2024-10-07_025423_pokcm9.png' }} />
//             </View> */}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f4f4f4',
//         padding: 20,
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         marginTop: 30,
//         marginBottom: 20,
//         color: '#333',
//         textAlign: 'center',
//     },
//     description: {
//         fontSize: 16,
//         color: '#555',
//         textAlign: 'center',
//         marginBottom: 30,
//         paddingHorizontal: 15,
//     },
//     inputContainer: {
//         width: '100%',
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 8,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 12,
//         fontSize: 16,
//         backgroundColor: '#fff',
//         textAlignVertical: 'top',
//     },
//     pickImageButton: {
//         backgroundColor: '#6c757d', // Màu xám cho nút chọn ảnh
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         marginTop: 10,
//         marginBottom: 20,
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 2,
//     },
//     pickImageButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     imagePreviewContainer: {
//         marginTop: 10,
//         marginBottom: 20,
//         width: '90%', // Chiếm gần hết chiều rộng để ảnh không quá nhỏ
//         height: 200, // Chiều cao cố định
//         borderRadius: 10,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: '#ddd',
//         backgroundColor: '#e9e9e9',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     imagePreview: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover', // Đảm bảo ảnh hiển thị đầy đủ trong khung
//     },
//     button: {
//         backgroundColor: '#007bff',
//         flexDirection: 'row', // Để spinner và text nằm cạnh nhau
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//         marginTop: 25,
//         elevation: 3,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'white',
//     },
//     disabledButton: {
//         backgroundColor: '#a0c7ff', // Màu mờ hơn khi disabled
//     },
//     spinner: {
//         marginLeft: 10,
//     },
// });

// export default Location;


import React, { useContext, useState } from "react";
import * as Permissions from 'expo-permissions';
import * as Locationn from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import { MyUserContext } from "../../config/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons

// Cấu hình Cloudinary (THAY THẾ BẰNG THÔNG TIN CỦA BẠN)
const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Đảm bảo đây là unsigned upload preset

const Location = () => {
    const [location, setLocation] = React.useState('');
    const [loc, setLoc] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [imageUri, setImageUri] = React.useState(null);
    const [uploadingImage, setUploadingImage] = React.useState(false);
    const user = useContext(MyUserContext);
    const [token, setToken] = React.useState('');
    const nav = useNavigation();
    const [content, setContent] = React.useState('');

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8, // Giảm chất lượng ảnh để tải lên nhanh hơn
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const uploadImageToCloudinary = async (uri) => {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/jpeg',
            name: 'upload.jpg',
        });
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setUploadingImage(false);
            return response.data.secure_url;
        } catch (error) {
            setUploadingImage(false);
            console.error("Lỗi khi tải ảnh lên Cloudinary:", error.response || error.message);
            Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.");
            return null;
        }
    };

    const getLocationAndSaveMemory = async () => {
        setLoading(true);
        let imageUrl = null;

        if (imageUri) {
            imageUrl = await uploadImageToCloudinary(imageUri);
            if (!imageUrl) {
                setLoading(false);
                return;
            }
        }

        let { status } = await Locationn.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({ errMsg: 'Quyền định vị chưa được cấp' });
            Alert.alert('Cần quyền truy cập vị trí', 'Bạn cần cấp quyền truy cập vị trí để lưu kỷ niệm.');
            setLoading(false);
            return;
        }

        try {
            const currentLocation = await Locationn.getCurrentPositionAsync({});
            const storedToken = await AsyncStorage.getItem("token");
            setToken(storedToken);

            let formData = {
                latitude: `${currentLocation.coords.latitude}`,
                longitude: `${currentLocation.coords.longitude}`,
                content: content,
                user: `${user.id}`,
                image: imageUrl,
            };

            let res = await axios.post(`https://thuylinh.pythonanywhere.com/Memory/`, formData, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
            });

            Alert.alert('Thành công', 'Vị trí và kỷ niệm của bạn đã được lưu lại!');
            setContent('');
            setImageUri(null);
            nav.navigate('Memory');

        } catch (ex) {
            console.error("Lỗi khi lấy vị trí hoặc gửi dữ liệu kỷ niệm:", ex.response ? ex.response.data : ex.message);
            Alert.alert('Lỗi', `Đã xảy ra lỗi khi lưu kỷ niệm: ${ex.response?.data?.detail || ex.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="map-marker-path" size={40} color="#007bff" />
                    <Text style={styles.title}>Lưu Khoảnh Khắc</Text>
                </View>
                <Text style={styles.description}>
                    Ghi lại vị trí đặc biệt cùng những kỷ niệm đáng nhớ của bạn.
                    Chúng tôi sẽ giúp bạn ôn lại những khoảnh khắc ấy!
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Nội dung kỷ niệm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Hôm nay tôi đã..."
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.pickImageButton, (loading || uploadingImage) && styles.disabledButton]}
                    onPress={pickImage}
                    disabled={loading || uploadingImage}
                >
                    <MaterialCommunityIcons name={imageUri ? "image-edit" : "image-plus"} size={24} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.pickImageButtonText}>
                        {imageUri ? "Chọn ảnh khác" : "Thêm ảnh kỷ niệm"}
                    </Text>
                </TouchableOpacity>

                {imageUri && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri(null)}>
                            <MaterialCommunityIcons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, (loading || uploadingImage) && styles.disabledButton]}
                    onPress={getLocationAndSaveMemory}
                    disabled={loading || uploadingImage}
                >
                    {(loading || uploadingImage) ? (
                        <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                    ) : (
                        <MaterialCommunityIcons name="map-marker-check" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                    )}
                    <Text style={styles.buttonText}>
                        {loading ? 'Đang lưu kỷ niệm...' : (uploadingImage ? 'Đang tải ảnh...' : 'Lưu kỷ niệm')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Đảm bảo ScrollView có thể cuộn
        backgroundColor: '#F7F9FC', // Nền sáng hơn, hiện đại hơn
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30, // Đẩy xuống một chút từ mép trên
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50', // Màu tối hơn cho tiêu đề
        marginLeft: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 15,
        lineHeight: 22, // Tăng khoảng cách dòng để dễ đọc hơn
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000', // Đổ bóng cho card
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600', // Đậm hơn một chút
        color: '#333',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0', // Viền nhạt hơn
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#FDFDFD',
        textAlignVertical: 'top',
        minHeight: 100, // Chiều cao tối thiểu cho TextInput nhiều dòng
        color: '#333',
    },
    pickImageButton: {
        backgroundColor: '#1ABC9C', // Màu xanh ngọc bắt mắt
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#1ABC9C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pickImageButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    imagePreviewContainer: {
        marginTop: 10,
        marginBottom: 25,
        width: '100%',
        aspectRatio: 4 / 3, // Giữ tỉ lệ 4:3 cho ảnh
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#E9EEF2', // Màu nền nhẹ cho khung ảnh trống
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        position: 'relative', // Để nút xóa ảnh có thể đặt position absolute
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 5,
        zIndex: 1, // Đảm bảo nút nằm trên ảnh
    },
    button: {
        backgroundColor: '#007bff', // Màu xanh dương chủ đạo
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        width: '100%', // Nút chiếm toàn bộ chiều rộng
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#A9D6FF', // Màu mờ hơn khi disabled
        shadowOpacity: 0.1,
    },
    spinner: {
        marginRight: 10, // Đặt spinner bên trái text
    },
});

export default Location;