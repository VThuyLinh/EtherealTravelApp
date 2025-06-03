import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl, // THÊM DÒNG NÀY
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import BackButton from '../Back/ButtonBack';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';

const screenWidth = Dimensions.get('window').width;

const TourReactStatsScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // THÊM STATE NÀY CHO REFRESH CONTROL

  const navigation = useNavigation();

  // Hàm tải dữ liệu, được dùng cho cả lần tải ban đầu và khi làm mới
  const fetchTourEngagementStats = useCallback(async () => {
    // Đặt isLoading/setRefreshing tùy theo ngữ cảnh gọi hàm
    // Nếu là lần tải ban đầu, dùng setIsLoading(true)
    // Nếu là kéo làm mới, dùng setRefreshing(true)
    if (!refreshing) { // Tránh trường hợp isLoading và refreshing cùng true
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin-stats/tour-engagement/`);
      const apiData = response.data;

      const labels = apiData.map(item => item.Tour_Name);
      const likeCounts = apiData.map(item => item.like_count);
      const commentCounts = apiData.map(item => item.comment_count);

      setData({ labels, likeCounts, commentCounts, rawData: apiData });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Tour Engagement Stats:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu tương tác tour.');
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Đảm bảo tắt refreshing sau khi tải xong
    }
  }, []); // [] vì fetchTourEngagementStats không phụ thuộc vào props hay state nào bên ngoài

  useEffect(() => {
    fetchTourEngagementStats();
  }, [fetchTourEngagementStats]);

  // Hàm xử lý khi kéo xuống để làm mới
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTourEngagementStats(); // Gọi lại hàm tải dữ liệu
  }, [fetchTourEngagementStats]);

  const handleCommentIconPress = (comments) => {
    setSelectedComments(comments);
    setModalVisible(true);
  };

  if (isLoading && !refreshing) { // Chỉ hiển thị ActivityIndicator toàn màn hình khi tải ban đầu
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
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
        <Text style={styles.emptyText}>Không có dữ liệu tương tác tour nào.</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.likeCounts,
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Màu đỏ cho Like
        legend: 'Lượt thích',
      },
      {
        data: data.commentCounts,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Màu xanh cho Comment
        legend: 'Lượt bình luận',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
              <View >
            <BackButton destination={'Chartfull'} />
        </View>
      <ScrollView
        contentContainerStyle={styles.container}
        // THÊM REFRESHCONTROL VÀO ĐÂY
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2ECC71']} // Màu sắc của spinner khi kéo
            tintColor="#2ECC71" // Màu sắc của spinner trên iOS
          />
        }
      >
        <Text style={styles.title}>Tương tác Tour</Text>
        <Text style={styles.subtitle}>Lượt thích và bình luận của từng tour</Text>

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={Math.max(300, data.labels.length * 40)}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
              barPercentage: 0.6,
              categoryPercentage: 0.8,
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

        <Text style={styles.sectionTitle}>Chi tiết dữ liệu:</Text>
        {data.rawData.map((item, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataItemText}>
              <Text style={styles.dataItemLabel}>Tour:</Text> {item.Tour_Name}
            </Text>
            <View style={styles.dataItemRow}>
              <Icon source="heart" size={16} color="#E74C3C" />
              <Text style={styles.dataItemValue}>{item.like_count}</Text>

              <TouchableOpacity
                onPress={() => handleCommentIconPress(item.comments)}
                style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon source="comment-text-multiple" size={16} color="#3498DB" />
                <Text style={styles.dataItemValue}>{item.comment_count}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal để hiển thị danh sách bình luận */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Bình luận</Text>
            {selectedComments.length > 0 ? (
              <FlatList
                data={selectedComments}
                keyExtractor={(comment, index) => comment.id ? comment.id.toString() : index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentUser}>Người dùng: {item.user ? item.user.username : 'Ẩn danh'}</Text>
                    <Text style={styles.commentContent}>Nội dung: {item.content}</Text>
                  </View>
                )}
                contentContainerStyle={styles.commentList}
              />
            ) : (
              <Text style={styles.noCommentsText}>Không có bình luận nào cho tour này.</Text>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dataItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dataItemValue: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  // Styles for Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C3E50',
  },
  commentList: {
    width: '100%',
    paddingBottom: 10,
  },
  commentItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 14,
    color: '#555',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '50%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TourReactStatsScreen;