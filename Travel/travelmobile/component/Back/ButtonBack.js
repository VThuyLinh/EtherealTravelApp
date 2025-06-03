// components/BackButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper'; // Giả sử bạn đang dùng Icon từ react-native-paper

const BackButton = ({ destination, style }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (destination) {
            navigation.navigate(destination);
        } else {
            // Mặc định là quay lại màn hình trước đó nếu không có destination được cung cấp
            navigation.goBack();
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.backButtonIconOnly, style]} // Cho phép truyền thêm style từ bên ngoài
            onPress={handlePress}
        >
            <Icon source="arrow-left" size={28} color="#2C3E50" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButtonIconOnly: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        borderRadius: 50,
        // backgroundColor: 'rgba(255,255,255,0.7)', // Bạn có thể thêm màu nền nhẹ để nổi bật hơn
        zIndex: 10,
    },
});

export default BackButton;