// // screens/TourUserCountsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../Back/ButtonBack';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com'; // Đảm bảo đường dẫn đúng

const screenWidth = Dimensions.get('window').width;

const TourUserCountsScreen = () => {
    const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTourUserCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://thuylinh.pythonanywhere.com/admin-stats/tour-user-counts/`);
      const apiData = response.data;

      // Chuyển đổi dữ liệu cho biểu đồ
      const labels = apiData.map(item => item.id_tour_id__Tour_Name);
      const uniqueUsers = apiData.map(item => item.total_bookings);

      setData({ labels, uniqueUsers });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Tour User Counts:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu khách hàng theo tour.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTourUserCounts();
  }, [fetchTourUserCounts]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
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

  if (!data || data.labels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu khách hàng theo tour.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
   
              <View >
            <BackButton destination={'Chartfull'} />
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Khách hàng theo Tour</Text>
        <Text style={styles.subtitle}>Số lượng khách hàng duy nhất đặt từng tour</Text>

        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.uniqueUsers,
                  colors: data.uniqueUsers.map((_, index) => (opacity = 1) => {
                    const colors = ['#3498DB', '#2ECC71', '#E67E22', '#9B59B6', '#1ABC9C', '#F1C40F'];
                    return colors[index % colors.length];
                  }),
                },
              ],
            }}
            width={screenWidth - 40} // Chiều rộng biểu đồ
            height={Math.max(500, data.labels.length * 100)} // Tự động điều chỉnh chiều cao
            yAxisLabel=""
            yAxisSuffix=" người"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0, // Không có số thập phân cho số người
              color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`, // Màu chữ & đường
              labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
              barPercentage: 0.8, // Độ rộng cột
              fillShadowGradientOpacity: 0.5,
              propsForLabels: {
                fontSize: 10, // Kích thước chữ trên trục
                fontWeight: 'bold',
              },
              propsForVerticalLabels: {
                fontSize: 11,
              },
              propsForHorizontalLabels: {
                fontSize: 11,
              },
            }}
            verticalLabelRotation={30} // Xoay nhãn trục X nếu tên tour dài
            fromZero={true} // Bắt đầu trục Y từ 0
            showValuesOnTopOfBars={true} // Hiển thị giá trị trên đỉnh cột
            style={styles.chartStyle}
          />
        </View>

        <Text style={styles.sectionTitle}>Chi tiết dữ liệu:</Text>
        {data.labels.map((tourName, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tour:</Text> {tourName}
            </Text>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Khách hàng:</Text> {data.uniqueUsers[index]}
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
  },
   backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute', // Đặt nút ở vị trí cố định
    left: 10,
    zIndex: 10, 
  },    
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
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
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
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

export default TourUserCountsScreen;
