// screens/AdminScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Icon } from 'react-native-paper'; // CHỈ IMPORT Avatar (để dùng Avatar.Icon)

import { MyUserContext } from '../../config/context'; // Import MyUserContext nếu bạn đã tạo

const AdminScreen = () => {
  const navigation = useNavigation();
  const user = useContext(MyUserContext); // Lấy thông tin người dùng từ context

  const navigateToManagement = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>
          Chào mừng, {user?.username || 'Admin'}! 👋
        </Text>
      </View>

      {/* Main Content Area - Scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardContainer}>
          {/* Card: Quản lý Tour */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('TourViewCount')}
            activeOpacity={0.7} // Thêm hiệu ứng chạm
          >
            <View style={styles.card}> {/* Thay Card bằng View */}
              <View style={styles.cardContent}>
                {/* Dùng Avatar.Icon của react-native-paper */}
                <Icon size={50} source="airplane" style={styles.cardIcon} color="#2196F3" />
                <Text style={styles.cardTitleText}>Quản lý Tour</Text> {/* Thay Title bằng Text */}
                <Text style={styles.cardDescriptionText}>Thêm, sửa, xóa tour du lịch.</Text> {/* Thay Paragraph bằng Text */}
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Quản lý Tin tức */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('ManageNews')}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Avatar.Icon size={50} icon="newspaper-variant-outline" style={styles.cardIcon} color="#FF9800" />
                <Text style={styles.cardTitleText}>Quản lý Tin tức</Text>
                <Text style={styles.cardDescriptionText}>Tạo, sửa, xóa bài viết.</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Xem Thống kê */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('Chartfull')}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Icon size={50} source="chart-bar" style={styles.cardIcon} color="#4CAF50" />
                <Text style={styles.cardTitleText}>Xem Thống kê</Text>
                <Text style={styles.cardDescriptionText}>Phân tích dữ liệu doanh thu, người dùng.</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Quản lý Người dùng */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('ManageUsers')}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Icon size={50} source="account-group" style={styles.cardIcon} color="#9C27B0" />
                <Text style={styles.cardTitleText}>Quản lý Người dùng</Text>
                <Text style={styles.cardDescriptionText}>Quản lý tài khoản khách hàng.</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Quản lý Đánh giá */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('ManageReviews')}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Icon size={50} source="star-box-multiple-outline" style={styles.cardIcon} color="#F44336" />
                <Text style={styles.cardTitleText}>Quản lý Đánh giá</Text>
                <Text style={styles.cardDescriptionText}>Duyệt và phản hồi các đánh giá.</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Cài đặt hệ thống */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigateToManagement('SystemSettings')}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Icon size={50} source="cog-outline" style={styles.cardIcon} color="#607D8B" />
                <Text style={styles.cardTitleText}>Cài đặt hệ thống</Text>
                <Text style={styles.cardDescriptionText}>Cấu hình chung của ứng dụng.</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Nền tổng thể nhẹ nhàng hơn
  },
  header: {
    backgroundColor: '#28A745', // Màu xanh lá cây đậm hơn, tươi tắn
    paddingVertical: 35, // Tăng padding
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
   
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginBottom: 20, // Khoảng cách với nội dung dưới
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700', // Đậm hơn
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    opacity: 0.9,
  },
  scrollContent: {
    paddingHorizontal: 15, // Padding đều các cạnh
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Phân bố đều các card
  },
  cardWrapper: {
    width: '48%', // Khoảng cách giữa các card là 4% (100 - 48*2 = 4)
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // Shadow cho Android (elevation) và iOS (shadow properties)
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    height: 170, // Chiều cao cố định
    justifyContent: 'center', // Căn giữa nội dung dọc
    alignItems: 'center', // Căn giữa nội dung ngang
    padding: 10,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardIcon: {
    backgroundColor: 'transparent', // Vẫn giữ transparent cho Avatar.Icon
    marginBottom: 10,
  },
  cardTitleText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  cardDescriptionText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    lineHeight: 16,
  },
});

export default AdminScreen;