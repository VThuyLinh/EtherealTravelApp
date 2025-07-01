import React, { useContext, useState } from "react";
import * as Permissions from 'expo-permissions';
import * as Locationn from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import { MyUserContext } from "../../config/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

const Location = () => {
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const user = useContext(MyUserContext); // Dùng để kiểm tra user có đăng nhập không (tùy thuộc vào MyUserContext)
    const nav = useNavigation();
    const [content, setContent] = useState('');

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
            quality: 0.7, // Giảm chất lượng ảnh một chút để tải lên nhanh hơn
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
            type: 'image/jpeg', // Đảm bảo đúng loại ảnh
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
            console.error("Lỗi khi tải ảnh lên Cloudinary:", error.response ? error.response.data : error.message);
            Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.");
            return null;
        }
    };

    const getLocationAndSaveMemory = async () => {
        // Kiểm tra xem người dùng đã nhập nội dung chưa
        if (!content.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập nội dung kỷ niệm.');
            return;
        }

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
            Alert.alert('Cần quyền truy cập vị trí', 'Bạn cần cấp quyền truy cập vị trí để lưu kỷ niệm.');
            setLoading(false);
            return;
        }

        try {
            const currentLocation = await Locationn.getCurrentPositionAsync({
                accuracy: Locationn.Accuracy.High, // Tăng độ chính xác
            });
            const storedToken = await AsyncStorage.getItem("token");

            if (!storedToken) {
                Alert.alert("Lỗi xác thực", "Không tìm thấy token. Vui lòng đăng nhập lại.");
                setLoading(false);
                return;
            }

            let formData = {
                // Đảm bảo latitude và longitude được gửi dưới dạng chuỗi nếu backend model là CharField
                latitude: `${currentLocation.coords.latitude}`, 
                longitude: `${currentLocation.coords.longitude}`,
                content: content,
                // KHÔNG GỬI user ID từ frontend nữa, backend sẽ tự động lấy từ token
                image: imageUrl, 
            };

            const response = await axios.post(`https://thuylinh.pythonanywhere.com/Memory/`, formData, {
                headers: {
                    // THAY ĐỔI 'Bearer' thành 'Token'
                    'Authorization': `Token ${storedToken}`, 
                    'Content-Type': 'application/json'
                },
            });

            console.log("Phản hồi từ server khi tạo kỷ niệm:", response.data);

            Alert.alert('Thành công', 'Vị trí và kỷ niệm của bạn đã được lưu lại!');
            setContent('');
            setImageUri(null);
            nav.navigate('Memory'); // Chuyển hướng người dùng về màn hình Memory để xem kỷ niệm mới

        } catch (ex) {
            console.error("Lỗi khi lấy vị trí hoặc gửi dữ liệu kỷ niệm:", ex.response ? ex.response.data : ex.message);
            Alert.alert('Lỗi', `Đã xảy ra lỗi khi lưu kỷ niệm: ${ex.response?.data?.error || ex.message}`);
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
                    style={[styles.button, (loading || uploadingImage || !content.trim()) && styles.disabledButton]} // Vô hiệu hóa nút nếu nội dung rỗng
                    onPress={getLocationAndSaveMemory}
                    disabled={loading || uploadingImage || !content.trim()}
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
        flexGrow: 1,
        backgroundColor: '#F7F9FC',
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginLeft: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 15,
        lineHeight: 22,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#FDFDFD',
        textAlignVertical: 'top',
        minHeight: 100,
        color: '#333',
    },
    pickImageButton: {
        backgroundColor: '#1ABC9C',
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
        width: '100%', // Thêm để nút chiếm toàn bộ chiều rộng
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
        aspectRatio: 4 / 3,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#E9EEF2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        position: 'relative',
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
        zIndex: 1,
    },
    button: {
        backgroundColor: '#007bff',
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
        width: '100%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#A9D6FF',
        shadowOpacity: 0.1,
    },
    spinner: {
        marginRight: 10,
    },
});

export default Location;