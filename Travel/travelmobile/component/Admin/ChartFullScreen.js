import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Dùng SafeAreaView cho iOS

const DashboardScreen = () => {
  const navigation = useNavigation();

  const STATS_CARDS = [
    {
      id: 'tourUserCounts',
      title: 'Khách hàng theo Tour',
      description: 'Số lượng khách hàng duy nhất đặt từng tour.',
      icon: 'account-multiple-outline',
      screen: 'ChartUserBookTour',
      color: '#3498DB',
    },
    {
      id: 'tourEngagementStats',
      title: 'Tương tác Tour',
      description: 'Lượt thích và bình luận của từng tour.',
      icon: 'heart-circle-outline',
      screen: 'ChartReactTour',
      color: '#2ECC71',
    },
    {
      id: 'monthlyBlogCounts',
      title: 'Bài viết Blog theo tháng',
      description: 'Số lượng bài viết blog được đăng mỗi tháng.',
      icon: 'post-outline',
      screen: 'ChartBlogMonthly',
      color: '#E67E22',
    },
    {
      id: 'blogEngagementStats',
      title: 'Tương tác Blog',
      description: 'Lượt thích và bình luận của từng bài blog.',
      icon: 'comment-text-multiple-outline',
      screen: 'ChartBlogReact',
      color: '#9B59B6',
    },
    {
      id: 'monthlyRevenue',
      title: 'Doanh thu hàng tháng',
      description: 'Tổng doanh thu theo từng tour và tổng cộng.',
      icon: 'currency-usd',
      screen: 'MonthlyRevenue',
      color: '#1ABC9C',
    },
    {
      id: 'tourRatings',
      title: 'Đánh giá Tour',
      description: 'Điểm trung bình và phân bố sao của các tour.',
      icon: 'star-circle-outline',
      screen: 'TourRatings',
      color: '#F1C40F',
    },
    {
      id: 'TourViewCount',
      title: 'Lượt xem trên tour',
      description: 'Mức độ phổ biến của mỗi tour dựa trên tổng số lượt xem mà mỗi tour đã nhận được',
      icon: 'counter',
      screen: 'TourViewCount',
      color: '#FF69B4',
    },
    
  ];

  const StatCard = ({ title, description, icon, screen, color }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color, shadowColor: color }]}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons name={icon} size={35} color={color} style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#7F8C8D" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Báo cáo & Thống kê</Text>
        <Text style={styles.headerSubtitle}>Tổng quan về hiệu suất hệ thống</Text>

        <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
          {STATS_CARDS.map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              screen={card.screen}
              color={card.color}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Nền nhẹ nhàng
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#34495E', // Xám xanh đậm
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D', // Xám nhạt hơn
    marginBottom: 25,
    textAlign: 'center',
  },
  cardsContainer: {
    paddingBottom: 20, // Khoảng trống dưới cùng
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 6, // Viền trái màu sắc
  },
  cardIcon: {
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#7F8C8D',
  },
});

export default DashboardScreen;