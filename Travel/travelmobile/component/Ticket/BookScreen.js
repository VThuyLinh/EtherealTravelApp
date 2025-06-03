import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-paper';
import axios from 'axios';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com'; // Thay thế bằng URL backend của bạn

const BookingScreen = ({ route, navigation }) => {
    const { scheduleId } = route.params;
    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]); // Ghế trống từ API /Available-seats/
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [quantityAdult, setQuantityAdult] = useState(1);
    const [quantityChildren, setQuantityChildren] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookTicketId, setBookTicketId] = useState(null);
    const [bookedSeatsFromServer, setBookedSeatsFromServer] = useState([]); // Ghế đã đặt từ API /BookedSeat/
    const [allPossibleSeats, setAllPossibleSeats] = useState([]); // Danh sách TẤT CẢ các ghế cho schedule này

    useEffect(() => {
        fetchScheduleDetails();
        fetchAvailableSeats();
        fetchBookedSeats();
    }, [scheduleId]);

    const fetchScheduleDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/SchedulesBook/${scheduleId}/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setScheduleDetails(data);
            // Giả định scheduleDetails.transport.available_seats chứa danh sách tất cả các ghế
            setAllPossibleSeats(data.transport.available_seats || []);
        } catch (e) {
            setError('Không thể tải thông tin lịch trình.');
            console.error('Fetch Schedule Error:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookedSeats = async () => {
        try {
            const response = await axios.get(`https://thuylinh.pythonanywhere.com/BookedSeat/get_booked_seats_by_schedule/?schedule=${scheduleId}`);
            const data = response.data;
            console.log('Booked Seats from Server:', data.booked_seats);
            setBookedSeatsFromServer(data.booked_seats || []);
        } catch (e) {
            setError('Không thể tải danh sách ghế đã đặt.');
            console.error('Fetch Booked Seats Error:', e);
        }
    };

    const fetchAvailableSeats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Available-seats/?schedule=${scheduleId}`);
            const data = await response.data.available_seats;
            console.log('Available Seats:', data);
            setAvailableSeats(data);
            console.log('Current Available Seats State:', availableSeats);
        } catch (e) {
            setError('Không thể tải danh sách ghế trống.');
            console.error('Fetch Available Seats Error:', e);
        }
    };

    const toggleSeatSelection = (seatNumber) => {
        const totalQuantity = quantityAdult + quantityChildren;
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else if (selectedSeats.length < totalQuantity && !bookedSeatsFromServer.includes(seatNumber)) {
            setSelectedSeats([...selectedSeats, seatNumber]);
        } else if (bookedSeatsFromServer.includes(seatNumber)) {
            Alert.alert('Thông báo', 'Ghế này đã được đặt.');
        } else {
            Alert.alert('Thông báo', `Bạn chỉ có thể chọn tối đa ${totalQuantity} ghế.`);
        }
    };

    const createBookTicket = async () => {
        setBookingLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/Booktickets/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schedule: scheduleId,
                    one_or_return: true, // Mặc định
                    quantity_adult: quantityAdult,
                    quantity_children: quantityChildren,
                    user_book: 4, // Thay bằng ID người dùng thực tế sau khi có hệ thống xác thực
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setBookTicketId(data.id);
                return data.id;
            } else {
                const errorData = await response.json();
                setError(`Lỗi khi tạo BookTicket: ${JSON.stringify(errorData)}`);
                return null;
            }
        } catch (e) {
            setError('Đã có lỗi xảy ra khi tạo BookTicket.');
            console.error('Create BookTicket Error:', e);
            return null;
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBookTicket = async () => {
        const totalQuantity = quantityAdult + quantityChildren;
        if (selectedSeats.length !== totalQuantity) {
            Alert.alert('Lỗi', `Vui lòng chọn ${totalQuantity} ghế.`);
            return;
        }

        setBookingLoading(true);
        setError(null);

        const bookTicketIdResult = await createBookTicket();
        if (bookTicketIdResult) {
            try {
                const bookedSeatsData = selectedSeats.map(seat => ({
                    book_ticket: bookTicketIdResult,
                    schedule: scheduleId,
                    seat_number: seat, // Sử dụng 'seat_number' (số ít) và giá trị ghế trực tiếp
                }));

                const response = await fetch(`${API_BASE_URL}/BookedSeat/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookedSeatsData), // Gửi trực tiếp mảng các đối tượng
                });

                if (response.ok) {
                    Alert.alert('Thành công', 'Đặt vé thành công!', [
                        { text: 'Xem vé của tôi', onPress: () => navigation.navigate('MyBookings') },
                        { text: 'OK' },
                    ]);
                } else {
                    const errorData = await response.json();
                    setError(`Đặt ghế thất bại: ${JSON.stringify(errorData)}`);
                    // Có thể cần rollback BookTicket nếu đặt ghế thất bại
                }
            } catch (e) {
                setError('Đã có lỗi xảy ra khi đặt ghế.');
                console.error('BookedSeat Error:', e);
                // Có thể cần rollback BookTicket nếu đặt ghế thất bại
            } finally {
                setBookingLoading(false);
            }
        }
    };

    const increaseAdult = () => {
        setQuantityAdult(prev => prev + 1);
    };
    const increaseChild = () => {
        setQuantityChildren(prev => prev + 1);
    };

    const decreaseAdult = () => {
        setQuantityAdult(prev => Math.max(1, prev - 1));
    };
    const decreaseChild = () => {
        setQuantityChildren(prev => Math.max(0, prev - 1));
    };

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
    }

    if (!scheduleDetails || !scheduleDetails.transport) {
        return <View style={styles.infoContainer}><Text>Không tìm thấy thông tin lịch trình hoặc thông tin vận chuyển.</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Thông tin lịch trình */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    {scheduleDetails.route.departure_place.Place_Name} - {scheduleDetails.route.destination_place.Place_Name}
                </Text>
                <Text style={styles.infoText}>
                    Thời gian: {new Date(scheduleDetails.departure_datetime).toLocaleString()}
                </Text>
                <Text style={styles.infoText}>
                    Người lớn: {parseInt(scheduleDetails.price).toLocaleString('vi-VN')} VNĐ/ 1 ghế
                </Text>
                <Text style={styles.infoText}>
                    Trẻ em (1m2-1m4): {(scheduleDetails.price * 0.6).toLocaleString('vi-VN')} VNĐ/ 1 ghế
                </Text>
            </View>

            {/* Chọn số lượng hành khách */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Số lượng người lớn:</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity style={styles.quantityButton} onPress={decreaseAdult}>
                        <Text style={styles.quantityButtonText}><Icon source="minus-circle" size={20}/></Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, styles.quantityInput, { backgroundColor: 'white' }]}
                        value={quantityAdult.toString()}
                        onChangeText={(text) => setQuantityAdult(parseInt(text) || 1)}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.quantityButton} onPress={increaseAdult}>
                        <Text style={styles.quantityButtonText}><Icon source="plus-circle" size={20}/></Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Số lượng trẻ em:</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity style={styles.quantityButton} onPress={decreaseChild}>
                        <Text style={styles.quantityButtonText}><Icon source="minus-circle" size={20}/></Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, styles.quantityInput, { backgroundColor: 'white' }]}
                        value={quantityChildren.toString()}
                        onChangeText={(text) => setQuantityChildren(parseInt(text) || 0)}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.quantityButton} onPress={increaseChild}>
                        <Text style={styles.quantityButtonText}><Icon source="plus-circle" size={20}/></Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Loại ghế */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Loại ghế: {scheduleDetails.transport.seat_class}</Text>
            </View>

            {/* Chọn ghế */}
            <Text style={styles.label}>Chọn ghế ({selectedSeats.length}/{quantityAdult + quantityChildren}):</Text>
            <View style={styles.seatGrid}>
                {allPossibleSeats.map(seat => {
                    const isAvailable = availableSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    const isBooked = bookedSeatsFromServer.includes(seat);
                    return (
                        <TouchableOpacity
                            key={seat}
                            style={[
                                styles.seatContainer,
                                isAvailable ? styles.availableSeat : (isBooked ? styles.bookedSeat : styles.selectedSeat),
                                isSelected && styles.selectedSeat,
                            ]}
                            onPress={() => isAvailable && toggleSeatSelection(seat)}
                            disabled={isBooked}
                        >
                            <Icon
                                source="seat"
                                size={25}
                                color={isSelected ? 'white' : (isAvailable ? 'black' : 'gray')}
                            />
                            <Text style={styles.seatNumber}>{seat}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>


            {/* Nút đặt vé */}
            <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookTicket}
                disabled={selectedSeats.length !== quantityAdult + quantityChildren || bookingLoading}
            >
                <Text style={styles.bookButtonText}>
                    {bookingLoading ? <ActivityIndicator color="white" size="small" /> : 'Đặt vé'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    bookButton: {
        backgroundColor: 'green', // Màu nền của nút
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:15,
        marginBottom:30,
        width:340,
        marginLeft:5
    },
    bookButtonText: {
        color: 'white', // Màu chữ
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 20,

        backgroundColor:'white'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#e0f2f7',
        borderRadius: 5,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 15,
    },
    picker: {
        borderColor: '#ccc',
        borderRadius: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityInput: {
        flex: 1,
        textAlign: 'center',
    },
    seatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    seatContainer: { // Style cho container của icon và số thứ tự
        width: 60,
        height: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center', // Căn giữa theo chiều ngang
        alignItems: 'center', // Căn giữa theo chiều dọc cho icon và text
        margin: 5,
        flexDirection: 'column',
        marginLeft:20 // Sắp xếp icon và text theo chiều dọc
    },

    availableSeat: {
        backgroundColor: 'white',
    },
    bookedSeat: {
        backgroundColor: '#ddd',
    },
    selectedSeat: {
        backgroundColor: 'green',
    },
    seatNumber: { // Style cho số thứ tự ghế
        fontSize: 12,
        marginTop: 2, // Khoảng cách giữa icon và số
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default BookingScreen;