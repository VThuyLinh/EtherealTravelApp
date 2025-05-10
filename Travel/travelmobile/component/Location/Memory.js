import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import * as Locationn from 'expo-location';
import axios from 'axios';
import { MyUserContext } from '../../config/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Memory = () => {
    const [location, setLocation] = useState(null);
    const [memories, setMemories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useContext(MyUserContext);
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchLocationAndMemories = async () => {
            setLoading(true);
            setError(null);

            let { status } = await Locationn.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Quyền truy cập vị trí bị từ chối.');
                setLoading(false);
                return;
            }

            try {
                const currentLocation = await Locationn.getCurrentPositionAsync({});
                setLocation(currentLocation.coords);

                const storedToken = await AsyncStorage.getItem("token");
                setToken(storedToken);
                console.warn("Token khi gọi CheckLocation:", storedToken);

                const response = await axios.get(
                    `https://thuylinh.pythonanywhere.com/CheckLocation/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log(response.data);
                setMemories(response.data.memory);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi khi lấy vị trí hoặc kỷ niệm:', err);
                setError('Không thể lấy vị trí hoặc kỷ niệm.');
                setLoading(false);
            }
        };

        fetchLocationAndMemories();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.memoryItem}>
            <Text style={styles.memoryContent}>{item.content}</Text>
            <Text style={styles.memoryDate}>
                Đã lưu vào: {new Date(item.created_at).toLocaleDateString()}
            </Text>
            {item.location && (
                <Text style={styles.memoryLocation}>
                    Vị trí: {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
                </Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Đang tải kỷ niệm gần đây...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kỷ Niệm Gần Đây</Text>
            {memories.length === 0 ? (
                <Text style={styles.noMemoriesText}>Không có kỷ niệm nào gần vị trí này.</Text>
            ) : (
                <FlatList
                    data={memories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    memoryItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    memoryContent: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    memoryDate: {
        fontSize: 12,
        color: '#777',
        marginBottom: 5,
    },
    memoryLocation: {
        fontSize: 12,
        color: '#777',
    },
    noMemoriesText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Memory;