import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Giữ nguyên nếu bạn dùng ở nơi khác
import { Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const NearbyPlaces = () => {
    const [location, setLocation] = useState(null);
    const [places, setPlaces] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedPlaceType, setSelectedPlaceType] = useState('restaurant');
    // THAY ĐỔI LỚN: Thêm state để kiểm tra đã tìm kiếm chưa
    const [hasSearched, setHasSearched] = useState(false); 

    const placeOptions = [
        { label: 'Nhà hàng', value: 'restaurant', tag: 'amenity=restaurant', icon: 'silverware-fork-knife' },
        { label: 'Quán cà phê', value: 'cafe', tag: 'amenity=cafe', icon: 'coffee' },
        { label: 'Trung tâm', value: 'mall', tag: 'shop=mall', icon: 'shopping' },
        { label: 'Khách sạn', value: 'hotel', tag: 'tourism=hotel', icon: 'bed' },
        { label: 'Bệnh viện', value: 'hospital', tag: 'amenity=hospital', icon: 'hospital-building' },
        { label: 'Ngân hàng', value: 'bank', tag: 'amenity=bank', icon: 'bank' },
        { label: 'ATM', value: 'atm', tag: 'amenity=atm', icon: 'cash-multiple' },
        { label: 'Công viên', value: 'park', tag: 'leisure=park', icon: 'tree' },
        { label: 'Trạm xăng', value: 'fuel', tag: 'amenity=fuel', icon: 'fuel' },
    ];

    const resetStates = useCallback(() => {
        console.log("Resetting states...");
        setLocation(null);
        setPlaces([]);
        setErrorMsg(null);
        setLoading(false);
        setSelectedPlaceType('restaurant');
        // Reset hasSearched về false khi reset trạng thái
        setHasSearched(false); 
    }, []);

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Quyền định vị chưa được cấp. Vui lòng bật quyền định vị trong cài đặt.');
            return null;
        }

        try {
            setLoading(true);
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeout: 15000,
                maximumAge: 1000 * 60 * 5
            });
            setLocation(loc.coords);
            console.log('Vị trí hiện tại:', loc.coords);
            return loc.coords;
        } catch (error) {
            setErrorMsg('Lỗi khi lấy vị trí: ' + error.message);
            console.error('Lỗi lấy vị trí:', error);
            Alert.alert("Lỗi Vị Trí", "Không thể lấy được vị trí hiện tại của bạn. Vui lòng kiểm tra cài đặt định vị và thử lại.");
            return null;
        } finally {
            setLoading(false); 
        }
    };

    const getNearbyPlacesWithOverpass = useCallback(async (latitude, longitude, placeTypeTag, radius = 2500) => {
        if (!latitude || !longitude || !placeTypeTag) {
            console.warn('Không có tọa độ hoặc loại địa điểm để tìm kiếm.');
            return [];
        }

        const overpassQuery = `
            [out:json];
            (
              node(around:${radius},${latitude},${longitude})[${placeTypeTag}];
              way(around:${radius},${latitude},${longitude})[${placeTypeTag}];
            );
            out center;
        `;
        
        const url = 'https://overpass-api.de/api/interpreter';

        try {
            setLoading(true);
            const response = await axios.post(url, overpassQuery, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 20000
            });
            
            const placesData = response.data.elements
                .map(item => {
                    const lat = item.lat || (item.center && item.center.lat);
                    const lon = item.lon || (item.center && item.center.lon);

                    if (item.tags && item.tags.name && lat && lon) {
                        const street = item.tags['addr:street'] || '';
                        const housenumber = item.tags['addr:housenumber'] || '';
                        const city = item.tags['addr:city'] || item.tags['addr:province'] || '';
                        const postCode = item.tags['addr:postcode'] || '';
                        let addressParts = [];
                        if (housenumber) addressParts.push(housenumber);
                        if (street) addressParts.push(street);
                        if (city) addressParts.push(city);
                        if (postCode) addressParts.push(postCode);
                        const fullAddress = addressParts.filter(Boolean).join(', ');

                        return {
                            place_id: item.id.toString(),
                            name: item.tags.name,
                            latitude: lat,
                            longitude: lon,
                            address: fullAddress || "Địa chỉ không xác định",
                            openingHours: item.tags.opening_hours || null,
                            cuisine: item.tags.cuisine || null,
                            price: item.tags.price || item.tags.charge || null,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            return placesData;
        } catch (error) {
            console.error('Lỗi khi tìm kiếm địa điểm với Overpass API:', error);
            setErrorMsg('Lỗi khi tìm kiếm địa điểm lân cận: ' + error.message);
            Alert.alert("Lỗi Tìm Kiếm", "Không thể tải danh sách địa điểm. Vui lòng kiểm tra kết nối mạng và thử lại.");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = useCallback(async () => {
        if (!location) {
            Alert.alert("Lỗi", "Không thể tìm kiếm. Vị trí hiện tại của bạn chưa được xác định.");
            return;
        }
        setPlaces([]);
        setLoading(true);
        // Đặt hasSearched thành true khi người dùng nhấn nút tìm kiếm
        setHasSearched(true); 

        const selectedTag = placeOptions.find(opt => opt.value === selectedPlaceType)?.tag;
        if (selectedTag) {
            const nearbyResults = await getNearbyPlacesWithOverpass(
                location.latitude,
                location.longitude,
                selectedTag
            );
            setPlaces(nearbyResults);
        } else {
            Alert.alert("Lỗi", "Vui lòng chọn một loại địa điểm hợp lệ.");
        }
        setLoading(false);
    }, [location, selectedPlaceType, placeOptions, getNearbyPlacesWithOverpass]);

    useFocusEffect(
        useCallback(() => {
            resetStates();
            return () => {};
        }, [resetStates])
    );

    useEffect(() => {
        getUserLocation();
    }, []);

    if (errorMsg) {
        return <Text style={styles.errorText}>{errorMsg}</Text>;
    }

    return (
        <View style={styles.container}>
            {location ? (
                // <Text style={styles.locationText}>
                //     Vị trí hiện tại: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                // </Text>
                <></>
            ) : (
                <Text style={styles.locationText}>Đang chờ vị trí của bạn...</Text>
            )}

            <View style={styles.optionsContainer}>
                <Text style={styles.optionsHeader}>Bạn muốn tìm gì?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsScroll}>
                    {placeOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.optionButton,
                                selectedPlaceType === option.value && styles.optionButtonSelected,
                            ]}
                            onPress={() => setSelectedPlaceType(option.value)}
                        >
                            {option.icon && (
                                <Icon 
                                    source={option.icon} 
                                    size={30} 
                                    color={selectedPlaceType === option.value ? '#FFFFFF' : '#34495E'} 
                                    style={styles.optionIcon}
                                />
                            )}
                            <Text style={[
                                styles.optionButtonText,
                                selectedPlaceType === option.value && styles.optionButtonTextSelected,
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={loading || !location} 
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.searchButtonText}>Tìm kiếm địa điểm</Text>
                )}
            </TouchableOpacity>

           
            {loading && location ? (
                <>
                     <Text style={styles.resultsHeader}>Kết quả tìm kiếm:</Text>
                     <View style={styles.loadingListContainer}>
                     <ActivityIndicator size="large" color="#0000ff" />
                     <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
                </View>
                </>
                
            ) : (
                <FlatList
                    data={places}
                    renderItem={({ item }) => (
                        <View style={styles.placeItem}>
                            <Text style={styles.placeName}>{item.name}</Text>
                            {item.address && item.address !== "Địa chỉ không xác định" && (
                                <Text style={styles.placeAddress}>{item.address}</Text>
                            )}
                            
                            {item.cuisine && (
                                <Text style={styles.placeDetail}>
                                    <Text style={styles.boldText}>Loại hình:</Text> {item.cuisine.charAt(0).toUpperCase() + item.cuisine.slice(1)}
                                </Text>
                            )}
                            
                            {item.openingHours && (
                                <Text style={styles.placeDetail}>
                                    <Text style={styles.boldText}>Giờ mở cửa:</Text> {item.openingHours}
                                </Text>
                            )}

                            {item.price && (
                                <Text style={styles.placeDetail}>
                                    <Text style={styles.boldText}>Giá:</Text> {item.price}
                                </Text>
                            )}
                        </View>
                    )}
                    keyExtractor={item => item.place_id}
                    ListEmptyComponent={() => (
                        // Chỉ hiển thị "Không tìm thấy" nếu ĐÃ TÌM KIẾM và không loading, không lỗi, và danh sách trống
                        !loading && !errorMsg && places.length === 0 && hasSearched ? 
                            <Text style={styles.emptyListText}>Không tìm thấy địa điểm nào phù hợp.</Text> 
                            : null // Không hiển thị gì nếu chưa tìm kiếm hoặc đang tải
                    )}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        padding: 10,
        paddingTop: 20,
    },
    greetingText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
        textAlign: 'center',
    },
    locationText: {
        fontSize: 15,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    optionsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495E',
        marginBottom: 15,
        textAlign: 'center',
    },
    optionsScroll: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    optionButton: {
        borderRadius: 15,
        backgroundColor: '#ECF0F1',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#D0D3D4',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    optionButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
    },
    optionIcon: {
        marginBottom: 5,
    },
    optionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#34495E',
        textAlign: 'center',
    },
    optionButtonTextSelected: {
        color: '#FFFFFF',
    },
    searchButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#1ABC9C',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        elevation: 10,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },
    resultsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D3D4',
        paddingBottom: 10,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    placeItem: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495E',
        marginBottom: 5,
    },
    placeAddress: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 8,
    },
    placeDetail: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    boldText: {
        fontWeight: 'bold',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#777',
    },
    loadingListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },
});

export default NearbyPlaces;