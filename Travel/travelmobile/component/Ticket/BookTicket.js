import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const BookingScreen = ({ navigation }) => {
  const [departurePlace, setDeparturePlace] = React.useState('');
  const [destinationPlace, setDestinationPlace] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState(new Date()); // Sử dụng thư viện DatePicker
  const [scheduleList, setScheduleList] = React.useState([]);

  const handleSearchSchedule = async () => {
    // Gọi API /api/schedulebooks/ với các tham số lọc
    try {
      const response = await fetch(
        `https://thuylinh.pythonanywhere.com/SchedulesBook/?departure_place=${departurePlace}&destination_place=${destinationPlace}&departure_datetime=${departureDate.toISOString()}`
      );
      const data = await response.json();
      setScheduleList(data);
    } catch (error) {
      console.error('Lỗi tìm kiếm lịch trình:', error);
    
    }
  };

  const navigateToSeatSelection = (schedule) => {
    navigation.navigate('SeatSelection', { schedule });
  };

  const renderScheduleItem = ({ item }) => (
    <TouchableOpacity style={styles.scheduleItem} onPress={() => navigateToSeatSelection(item)}>
      <Text>{item.route.departure_place.name} - {item.route.destination_place.name}</Text>
      <Text>Khởi hành: {new Date(item.departure_datetime).toLocaleString()}</Text>
      <Text>Giá: {item.price}</Text>
      <Button title="Chọn chỗ" onPress={() => navigateToSeatSelection(item)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Tìm kiếm lịch trình</Text>
      <TextInput placeholder="Điểm đi" value={departurePlace} onChangeText={setDeparturePlace} style={styles.input} />
      <TextInput placeholder="Điểm đến" value={destinationPlace} onChangeText={setDestinationPlace} style={styles.input} />
      {/* Sử dụng một thư viện DatePicker ở đây */}
      <Button title="Chọn ngày đi" onPress={() => {}} />
      <Button title="Tìm kiếm" onPress={handleSearchSchedule} />

      <FlatList
        data={scheduleList}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listContainer}
      />
    </View>
  );
};

// Màn hình Chọn Chỗ (Seat Selection Screen) - Cấu trúc cơ bản
const SeatSelectionScreen = ({ route, navigation }) => {
  const { schedule } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [quantityAdult, setQuantityAdult] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [seatClass, setSeatClass] = useState('Ghế ngồi');
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    // Gọi API /api/booktickets/{schedule_id}/booked-seats/ để lấy ghế đã đặt
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(`/api/booktickets/${schedule.id}/booked-seats/`);
        const data = await response.json();
        // Xử lý dữ liệu ghế đã đặt để hiển thị trên mô hình xe
        setBookedSeats(data.map(item => item.seat_number));
      } catch (error) {
        console.error('Lỗi lấy ghế đã đặt:', error);
      }
    };

    fetchBookedSeats();
  }, [schedule.id]);

  const handleSeatSelection = (seatNumber) => {
    // Logic chọn/bỏ chọn ghế
  };

  const handleBookTicket = async () => {
    // Gọi API POST /api/booktickets/ để đặt vé
    try {
      const response = await fetch('/api/booktickets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Thêm token xác thực nếu cần
        },
        body: JSON.stringify({
          schedule: schedule.id,
          quantity_adult: quantityAdult,
          quantity_children: quantityChildren,
          seat_class: seatClass,
          seat_numbers: selectedSeats,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Xử lý đặt vé thành công
        navigation.navigate('BookingConfirmation', { bookingDetails: data });
      } else {
        // Xử lý lỗi đặt vé
      }
    } catch (error) {
      console.error('Lỗi đặt vé:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Chọn chỗ cho lịch trình:</Text>
      <Text>{schedule.route.departure_place.name} - {schedule.route.destination_place.name}</Text>
      
      <Text>Ghế đã chọn: {selectedSeats.join(', ')}</Text>
      {/* Các bộ chọn số lượng hành khách và loại ghế */}
      <Button title="Đặt vé" onPress={handleBookTicket} />
    </View>
  );
};