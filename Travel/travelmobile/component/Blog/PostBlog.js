import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  RadioButton,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import APIs, { endpoints } from "../../config/APIs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../config/context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dqcjhhtlm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const PostBlog = ({ route }) => {
  const user = useContext(MyUserContext);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [tagAll, setTagAll] = useState([]);
  const [image, setImage] = useState(null); // Lưu đường dẫn ảnh Cloudinary
  const [uploading, setUploading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const nav = useNavigation();
  const [tag, setTag] = useState(1);
  const theme = useTheme();

  const getTag = async () => {
    try {
      let res = await APIs.get(endpoints["tag"]);
      setTagAll(res.data);
    } catch (error) {
      console.error("Lỗi lấy tags:", error);
      Alert.alert("Lỗi", "Không thể lấy danh sách tags.");
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'image.jpg', // Tên file mặc định, có thể cải thiện
        type: 'image/jpeg', // Loại file mặc định, cần xác định chính xác
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });

      if (response.data && response.data.secure_url) {
        // Lấy phần đường dẫn sau "v[version]/"
        const parts = response.data.secure_url.split(`/v${response.data.version}/`);
        if (parts.length > 1) {
          setImage(parts[1]); // Lưu đường dẫn tương đối vào state
        } else {
          setImage(response.data.secure_url); // Nếu không có version, lưu toàn bộ URL (trường hợp hiếm)
        }
        return response.data.secure_url; // Vẫn trả về URL đầy đủ nếu cần ở nơi khác
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


  const resetForm = () => {
    setName("");
    setContent("");
    setImage(null);
    setTag(tagAll[0]?.id || 1); // Reset tag về giá trị mặc định hoặc ID của tag đầu tiên
  };

  useFocusEffect(
    React.useCallback(() => {
      // Gọi hàm resetForm khi component được focus
      resetForm();

      // Cleanup function (nếu cần) - trong trường hợp này không cần cleanup đặc biệt
      return () => {
        // Không có hành động cleanup cụ thể
      };
    }, [tagAll]) // Thêm tagAll vào dependency array nếu bạn muốn reset tag khi danh sách tag thay đổi
  );

  const postblog = async () => {
    if (!name.trim() || !content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập chủ đề và nội dung bài đăng.");
      return;
    }

    setLoadingPost(true);
    try {
      const formData = {
        name: name,
        content: content,
        user_post: `${user.id}`,
        image: image,
        tag: tag,
      };

      let res = await APIs.post(
        "https://thuylinh.pythonanywhere.com/Blog/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 201) {
        Alert.alert("Thành công", "Đăng bài thành công!", [
          { text: "OK", onPress: () => nav.navigate("BlogTab") },
        ]);
      }
    } catch (ex) {
      console.error("Lỗi đăng bài:", ex.request);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi đăng bài.");
    } finally {
      setLoadingPost(false);
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
      quality: 0.8, // Giảm chất lượng để tăng tốc độ upload
    });

    if (!result.canceled && result.assets.length > 0) {
        console.log("Loại file đã chọn:", result.assets[0].type);
      uploadImageToCloudinary(result.assets[0].uri);
    }
  };

  useEffect(() => {
    getTag();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Card style={styles.card}>
          <Card.Title title="Đăng bài Blog" titleStyle={styles.title} />
          <Card.Content>
            <TextInput
              label="Chủ đề bài đăng"
              style={styles.input}
              onChangeText={(value) => setName(value)}
            />
            <TextInput
              label="Nội dung"
              style={[styles.input, styles.multilineInput]}
              multiline
              numberOfLines={5}
              onChangeText={(value) => setContent(value)}
            />

            <Text style={styles.label}>Chọn loại nội dung</Text>
            {tagAll.map((ta) => (
              <View style={styles.radioGroup} key={ta.id}>
                <RadioButton
                  value={ta.id}
                  status={tag === ta.id ? "checked" : "unchecked"}
                  onPress={() => setTag(ta.id)}
                />
                <Text style={styles.radioLabel}>{ta.name}</Text>
              </View>
            ))}

            <View style={styles.imagePickerContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.pickedImage} />
              ) : (
                <View style={styles.defaultImageContainer}>
                  <Text style={styles.defaultImageText}>Chưa chọn ảnh</Text>
                </View>
              )}
              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.pickButton}
                loading={uploading}
                disabled={uploading}
              >
                Chọn ảnh
              </Button>
              {uploading && (
                <ActivityIndicator style={styles.uploadIndicator} size="small" color={theme.colors.primary} />
              )}
            </View>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              loading={loadingPost}
              onPress={postblog}
              style={styles.postButton}
              disabled={uploading}
            >
              Đăng bài
            </Button>
            <Button onPress={() => nav.goBack()} disabled={uploading || loadingPost}>Hủy</Button>
          </Card.Actions>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  card: {
    marginVertical: 20,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  imagePickerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  pickedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  defaultImageContainer: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultImageText: {
    fontSize: 16,
    color: "#777",
  },
  pickButton: {
    marginBottom: 16,
  },
  uploadIndicator: {
    marginTop: 10,
  },
  actions: {
    justifyContent: "flex-end",
    paddingVertical: 16,
  },
  postButton: {
    marginLeft: 16,
  },
});

export default PostBlog;