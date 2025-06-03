// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ActivityIndicator,
//     ScrollView,
//     Dimensions,
//     Alert,
//     TouchableOpacity,
//     FlatList, // Dùng FlatList thay cho ScrollView trực tiếp khi có danh sách dài
//     RefreshControl, // Thêm RefreshControl cho chức năng kéo để làm mới
// } from 'react-native';
// // Đã bỏ LineChart vì báo cáo này là danh sách, không phải xu hướng thời gian
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Icon } from 'react-native-paper'; // Giữ Icon từ react-native-paper
// import BackButton from '../Back/ButtonBack'; // Giữ component BackButton của bạn

// const screenWidth = Dimensions.get('window').width;

// const TourViewCountReportScreen = () => { // Đổi tên component cho phù hợp
//     const [tours, setTours] = useState([]); // Lưu trữ danh sách các tour và lượt xem của chúng
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refreshing, setRefreshing] = useState(false); // State cho RefreshControl

//     const navigation = useNavigation();

//     // Hàm để tải dữ liệu lượt xem tour
//     const fetchTourViewCounts = useCallback(async () => {
//         // Đặt isLoading/setRefreshing tùy theo ngữ cảnh gọi hàm
//         if (!refreshing) {
//             setIsLoading(true);
//         }
//         setError(null);
//         try {
//             // Đây là endpoint API bạn đã có để lấy danh sách tour và view_count của từng tour
//             // Giả định nó trả về một mảng các đối tượng tour, mỗi đối tượng có 'Tour_Name' và 'view_count'
//             const response = await axios.get(`https://thuylinh.pythonanywhere.com/admin-stats/tour-view-count/`); 
//             setTours(response.data); // Lưu trực tiếp mảng dữ liệu vào state 'tours'
//         } catch (err) {
//             console.error('Lỗi khi tải dữ liệu lượt xem tour:', err.response?.data || err.message);
//             setError('Không thể tải dữ liệu lượt xem tour. Vui lòng thử lại.');
//             Alert.alert('Lỗi', 'Không thể tải dữ liệu lượt xem tour.');
//         } finally {
//             setIsLoading(false);
//             setRefreshing(false); // Tắt refreshing sau khi tải xong
//         }
//     }, []);

//     useEffect(() => {
//         fetchTourViewCounts();
//     }, [fetchTourViewCounts]);

//     // Hàm xử lý khi kéo xuống để làm mới
//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         fetchTourViewCounts(); // Gọi lại hàm tải dữ liệu
//     }, [fetchTourViewCounts]);

//     // Render từng item tour trong FlatList
//     const renderTourItem = ({ item }) => (
//         <View style={styles.dataItem}>
//             <Text style={styles.dataItemText}>
//                 <Text style={styles.dataItemLabel}>Tour:</Text> {item.Tour_Name}
//             </Text>
//             <View style={styles.viewCountRow}>
//                 <Icon source="eye" size={18} color="#3498DB" />
//                 <Text style={styles.viewCountValue}>Lượt xem: {item.view_count}</Text>
//             </View>
//         </View>
//     );

//     if (isLoading && !refreshing) { // Chỉ hiển thị ActivityIndicator toàn màn hình khi tải ban đầu
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#2ECC71" />
//                 <Text style={styles.loadingText}>Đang tải dữ liệu lượt xem tour...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//             </View>
//         );
//     }

//     if (tours.length === 0) { // Kiểm tra nếu không có tour nào
//         return (
//             <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyText}>Không có dữ liệu tour nào để thống kê lượt xem.</Text>
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View>
//                 <BackButton destination={'Chartfull'} /> 
//             </View>
//             <ScrollView
//                 contentContainerStyle={styles.container}
//                 refreshControl={ // Thêm RefreshControl vào ScrollView
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={['#2ECC71']} // Màu sắc của spinner khi kéo
//                         tintColor="#2ECC71" // Màu sắc của spinner trên iOS
//                     />
//                 }
//             >
//                 <Text style={styles.title}>Thống Kê Lượt Xem Tour</Text>
//                 <Text style={styles.subtitle}>Số lượng lượt xem của từng tour</Text>

//                 {/* Sử dụng FlatList để hiển thị danh sách các tour */}
//                 <FlatList
//                     data={tours}
//                     keyExtractor={item => item.id.toString()} // Đảm bảo Id_Tour là duy nhất và có thể chuyển thành chuỗi
//                     renderItem={renderTourItem}
//                     scrollEnabled={false} // FlatList bên trong ScrollView nên vô hiệu hóa cuộn của FlatList
//                     contentContainerStyle={styles.listContentContainer}
//                 />
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#F0F2F5',
//     },
//     container: {
//         padding: 20,
//         alignItems: 'center',
//         paddingBottom: 40, // Đảm bảo có khoảng trống dưới cùng
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F0F2F5',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#555',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F0F2F5',
//         padding: 20,
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#E74C3C',
//         textAlign: 'center',
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F0F2F5',
//         padding: 20,
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#7F8C8D',
//         textAlign: 'center',
//     },
//     title: {
//         fontSize: 26, // Tăng kích thước tiêu đề
//         fontWeight: '700',
//         color: '#2C3E50',
//         marginBottom: 8,
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: 16, // Tăng kích thước phụ đề
//         color: '#7F8C8D',
//         marginBottom: 30, // Tăng khoảng cách dưới phụ đề
//         textAlign: 'center',
//     },
//     listContentContainer: {
//         width: screenWidth - 40, // Đảm bảo FlatList có chiều rộng phù hợp
//     },
//     dataItem: { // Style cho mỗi thẻ tour
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12, // Tăng bo góc
//         padding: 18, // Tăng padding
//         marginBottom: 12, // Tăng khoảng cách giữa các thẻ
//         width: '100%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 3 }, // Đổ bóng rõ hơn
//         shadowOpacity: 0.15,
//         shadowRadius: 5,
//         elevation: 6,
//         flexDirection: 'row', // Hiển thị tên và lượt xem trên cùng 1 hàng
//         justifyContent: 'space-between', // Đẩy tên tour sang trái, lượt xem sang phải
//         alignItems: 'center',
//     },
//     dataItemText: { // Style cho tên tour
//         fontSize: 17, // Kích thước chữ tên tour
//         fontWeight: '600',
//         color: '#34495E',
//         flexShrink: 1, // Cho phép tên tour thu nhỏ nếu dài
//         marginRight: 15,
//     },
//     dataItemLabel: {
//         fontWeight: '700', // Đậm hơn cho nhãn
//         color: '#7F8C8D',
//     },
//     viewCountRow: { // Container cho icon và số lượt xem
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#EBF5FB', // Nền màu xanh nhạt cho lượt xem
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//     },
//     viewCountValue: {
//         fontSize: 17,
//         fontWeight: 'bold',
//         color: '#2980B9', // Màu xanh đậm hơn
//         marginLeft: 8, // Khoảng cách giữa icon và số
//     },
// });

// export default TourViewCountReportScreen;


import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import BackButton from '../Back/ButtonBack';

const screenWidth = Dimensions.get('window').width;

const TourViewCountReportScreen = () => {
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const fetchTourViewCounts = useCallback(async () => {
        if (!refreshing) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const response = await axios.get(`https://thuylinh.pythonanywhere.com/admin-stats/tour-view-count/`); 
            // Giả định API trả về mảng các đối tượng có Id_Tour (hoặc id), Tour_Name, và view_count
            setTours(response.data); 
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu lượt xem tour:', err.response?.data || err.message);
            setError('Không thể tải dữ liệu lượt xem tour. Vui lòng thử lại.');
            Alert.alert('Lỗi', 'Không thể tải dữ liệu lượt xem tour.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]); // Thêm refreshing vào dependencies để hàm được tạo lại khi refreshing thay đổi

    useEffect(() => {
        fetchTourViewCounts();
    }, [fetchTourViewCounts]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTourViewCounts();
    }, [fetchTourViewCounts]);

    const renderTourItem = ({ item }) => (
        <View style={styles.dataItem}>
            <Text style={styles.dataItemText} numberOfLines={2}> {/* Giới hạn 2 dòng cho tên tour */}
                <Text style={styles.dataItemLabel}>Tour:</Text> {item.Tour_Name || `Tour ID: ${item.id}`} {/* Fallback nếu không có Tour_Name */}
            </Text>
            <View style={styles.viewCountRow}>
                <Icon source="eye" size={18} color="#3498DB" />
                <Text style={styles.viewCountValue}>{item.view_count || 0}</Text> {/* Hiển thị 0 nếu view_count null/undefined */}
            </View>
        </View>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2ECC71" />
                <Text style={styles.loadingText}>Đang tải dữ liệu lượt xem tour...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchTourViewCounts} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (tours.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có dữ liệu tour nào để thống kê lượt xem.</Text>
                <TouchableOpacity onPress={fetchTourViewCounts} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Tải lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <BackButton destination={'Chartfull'} /> 
            </View>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2ECC71']}
                        tintColor="#2ECC71"
                    />
                }
            >
                <Text style={styles.title}>Thống Kê Lượt Xem Tour</Text>
                <Text style={styles.subtitle}>Số lượng lượt xem của từng tour</Text>

                <FlatList
                    data={tours}
                    // Ưu tiên item.id nếu có, nếu không thì dùng Id_Tour. Hoặc bạn có thể chọn một trong hai tùy theo API của bạn.
                    keyExtractor={item => (item.id ? item.id.toString() : item.Id_Tour.toString())} 
                    renderItem={renderTourItem}
                    scrollEnabled={false} 
                    contentContainerStyle={styles.listContentContainer}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    headerContainer: {
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: '#F0F2F5',
    },
    container: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 40,
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
        marginBottom: 15,
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
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 28, // Kích thước lớn hơn
        fontWeight: '800', // Đậm hơn nữa
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 17, // Kích thước lớn hơn
        color: '#7F8C8D',
        marginBottom: 35, // Khoảng cách lớn hơn
        textAlign: 'center',
    },
    listContentContainer: {
        width: screenWidth - 40,
    },
    dataItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15, // Bo góc nhiều hơn
        padding: 20, // Padding lớn hơn
        marginBottom: 15, // Khoảng cách lớn hơn
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Đổ bóng sâu hơn
        shadowOpacity: 0.18, // Độ mờ của bóng
        shadowRadius: 7, // Bán kính bóng
        elevation: 8, // Nâng cao elevation cho Android
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dataItemText: {
        fontSize: 18, // Lớn hơn
        fontWeight: '600',
        color: '#34495E',
        flex: 1, // Cho phép chiếm không gian còn lại
        marginRight: 15,
    },
    dataItemLabel: {
        fontWeight: '700',
        color: '#7F8C8D',
    },
    viewCountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F6F3', // Màu xanh lá cây nhạt hơn, tươi tắn hơn
        borderRadius: 10, // Bo góc nhiều hơn
        paddingHorizontal: 12, // Padding ngang
        paddingVertical: 8, // Padding dọc
    },
    viewCountValue: {
        fontSize: 18, // Lớn hơn
        fontWeight: 'bold',
        color: '#27AE60', // Màu xanh lá cây đậm hơn
        marginLeft: 8,
    },
});

export default TourViewCountReportScreen;