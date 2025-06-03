import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ScheduleItem = ({ schedule, onSelect }) => {
    return (
        <TouchableOpacity style={styles.item} onPress={() => onSelect(schedule.id)}>
            <Text style={styles.title}>
                {schedule.route.departure_place.Place_Name} - {schedule.route.destination_place.Place_Name}
            </Text>
            <Text>Thời gian: {new Date(schedule.departure_datetime).toLocaleString()}</Text>
            <Text>Phương tiện: {schedule.transport.name} ({schedule.transport.license})</Text>
            <Text>Giá vé: {schedule.price} VNĐ</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ScheduleItem;