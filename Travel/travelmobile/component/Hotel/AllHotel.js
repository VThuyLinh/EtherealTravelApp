import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Chip, DataTable, Icon, Searchbar, SegmentedButtons, Text } from "react-native-paper";
import React, { useContext, useState, useEffect } from "react";
import APIs, { endpoints } from "../../config/APIs";
import moment from "moment";
import { isCloseToBottom } from "../Utils/util";
import { Image } from "react-native";
import StyleAll from "../../style/StyleAll";
import { MyUserContext } from "../../config/context";
import StyleTour from "../../style/StyleTour";

const Hotel = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [refreshing, setRefreshing] = useState(false);

    const [hotel, setHotel] = useState([]);
    const [address, setAddress] = useState('');

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true); // Theo dõi xem còn trang tiếp theo không

    const loadHotel = async () => {
        if (page > 0 && hasNextPage) {
            let url = `${endpoints['hotel']}?address=${address}&page=${page}`; // Sửa 'addess' thành 'address'
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (res && res.data) {
                    if (page === 1) {
                        setHotel(res.data.results || []);
                       
                    } else if (page > 1) {
                        setHotel(current => [...current, ...(res.data.results || [])]);
                    }
                    // Kiểm tra xem còn trang tiếp theo không (tùy thuộc vào API response của bạn)
                    // Ví dụ: nếu response có trường 'next', bạn có thể kiểm tra nó
                    setHasNextPage(res.data.next !== null);
                } else {
                    setHasNextPage(false); // Không có dữ liệu hoặc lỗi response
                    console.warn("Không có dữ liệu hoặc lỗi response API");
                }
            } catch (ex) {
                console.error("Lỗi loadHotel:", ex);
                // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    useEffect(() => {
        loadHotel();
    }, [page, address]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasNextPage(true);
        // Không cần gọi loadHotel trực tiếp ở đây vì useEffect sẽ xử lý khi page thay đổi
    }, []);

    const loadMore = ({ nativeEvent }) => {
        if (loading === false && isCloseToBottom(nativeEvent) && hasNextPage) {
            console.log("Đang tải thêm trang:", page + 1);
            setPage(prevPage => prevPage + 1);
        }
    };

    const search = (value, callback) => {
        setPage(1);
        setHasNextPage(true);
        callback(value);
        setAddress(value);
    };

    // Giả định items là số trang tối đa (bạn có thể cần lấy thông tin này từ API)
    const [totalPages, setTotalPages] = useState(1); // Giá trị mặc định
    useEffect(() => {
        // Gọi API để lấy tổng số lượng khách sạn và tính toán totalPages
        const fetchTotalHotels = async () => {
            try {
                const res = await APIs.get(`${endpoints['hotel']}?address=${address}`); 
                if (res && res.data && res.data.count) {
                    setTotalPages(Math.ceil(res.data.count / 10)); // Giả sử mỗi trang 10 kết quả
                }
            } catch (error) {
                console.error("Lỗi khi lấy tổng số khách sạn:", error);
            }
        };
        fetchTotalHotels();
    }, [address]);

    const renderPaginationButtons = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <View style={styles.paginationContainer}>
                {pageNumbers.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.paginationButton, page === item && styles.activePaginationButton]}
                        onPress={() => setPage(item)}
                        disabled={loading}
                    >
                        <Text style={[styles.paginationText, page === item && styles.activePaginationText]}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={[StyleAll.container, { backgroundColor: '#f0f4f8' }]}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16 }}
                onScroll={loadMore}
                scrollEventThrottle={400}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
               

                <View style={styles.searchContainer}>
                    <Searchbar
                        style={styles.searchBar}
                        value={address}
                        placeholder="Tìm địa chỉ..."
                        onChangeText={t => search(t, setAddress)}
                        icon="magnify"
                    />
                </View>

                {loading && page === 1 ? (
                    <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#153050" />
                ) : (
                    <>
                        {hotel.map(c => (
                            <Card mode="elevated" style={styles.card} key={c.id}>
                                <Card.Content>
                                    <Text style={styles.hotelName}>{c.nameofhotel}</Text>
                                </Card.Content>
                                <Card.Cover style={styles.imgincard} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.image}` }} />

                                <Text style={styles.address}><Icon size={16} source="home-city" color="#757575" /> {c.address}</Text>
                                <Card.Actions style={styles.actionsContainer}>
                                    {user === null ? (
                                        <Text style={styles.loginMessage}>
                                            Vui lòng <Text style={[StyleTour.loginn, StyleTour.text1]} onPress={() => navigation.navigate("login")}>đăng nhập</Text> để có những trải nghiệm tốt nhất cùng Ethereal_Travel
                                        </Text>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.viewMoreButton}
                                            onPress={() => navigation.navigate("hoteldetail", { 'hotel_id': c.id })}
                                            key={c.id}
                                        >
                                            <Text style={styles.viewMoreText}>
                                                <Icon color="#fff" size={16} name="information-outline" /> Xem thêm
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </Card.Actions>
                            </Card>
                        ))}
                        {loading && page > 1 && <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#153050" />}
                        {hotel.length === 0 && !loading && page === 1 && (
                            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: '#757575' }}>Không tìm thấy khách sạn nào theo địa chỉ này.</Text>
                        )}
                        {!hasNextPage && hotel.length > 0 && (
                            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: '#757575' }}>Đã tải tất cả khách sạn.</Text>
                        )}
                    </>
                )}

                {totalPages > 1 && renderPaginationButtons()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#153050',
    },
    searchContainer: {
        marginBottom: 20,
        marginTop:20
    },
    searchBar: {
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: "#fff",
        marginBottom: 20,
        borderRadius: 25,
        elevation: 3,
    },
    hotelName: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        marginBottom: 8,
        marginLeft:5
    },
     imgincard:{
        marginLeft:15,
        marginRight:15
    },
    address: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 12,
        marginLeft:18,
        marginTop:10
    },
    loginMessage: {
        fontSize: 16,
        color: '#757575',
    },
    viewMoreButton: {
        backgroundColor: '#153050',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight:10,
        marginBottom:10
    },
    viewMoreText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    actionsContainer: {
        justifyContent: 'flex-end',
        paddingVertical: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 20,
    },
    paginationButton: {
        backgroundColor: '#d6e7ee',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    activePaginationButton: {
        backgroundColor: '#153050',
    },
    paginationText: {
        color: '#153050',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activePaginationText: {
        color: '#fff',
    },
});

export default Hotel;