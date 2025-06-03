import React, { useCallback, useState, useEffect } from 'react'; // Import useEffect
import {View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, ScrollView, Platform, Switch,Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import ScheduleItem from './ScheduleItem'; 

const API_BASE_URL = 'https://thuylinh.pythonanywhere.com'; // Thay thế bằng URL backend của bạn

const SearchTicketScreen = ({ navigation, route }) => {
    const [departurePlace, setDeparturePlace] = useState('');
    const [allTicket, setAllTicket] = useState([]);
    const [destinationPlace, setDestinationPlace] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [departurePlaces, setDeparturePlaces] = useState([]);
    const [destinationPlaces, setDestinationPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(true);
    const [errorPlaces, setErrorPlaces] = useState(null);
    const [isDateSelected, setIsDateSelected] = useState(true); // Mặc định là có chọn ngày
    const [searchResults, setSearchResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingAllTicket, setloadingAllTicket] = useState(false);
    const [errorSearch, setErrorSearch] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentSearchParams, setCurrentSearchParams] = useState({});
    const [hasSearched, setHasSearched] = useState(false); // Theo dõi đã tìm kiếm lần nào chưa

    useEffect(() => {
        fetchDeparturePlaces();
        fetchDestinationPlaces();
        getAllTicket();
        // Reset state khi component được focus trở lại (nếu dùng Navigation)
        const unsubscribe = navigation.addListener('focus', () => {
            setDeparturePlace('');
            setDestinationPlace('');
            setDepartureDate(new Date());
            setIsDateSelected(true);
            setSearchResults([]);
            setHasSearched(false);
            // setAllTicket([]);
        });
        return unsubscribe; // Cleanup listener khi component unmount
    }, [navigation]);


    const getAllTicket = async () => {
        
        try {
            const response = await axios.get(`https://thuylinh.pythonanywhere.com/SchedulesBook/`);
            const data = response.data;
            setAllTicket(data);
            setloadingAllTicket(false);
        } catch (e) {
            console.error('getAllTicket error:', e);
            setloadingAllTicket(false);
        }
    };

    const fetchDeparturePlaces = async () => {
        setLoadingPlaces(true);
        setErrorPlaces(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/DeparturePlaces/`);
            const data = response.data;
            setDeparturePlaces(data);
            setLoadingPlaces(false);
        } catch (e) {
            setErrorPlaces('Không thể tải danh sách điểm đi.');
            console.error('Fetch Departure Places Error:', e);
            setLoadingPlaces(false);
        }
    };

    const fetchDestinationPlaces = async () => {
        setLoadingPlaces(true);
        setErrorPlaces(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/DestinationPlaces/`);
            const data = response.data;
            setDestinationPlaces(data);
            setLoadingPlaces(false);
        } catch (e) {
            setErrorPlaces('Không thể tải danh sách điểm đến.');
            console.error('Fetch Destination Places Error:', e);
            setLoadingPlaces(false);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || departureDate;
        setShowDatePicker(Platform.OS === 'ios');
        setDepartureDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleSearchPress = () => {
        const searchParams = {
            departurePlace,
            destinationPlace,
        };
        if (isDateSelected) {
            searchParams.departureDate = departureDate.toISOString().split('T')[0]; // Format date toYYYY-MM-DD
        }
        handleSearch(searchParams);
        setHasSearched(true); 
    };

    const getFormattedDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today;
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleSearch(currentSearchParams);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [handleSearch, currentSearchParams]);

    const handleSearch = (searchParams) => {
        let apiUrl = `${API_BASE_URL}/SchedulesBook/?`;
        if (searchParams.departurePlace) {
            apiUrl += `departure_place=${searchParams.departurePlace}&`;
        }
        if (searchParams.destinationPlace) {
            apiUrl += `destination_place=${searchParams.destinationPlace}&`;
        }
        if (searchParams.departureDate) {
            apiUrl += `departure_datetime=${searchParams.departureDate}&`;
        }

        apiUrl = apiUrl.slice(0, -1);

        console.log("API URL:", apiUrl);
        setLoadingSearch(true);
        setErrorSearch(null);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setSearchResults(data);
                setLoadingSearch(false);
                setCurrentSearchParams(searchParams);
            })
            .catch(error => {
                console.error("Error fetching schedules:", error);
                setErrorSearch("Không thể tải lịch trình. Vui lòng thử lại.");
                setLoadingSearch(false);
                setSearchResults([]);
            });
    };

    const handleReload = () => {
        setSearchResults([]);
        setErrorSearch(null);
        setCurrentSearchParams({});
        setRefreshing(true);
        handleSearch({});
        setHasSearched(true); 
    };

    const handleSelectSchedule = (scheduleId) => {
        navigation.navigate('Booking', { scheduleId });
    };

    if (loadingSearch) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
    }

    if (errorSearch) {
        return (
            <View style={styles.errorContainer}>
                <TouchableOpacity onPress={handleReload} style={styles.reloadButton}>
                    <Text style={styles.reloadButtonText}>Tải lại</Text>
                </TouchableOpacity>
                <Text style={styles.errorText}>{errorSearch}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.screenContainer}>
            <View style={styles.searchContainer}>
                <Text style={styles.label}>Điểm đi:</Text>
                <View style={styles.pickerContainer}>
                    {loadingPlaces ? (
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    ) : errorPlaces ? (
                        <Text style={styles.errorText}>{errorPlaces}</Text>
                    ) : (
                        <Picker
                            selectedValue={departurePlace}
                            style={styles.picker}
                            onValueChange={(itemValue) => setDeparturePlace(itemValue)}
                            dropdownIconColor={styles.pickerIcon.color}
                        >
                            <Picker.Item label="Chọn điểm đi" value="" />
                            {departurePlaces.map((place, index) => (
                                <Picker.Item key={index} label={place} value={place} />
                            ))}
                        </Picker>
                    )}
                </View>

                <Text style={styles.label}>Điểm đến:</Text>
                <View style={styles.pickerContainer}>
                    {loadingPlaces ? (
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    ) : errorPlaces ? (
                        <Text style={styles.errorText}>{errorPlaces}</Text>
                    ) : (
                        <Picker
                            selectedValue={destinationPlace}
                            style={styles.picker}
                            onValueChange={(itemValue) => setDestinationPlace(itemValue)}
                            dropdownIconColor={styles.pickerIcon.color}
                        >
                            <Picker.Item label="Chọn điểm đến" value="" />
                            {destinationPlaces.map((place, index) => (
                                <Picker.Item key={index} label={place} value={place} />
                            ))}
                        </Picker>
                    )}
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.label}>Ngày đi:</Text>
                    <Switch
                        value={isDateSelected}
                        onValueChange={setIsDateSelected}
                        style={styles.dateSwitch}
                    />
                    <Text style={styles.switchLabel}>{isDateSelected ? 'Chọn ngày' : 'Không chọn ngày'}</Text>
                </View>

                {isDateSelected && (
                    <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
                        <Icon name="calendar" size={20} color="black" style={styles.calendarIcon} />
                        <Text style={styles.dateText}>{getFormattedDate(departureDate)}</Text>
                    </TouchableOpacity>
                )}
                {showDatePicker && isDateSelected && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={departureDate}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                        minimumDate={getMinDate()}
                        maximumDate={getMaxDate()}
                    />
                )}

                <Button title="Tìm kiếm" onPress={handleSearchPress} color="#28a745" />
            </View>

            
            {hasSearched && (
                <>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ScheduleItem schedule={item} onSelect={handleSelectSchedule} />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy vé xe phù hợp.</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                </>
                
            )}
            {!hasSearched && (
                <>
                <FlatList
                    data={allTicket}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ScheduleItem schedule={item} onSelect={handleSelectSchedule} />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Đang cập nhật vé. Vui lòng quay lại sau</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingTop: 20,
    },
    searchContainer: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#343a40',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    picker: {
        height: 60,
        width: '100%',
        color: '#495057',
    },
    loadingText: {
        padding: 15,
        color: '#6c757d',
    },
    errorText: {
        color: '#dc3545',
        padding: 15,
    },
    pickerIcon: {
        color: '#007bff',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateSwitch: {
        marginRight: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#495057',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    calendarIcon: {
        marginRight: 10,
    },
    dateText: {
        fontSize: 16,
        color: '#495057',
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
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
    reloadButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginLeft: 20,
    },
    reloadButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});

export default SearchTicketScreen;


