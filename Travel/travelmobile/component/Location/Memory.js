import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import * as Locationn from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MyUserContext } from '../../config/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Lấy chiều rộng và chiều cao màn hình để tính toán kích thước của mỗi "trang"
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Cấu hình Cloudinary của bạn
const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';


const Memory = () => {
    const [currentLocationCoords, setCurrentLocationCoords] = useState(null);
    const [memories, setMemories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const user = useContext(MyUserContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMemoryContent, setNewMemoryContent] = useState('');
    const [newMemoryImage, setNewMemoryImage] = useState(null); // Lưu URI cục bộ của ảnh
    const [newMemoryLocation, setNewMemoryLocation] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const fetchAllMemories = async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedToken = await AsyncStorage.getItem("token");

            if (!fetchedToken) {
                Alert.alert("Lỗi xác thực", "Không tìm thấy token. Vui lòng đăng nhập lại.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `https://thuylinh.pythonanywhere.com/Memory/`,
                {
                    headers: {
                        'Authorization': `Bearer ${fetchedToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMemories(response.data);
          

        } catch (err) {
            console.error('Lỗi khi lấy tất cả kỷ niệm:', err.response ? err.response.data : err.message);
            setError('Không thể tải kỷ niệm. Vui lòng thử lại.');
            Alert.alert('Lỗi', `Không thể tải kỷ niệm: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchCurrentLocation = async () => {
        let { status } = await Locationn.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const currentLocation = await Locationn.getCurrentPositionAsync({
                    accuracy: Locationn.Accuracy.High,
                });
                setCurrentLocationCoords(currentLocation.coords);
            } catch (err) {
                console.warn('Không thể lấy vị trí hiện tại:', err);
            }
        } else {
            console.warn('Quyền truy cập vị trí bị từ chối.');
        }
    };

    useEffect(() => {
        fetchCurrentLocation();
        fetchAllMemories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllMemories();
    };

    // Hàm upload ảnh lên Cloudinary
    const uploadImageToCloudinary = async (imageUri) => {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg', // Hoặc 'image/png' tùy loại ảnh
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
            // Cloudinary trả về URL đầy đủ, chúng ta cần cắt phần từ "image/upload/" trở đi
            const fullUrl = response.data.secure_url;
            const startIndex = fullUrl.indexOf("image/upload/");
            if (startIndex !== -1) {
                return fullUrl.substring(startIndex);
            }
            return fullUrl; // Trả về full URL nếu không tìm thấy "image/upload/"
        } catch (error) {
            console.error("Lỗi khi upload ảnh lên Cloudinary:", error.response ? error.response.data : error.message);
            Alert.alert("Lỗi Upload Ảnh", "Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.");
            return null;
        }
    };

    const handlePickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Quyền bị từ chối", "Cần quyền truy cập thư viện ảnh để chọn ảnh.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewMemoryImage(result.assets[0].uri);
        }
    };

    const handleGetMemoryLocation = async () => {
        let { status } = await Locationn.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const location = await Locationn.getCurrentPositionAsync({
                    accuracy: Locationn.Accuracy.High,
                });
                setNewMemoryLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                Alert.alert("Thành công", "Đã lấy vị trí hiện tại cho kỷ niệm mới.");
            } catch (err) {
                console.warn('Không thể lấy vị trí:', err);
                Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại. Vui lòng thử lại.");
            }
        } else {
            Alert.alert("Quyền bị từ chối", "Cần quyền truy cập vị trí để lưu vị trí kỷ niệm.");
        }
    };

    const handleCreateMemory = async () => {
        if (!newMemoryContent.trim()) {
            Alert.alert("Lỗi", "Nội dung kỷ niệm không được để trống.");
            return;
        }

        setIsCreating(true);
        try {
            const currentToken = await AsyncStorage.getItem("token");
            if (!currentToken) {
                Alert.alert("Lỗi xác thực", "Không tìm thấy token. Vui lòng đăng nhập lại.");
                setIsCreating(false);
                return;
            }

            let imageUrlToSave = null;
            if (newMemoryImage) {
                imageUrlToSave = await uploadImageToCloudinary(newMemoryImage);
                if (!imageUrlToSave) {
                    setIsCreating(false);
                    return;
                }
            }

            const formData = new FormData();
            formData.append('content', newMemoryContent);
            if (imageUrlToSave) {
                formData.append('image', imageUrlToSave);
            }

            // Làm tròn tọa độ trước khi gửi lên server
            if (newMemoryLocation) {
                const roundedLatitude = newMemoryLocation.latitude.toFixed(6); // 6 chữ số thập phân
                const roundedLongitude = newMemoryLocation.longitude.toFixed(6); // 6 chữ số thập phân
                
                // Kiểm tra lại tổng số chữ số cho longitude (bao gồm phần nguyên và thập phân)
                // Ví dụ: 106.703687 có 9 chữ số tổng cộng (3 nguyên, 6 thập phân).
                // Nếu backend yêu cầu tổng 9 chữ số và chỉ 6 thập phân, việc làm tròn 6 thập phân là đủ.
                // Tuy nhiên, nếu tổng số chữ số bao gồm cả dấu chấm hoặc yêu cầu khắt khe hơn,
                // bạn có thể cần điều chỉnh độ chính xác.
                // Hiện tại, toFixed(6) thường giải quyết được vấn đề này.

                formData.append('latitude', roundedLatitude.toString());
                formData.append('longitude', roundedLongitude.toString());
            }

            const response = await axios.post(
                `https://thuylinh.pythonanywhere.com/Memory/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert("Thành công", "Kỷ niệm đã được tạo!");
            setShowCreateModal(false);
            setNewMemoryContent('');
            setNewMemoryImage(null);
            setNewMemoryLocation(null);
            fetchAllMemories();

        } catch (err) {
            console.error('Lỗi khi tạo kỷ niệm:', err.response ? err.response.data : err.message);
            Alert.alert("Lỗi", `Không thể tạo kỷ niệm: ${err.response?.data?.detail || err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.memoryPage}>
            {item.image && (
                <Image  style={styles.memoryImageBook} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.image}` }}/>
                
            )}
            <View style={styles.textContainerBook}>
                <Text style={styles.memoryContentBook}>{item.content}</Text>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar-month" size={14} color="#555" />
                    <Text style={styles.memoryDateBook}>Đã lưu vào: {new Date(item.DatePost).toLocaleDateString()}</Text>
                </View>
                {item.location && (
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="map-marker" size={14} color="#555" />
                        <Text style={styles.memoryLocationBook}>Vị trí: {parseFloat(item.location.latitude).toFixed(6)}, {parseFloat(item.location.longitude).toFixed(6)}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Đang tải kỷ niệm...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cuốn Sổ Tay Kỷ Niệm Của Bạn</Text>
            {currentLocationCoords && (
                <Text style={styles.currentLocationText}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#666" /> Vị trí hiện tại: {currentLocationCoords.latitude.toFixed(6)}, {currentLocationCoords.longitude.toFixed(6)}
                </Text>
            )}

            {memories.length === 0 ? (
                <View style={styles.noMemoriesContainer}>
                    <MaterialCommunityIcons name="book-open-outline" size={80} color="#ccc" />
                    <Text style={styles.noMemoriesText}>Chưa có kỷ niệm nào được lưu.</Text>
                    <Text style={styles.noMemoriesSubText}>Hãy thêm kỷ niệm đầu tiên của bạn!</Text>
                    <TouchableOpacity style={styles.createButtonEmpty} onPress={() => setShowCreateModal(true)}>
                        <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
                        <Text style={styles.createButtonText}>Tạo kỷ niệm mới</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={memories}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007bff" />
                        }
                        contentContainerStyle={styles.flatListContentContainer}
                    />
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => setShowCreateModal(true)}
                    >
                        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
                    </TouchableOpacity>
                </>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showCreateModal}
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
                            <Text style={styles.modalTitle}>Tạo Kỷ Niệm Mới</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Nội dung kỷ niệm của bạn..."
                                multiline
                                numberOfLines={4}
                                value={newMemoryContent}
                                onChangeText={setNewMemoryContent}
                            />

                            <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
                                <MaterialCommunityIcons name="image-plus" size={20} color="#007bff" />
                                <Text style={styles.imagePickerButtonText}>Chọn ảnh</Text>
                            </TouchableOpacity>
                            
                            <Text>{newMemoryImage}</Text>
                           {newMemoryImage && (
                                <Image source={{ uri: newMemoryImage }} style={styles.previewImage} />
                            )}

                            <TouchableOpacity style={styles.locationButton} onPress={handleGetMemoryLocation}>
                                <MaterialCommunityIcons name="map-marker-plus" size={20} color="#28a745" />
                                <Text style={styles.locationButtonText}>Lấy vị trí hiện tại</Text>
                            </TouchableOpacity>
                            {newMemoryLocation && (
                                <Text style={styles.locationText}>
                                    Vị trí: {newMemoryLocation.latitude.toFixed(6)}, {newMemoryLocation.longitude.toFixed(6)}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={styles.createMemoryButton}
                                onPress={handleCreateMemory}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                                        <Text style={styles.createMemoryButtonText}>Lưu Kỷ Niệm</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setShowCreateModal(false);
                                    setNewMemoryContent('');
                                    setNewMemoryImage(null);
                                    setNewMemoryLocation(null);
                                }}
                                disabled={isCreating}
                            >
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2C3E50',
        textAlign: 'center',
        paddingVertical: 10,
    },
    currentLocationText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    flatListContentContainer: {
        flexGrow: 1,
        
        alignItems: 'center',
        paddingVertical: 10,
        
    },
    memoryPage: {
        width: 365, // Giảm chiều rộng để có khoảng trống hai bên
        height: screenHeight * 0.6, // Tăng chiều cao để chứa ảnh và text cân đối
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 20,
        marginHorizontal: 5, // Tăng khoảng cách giữa các trang
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        justifyContent: 'flex-start', // Bắt đầu từ trên
        alignItems: 'center',
        marginTop:50
    },
    memoryImageBook: {
        width: '100%', // Ảnh rộng full page
        height: screenWidth * 0.6, // Chiều cao ảnh tương đối với chiều rộng màn hình
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textContainerBook: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 5, // Thêm padding để text không sát lề
    },
    memoryContentBook: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15, // Tăng khoảng cách
        color: '#333',
        textAlign: 'justify',
        lineHeight: 25,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Khoảng cách giữa các dòng thông tin
    },
    memoryDateBook: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5, // Khoảng cách giữa icon và text
        textAlign: 'left', // Chỉnh sang trái
    },
    memoryLocationBook: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5, // Khoảng cách giữa icon và text
        textAlign: 'left', // Chỉnh sang trái
    },
    noMemoriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
    },
    noMemoriesText: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: 'bold',
    },
    noMemoriesSubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
    },
    createButtonEmpty: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'left',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007bff',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: screenWidth * 0.9,
        maxHeight: screenHeight * 0.8,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalScrollViewContent: {
        flexGrow: 1,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2C3E50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imagePickerButton: {
        flexDirection: 'row',
        backgroundColor: '#e7f3ff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#007bff',
    },
    imagePickerButtonText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    previewImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#eee',
    },
    locationButton: {
        flexDirection: 'row',
        backgroundColor: '#e6ffe6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#28a745',
    },
    locationButtonText: {
        color: '#28a745',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    locationText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    createMemoryButton: {
        flexDirection: 'row',
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    createMemoryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Memory;