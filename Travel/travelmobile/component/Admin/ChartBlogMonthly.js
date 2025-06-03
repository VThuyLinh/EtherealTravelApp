import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';import { LineChart } from 'react-native-chart-kit'; // LineChart cho xu hướng theo thời gianimport axios from 'axios';import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../Back/ButtonBack';
const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';
const screenWidth = Dimensions.get('window').width;
const MonthlyBlogCountsScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation= useNavigation();

  const fetchMonthlyBlogCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://thuylinh.pythonanywhere.com/admin-stats/monthly-blog-counts/`);
      const apiData = response.data;

      const labels = apiData.map(item => item.month); // ví dụ: "2023-01"
      const counts = apiData.map(item => item.count);

      setData({ labels, counts, rawData: apiData });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Monthly Blog Counts:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu bài viết blog theo tháng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyBlogCounts();
  }, [fetchMonthlyBlogCounts]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E67E22" />
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
        <Text style={styles.emptyText}>Không có dữ liệu bài viết blog theo tháng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
              <View >
            <BackButton destination={'Chartfull'} />
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bài viết Blog theo tháng</Text>
        <Text style={styles.subtitle}>Số lượng bài viết blog được đăng mỗi tháng</Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.counts,
                  color: (opacity = 1) => `rgba(230, 126, 34, ${opacity})`, // Màu cam
                  strokeWidth: 2, // Độ dày của đường
                },
              ],
            }}
            width={screenWidth - 40}
            height={280}
            yAxisLabel=""
            yAxisSuffix=" bài"
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
                stroke: '#E67E22',
              },
            }}
            bezier // Làm đường cong mượt mà
            fromZero={true}
            style={styles.chartStyle}
          />
        </View>

        <Text style={styles.sectionTitle}>Chi tiết dữ liệu:</Text>
        {data.rawData.map((item, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tháng:</Text> {item.month}
            </Text>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Số bài viết:</Text> {item.count}
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
export default MonthlyBlogCountsScreen;