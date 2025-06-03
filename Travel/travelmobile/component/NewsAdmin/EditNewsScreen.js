import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Switch,
  useWindowDimensions,
  KeyboardAvoidingView, // Để lấy chiều rộng màn hình cho RenderHTML
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Icon, TextInput as PaperTextInput } from 'react-native-paper';
import axios from 'axios';

import RenderHTML from 'react-native-render-html'; // Import RenderHTML
import { MyUserContext } from '../../config/context';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';


const stripHtmlTags = (htmlString) => {
  if (!htmlString) return '';
 
  let plainText = htmlString.replace(/<[^>]*>/g, ''); // Loại bỏ tất cả các thẻ HTML
  plainText = plainText.replace(/&nbsp;/g, ' '); 
  plainText = plainText.replace(/&amp;/g, '&'); 
  plainText = plainText.replace(/&lt;/g, '<'); 
  plainText = plainText.replace(/&gt;/g, '>'); 
  return plainText.trim();
};


const convertToBasicHtml = (plainText) => {
  if (!plainText || plainText.trim() === '') {
    return '<div></div>'; // Trả về div rỗng nếu không có nội dung
  }
  // Chia văn bản thành các dòng và bọc mỗi dòng không rỗng trong thẻ <p>
  const lines = plainText.split('\n');
  const htmlParagraphs = lines.map(line => {
    const trimmedLine = line.trim();
    // Bọc dòng trong <p> nếu không rỗng, nếu không thì trả về rỗng để bỏ qua
    return trimmedLine ? `<p>${trimmedLine}</p>` : '';
  }).filter(Boolean); // Lọc bỏ các chuỗi rỗng

  return htmlParagraphs.join(''); // Nối các đoạn lại với nhau
};


const EditNewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { newsId, newsData } = route.params || {};
  const user = useContext(MyUserContext);
  const { width } = useWindowDimensions();

  const [nameNews, setNameNews] = useState('');
  const [imageThumbnail, setImageThumbnail] = useState('');
  const [content, setContent] = useState(''); // content sẽ chứa văn bản thuần túy
  const [originalHtmlContent, setOriginalHtmlContent] = useState(''); // Để lưu trữ HTML gốc để xem trước
  const [token, setToken] = useState("");
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        AsyncStorage.getItem("token").then((value) => setToken(value));
        console.warn(token);
        try {
            let dataToLoad = newsData;
            if (!dataToLoad && newsId) {
                // Nếu newsData không có, fetch từ API
                const response = await axios.get(`${API_BASE_URL}/News/${newsId}/`);
                dataToLoad = response.data;
            }
             

            if (dataToLoad) {
                setNameNews(dataToLoad.Name_News || '');
                setImageThumbnail(dataToLoad.image_thumbnail || '');
                setOriginalHtmlContent(dataToLoad.content || ''); // Lưu HTML gốc
                setContent(stripHtmlTags(dataToLoad.content || '')); // Chuyển đổi sang plain text cho input
                setActive(dataToLoad.active || false);
            } else {
                Alert.alert('Lỗi', 'Không tìm thấy thông tin tin tức để chỉnh sửa.');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Lỗi khi tải chi tiết tin tức:', error.response?.data || error.message);
            Alert.alert('Lỗi', 'Không thể tải chi tiết tin tức. Vui lòng thử lại.');
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [newsData, newsId, navigation]);

  const handleUpdateNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
         headers['Authorization'] = `Bearer ${token}`;
      } else {
         Alert.alert('Lỗi', 'Bạn chưa đăng nhập hoặc không có quyền thực hiện hành động này.');
         setIsLoading(false);
         return;
      }

      const payload = {
        Name_News: nameNews,
        image_thumbnail: imageThumbnail,
        content: convertToBasicHtml(content), // Chuyển đổi plain text thành HTML cơ bản khi gửi đi
        active: active,
        admin_id: `${user.id}`
      };

      const response = await axios.put(
        `${API_BASE_URL}/News/${newsId}/`,
        payload,
        { headers }
      );

      if (response.status === 200) {
        Alert.alert('Thành công', 'Tin tức đã được cập nhật thành công!');
        navigation.navigate('ManageNews');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật tin tức. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tin tức:', error.response|| error.message);
      if (error.response?.status === 403) {
        Alert.alert('Lỗi quyền hạn', error.response || 'Bạn không có quyền cập nhật tin tức này.');
      } else if (error.response?.status === 401) {
         Alert.alert('Lỗi xác thực', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.data) {
          const errorDetail = typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data;
          Alert.alert('Lỗi', `Đã xảy ra lỗi: ${errorDetail}`);
      }
      else {
        Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.message}`);
      }
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) { // Đặt isLoading chỉ khi loading dữ liệu ban đầu
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
     <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
          style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chỉnh Sửa Tin Tức</Text>
        <Text style={styles.headerSubtitle}>ID: {newsId}</Text>
      </View>

      <PaperTextInput
        label="Tên Tin Tức"
        value={nameNews}
        onChangeText={setNameNews}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#3498DB' } }}
      />

      <PaperTextInput
        label="URL Hình Ảnh Thu nhỏ"
        value={imageThumbnail}
        onChangeText={setImageThumbnail}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#3498DB' } }}
        keyboardType="url"
      />

      {imageThumbnail ? (
        <Image source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${imageThumbnail}` }} style={styles.thumbnailPreview} />
      ) : (
        <View style={styles.noThumbnail}>
          <Icon source="image-off-outline" size={50} color="#888" />
          <Text style={styles.noThumbnailText}>Không có hình ảnh</Text>
        </View>
      )}

      {/* HIỂN THỊ XEM TRƯỚC HTML GỐC */}
      <View style={styles.htmlPreviewContainer}>
        <Text style={styles.sectionTitle}>Xem trước nội dung (HTML gốc):</Text>
        <ScrollView style={styles.htmlScrollView}>
          {originalHtmlContent ? (
            <RenderHTML
              contentWidth={width - 40}
              source={{ html: originalHtmlContent }} // Hiển thị HTML gốc
              tagsStyles={htmlStyles}
            />
          ) : (
            <Text style={styles.noContentText}>Không có nội dung để xem trước.</Text>
          )}
        </ScrollView>
      </View>

      {/* CHỈNH SỬA VĂN BẢN BÌNH THƯỜNG */}
      <View style={styles.plainTextEditContainer}>
        <Text style={styles.sectionTitle}>Chỉnh sửa nội dung (văn bản bình thường):</Text>
        <Text style={styles.warningText}>
            LƯU Ý: Chỉnh sửa tại đây sẽ loại bỏ các định dạng phức tạp (in đậm, hình ảnh, bảng, v.v.)
            và chỉ lưu dưới dạng văn bản đơn giản.
        </Text>
        <PaperTextInput
          label="Nội dung tin tức"
          value={content} // Giờ là văn bản thuần túy
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={15}
          style={[styles.input, styles.multilineInput]}
          theme={{ colors: { primary: '#3498DB' } }}
          placeholder="Nhập nội dung tin tức tại đây..."
        />
      </View>

      <View style={styles.activeSwitchContainer}>
        <Text style={styles.activeSwitchLabel}>Trạng thái hiển thị:</Text>
        <Switch
          trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
          thumbColor={active ? "#FFFFFF" : "#F4F4F4"}
          ios_backgroundColor="#E0E0E0"
          onValueChange={setActive}
          value={active}
        />
        <Text style={styles.activeStatusText}>
          {active ? 'Đang hiển thị' : 'Đang ẩn'}
        </Text>
      </View>

      {error && <Text style={styles.errorText}>Lỗi: {error}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleUpdateNews}
          style={styles.updateButton}
          labelStyle={styles.buttonLabel}
          loading={isLoading}
          disabled={isLoading}
        >
          Lưu Thay Đổi
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          labelStyle={styles.buttonLabel}
        >
          Hủy
        </Button>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles cho RenderHTML tags (ví dụ)
const htmlStyles = {
  p: { fontSize: 16, lineHeight: 24, marginBottom: 10, color: '#333' },
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  h2: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  img: { maxWidth: '100%', height: 'auto', borderRadius: 8, marginVertical: 10 },
  a: { color: '#3498DB', textDecorationLine: 'underline' },
  ul: { marginBottom: 10 },
  ol: { marginBottom: 10 },
  li: { fontSize: 16, lineHeight: 22, marginBottom: 5, color: '#333' },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#CCC',
    paddingLeft: 15,
    marginVertical: 10,
    fontStyle: 'italic',
    color: '#555',
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  header: {
    marginBottom: 25, alignItems: 'center', backgroundColor: '#3498DB',
    paddingVertical: 20, borderRadius: 10, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#E0E0E0', opacity: 0.9 },
  input: { marginBottom: 15, backgroundColor: '#FFFFFF', borderRadius: 8 },
  multilineInput: { minHeight: 150, textAlignVertical: 'top', paddingVertical: 10 },
  thumbnailPreview: {
    width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10,
    marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0',
  },
  noThumbnail: {
    width: '100%', height: 150, backgroundColor: '#ECEFF1',
    justifyContent: 'center', alignItems: 'center', borderRadius: 10,
    marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0',
  },
  noThumbnailText: { marginTop: 8, color: '#666', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  htmlPreviewContainer: {
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10,
    marginBottom: 20, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3,
  },
  htmlScrollView: {
    maxHeight: 300, borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 5, padding: 10,
  },
  plainTextEditContainer: { // Style mới cho vùng chỉnh sửa văn bản
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10,
    marginBottom: 20, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3,
  },
  warningText: {
    color: '#D32F2F', fontSize: 13, marginBottom: 15, fontStyle: 'italic',
    textAlign: 'center', backgroundColor: '#FFEBEE', padding: 10, borderRadius: 5,
  },
  noContentText: {
    textAlign: 'center', color: '#999', fontSize: 14, fontStyle: 'italic', paddingVertical: 20,
  },
  activeSwitchContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3,
  },
  activeSwitchLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  activeStatusText: { fontSize: 16, color: '#666', fontWeight: '400' },
  errorText: {
    color: '#D32F2F', textAlign: 'center', marginBottom: 15,
    fontSize: 14, fontWeight: '500',
  },
  buttonContainer: { marginTop: 10 },
  updateButton: {
    marginBottom: 15, backgroundColor: '#28A745', borderRadius: 10,
    paddingVertical: 5, elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  cancelButton: {
    borderColor: '#6C757D', borderWidth: 1, borderRadius: 10,
    paddingVertical: 5, backgroundColor: '#FFFFFF', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  buttonLabel: { fontSize: 18, fontWeight: '600' },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555', fontWeight: '500' },
});

export default EditNewsScreen;