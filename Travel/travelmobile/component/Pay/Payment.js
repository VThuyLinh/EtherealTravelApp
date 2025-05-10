// //     <Image width={200} height={200}  source={{uri:'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728235373/Screenshot_2024-10-07_002217_dvl5vc.png'}}/>

// import React, { useRef } from 'react';
// import { Paystack, paystackProps } from 'react-native-paystack-webview';
// import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Alert } from 'react-native';
// import axios from 'axios';

// const sendBookingConfirmationEmail = async (emailData, navigation) => {
//     try {
//         const emailRes = await axios.post('https://vothuylinh.pythonanywhere.com/send-confirmpay-confirmation', emailData, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log("Gửi email thành công:", emailRes.data);
//         Alert.alert(
//             "Thành công",
//             "Đặt tour thành công! Hóa đơn đã được gửi đến email của bạn.",
//             [
//                 {
//                     text: "OK",
//                     onPress: () => {
//                         navigation.navigate('MyTour');
//                     }
//                 }
//             ]
//         );
//     } catch (error) {
//         console.log("Lỗi gửi email:", error);
//         if (error.response) {
//             console.log("Lỗi response khi gửi email:", error.response.data);
//             console.log("Lỗi response khi gửi email:", error.response);
//             Alert.alert("Lỗi", `Gửi email không thành công: ${JSON.stringify(error.response.data)}`);
//         } else {
//             Alert.alert("Lỗi", "Đã có lỗi xảy ra khi gửi email.");
//         }
//     }
// };

// const Payment = ({ route }) => {
//     const { price, name, tourName, departureDay, departurePlace, departureTime, destination, adultCount, childrenCount } = route.params || {};
//     const paystackWebViewRef = useRef(paystackProps.PayStackRef);
//     const navigation = useNavigation();

//     const handlePaymentSuccess = (res) => {
//         console.warn(res);
//         const payData = {
//             name: name,
//             email: "vthuylinh135@gmail.com", // Thay bằng email thực tế
//             price: price,
//             tourName: tourName,
//             departureDay: departureDay,
//             departurePlace: departurePlace,
//             departureTime: departureTime,
//             destination: destination,
//             adultCount: adultCount,
//             childrenCount: childrenCount,
//         };
//         sendBookingConfirmationEmail(payData, navigation);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Thanh toán</Text>

//             <View style={styles.orderSummary}>
//                 <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
//                 {tourName && <Text style={styles.orderItem}>Tour: <Text style={styles.boldText}>{tourName}</Text></Text>}
//                 {departureDay && <Text style={styles.orderItem}>Ngày đi: <Text style={styles.boldText}>{departureDay}</Text></Text>}
//                 {departurePlace && <Text style={styles.orderItem}>Nơi đi: <Text style={styles.boldText}>{departurePlace}</Text></Text>}
//                 {destination && <Text style={styles.orderItem}>Nơi đến: <Text style={styles.boldText}>{destination}</Text></Text>}
//                 {adultCount !== undefined && <Text style={styles.orderItem}>Người lớn: <Text style={styles.boldText}>{adultCount}</Text></Text>}
//                 {childrenCount !== undefined && <Text style={styles.orderItem}>Trẻ em: <Text style={styles.boldText}>{childrenCount}</Text></Text>}
//                 <View style={styles.separator} />
//                 <Text style={styles.totalAmount}>Tổng tiền: <Text style={styles.boldText}>{price?.toLocaleString('vi-VN')} VND</Text></Text>
//             </View>

//             <View style={styles.paymentMethod}>
//                 <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
//                 <View style={styles.paystackContainer}>
//                     <Image
//                         source={{ uri: 'https://res.cloudinary.com/dq1hlpgjx/image/upload/v1682644289/paystack_logo_oyy3jk.png' }} // Thay thế bằng logo Paystack của bạn
//                         style={styles.paystackLogo}
//                         resizeMode="contain"
//                     />
//                     <Text style={styles.paystackText}>Thanh toán qua Paystack</Text>
//                 </View>
//                 <Paystack
//                     paystackKey="pk_test_5c6700536bdbfe1a3b8fbef74a07f8cafea4f15f"
//                     paystackSecretKey="sk_test_33616f7f53acb089b519ec80ef77da33e269fe50"
//                     billingEmail="vthuylinh135@gmail.com"
//                     billingMobile="12344321"
//                     billingName={name}
//                     currency="ZAR"
//                     amount={1000}
//                     onCancel={(e) => {
//                         console.log(e);
//                         Alert.alert("Thông báo", "Bạn đã hủy giao dịch thanh toán.");
//                     }}
//                     onSuccess={handlePaymentSuccess}
//                     ref={paystackWebViewRef}
//                 />
//                 <TouchableOpacity
//                     style={styles.payButton}
//                     onPress={() => paystackWebViewRef.current.startTransaction()}
//                 >
//                     <Text style={styles.payButtonText}>Tiến hành thanh toán</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={{ height: 30 }} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9f9f9',
//         padding: 20,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 25,
//         textAlign: 'center',
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#555',
//         marginBottom: 15,
//     },
//     orderSummary: {
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     orderItem: {
//         fontSize: 16,
//         color: '#666',
//         marginBottom: 8,
//     },
//     boldText: {
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     separator: {
//         borderBottomWidth: 1,
//         borderColor: '#ddd',
//         marginVertical: 10,
//     },
//     totalAmount: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#007bff',
//         marginTop: 10,
//     },
//     paymentMethod: {
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     paystackContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     paystackLogo: {
//         width: 80,
//         height: 30,
//         marginRight: 10,
//     },
//     paystackText: {
//         fontSize: 16,
//         color: '#555',
//         fontWeight: 'bold',
//     },
//     payButton: {
//         backgroundColor: '#28a745',
//         paddingVertical: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 2,
//         marginTop: 20,
//     },
//     payButtonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default Payment;



import React, { useRef } from 'react';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const sendPayConfirmationEmail = async (emailData, navigation) => {
    try {
        const emailRes = await axios.post('https://vothuylinh.pythonanywhere.com/send-confirmpay-confirmation', emailData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Gửi email thành công:", emailRes.data);
        Alert.alert(
            "Thành công",
            "Thanh toán thành công! Hóa đơn đã được gửi đến email của bạn.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.navigate('MyTour');
                    }
                }
            ]
        );
    } catch (error) {
        console.log("Lỗi gửi email:", error);
        if (error.response) {
            console.log("Lỗi response khi gửi email:", error.response.data);
            console.log("Lỗi response khi gửi email:", error.response);
            Alert.alert("Lỗi", `Gửi email không thành công: ${JSON.stringify(error.response.data)}`);
        } else {
            Alert.alert("Lỗi", "Đã có lỗi xảy ra khi gửi email.");
        }
    }
};

const Payment = ({ route }) => {
    const { price,email, name, tourName, departureDay, departurePlace, departureTime, destination, adultCount, childrenCount, bookTourId, onPaymentSuccess } = route.params || {};
    const paystackWebViewRef = useRef(paystackProps.PayStackRef);
    const navigation = useNavigation();

    const handlePaystackSuccess = (res) => {
      console.log({email})
        console.log("Paystack success response:", res);
        Alert.alert(
            "Thanh toán thành công",
            "Giao dịch của bạn đã thành công.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        // Gọi callback onPaymentSuccess để cập nhật trạng thái BookTour
                        if (onPaymentSuccess && bookTourId) {
                            onPaymentSuccess(bookTourId);
                        }
                        // Gửi email xác nhận
                        const payData = {
                            name: name,
                            email: email, // LƯU Ý: Cần lấy email thực tế của người dùng
                            price: price,
                            tourName: tourName,
                            departure_day: departureDay,
                            departure_place: departurePlace,
                            departure_time: departureTime,
                            destination: destination,
                            adultCount: adultCount,
                            childrenCount: childrenCount,
                        };
                        sendPayConfirmationEmail(payData, navigation);
                        navigation.navigate('MyTour'); // Chuyển về màn hình MyTour sau khi hoàn tất
                    }
                }
            ]
        );
    };

    const handlePaystackCancel = (e) => {
        console.log("Paystack cancel response:", e);
        Alert.alert("Thông báo", "Bạn đã hủy giao dịch thanh toán.");
    };

    const handleError = (error) => {
        console.error("Lỗi Paystack:", error);
        Alert.alert("Lỗi thanh toán", "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thanh toán</Text>

            <View style={styles.orderSummary}>
                <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
                {tourName && <Text style={styles.orderItem}>Tour: <Text style={styles.boldText}>{tourName}</Text></Text>}
                {departureDay && <Text style={styles.orderItem}>Ngày đi: <Text style={styles.boldText}>{departureDay}</Text></Text>}
                {departurePlace && <Text style={styles.orderItem}>Nơi đi: <Text style={styles.boldText}>{departurePlace}</Text></Text>}
                {destination && <Text style={styles.orderItem}>Nơi đến: <Text style={styles.boldText}>{destination}</Text></Text>}
                {adultCount !== undefined && <Text style={styles.orderItem}>Người lớn: <Text style={styles.boldText}>{adultCount}</Text></Text>}
                {childrenCount !== undefined && <Text style={styles.orderItem}>Trẻ em: <Text style={styles.boldText}>{childrenCount}</Text></Text>}
                <View style={styles.separator} />
                <Text style={styles.totalAmount}>Tổng tiền: <Text style={styles.boldText}>{price?.toLocaleString('vi-VN')} VND</Text></Text>
            </View>

            <View style={styles.paymentMethod}>
                <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
                <View style={styles.paystackContainer}>
                    <Image
                        source={{ uri: 'https://res.cloudinary.com/dq1hlpgjx/image/upload/v1682644289/paystack_logo_oyy3jk.png' }} // Thay thế bằng logo Paystack của bạn
                        style={styles.paystackLogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.paystackText}>Thanh toán qua Paystack</Text>
                </View>
                <Paystack
                    paystackKey="pk_test_5c6700536bdbfe1a3b8fbef74a07f8cafea4f15f"
                    paystackSecretKey="sk_test_33616f7f53acb089b519ec80ef77da33e269fe50"
                    billingEmail="vthuylinh135@gmail.com" // LƯU Ý: Cần lấy email thực tế của người dùng
                    billingMobile="12344321" // LƯU Ý: Cần lấy số điện thoại thực tế của người dùng
                    billingName={name}
                    currency="ZAR"
                    amount={100} // Paystack yêu cầu số tiền tính bằng cent
                    onCancel={handlePaystackCancel}
                    onSuccess={handlePaystackSuccess}
                    onError={handleError}
                    ref={paystackWebViewRef}
                />
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => paystackWebViewRef.current.startTransaction()}
                >
                    <Text style={styles.payButtonText}>Tiến hành thanh toán</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 30 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 15,
    },
    orderSummary: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    orderItem: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#333',
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: 10,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: 10,
    },
    paymentMethod: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    paystackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    paystackLogo: {
        width: 80,
        height: 30,
        marginRight: 10,
    },
    paystackText: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
    },
    payButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginTop: 20,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Payment;