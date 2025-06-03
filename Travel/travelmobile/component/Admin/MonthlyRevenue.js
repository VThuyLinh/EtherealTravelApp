import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  RefreshControl,
  TouchableOpacity, // Import RefreshControl
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../Back/ButtonBack';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';
const screenWidth = Dimensions.get('window').width;

const MonthlyRevenueScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh
  const navigation= useNavigation();

  const fetchMonthlyRevenue = useCallback(async () => {
    // Chỉ hiển thị ActivityIndicator toàn màn hình nếu không phải là hành động refresh
    if (!isRefreshing) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin-stats/monthly-revenue/`);
      const apiData = response.data;

      const monthlyTotals = {};
      apiData.monthly_revenue_by_tour.forEach(item => {
        if (!monthlyTotals[item.month]) {
          monthlyTotals[item.month] = 0;
        }
        monthlyTotals[item.month] += item.total_revenue;
      });

      const sortedMonths = Object.keys(monthlyTotals).sort();
      const labels = sortedMonths;
      const totalRevenues = sortedMonths.map(month => monthlyTotals[month]);

      setData({
        labels,
        totalRevenues,
        monthlyRevenueByTour: apiData.monthly_revenue_by_tour,
        totalRevenueOverall: apiData.total_revenue_overall,
      });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Monthly Revenue:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu doanh thu hàng tháng.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Đảm bảo ẩn biểu tượng refresh
    }
  }, [isRefreshing]); // Thêm isRefreshing vào dependencies để useCallback không bị lỗi closure cũ nếu bạn muốn logic loading được phân biệt rõ ràng hơn.

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  // Hàm xử lý khi kéo xuống để làm mới
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (isLoading && !isRefreshing) { // Chỉ hiển thị loading ban đầu nếu không phải refresh
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
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

  if (!data || (data.labels.length === 0 && data.monthlyRevenueByTour.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu doanh thu nào.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        
              <View >
            <BackButton destination={'Chartfull'} />
        </View>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={ // Gắn RefreshControl vào ScrollView
          <RefreshControl
            refreshing={isRefreshing} // Trạng thái hiện tại của việc refresh
            onRefresh={onRefresh}     // Hàm được gọi khi kéo xuống
            colors={['#1ABC9C']}      // Màu sắc của biểu tượng refresh (Android)
            tintColor="#1ABC9C"       // Màu sắc của biểu tượng refresh (iOS)
          />
        }>
        <Text style={styles.title}>Doanh thu hàng tháng</Text>
        <Text style={styles.subtitle}>Tổng quan doanh thu theo tháng và từng tour</Text>

        <View style={styles.totalRevenueCard}>
          <Icon source="wallet-outline" size={30} color="#1ABC9C" />
          <Text style={styles.totalRevenueLabel}>Tổng doanh thu:</Text>
          <Text style={styles.totalRevenueValue}>{formatCurrency(data.totalRevenueOverall)}</Text>
        </View>

        {data.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Tổng doanh thu theo tháng</Text>
            <LineChart
              data={{
                labels: data.labels,
                datasets: [
                  {
                    data: data.totalRevenues,
                    color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={280}
              yAxisLabel=""
              yAxisSuffix="đ"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#1ABC9C',
                },
                formatYLabel: (yValue) => formatCurrency(parseFloat(yValue)).replace('₫', ''),
              }}
              bezier
              fromZero={true}
              style={styles.chartStyle}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Doanh thu chi tiết theo tour và tháng:</Text>
        {data.monthlyRevenueByTour.map((item, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tháng:</Text> {item.month}
            </Text>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tour:</Text> {item.Tour_Name}
            </Text>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Doanh thu:</Text> {formatCurrency(item.total_revenue)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1, // Rất quan trọng để kích hoạt cuộn và do đó kích hoạt pull-to-refresh
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
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
    backgroundColor: '#F0F2F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  backButtonIconOnly: {
    position: 'absolute', // Đặt vị trí tuyệt đối nếu bạn muốn nó nổi lên trên nội dung khác
    top: 10,             // Khoảng cách từ trên xuống
    left: 10,            // Khoảng cách từ trái vào
    padding: 10,         // Tăng vùng chạm cho dễ bấm
    borderRadius: 50,    // Bo tròn hoàn toàn để tạo hình tròn
  
    zIndex: 10, 
    },        
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalRevenueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    width: '100%',
    justifyContent: 'center',
  },
  totalRevenueLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 10,
    marginRight: 10,
  },
  totalRevenueValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1ABC9C',
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
    marginTop: 5,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 15,
    width: '100%',
  },
  dataItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  dataItemText: {
    fontSize: 15,
    color: '#34495E',
    marginBottom: 5,
  },
  dataItemLabel: {
    fontWeight: '600',
    color: '#7F8C8D',
  },
});

export default MonthlyRevenueScreen;