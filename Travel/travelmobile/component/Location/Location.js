
import React, { useContext, useState } from "react";
import * as Permissionss from 'expo-permissions';
import * as Locationn from 'expo-location';
import { Alert, Button, Image, Linking, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { MyUserContext } from "../../config/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Location = () => {
    const [location, setLocation] = React.useState('');
    const [loc, setLoc] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const user = useContext(MyUserContext);
    const [token, setToken] = React.useState('');
    const nav= useNavigation();
    const [content, setContent] = React.useState(''); // State cho nội dung kỷ niệm
    let locc = '';

    const getLocation = async () => {
        let { status } = await Locationn.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({
                errMsg: 'Quyền định vị chưa được cấp'
            });
            return;
        }

        setLoading(true);

        try {
            const currentLocation = await Locationn.getCurrentPositionAsync({});
            setLoc(currentLocation);
            locc = currentLocation;
            setLocation(`${currentLocation.coords.longitude}-${currentLocation.coords.latitude}`);

            const storedToken = await AsyncStorage.getItem("token");
            setToken(storedToken);
            console.warn("Token khi gửi vị trí:", storedToken);

            let formData = {
                latitude: `${currentLocation.coords.latitude}`,
                longitude: `${currentLocation.coords.longitude}`,
                content: content, // Sử dụng nội dung người dùng nhập
                user: `${user.id}`,
            };

            let res = await axios.post(`https://thuylinh.pythonanywhere.com/Memory/`, formData, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
            });
            console.warn("Phản hồi từ server:", res.data);

            Alert.alert('Thành công', 'Vị trí và kỷ niệm của bạn đã được lưu lại!');
            setContent(''); // Reset ô nhập nội dung sau khi lưu thành công
            nav.navigate('MemoryTab');
        } catch (ex) {
            console.log("Lỗi khi lấy và gửi vị trí:", ex);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy hoặc lưu vị trí.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lưu Khoảnh Khắc</Text>
            <Text style={styles.description}>
                Lưu lại vị trí đặc biệt của bạn và một dòng ký ức tại nơi đó.
                Khi bạn quay lại, chúng tôi sẽ gợi nhớ kỷ niệm này!
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nội dung kỷ niệm:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập kỷ niệm tại đây..."
                    value={content}
                    onChangeText={setContent}
                    multiline // Cho phép nhập nhiều dòng
                    numberOfLines={3} // Hiển thị ban đầu 3 dòng
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={getLocation}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Đang lưu...' : 'Lấy vị trí và lưu chúng vào kỷ niệm'}
                </Text>
            </TouchableOpacity>

            
            <View style={{ marginTop: 10 }}>
                 <Image width={400} height={400} source={{ uri: 'https://res.cloudinary.com/dqcjhhtlm/image/upload/v1728244487/Screenshot_2024-10-07_025423_pokcm9.png' }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start', // Đặt các phần tử từ đầu trang
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 15,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top', // Để con trỏ ở đầu khi nhập nhiều dòng
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Tạo hiệu ứng đổ bóng nhẹ
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    imageContainer: {
        marginTop: 40,
        width: '80%',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden', // Cắt bỏ phần thừa của ảnh nếu không vừa container
    },
    image: {
        width: 500,
        height: 600,
    },
});

export default Location;