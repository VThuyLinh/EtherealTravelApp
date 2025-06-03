import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  Platform, // Import Platform để xử lý shadow tốt hơn trên Android
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from '../../config/context';
import { Icon } from 'react-native-paper';

// --- Cấu hình API ---
const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';

const ManageNewsScreen = () => {
  const navigation = useNavigation();
  const user = useContext(MyUserContext); // Dữ liệu người dùng từ context
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(null); // Khởi tạo token là null

  // --- Lấy token khi component mount ---
  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Lỗi khi lấy token từ AsyncStorage:", error);
      }
    };
    retrieveToken();
  }, []); // Chỉ chạy một lần khi component mount

  // --- Hàm gọi API lấy danh sách tin tức ---
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/News/`, {
        params: {
          name: searchQuery,
          page: 1, // Bạn có thể thêm chức năng phân trang nâng cao nếu cần
        },
      });
      // Đảm bảo dữ liệu trả về là một mảng và có thuộc tính 'id'
      setNewsList(response.data.results || response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tin tức:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể tải danh sách tin tức. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery]); // fetchNews sẽ thay đổi khi searchQuery thay đổi

  // --- Effect để fetch dữ liệu khi màn hình được focus hoặc searchQuery thay đổi ---
  useFocusEffect(
    useCallback(() => {
      fetchNews();
    }, [fetchNews]) // Dependency là fetchNews để đảm bảo nó được gọi lại khi fetchNews thay đổi
  );

  // --- Xử lý làm mới danh sách (pull-to-refresh) ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNews();
  };

  // --- Điều hướng đến màn hình chỉnh sửa tin tức ---
  const handleEditNews = (newsItem) => {
    navigation.navigate('EditNews', { newsId: newsItem.id, newsData: newsItem });
  };

  // --- Xử lý xóa tin tức ---
  const handleDeleteNews = (newsId, newsName) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa tin tức "${newsName}" không? Hành động này không thể hoàn tác!`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            setIsLoading(true); // Hiển thị loading khi đang xóa
            try {
              if (!token) {
                Alert.alert('Lỗi', 'Bạn chưa đăng nhập hoặc không có quyền thực hiện hành động này.');
                setIsLoading(false);
                return;
              }

              const response = await axios.delete(`${API_BASE_URL}/News/${newsId}/`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.status === 204) {
                Alert.alert('Thành công', 'Tin tức đã được xóa thành công!');
                fetchNews(); // Tải lại danh sách sau khi xóa thành công
              } else {
                Alert.alert('Lỗi', 'Không thể xóa tin tức. Vui lòng thử lại.');
              }
            } catch (error) {
              console.error('Lỗi khi xóa tin tức:', error.response?.data || error.message);
              if (error.response?.status === 403) {
                Alert.alert('Lỗi quyền hạn', error.response.data.detail || 'Bạn không có quyền xóa tin tức này.');
              } else if (error.response?.status === 401) {
                Alert.alert('Lỗi xác thực', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
              } else {
                Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.response?.data?.detail || error.message}`);
              }
            } finally {
              setIsLoading(false); // Ẩn loading
            }
          },
          style: 'destructive', // Màu đỏ cho nút xóa
        },
      ],
      { cancelable: true }
    );
  };

  // --- Render từng item tin tức trong FlatList ---
  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })} // Ví dụ: chuyển đến trang chi tiết tin tức
      activeOpacity={0.8}
    >
      {item.image_thumbnail ? (
        <Image
          source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.image_thumbnail}` }}
          style={styles.newsImage}
        />
      ) : (
        <View style={styles.noImageIcon}>
          <Icon source="image-off" size={60} color="#B0BEC5" />
          <Text style={styles.noImageText}>Không có ảnh</Text>
        </View>
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsName} numberOfLines={2}>
          {item.Name_News}
        </Text>
        <View style={styles.newsMeta}>
          <Icon source="account-circle" size={14} color="#78909C" />
          <Text style={styles.newsMetaText}>
            {item.admin ? `Admin ${item.admin.first_name} ${item.admin.last_name}` : 'Người dùng không xác định'}
          </Text>
          <Icon source="calendar" size={14} color="#78909C" style={{ marginLeft: 10 }} />
          <Text style={styles.newsMetaText}>
            {new Date(item.created_date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditNews(item)}
            activeOpacity={0.7}
          >
            <Icon source="pencil-outline" size={23} color="#FFF" />
            <Text style={styles.actionButtonText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteNews(item.id, item.Name_News)}
            activeOpacity={0.7}
          >
            <Icon source="delete-alert" size={23} color="#FFF" />
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --- Hiển thị trạng thái loading ban đầu ---
  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải tin tức, vui lòng chờ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý Tin Tức</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon source="magnify" size={22} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tin tức..."
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={fetchNews} // Tìm kiếm khi nhấn Enter/Done
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
            <Icon source="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>

      {/* Add New News Button */}
      <TouchableOpacity
        style={styles.addNewButton}
        onPress={() => navigation.navigate('CreateNews')}
      >
        <Icon source="plus-circle" size={24} color="#FFF" />
        <Text style={styles.addNewButtonText}>Thêm tin tức mới</Text>
      </TouchableOpacity>

      {/* News List hoặc thông báo rỗng */}
      {newsList.length === 0 && !isLoading ? (
        <View style={styles.emptyListContainer}>
          <Icon source="information-outline" size={60} color="#B0BEC5" />
          <Text style={styles.emptyListText}>Không tìm thấy tin tức nào.</Text>
          <Text style={styles.emptyListSubText}>Hãy thêm một tin tức mới hoặc thử tìm kiếm khác.</Text>
        </View>
      ) : (
        <FlatList
          data={newsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          contentContainerStyle={styles.listContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#4CAF50', '#2196F3']} // Thêm nhiều màu để đẹp hơn
              tintColor="#4CAF50" // Màu icon trên iOS
            />
          }
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Nền màu xám nhạt hiện đại
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#616161',
    fontWeight: '600',
  },
  // --- Header Section ---
  header: {
    backgroundColor: '#000080', // Màu xanh navy đậm hơn, sang trọng
    paddingTop: 10, // Điều chỉnh padding cho iOS
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 30, // Tăng khoảng cách dưới header
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  headerTitle: {
    fontSize: 32, // Kích thước lớn hơn
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#E0F2F7',
    opacity: 0.9,
    fontWeight: '500',
  },

  // --- Search Bar Section ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30, // Bo tròn nhiều hơn
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    height: 55, // Chiều cao cố định
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
    color: '#607D8B', // Màu xám xanh đậm
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#424242',
    paddingVertical: 0,
  },
  clearSearchButton: {
    marginLeft: 10,
    padding: 5,
  },

  
  addNewButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Màu xanh lá cây tươi sáng
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width:200,
    marginHorizontal: 20,
    marginBottom: 30,
    marginLeft:200 // Tăng khoảng cách
  },
  addNewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },

  // --- News List & Card Section ---
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30, // Đảm bảo có đủ khoảng trống ở cuối danh sách
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18, // Bo tròn nhiều hơn nữa
    marginBottom: 20, // Tăng khoảng cách giữa các card
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  newsImage: {
    width: '100%',
    height: 220, // Tăng chiều cao ảnh để trông nổi bật hơn
    resizeMode: 'cover',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  noImageIcon: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  noImageText: {
    marginTop: 10,
    color: '#90A4AE', // Màu xám xanh nhạt
    fontSize: 15,
    fontWeight: '600',
  },
  newsContent: {
    padding: 18,
  },
  newsName: {
    fontSize: 20, // Lớn hơn và nổi bật hơn
    fontWeight: '800',
    color: '#212121', // Màu đen đậm
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Khoảng cách với nút hành động
  },
  newsMetaText: {
    fontSize: 14,
    color: '#757575', // Màu xám trung tính
    marginLeft: 5,
    marginRight: 15, // Tăng khoảng cách giữa các meta info
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 0.5, // Đường kẻ mỏng hơn
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
   // Khoảng cách với meta info
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12, // Tăng padding
    borderRadius: 10, // Bo tròn nút hành động
    marginHorizontal: 5, // Khoảng cách giữa các nút
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#FBC02D', // Màu vàng cam ấm áp
  },
  deleteButton: {
    backgroundColor: '#F44336', // Màu đỏ rực rỡ hơn
  },

  // --- Empty List Section ---
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 30,
  },
  emptyListText: {
    fontSize: 20,
    color: '#757575',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyListSubText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ManageNewsScreen;