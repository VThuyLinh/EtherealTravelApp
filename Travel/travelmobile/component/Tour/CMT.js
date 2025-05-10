import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { Icon, MD3Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const CommentInput = ({ onCommentSubmit }) => {
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null); // Lưu đường dẫn ảnh Cloudinary
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(''); // State để hiển thị lỗi tải ảnh

    const handleInputChange = (text) => {
        setCommentText(text);
        setError('');
    };

    const uploadImageToCloudinary = async (uri) => {
        setUploading(true);
        setUploadError(''); // Reset lỗi trước khi tải
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                name: 'comment_image.jpg',
                type: 'image/jpeg',
            });
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });

            if (response.data && response.data.secure_url) {
                setImage(response.data.secure_url);
                console.log("Đường dẫn ảnh Cloudinary:", response.data.secure_url);
            } 
            if (response.data && response.data.secure_url) {
            // Lấy phần đường dẫn sau "v[version]/"
            const parts = response.data.secure_url.split(`/v${response.data.version}/`);
            if (parts.length > 1) {
              setImage(parts[1]); // Lưu đường dẫn tương đối vào state
              console.log("Đường dẫn ảnh từ CommentInput",response.data.secure_url)
            } else {
              setImage(response.data.secure_url); // Nếu không có version, lưu toàn bộ URL (trường hợp hiếm)
              console.log("Đường dẫn ảnh từ CommentInput",response.data.secure_url)
            }
            return response.data.secure_url; // Vẫn trả về URL đầy đủ nếu cần ở nơi khác
          }else {
                console.error("Không nhận được URL ảnh từ Cloudinary");
                setUploadError("Lỗi: Không nhận được URL ảnh từ server.");
            }
        } catch (error) {
            console.error("Lỗi tải ảnh lên Cloudinary:", error.request);
            setUploadError("Lỗi tải ảnh lên Cloudinary. Vui lòng thử lại.");
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
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            console.log("Thông tin asset:", result.assets[0]);
            uploadImageToCloudinary(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        const trimmedComment = commentText.trim();

        if (!trimmedComment && !image) {
            setError('Vui lòng nhập nội dung bình luận hoặc chọn ảnh.');
            return;
        }

        if (trimmedComment.length < 3 && trimmedComment) {
            setError('Bình luận phải có ít nhất 3 ký tự.');
            return;
        }

        if (trimmedComment.length > 500) {
            setError('Bình luận không được quá 500 ký tự.');
            return;
        }

        const inappropriateWords = ["từ cấm", "không thông minh"];
        const containsInappropriateWord = inappropriateWords.some(word =>
            trimmedComment.toLowerCase().includes(word.toLowerCase())
        );
        if (containsInappropriateWord) {
            setError('Từ ngữ không phù hợp.');
            return;
        }

        onCommentSubmit(trimmedComment, image); // Gửi cả nội dung và đường dẫn ảnh
        setCommentText('');
        setImage(null); // Reset trạng thái ảnh sau khi gửi
    };

    return (
        <View style={styles.container}>
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <Image
                        source={{uri: `https://res.cloudinary.com/dqcjhhtlm/${image}`}}
                        style={styles.imagePreview}
                    />
                    <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
                        <Icon source="close" color="red" size={15} />
                    </TouchableOpacity>
                </View>
            )}
            {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Bình luận ..."
                value={commentText}
                onChangeText={handleInputChange}
                multiline
                textAlignVertical="top"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={pickImage} style={styles.imageButton} disabled={uploading}>
                    <Icon source="camera" color="#777" size={25} />
                    {uploading && <ActivityIndicator style={styles.uploadIndicator} size="small" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={handleSubmit} disabled={uploading}>
                    <Text style={styles.sendButtonText}><Icon source="send" color="white" size={25} /></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    imagePreviewContainer: {
        width: 80,
        height: 60,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
        alignSelf: 'flex-start', // Để ảnh ở phía trên bên trái
        marginRight: 10,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        minHeight: 50,
        marginBottom: 10,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Đẩy nút camera và gửi ra hai đầu
        marginTop: 5,
    },
    imageButton: {
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#3CB371',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'orange',
        fontSize: 12,
        marginBottom: 5,
    },
    removeImageButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    uploadIndicator: {
        position: 'absolute',
        top: -5,
        left: -5,
    },
});

export default CommentInput;