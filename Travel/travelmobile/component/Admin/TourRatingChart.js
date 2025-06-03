import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../Back/ButtonBack';
const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';
const screenWidth = Dimensions.get('window').width;
const TourRatingsScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation= useNavigation();

  const fetchTourRatings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://thuylinh.pythonanywhere.com/admin-stats/tour-ratings/`);
      const apiData = response.data;

      // Dữ liệu cho biểu đồ điểm trung bình
      const avgRatingLabels = apiData.tour_average_ratings_over_time.map(item => item.Tour_Name);
      const avgRatingValues = apiData.tour_average_ratings_over_time.map(item => parseFloat(item.average_rating || 0).toFixed(1));

      // Dữ liệu cho biểu đồ phân bố sao (Pie Chart cho tour đầu tiên hoặc tổng hợp)
      const firstTourRatingDistribution = apiData.tour_rating_distribution.length > 0
        ? apiData.tour_rating_distribution[0].ratings_breakdown
        : null;

      let pieChartData = [];
      if (firstTourRatingDistribution) {
        pieChartData = [
          { name: '5 Sao', population: firstTourRatingDistribution['5_star'], color: '#2ECC71', legendFontColor: '#7F8C8D', legendFontSize: 14 },
          { name: '4 Sao', population: firstTourRatingDistribution['4_star'], color: '#5DADE2', legendFontColor: '#7F8C8D', legendFontSize: 14 },
          { name: '3 Sao', population: firstTourRatingDistribution['3_star'], color: '#F1C40F', legendFontColor: '#7F8C8D', legendFontSize: 14 },
          { name: '2 Sao', population: firstTourRatingDistribution['2_star'], color: '#E67E22', legendFontColor: '#7F8C8D', legendFontSize: 14 },
          { name: '1 Sao', population: firstTourRatingDistribution['1_star'], color: '#E74C3C', legendFontColor: '#7F8C8D', legendFontSize: 14 },
        ].filter(item => item.population > 0); // Chỉ hiển thị các mục có dữ liệu
      }

      setData({
        avgRatingLabels,
        avgRatingValues,
        tourRatingDistribution: apiData.tour_rating_distribution,
        pieChartData,
      });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Tour Ratings:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu đánh giá tour.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTourRatings();
  }, [fetchTourRatings]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} source="star" size={18} color="#F1C40F" />);
    }
    if (halfStar) {
      stars.push(<Icon key="half" source="star-half" size={18} color="#F1C40F" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} source="star-outline" size={18} color="#BDC3C7" />);
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F1C40F" />
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

  if (!data || (data.avgRatingLabels.length === 0 && data.tourRatingDistribution.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu đánh giá tour nào.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        
              <View >
            <BackButton destination={'Chartfull'} />
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đánh giá Tour</Text>
        <Text style={styles.subtitle}>Điểm trung bình và phân bố sao của các tour</Text>

        {data.avgRatingLabels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Điểm đánh giá trung bình theo Tour</Text>
            <BarChart
              data={{
                labels: data.avgRatingLabels,
                datasets: [
                  {
                    data: data.avgRatingValues.map(Number), // Chuyển đổi về số
                    colors: data.avgRatingValues.map((value, index) => (opacity = 1) => {
                      const hue = (value / 5) * 120; // Từ đỏ (thấp) đến xanh (cao)
                      return `hsla(${hue}, 70%, 50%, ${opacity})`;
                    }),
                  },
                ],
              }}
              width={screenWidth - 40}
              height={Math.max(300, data.avgRatingLabels.length * 40)}
              yAxisLabel=""
              yAxisSuffix=" sao"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 1, // 1 chữ số thập phân
                color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                barPercentage: 0.8,
                propsForLabels: {
                  fontSize: 10,
                  fontWeight: 'bold',
                },
                propsForVerticalLabels: {
                  fontSize: 11,
                },
                propsForHorizontalLabels: {
                  fontSize: 11,
                },
              }}
              verticalLabelRotation={30}
              fromZero={true}
              showValuesOnTopOfBars={true}
              style={styles.chartStyle}
            />
          </View>
        )}

        {data.pieChartData && data.pieChartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Phân bố sao đánh giá (Tour đầu tiên)</Text>
            <PieChart
              data={data.pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chung (sẽ bị ghi đè)
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // Hiển thị giá trị tuyệt đối
              has = {true} // Hiển thị legend
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Chi tiết đánh giá từng tour:</Text>
        {data.tourRatingDistribution.map((item, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tour:</Text> {item.Tour_Name}
            </Text>
            <View style={styles.ratingSummary}>
              <Text style={styles.dataItemLabel}>Điểm trung bình:</Text>
              <Text style={styles.averageRatingValue}>
                {item.average_rating ? item.average_rating.toFixed(1) : 'N/A'}
              </Text>
              {item.average_rating && renderStars(item.average_rating)}
            </View>
            <Text style={styles.breakdownTitle}>Phân bố sao:</Text>
            {Object.entries(item.ratings_breakdown).map(([star, count]) => (
              <View key={star} style={styles.breakdownItem}>
                <Text style={styles.breakdownText}>
                  <Icon source="star" size={16} color="#F1C40F" /> {star.replace('_star', '')} sao:
                </Text>
                <Text style={styles.breakdownCount}>{count}</Text>
              </View>
            ))}
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
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  averageRatingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1C40F',
    marginLeft: 5,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 5,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  breakdownText: {
    fontSize: 14,
    color: '#34495E',
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
export default TourRatingsScreen;