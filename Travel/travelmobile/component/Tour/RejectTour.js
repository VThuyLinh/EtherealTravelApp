import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, RefreshControl } from "react-native";
import { Text, TextInput, Button, Icon, ActivityIndicator } from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const RejectTour = () => {
    const navigation = useNavigation();
    const [idBookTour, setIdBookTour] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookingDetail, setBookingDetail] = useState(null); // State để lưu chi tiết đặt tour
    const [token, setToken] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showRejectButton, setShowRejectButton] = useState(false);

    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        // Kiểm tra xem có bookingDetail hay không để hiển thị nút Hủy
        setShowRejectButton(bookingDetail !== null);
    }, [bookingDetail]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Reset các state về giá trị ban đầu khi màn hình được focus
            setIdBookTour("");
            setReason("");
            setBookingDetail(null);
            setShowRejectButton(false);
            setLoading(false); // Có thể không cần reset loading nếu không có tác dụng phụ
        });

        // Cleanup listener khi component unmount
        return unsubscribe;
    }, [navigation]);

   

    const findBookTourByCode = async () => {
        setRefreshing(true);
        setLoading(true);
        setBookingDetail(null); // Reset chi tiết đặt tour khi tìm kiếm mới
        setShowRejectButton(false); // Ẩn nút Hủy khi tìm kiếm mới
        try {
            const storedToken = await AsyncStorage.getItem("token");
            setToken(storedToken);

            const response = await axios.get(
                `https://thuylinh.pythonanywhere.com/BookTourDetail/check_booktour_code/?code=${idBookTour}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data) {
                setBookingDetail(response.data); // Lấy toàn bộ dữ liệu response
            } else {
                Alert.alert("Lỗi", "Không tìm thấy mã đặt tour.");
            }
        } catch (error) {
            console.error("Lỗi tìm mã đặt tour:", error.response?.data || error.message);
            Alert.alert("Lỗi", error.response?.data?.error || "Có lỗi xảy ra khi tìm kiếm.");
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const cancelBookTour = async (bookTourId) => {
        const formData = {
            State: "Reject"
        };
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.patch(`https://thuylinh.pythonanywhere.com/BookTour/${bookTourId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log(`[cancelBookTour] Đã hủy BookTour có ID: ${bookTourId}`);
            
            Alert.alert("Thành công", "Đã hủy chuyến đi thành công!", [
                { text: "OK", onPress: () => {
                    setBookingDetail(null);
                    setShowRejectButton(false); 
                    setIdBookTour("");
                   navigation.navigate('MyTour')
                }}
            ]);
        } catch (error) {
            console.error("[cancelBookTour] Lỗi khi hủy BookTour:", error); // Log toàn bộ lỗi
            Alert.alert("Lỗi", "Có lỗi xảy ra khi hủy chuyến đi. Vui lòng thử lại.");
           
            if (error.response?.data?.message) {
                console.error("[cancelBookTour] Lỗi từ server:", error.response.data.message);
               
            }
        }
    };
    
    const loadBookTourDetail = async () => {
        setRefreshing(true);
        setLoading(true); // Có thể không cần thiết vì đang trong quá trình làm mới
        setBookingDetail(null);
        setShowRejectButton(false);
        try {
            const storedToken = await AsyncStorage.getItem("token");
            setToken(storedToken);
            const response = await axios.get(
                `https://thuylinh.pythonanywhere.com/BookTourDetail/check_booktour_code/?code=${idBookTour}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data) {
                setBookingDetail(response.data);
            } else {
                Alert.alert("Lỗi", "Không tìm thấy mã đặt tour.");
            }
        } catch (error) {
            console.error("Lỗi tìm mã đặt tour:", error);
            Alert.alert("Lỗi", error.response?.data?.error || "Có lỗi xảy ra khi tìm kiếm.");
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const policyText = `
Chính Sách Hủy và Hoàn Tiền

1. Điều kiện hủy chuyến đi:
    - Khách hàng được phép hủy chuyến đi theo các điều kiện cụ thể được quy định trong từng chương trình tour.
    - Thời gian hủy và phí hủy có thể khác nhau tùy thuộc vào thời điểm hủy so với ngày khởi hành.

2. Phí hủy chuyến đi:
    - Hủy trước 3 ngày so với ngày khởi hành: Hoàn 70% giá trị chuyến đi.
    - Hủy trong vòng 2 ngày so với ngày khởi hành: Không được hoàn tiền.
    - Không thanh toán trước 2 ngày so với ngày khởi hành, chuyến đi sẽ bị hủy tự động, đồng thời cũng không được hoàn tiền.
    - Các trường hợp đặc biệt sẽ được xem xét cụ thể.

3. Hoàn tiền:
    - Việc hoàn tiền (nếu có) sẽ được thực hiện trong vòng 7 ngày làm việc kể từ ngày xác nhận hủy.
    - Mang CCCD đến Đại học Mở TpHCM ở Nhơn Đức, Nhà Bè để được nhận lại tiền hoàn trả.

4. Thay đổi thông tin đặt tour:
    - Việc thay đổi thông tin (ví dụ: tên, ngày đi) có thể phát sinh phí và phụ thuộc vào quy định của từng dịch vụ (vé máy bay, khách sạn,...).

5. Các trường hợp bất khả kháng:
    - Trong trường hợp hủy tour do các sự kiện bất khả kháng (thiên tai, dịch bệnh,...), công ty sẽ xem xét phương án hỗ trợ tốt nhất cho khách hàng.

Lưu ý: Đây chỉ là chính sách chung, vui lòng tham khảo chi tiết chính sách hủy và hoàn tiền cụ thể của từng tour khi đặt dịch vụ.
    `;


    const loadMore=async ({ nativeEvent })=>{

    }
    return (
        
        <View style={styles.container}>
            <ScrollView
                        style={[StyleAll.container, StyleAll.margin]}
                        onScroll={loadMore}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={()=>loadBookTourDetail()} // Gọi trực tiếp loadTourDetail
                            />
                        }
                    >
                        {refreshing && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007bff" />
                                <Text style={styles.loadingText}>Đang làm mới...</Text>
                            </View>
                        )}
            <View style={styles.header}>
                <Text style={styles.title}>Hủy chuyến đi</Text>
            </View>
    
            <View style={styles.inputContainer}>
                <View style={styles.rowInput}>
                    <TextInput
                        placeholder="Mã Đặt Tour"
                        value={idBookTour}
                        onChangeText={(text) => setIdBookTour(text)}
                        mode="flat"
                        style={[styles.input, styles.inputLeft]}
                        underlineColorAndroid="transparent"
                        theme={{ colors: { primary: '#388E3C', underlineColor: 'transparent' } }}
                    />
                    <View style={styles.iconRight}>
                        <Icon source="barcode-scan" size={28} color="black" />
                    </View>
                </View>
            </View>
    
            {bookingDetail && bookingDetail.tour && (
                <View style={styles.bookingDetailContainer}>
                    <Text style={styles.detailTitle}>Chi Tiết Đặt Tour</Text>
                    <Text>Mã đặt chuyến đi: {bookingDetail.id_booktour}</Text>
                    <Text>Tên chuyến đi: {bookingDetail.tour.Tour_Name}</Text>
                    <Text>Nơi đi: {bookingDetail.tour.DeparturePlace.Place_Name}</Text>
                    <Text>Nơi đến: {bookingDetail.tour.Destination.Place_Name}</Text>
                    <Text>Ngày khởi hành: {bookingDetail.tour.DepartureDay}</Text>
                    <Text>Hành trình: {bookingDetail.tour.Days} Ngày {bookingDetail.tour.Nights} Đêm</Text>
                    <Text>Ngày Đặt: {bookingDetail.book_date}</Text>
                    <Text>Người Lớn: {bookingDetail.Quantity_Adult} người</Text>
                    <Text>Trẻ Em: {bookingDetail.Quantity_Children} người</Text>
                    <Text>
                        Trạng Thái:
                        {bookingDetail.State === "Wait for Paid" ? " Chờ thanh toán" : null}
                        {bookingDetail.State === "Paid" ? " Đã thanh toán" : null}
                        {bookingDetail.State === "Reject" ? " Đã hủy" : null}
                        {bookingDetail.State === "Complete" ? " Hoàn thành" : null}
                    </Text>
                    <Text>Giá: {bookingDetail.Price}</Text>
                    <Text>Email: {bookingDetail.email}</Text>
                </View>
            )}
    
           
                <View style={styles.inputContainer}>
                    <View style={styles.rowInput}>
                        <TextInput
                            placeholder="Lý do hủy (không bắt buộc)"
                            value={reason}
                            onChangeText={(text) => setReason(text)}
                            mode="flat"
                            multiline
                            style={[styles.input, styles.inputLeft]}
                            underlineColorAndroid="transparent"
                            theme={{ colors: { primary: '#388E3C', underlineColor: 'transparent' } }}
                        />
                        <View style={styles.iconRight}>
                            <Icon source="comment-text-outline" size={28} color="black" />
                        </View>
                    </View>
                </View>
            
    
            <TouchableOpacity onPress={toggleModal} style={styles.policyLink}>
                <Text style={styles.policyText}><Icon source="book-open-variant" size={18} color="#1976D2" /> Chính sách hủy và hoàn tiền</Text>
            </TouchableOpacity>
    
            {!showRejectButton && (
                <Button
                    mode="contained"
                    onPress={findBookTourByCode}
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                    
                >
                   <Text style={{ fontSize: loading ? 20 : 20, color: 'white' }}><Icon source="barcode-scan" size={25} color="white"/> Xác thực mã</Text>
                </Button>
            )}
    
    {showRejectButton && bookingDetail && (
    <Button
        style={styles.rejectButton}
        loading={loading}
        disabled={loading}
        mode="contained"
        onPress={() => cancelBookTour(bookingDetail.id)}
        icon={loading ? "cancel" : "close-circle"}
    >
        <Text style={{ fontSize: loading ? 20 : 20, color: 'white', marginTop:14 }}>Hủy chuyến đi</Text>
    </Button>
)}
    
           
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView style={styles.modalScrollView}>
                            <Icon name="book-open-variant-outline" size={30} color="#388E3C" style={{ marginBottom: 10, alignSelf: 'center' }} />
                            <Text style={styles.modalTitle}>Chính sách hủy và hoàn tiền</Text>
                            <Text style={styles.modalParagraph}>{policyText}</Text>
                        </ScrollView>
                        <Button onPress={toggleModal} style={styles.modalButton}>
                            Đóng
                        </Button>
                    </View>
                </View>
            </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "red",
    },
    inputContainer: {
        marginBottom: 20,
    },
    rowInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        backgroundColor: 'transparent',
        paddingLeft: 0,
        borderBottomWidth: 0,
        flex: 1, // Để TextInput chiếm phần lớn chiều rộng
    },
    inputLeft: {
        marginRight: 10, // Khoảng cách giữa TextInput và Icon
    },
    iconRight: {
        alignItems: 'flex-end',
    },
    underline: {
        height: 1,
        backgroundColor: '#a9a9a9',
        width: '100%',
        marginTop: -8, // Để đường gạch chân nằm ngay dưới TextInput
    },
    button: {
        marginTop: 20,
        width:350, 
        height:50,
        borderRadius: 8,
        marginLeft:12,
        backgroundColor:"#4DB6AC"
    },
    rejectButton: {
        width:350, 
        marginLeft:12,
        backgroundColor: "red",
        marginTop:20,
        height:50,
        marginBottom:30,
    },
    policyLink: {
        marginTop: 30,
        alignItems: "center",
    },
    policyText: {
        color: "#1976D2",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
    },
    modalScrollView: {
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#388E3C",
        textAlign: "center",
    },
    modalParagraph: {
        fontSize: 16,
        lineHeight: 19,
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 15,
    },
    bookingDetailContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F0FAF0',
        borderRadius: 8,
        marginBottom:20
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
});

export default RejectTour;