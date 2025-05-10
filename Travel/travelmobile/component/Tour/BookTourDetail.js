// import { Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// import StyleAll from "../../style/StyleAll";
// import { ActivityIndicator, Button, Card, Chip, List, Text } from "react-native-paper";
// import React, { useContext, useState } from "react";
// import APIs, { endpoints } from "../../config/APIs";
// import moment from "moment";
// import Icon from "react-native-vector-icons/FontAwesome6";
// import { MyDispatchContext, MyUserContext } from "../../config/context";
// import StyleTour from "../../style/StyleTour";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { isCloseToBottom } from "../Utils/util";
// import { useNavigation } from "@react-navigation/native";

// const BookTourDetail = ({ navigation }) => {
//     const user = useContext(MyUserContext);
//     const nav = useNavigation();
//     const [booktourdetail, setBookTourDetail] = React.useState([]);
//     const [tour, setTour] = React.useState([]);
//     const [loading, setLoading] = React.useState(false);
//     const [token, setToken] = React.useState('');

//     const loadBookTourDetail = async () => {
//         try {
//             setLoading(true);
//             let res = await APIs.get(endpoints['booktourdetail']);
//             setBookTourDetail(res.data);
//             let res1 = await APIs.get(endpoints['tour']);
//             setTour(res1.data.results);
//         } catch (ex) {
//             console.error(ex);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const cancelBookTour = async (bookTourId) => {
//         const formData = {
//             State: "Reject"
//         };
//         try {
//             const token = await AsyncStorage.getItem("token");
//             await axios.patch(`https://thuylinh.pythonanywhere.com/BookTour/${bookTourId}/`, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//             console.log(`Đã hủy BookTour có ID: ${bookTourId}`);
//             loadBookTourDetail();
//         } catch (error) {
//             console.error("Lỗi khi hủy BookTour:", error.request);
//         }
//     };

//     const updateBookTourState = async (bookTourId, newState) => {
//         const formData = {
//             State: newState
//         };
//         try {
//             const token = await AsyncStorage.getItem("token");
//             await axios.patch(`https://thuylinh.pythonanywhere.com/BookTour/${bookTourId}/`, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//             console.log(`Đã cập nhật BookTour ID ${bookTourId} sang trạng thái: ${newState}`);
//             loadBookTourDetail(); // Sau khi cập nhật, tải lại dữ liệu
//         } catch (error) {
//             console.error(`Lỗi khi cập nhật BookTour ID ${bookTourId}:`, error.request);
//         }
//     };

//     const checkAndAutoCancel = () => {
//         const now = new Date();
//         const tourMap = new Map(tour.map(t => [t.id, t])); // Tạo map tour ID -> thông tin tour

//         booktourdetail.forEach(btd => {
//             if (btd.State === 'Wait for Paid') {
//                 const tourInfo = tourMap.get(btd.id_tour_id);
//                 if (tourInfo && tourInfo.DepartureDay && tourInfo.DepartureTime) {
//                     const departureDateTimeString = `${tourInfo.DepartureDay.slice(0, 10)}T${tourInfo.DepartureTime.DepartureTime}`;
//                     const departureTime = new Date(departureDateTimeString);
//                     const timeBeforeDeparture = departureTime.getTime() - now.getTime();
//                     const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

//                     // Kiểm tra nếu đã quá 48 giờ trước giờ khởi hành và vẫn chưa thanh toán
//                     if (timeBeforeDeparture <= 0 && timeBeforeDeparture > -30 * 60 * 1000) { // Hủy trong khoảng 48h trước và 30p sau giờ khởi hành
//                         console.log(`Đã quá thời hạn thanh toán 48h cho BookTour ID: ${btd.id}. Thực hiện hủy.`);
//                         cancelBookTour(btd.id);
//                         // Có thể thêm một flag để đánh dấu đã hủy để tránh gọi lại
//                     }
//                 }
//             }
//         });
//     };

//     const completeBookTour = async () => {
//         const now = new Date();
//         const tourMap = new Map(tour.map(t => [t.id, t])); // Tạo map tour ID -> thông tin tour

//         for (const btd of booktourdetail) {
//             if (btd.State === 'Paid') {
//                 const tourInfo = tourMap.get(btd.id_tour_id);
//                 if (tourInfo && tourInfo.DepartureDay && tourInfo.DepartureTime) {
//                     const departureDateTimeString = `${tourInfo.DepartureDay.slice(0, 10)}T${tourInfo.DepartureTime.DepartureTime}`;
//                     const departureTime = new Date(departureDateTimeString);
//                     const completionTime = new Date(departureTime.getTime() + 30 * 60 * 1000); // Cộng thêm 30 phút (milliseconds)

//                     if (now >= completionTime && btd.State !== 'Complete') {
//                         console.log(`Đã quá 30 phút sau giờ khởi hành cho BookTour ID: ${btd.id}. Chuyển sang trạng thái Complete.`);
//                         await updateBookTourState(btd.id, "Complete");
//                     }
//                 }
//             }
//         }
//     };

//     const navigateToPayment = async (booktour) => {
//         const selectedTour = tour.find(t => t.id === booktour.id_tour_id);
//         navigation.navigate("payment", {
//             bookTourId: booktour.id, // Truyền ID của BookTour để có thể cập nhật sau khi thanh toán thành công
//             price: booktour.Price,
//             name: `${user.first_name} ${user.last_name}`,
//             tourName: selectedTour?.Tour_Name,
//             email:user.email,
//             departureDay: selectedTour?.DepartureDay?.slice(0, 10),
//             departurePlace: selectedTour?.DeparturePlace?.Place_Name,
//             departureTime: selectedTour?.DepartureTime?.DepartureTime,
//             destination: selectedTour?.Destination?.Place_Name,
//             adultCount: booktour.Quantity_Adult,
//             childrenCount: booktour.Quantity_Children,
//             onPaymentSuccess: handlePaymentSuccess, // Truyền một callback để xử lý khi thanh toán thành công
//         });
//     };

//     const handlePaymentSuccess = (bookTourId) => {
//         // Hàm này sẽ được gọi từ màn hình Payment khi thanh toán thành công
//         console.log(`Thanh toán thành công cho BookTour ID: ${bookTourId}. Tiến hành cập nhật trạng thái.`);
//         updateBookTourState(bookTourId, "Paid");
//     };

//     React.useEffect(() => {
//         loadBookTourDetail();
//         const intervalIdCancel = setInterval(checkAndAutoCancel, 60 * 60 * 1000); // Kiểm tra mỗi tiếng để hủy
//         const intervalIdComplete = setInterval(completeBookTour, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút để hoàn thành

//         return () => {
//             clearInterval(intervalIdCancel);
//             clearInterval(intervalIdComplete);
//         };
//     }, []);

//     const loadMore = () => {
//         // Logic tải thêm dữ liệu nếu cần
//     };

//     return (
//         <View style={StyleAll.container}>
//             <RefreshControl refreshing={loading} onRefresh={loadBookTourDetail} />
//             <ScrollView onScroll={loadMore}>
//                 {booktourdetail.map(c => c.id_customer_bt !== user.id ? null : (
//                     <React.Fragment key={c.id}>
//                         {booktourdetail === null ? (
//                             <>
//                                 <ActivityIndicator />
//                                 <Text>Hiện tại bạn chưa có chuyến đi nào. Hãy chọn cho mình
//                                     <Text onPress={() => navigation.navigate("tour")} style={StyleTour.loginn}>chuyến đi</Text> để có những trải nghiệm tốt nhất cùng TL_Travel</Text>
//                             </>
//                         ) : (
//                             <Card mode="elevated" style={{ backgroundColor: "#f1faee", marginBottom: 30, marginLeft: 8, marginRight: 8, }}>
//                                 <Card.Content>
//                                     <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginBottom: 8 }} />
//                                     <Text style={StyleTour.text2}>Thông tin người đi</Text>
//                                     <Text style={StyleTour.text1}>Người đặt chuyến đi : {user.first_name + " " + user.last_name}</Text>
//                                     <Text style={StyleTour.text1}>Số điện thoại : {user.sdt}</Text>
//                                     <Text style={StyleTour.text1}>Email nhận hóa đơn : {user.email}</Text>
//                                     <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />
//                                     <Text style={StyleTour.text2}>Thông tin chuyến đi</Text>

//                                     {tour.map(to => to.id === c.id_tour_id ? (
//                                         <View key={to.id}>
//                                             <Text style={StyleTour.text1}>Chuyến đi : {to.Tour_Name}</Text>
//                                             <Text style={StyleTour.text1}>Phương tiện di chuyển : {to.vehicle?.Name}</Text>
//                                             <Text style={StyleTour.text1}>Số hiệu phương tiện : {to.vehicle?.License}</Text>
//                                             <Text style={StyleTour.text1}>Giá vé người lớn : {to.Adult_price}</Text>
//                                             <Text style={StyleTour.text1}>Giá vé trẻ em : {to.Children_price}</Text>
//                                             <Text style={StyleTour.text1}>Nơi đi : {to.DeparturePlace?.Place_Name}</Text>
//                                             <Text style={StyleTour.text1}>Nơi đến : {to.Destination?.Place_Name}</Text>
//                                             <Text style={StyleTour.text1}>Ngày khởi hành: {new Date(to.DepartureDay?.slice(0, 10)).toLocaleDateString()} </Text>
//                                             <Text style={StyleTour.text1}>Giờ khởi hành: {to.DepartureTime?.DepartureTime} </Text>
//                                             <Text style={StyleTour.text1}>Hành trình: {to.Days} Ngày {to.Nights} Đêm </Text>
//                                         </View>
//                                     ) : null)}

//                                     <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />
//                                     <Text style={StyleTour.text2}>Thông tin đặt tour</Text>
//                                     <Text style={StyleTour.text1}>Mã đặt tour : {c.id_booktour}</Text>
//                                     <Text style={StyleTour.text1}>Ngày đặt chuyến đi : {new Date(c.book_date?.slice(0, 10)).toLocaleDateString()}</Text>
//                                     <Text style={StyleTour.text1}>Số vé người lớn : {c.Quantity_Adult}</Text>
//                                     <Text style={StyleTour.text1}>Số vé trẻ em : {c.Quantity_Children}</Text>
//                                     <Text style={StyleTour.text1}>Tổng tiền : {c.Price}</Text>
//                                     <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />

//                                     {c.State === "Wait for Paid" ? (
//                                         <>
//                                             <Text style={{ fontSize: 10 }}>Hãy thanh toán trước giờ khởi hành 48h nếu không tour của bạn sẽ bị hủy !</Text>
//                                             <View style={{ flexDirection: 'row' }}>
//                                                 <Button style={StyleTour.btn1a} onPress={() => navigateToPayment(c)}><Text style={StyleTour.text22}>Thanh toán</Text></Button>
//                                                 <Button style={StyleTour.btn1b} onPress={() => cancelBookTour(c.id)}><Text style={StyleTour.text22}>Hủy</Text></Button>
//                                             </View>
//                                         </>
//                                     ) : null}

//                                     {c.State === 'Paid' ? (
//                                         <>
//                                             <Text>Hãy bỏ đồ vào vali và chuẩn bị đi thôi</Text>
//                                             <View style={{ flexDirection: 'row' }}>
//                                                 <Button style={StyleTour.btn2}><Text style={StyleTour.text21}>{c.State}</Text></Button>
//                                                 <Button style={StyleTour.btn1b} onPress={() => cancelBookTour(c.id)}><Text style={StyleTour.text22}>Hủy</Text></Button>
//                                             </View>
//                                         </>
//                                     ) : null}

//                                     {c.State === 'Complete' ? (
//                                         <>
//                                             <Text style={{ fontSize: 10 }}>Đừng ngần ngại mà hãy chia sẻ chuyến đi của mình vào <Text style={[StyleTour.loginn, StyleTour.text1b,]} onPress={() => navigation.navigate("Blog")}>blog </Text>nhé</Text>
//                                             <Button style={StyleTour.btn1}><Text style={StyleTour.text21}>{c.State}</Text></Button>
//                                         </>
//                                     ) : null}
//                                     {c.State === 'Reject' ? (
//                                         <>
//                                             <Button style={StyleTour.btn3}><Text style={StyleTour.text21}>{c.State}</Text></Button>
//                                         </>
//                                     ) : null}
//                                 </Card.Content>
//                             </Card>
//                         )}
//                     </React.Fragment>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     button: {
//         backgroundColor: "#b2dbbf",
//         color: "white",
//         textAlign: "center",
//         marginTop: 5,
//         height: 45,
//         width: 160,
//         marginBottom: 20,
//         marginLeft: 200,
//         borderRadius: 20
//     },
//     button1: {
//         textAlign: "center",
//     },
// });

// export default BookTourDetail;



import { Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import StyleAll from "../../style/StyleAll";
import { ActivityIndicator, Button, Card, Chip, List, Text } from "react-native-paper";
import React, { useContext, useState, useCallback } from "react"; // Import useCallback
import APIs, { endpoints } from "../../config/APIs";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome6";
import { MyDispatchContext, MyUserContext } from "../../config/context";
import StyleTour from "../../style/StyleTour";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isCloseToBottom } from "../Utils/util";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const BookTourDetail = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const nav = useNavigation();
    const [booktourdetail, setBookTourDetail] = React.useState([]);
    const [tour, setTour] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [token, setToken] = React.useState('');

    const loadBookTourDetail = useCallback(async () => { // Sử dụng useCallback để tránh tạo mới function ở mỗi lần render
        try {
            setLoading(true);
            let res = await APIs.get(endpoints['booktourdetail']);
            setBookTourDetail(res.data);
            let res1 = await APIs.get(endpoints['tour']);
            setTour(res1.data.results);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }, []);

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
            console.log(`Đã hủy BookTour có ID: ${bookTourId}`);
            loadBookTourDetail();
        } catch (error) {
            console.error("Lỗi khi hủy BookTour:", error.request);
        }
    };

    const updateBookTourState = async (bookTourId, newState) => {
        const formData = {
            State: newState
        };
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.patch(`https://thuylinh.pythonanywhere.com/BookTour/${bookTourId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log(`Đã cập nhật BookTour ID ${bookTourId} sang trạng thái: ${newState}`);
            loadBookTourDetail(); // Sau khi cập nhật, tải lại dữ liệu
        } catch (error) {
            console.error(`Lỗi khi cập nhật BookTour ID ${bookTourId}:`, error.request);
        }
    };

    const checkAndAutoCancel = () => {
        const now = new Date();
        const tourMap = new Map(tour.map(t => [t.id, t])); // Tạo map tour ID -> thông tin tour

        booktourdetail.forEach(btd => {
            if (btd.State === 'Wait for Paid') {
                const tourInfo = tourMap.get(btd.id_tour_id);
                if (tourInfo && tourInfo.DepartureDay && tourInfo.DepartureTime) {
                    const departureDateTimeString = `${tourInfo.DepartureDay.slice(0, 10)}T${tourInfo.DepartureTime.DepartureTime}`;
                    const departureTime = new Date(departureDateTimeString);
                    const timeBeforeDeparture = departureTime.getTime() - now.getTime();
                    const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

                    // Kiểm tra nếu đã quá 48 giờ trước giờ khởi hành và vẫn chưa thanh toán
                    if (timeBeforeDeparture <= 0 && timeBeforeDeparture > -30 * 60 * 1000) { // Hủy trong khoảng 48h trước và 30p sau giờ khởi hành
                        console.log(`Đã quá thời hạn thanh toán 48h cho BookTour ID: ${btd.id}. Thực hiện hủy.`);
                        cancelBookTour(btd.id);
                        // Có thể thêm một flag để đánh dấu đã hủy để tránh gọi lại
                    }
                }
            }
        });
    };

    const completeBookTour = async () => {
        const now = new Date();
        const tourMap = new Map(tour.map(t => [t.id, t])); // Tạo map tour ID -> thông tin tour

        for (const btd of booktourdetail) {
            if (btd.State === 'Paid') {
                const tourInfo = tourMap.get(btd.id_tour_id);
                if (tourInfo && tourInfo.DepartureDay && tourInfo.DepartureTime) {
                    const departureDateTimeString = `${tourInfo.DepartureDay.slice(0, 10)}T${tourInfo.DepartureTime.DepartureTime}`;
                    const departureTime = new Date(departureDateTimeString);
                    const completionTime = new Date(departureTime.getTime() + 30 * 60 * 1000); // Cộng thêm 30 phút (milliseconds)

                    if (now >= completionTime && btd.State !== 'Complete') {
                        console.log(`Đã quá 30 phút sau giờ khởi hành cho BookTour ID: ${btd.id}. Chuyển sang trạng thái Complete.`);
                        await updateBookTourState(btd.id, "Complete");
                    }
                }
            }
        }
    };

    const navigateToPayment = async (booktour) => {
        const selectedTour = tour.find(t => t.id === booktour.id_tour_id);
        navigation.navigate("payment", {
            bookTourId: booktour.id, // Truyền ID của BookTour để có thể cập nhật sau khi thanh toán thành công
            price: booktour.Price,
            name: `${user.first_name} ${user.last_name}`,
            tourName: selectedTour?.Tour_Name,
            email:user.email,
            departureDay: selectedTour?.DepartureDay?.slice(0, 10),
            departurePlace: selectedTour?.DeparturePlace?.Place_Name,
            departureTime: selectedTour?.DepartureTime?.DepartureTime,
            destination: selectedTour?.Destination?.Place_Name,
            adultCount: booktour.Quantity_Adult,
            childrenCount: booktour.Quantity_Children,
            onPaymentSuccess: handlePaymentSuccess, // Truyền một callback để xử lý khi thanh toán thành công
        });
    };

    const handlePaymentSuccess = (bookTourId) => {
        // Hàm này sẽ được gọi từ màn hình Payment khi thanh toán thành công
        console.log(`Thanh toán thành công cho BookTour ID: ${bookTourId}. Tiến hành cập nhật trạng thái.`);
        updateBookTourState(bookTourId, "Paid");
    };

    // Sử dụng useFocusEffect để load lại dữ liệu khi trang được focus
    useFocusEffect(
        useCallback(() => {
            loadBookTourDetail();
            const intervalIdCancel = setInterval(checkAndAutoCancel, 60 * 60 * 1000); // Kiểm tra mỗi tiếng để hủy
            const intervalIdComplete = setInterval(completeBookTour, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút để hoàn thành

            return () => {
                clearInterval(intervalIdCancel);
                clearInterval(intervalIdComplete);
            };
        }, [loadBookTourDetail]) // Thêm loadBookTourDetail vào dependency array
    );

    const loadMore = () => {
        // Logic tải thêm dữ liệu nếu cần
    };

    return (
        <View style={StyleAll.container}>
            <RefreshControl refreshing={loading} onRefresh={loadBookTourDetail} />
            <ScrollView onScroll={loadMore}>
                {booktourdetail.map(c => c.id_customer_bt !== user.id ? null : (
                    <React.Fragment key={c.id}>
                        {booktourdetail === null ? (
                            <>
                                <ActivityIndicator />
                                <Text>Hiện tại bạn chưa có chuyến đi nào. Hãy chọn cho mình
                                    <Text onPress={() => navigation.navigate("tour")} style={StyleTour.loginn}>chuyến đi</Text> để có những trải nghiệm tốt nhất cùng TL_Travel</Text>
                            </>
                        ) : (
                            <Card mode="elevated" style={{ backgroundColor: "#f1faee", marginBottom: 30, marginLeft: 8, marginRight: 8, }}>
                                <Card.Content>
                                    <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginBottom: 8 }} />
                                    <Text style={StyleTour.text2}>Thông tin người đi</Text>
                                    <Text style={StyleTour.text1}>Người đặt chuyến đi : {user.first_name + " " + user.last_name}</Text>
                                    <Text style={StyleTour.text1}>Số điện thoại : {user.sdt}</Text>
                                    <Text style={StyleTour.text1}>Email nhận hóa đơn : {user.email}</Text>
                                    <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />
                                    <Text style={StyleTour.text2}>Thông tin chuyến đi</Text>

                                    {tour.map(to => to.id === c.id_tour_id ? (
                                        <View key={to.id}>
                                            <Text style={StyleTour.text1}>Chuyến đi : {to.Tour_Name}</Text>
                                            <Text style={StyleTour.text1}>Phương tiện di chuyển : {to.vehicle?.Name}</Text>
                                            <Text style={StyleTour.text1}>Số hiệu phương tiện : {to.vehicle?.License}</Text>
                                            <Text style={StyleTour.text1}>Giá vé người lớn : {to.Adult_price}</Text>
                                            <Text style={StyleTour.text1}>Giá vé trẻ em : {to.Children_price}</Text>
                                            <Text style={StyleTour.text1}>Nơi đi : {to.DeparturePlace?.Place_Name}</Text>
                                            <Text style={StyleTour.text1}>Nơi đến : {to.Destination?.Place_Name}</Text>
                                            <Text style={StyleTour.text1}>Ngày khởi hành: {new Date(to.DepartureDay?.slice(0, 10)).toLocaleDateString()} </Text>
                                            <Text style={StyleTour.text1}>Giờ khởi hành: {to.DepartureTime?.DepartureTime} </Text>
                                            <Text style={StyleTour.text1}>Hành trình: {to.Days} Ngày {to.Nights} Đêm </Text>
                                        </View>
                                    ) : null)}

                                    <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />
                                    <Text style={StyleTour.text2}>Thông tin đặt tour</Text>
                                    <Text style={StyleTour.text1}>Mã đặt tour : {c.id_booktour}</Text>
                                    <Text style={StyleTour.text1}>Ngày đặt chuyến đi : {new Date(c.book_date?.slice(0, 10)).toLocaleDateString()}</Text>
                                    <Text style={StyleTour.text1}>Số vé người lớn : {c.Quantity_Adult}</Text>
                                    <Text style={StyleTour.text1}>Số vé trẻ em : {c.Quantity_Children}</Text>
                                    <Text style={StyleTour.text1}>Tổng tiền : {c.Price}</Text>
                                    <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom: 8, marginTop: 8 }} />

                                    {c.State === "Wait for Paid" ? (
                                        <>
                                            <Text style={{ fontSize: 10 }}>Hãy thanh toán trước giờ khởi hành 48h nếu không tour của bạn sẽ bị hủy !</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Button style={StyleTour.btn1a} onPress={() => navigateToPayment(c)}><Text style={StyleTour.text22}>Thanh toán</Text></Button>
                                                <Button style={StyleTour.btn1b} onPress={() => cancelBookTour(c.id)}><Text style={StyleTour.text22}>Hủy</Text></Button>
                                            </View>
                                        </>
                                    ) : null}

                                    {c.State === 'Paid' ? (
                                        <>
                                            <Text>Hãy bỏ đồ vào vali và chuẩn bị đi thôi</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Button style={StyleTour.btn2}><Text style={StyleTour.text21}>{c.State}</Text></Button>
                                                <Button style={StyleTour.btn1b} onPress={() => cancelBookTour(c.id)}><Text style={StyleTour.text22}>Hủy</Text></Button>
                                            </View>
                                        </>
                                    ) : null}

                                    {c.State === 'Complete' ? (
                                        <>
                                            <Text style={{ fontSize: 10 }}>Đừng ngần ngại mà hãy chia sẻ chuyến đi của mình vào <Text style={[StyleTour.loginn, StyleTour.text1b,]} onPress={() => navigation.navigate("Blog")}>blog </Text>nhé</Text>
                                            <Button style={StyleTour.btn1}><Text style={StyleTour.text21}>{c.State}</Text></Button>
                                        </>
                                    ) : null}
                                    {c.State === 'Reject' ? (
                                        <>
                                            <Button style={StyleTour.btn3}><Text style={StyleTour.text21}>{c.State}</Text></Button>
                                        </>
                                    ) : null}
                                </Card.Content>
                            </Card>
                        )}
                    </React.Fragment>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#b2dbbf",
        color: "white",
        textAlign: "center",
        marginTop: 5,
        height: 45,
        width: 160,
        marginBottom: 20,
        marginLeft: 200,
        borderRadius: 20
    },
    button1: {
        textAlign: "center",
    },
});

export default BookTourDetail;