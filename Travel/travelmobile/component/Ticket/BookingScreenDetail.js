import axios from 'axios';

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MyUserContext } from '../../config/context';

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com'; // Thay thế bằng URL backend của bạn

const MyBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user= useContext(MyUserContext);

    React.useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://thuylinh.pythonanywhere.com/Booktickets/mybookticket/?user_id=${user.id}`);
            const data = response.data;
            console.log(data)
            setBookings(data);
        } catch (e) {
            setError('Không thể tải danh sách vé của bạn.');
            console.error('Fetch My Bookings Error:', e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.bookingItem}>
            <Text style={styles.bookingId}>Mã vé: {item.id}</Text>
            <Text style={styles.route}>
                {item.schedule.route.departure_place.name} - {item.schedule.route.destination_place.name}
            </Text>
            <Text>Thời gian khởi hành: {new Date(item.schedule.departure_datetime).toLocaleString()}</Text>
            <Text>Số lượng: Người lớn: {item.quantity_adult}, Trẻ em: {item.quantity_children}</Text>
            <Text>Loại ghế: {item.seat_class}</Text>
            <Text>Ghế đã đặt: {item.booked_seats.map(seat => seat.seat_number).join(', ')}</Text>
            <Text>Trạng thái: {item.state}</Text>
        </View>
    );

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có vé nào.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    bookingItem: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginBottom: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    bookingId: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    route: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});

export default MyBookingsScreen;