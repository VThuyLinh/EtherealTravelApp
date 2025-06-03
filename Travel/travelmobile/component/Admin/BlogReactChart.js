// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
//   Alert,
//   Pressable, // Import Pressable
//   Modal, // Import Modal
// } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import axios from 'axios';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Icon } from 'react-native-paper';

// const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';
// const screenWidth = Dimensions.get('window').width;

// const BlogReactStatsScreen = () => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
//   const [selectedComments, setSelectedComments] = useState([]); // State for comments to display in modal
//   const [selectedBlogName, setSelectedBlogName] = useState(''); // State for current blog name

//   const fetchBlogEngagementStats = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/admin-stats/blog-engagement/`);
//       const apiData = response.data;

//       const labels = apiData.map(item => item.Blog_Name);
//       const likeCounts = apiData.map(item => item.like_count);
//       const commentCounts = apiData.map(item => item.comment_count);

//       setData({ labels, likeCounts, commentCounts, rawData: apiData });
//     } catch (err) {
//       console.error('Lỗi khi tải dữ liệu Blog Engagement Stats:', err.response?.data || err.message);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//       Alert.alert('Lỗi', 'Không thể tải dữ liệu tương tác blog.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBlogEngagementStats();
//   }, [fetchBlogEngagementStats]);

//   // Function to open the modal with specific comments
//   const openCommentsModal = (comments, blogName) => {
//     setSelectedComments(comments);
//     setSelectedBlogName(blogName);
//     setIsModalVisible(true);
//   };

//   // Function to close the modal
//   const closeCommentsModal = () => {
//     setIsModalVisible(false);
//     setSelectedComments([]);
//     setSelectedBlogName('');
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#9B59B6" />
//         <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   if (!data || data.labels.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>Không có dữ liệu tương tác blog nào.</Text>
//       </View>
//     );
//   }

//   const chartData = {
//     labels: data.labels,
//     datasets: [
//       {
//         data: data.likeCounts,
//         color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
//         legend: 'Lượt thích',
//       },
//       {
//         data: data.commentCounts,
//         color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
//         legend: 'Lượt bình luận',
//       },
//     ],
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Tương tác Blog</Text>
//         <Text style={styles.subtitle}>Lượt thích và bình luận của từng bài blog</Text>

//         <View style={styles.chartContainer}>
//           <BarChart
//             data={chartData}
//             width={screenWidth - 40}
//             height={Math.max(300, data.labels.length * 40)}
//             chartConfig={{
//               backgroundColor: '#FFFFFF',
//               backgroundGradientFrom: '#FFFFFF',
//               backgroundGradientTo: '#FFFFFF',
//               decimalPlaces: 0,
//               color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
//               barPercentage: 0.6,
//               categoryPercentage: 0.8,
//               propsForLabels: {
//                 fontSize: 10,
//                 fontWeight: 'bold',
//               },
//               propsForVerticalLabels: {
//                 fontSize: 11,
//               },
//               propsForHorizontalLabels: {
//                 fontSize: 11,
//               },
//             }}
//             verticalLabelRotation={30}
//             fromZero={true}
//             showValuesOnTopOfBars={true}
//             style={styles.chartStyle}
//           />
//         </View>

//         <Text style={styles.sectionTitle}>Chi tiết dữ liệu:</Text>
//         {data.rawData.map((item, index) => (
//           <View key={index} style={styles.dataItem}>
//             <Text style={styles.dataItemText}>
//               <Text style={styles.dataItemLabel}>Blog:</Text> {item.Blog_Name}
//             </Text>
//             <View style={styles.dataItemRow}>
//               <Icon source="heart" size={16} color="#E74C3C" />
//               <Text style={styles.dataItemValue}>{item.like_count} </Text>
//               {/* Wrap the comment icon in a Pressable */}
//               <Pressable
//                 onPress={() => openCommentsModal(item.comments, item.Blog_Name)} // Pass comments and blog name
//                 style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
//                 <Icon source="comment-text-multiple" size={16} color="#3498DB" />
//                 <Text style={styles.dataItemValue}>{item.comment_count}</Text>
//               </Pressable>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Comments Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={closeCommentsModal}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Bình luận của Blog: {selectedBlogName}</Text>
//             {selectedComments.length > 0 ? (
//               <ScrollView style={styles.modalScrollView}>
//                 {selectedComments.map((comment, idx) => (
//                   <View key={idx} style={styles.commentItem}>
//                     <Text style={styles.commentText}>
//                       <Text style={styles.commentAuthor}>{comment.user.username}:</Text>{' '}
//                       {comment.content}
//                     </Text>
//                     <Text style={styles.commentDate}>
//                       Ngày: {new Date(comment.created_date).toLocaleDateString()}
//                     </Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             ) : (
//               <Text style={styles.noCommentsText}>Chưa có bình luận nào.</Text>
//             )}
//             <Pressable style={styles.closeButton} onPress={closeCommentsModal}>
//               <Text style={styles.textStyle}>Đóng</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F0F2F5',
//   },
//   container: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F0F2F5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F0F2F5',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#E74C3C',
//     textAlign: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F0F2F5',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7F8C8D',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 15,
//     color: '#7F8C8D',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   chartContainer: {
//     marginVertical: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   chartStyle: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginTop: 20,
//     marginBottom: 15,
//     width: '100%',
//   },
//   dataItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     width: '100%',
//   },
//   dataItemText: {
//     fontSize: 15,
//     color: '#34495E',
//     marginBottom: 5,
//   },
//   dataItemLabel: {
//     fontWeight: '600',
//     color: '#7F8C8D',
//   },
//   dataItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   dataItemValue: {
//     marginLeft: 5,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   // Modal Styles
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '90%', // Make modal wider
//     maxHeight: '70%', // Limit modal height
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#2C3E50',
//   },
//   modalScrollView: {
//     width: '100%',
//     marginBottom: 15,
//   },
//   commentItem: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#34495E',
//     marginBottom: 3,
//   },
//   commentAuthor: {
//     fontWeight: 'bold',
//   },
//   commentDate: {
//     fontSize: 12,
//     color: '#7F8C8D',
//     textAlign: 'right',
//   },
//   noCommentsText: {
//     fontSize: 16,
//     color: '#7F8C8D',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   closeButton: {
//     backgroundColor: '#9B59B6',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//     marginTop: 10,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default BlogReactStatsScreen;



import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  Pressable,
  Modal,
  RefreshControl,
  TouchableOpacity, // Import RefreshControl
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../Back/ButtonBack';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com';
const screenWidth = Dimensions.get('window').width;

const BlogReactStatsScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedBlogName, setSelectedBlogName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh
  const navigation=useNavigation();

  const fetchBlogEngagementStats = useCallback(async () => {
    // We'll handle loading state differently for initial load vs. refresh
    if (!isRefreshing) { // Only set isLoading true if it's not a refresh
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin-stats/blog-engagement/`);
      const apiData = response.data;

      const labels = apiData.map(item => item.Blog_Name);
      const likeCounts = apiData.map(item => item.like_count);
      const commentCounts = apiData.map(item => item.comment_count);

      setData({ labels, likeCounts, commentCounts, rawData: apiData });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Blog Engagement Stats:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu tương tác blog.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Reset refreshing state
    }
  }, [isRefreshing]); // Dependency on isRefreshing to avoid stale closure issues if needed, though for a simple fetch it's often not strictly necessary.

  useEffect(() => {
    fetchBlogEngagementStats();
  }, [fetchBlogEngagementStats]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchBlogEngagementStats();
  }, [fetchBlogEngagementStats]);

  const openCommentsModal = (comments, blogName) => {
    setSelectedComments(comments);
    setSelectedBlogName(blogName);
    setIsModalVisible(true);
  };

  const closeCommentsModal = () => {
    setIsModalVisible(false);
    setSelectedComments([]);
    setSelectedBlogName('');
  };

  if (isLoading && !isRefreshing) { // Show initial loading indicator only if not refreshing
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9B59B6" />
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
        <Text style={styles.emptyText}>Không có dữ liệu tương tác blog nào.</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.likeCounts,
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        legend: 'Lượt thích',
      },
      {
        data: data.commentCounts,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
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
        refreshControl={ // Attach RefreshControl
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#9B59B6']} // Color of the refresh indicator
            tintColor="#9B59B6" // Color for iOS
          />
        }>
        <Text style={styles.title}>Tương tác Blog</Text>
        <Text style={styles.subtitle}>Lượt thích và bình luận của từng bài blog</Text>

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
              <Text style={styles.dataItemLabel}>Blog:</Text> {item.Blog_Name}
            </Text>
            <View style={styles.dataItemRow}>
              <Icon source="heart" size={16} color="#E74C3C" />
              <Text style={styles.dataItemValue}>{item.like_count} </Text>
              <Pressable
                onPress={() => openCommentsModal(item.comments, item.Blog_Name)}
                style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="comment-text-multiple" size={16} color="#3498DB" />
                <Text style={styles.dataItemValue}>{item.comment_count}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Comments Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeCommentsModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Bình luận của Blog: {selectedBlogName}</Text>
            {selectedComments.length > 0 ? (
              <ScrollView style={styles.modalScrollView}>
                {selectedComments.map((comment, idx) => (
                  <View key={idx} style={styles.commentItem}>
                    <Text style={styles.commentText}>
                      <Text style={styles.commentAuthor}>{comment.user.first_name +' '+ comment.user.last_name|| 'Người dùng ẩn danh'}:</Text>{' '}
                      {comment.content}
                    </Text>
                    <Text style={styles.commentDate}>
                      Ngày: {new Date(comment.created_date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noCommentsText}>Chưa có bình luận nào.</Text>
            )}
            <Pressable style={styles.closeButton} onPress={closeCommentsModal}>
              <Text style={styles.textStyle}>Đóng</Text>
            </Pressable>
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
    flexGrow: 1, // Ensure content can grow to enable scrolling for refresh
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
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C3E50',
  },
  modalScrollView: {
    width: '100%',
    marginBottom: 15,
  },
  commentItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  commentText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 3,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BlogReactStatsScreen;