import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Chip, DataTable, Icon, Searchbar, SegmentedButtons, Text, useTheme} from "react-native-paper";
import React, { useContext, useState, useCallback, useEffect } from "react";
import APIs, { endpoints } from "../../config/APIs";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Image } from "react-native";

import { MyUserContext } from "../../config/context";
import { isCloseToBottom } from "../Utils/util";
import StyleAll from "../../style/StyleAll";
import StyleTour from "../../style/StyleTour";

const TourPicker = ({ setDepartureTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDateText, setSelectedDateText] = useState("  Chọn ngày khởi hành bạn muốn tìm");
    const [selectedDate, setSelectedDate] = useState(null); // State để lưu trữ ngày đã chọn

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setSelectedDateText(formattedDate);
        setSelectedDate(formattedDate);
        setDepartureTime(formattedDate);
    };

    const handleClearDate = () => {
        setSelectedDate(null);
        setSelectedDateText("  Chọn ngày khởi hành bạn muốn tìm");
        setDepartureTime(""); // Xóa ngày khỏi state tìm kiếm
    };

    return (
        <View style={styles1.container}>
            <TouchableOpacity style={styles1.dateButton} onPress={showDatePicker}>
                <Icon style={styles1.calendarIcon} size={30} source="calendar-month-outline" color={"black"} />
                <Text style={{marginLeft:15, fontSize:16}}>
                       {selectedDateText}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            {selectedDate && (
                <TouchableOpacity style={styles1.clearButton} onPress={handleClearDate}>
                    <Text style={{color:"red"}}> Xóa</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles1 = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Để nút xóa ở bên phải
        marginBottom: 5,
        marginLeft:15
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexGrow: 1, // Để chiếm không gian còn lại
        marginRight: 10, // Khoảng cách với nút xóa
    },
    calendarIcon: {
        marginRight: 10,
        marginTop: 10,
    },
    dateText: {
        fontSize: 16,
        color: '#36454F',
    },
    clearButton: {
        padding: 5,
        marginRight:100
    },
});


const Tour = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [tour, setTour] = useState([]);
    const [page, setPage] = useState(1);
    const [departurePlace, setDeparturePlace] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [value, setValue] = useState('Destination');
    const [q, setQ] = useState('');

    const theme = useTheme(); // Lấy theme hiện tại của react-native-paper

    const loadTour = useCallback(async () => {
        try {
            setLoading(true);
            const res = await APIs.get(`${endpoints['tour']}?noidi=${departurePlace}&noiden=${destination}&thoigiandi=${departureTime}&Price=${price}&page=${page}`);
            console.log("API URL:", `${endpoints['tour']}?noidi=${departurePlace}&noiden=${destination}&thoigiandi=${departureTime}&Price=${price}&page=${page}`); // Kiểm tra URL
            if (res.data && Array.isArray(res.data.results)) {
                if (page === 1) {
                    setTour(res.data.results);
                } else if (page > 1) {
                    setTour(current => [...current, ...res.data.results]);
                }
                setHasNextPage(!!res.data.next); // Kiểm tra xem có trang tiếp theo không
            } else {
                setHasNextPage(false); // Nếu không có dữ liệu hợp lệ, coi như hết trang
            }
        } catch (ex) {
            console.error("Lỗi khi tải tour", ex);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    }, [departurePlace, departureTime, destination, page, price]);

    useEffect(() => {
        loadTour();
    }, [departurePlace, departureTime, destination, page, price, loadTour]);

    useEffect(() => {
        setPage(1);
        setHasNextPage(true);
    }, [destination, departurePlace, departureTime, price]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasNextPage(true);
        loadTour();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [departurePlace, departureTime, destination, price, loadTour]);

    const search = (text, searchType) => {
        setPage(1);
        setQ(text);
        if (searchType === 'Destination') {
            setDestination(text);
        } else if (searchType === 'DeparturePlace') {
            setDeparturePlace(text);
        } else if (searchType === 'Price') {
            setPrice(text);
        }
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && hasNextPage && isCloseToBottom(nativeEvent)) {
            setPage(prevPage => prevPage + 1);
        } else if (!hasNextPage && isCloseToBottom(nativeEvent)) {
            console.log("Đã tải hết bài đăng.");
        }
    };

    return (
        <SafeAreaView style={StyleAll.container}>
            <ScrollView
                style={[StyleAll.container, StyleAll.margin]}
                onScroll={loadMore}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {refreshing && (
                    <View style={stylesTour.loadingContainer}>
                        <ActivityIndicator size="large" color={'pink'} />
                        <Text style={stylesTour.loadingText}>Đang làm mới...</Text>
                    </View>
                )}
                <View>
                    <Searchbar
                        style={StyleAll.sear}
                        value={q}
                        placeholder="Tìm chuyến đi..."
                        placeholderTextColor="#A9A9A9"
                        onChangeText={text => search(text, value)}
                    />
                    <TourPicker setDepartureTime={setDepartureTime} />
                    <SegmentedButtons
                        style={StyleAll.sty}
                        density="small"
                        value={value}
                        onValueChange={newValue => { setValue(newValue); setQ(""); if (newValue !== 'Price') setPrice(""); if (newValue !== 'DeparturePlace') setDeparturePlace(""); if (newValue !== 'Destination') setDestination(""); }}
                        buttons={[
                            {
                                value: 'Destination',
                                label: 'Nơi đến',
                                icon: 'bus-side',
                            },
                            {
                                value: 'DeparturePlace',
                                label: 'Nơi đi',
                                icon: 'home-outline',
                            },
                            {
                                value: 'Price',
                                label: 'Giá',
                                icon: 'cash-100',
                            },
                        ]}
                        theme={{
                            colors: {
                                primary: '#008080', // Màu xanh đậm bạn muốn
                                onPrimary: theme.colors.surface, // Màu chữ khi nút được chọn (thường là màu nền)
                            },
                        }}
                    />
                </View>

                {loading ? <ActivityIndicator style={{ marginVertical: 20 }} color={'pink'} /> : <>
                    {tour.map(c =>
                        <Card mode="elevated" style={StyleAll.card} key={c.Id_Tour}>
                            <Card.Content>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon size={30} source="barcode" color="#36454F" />
                                    <Text style={stylesTour.text1}> {c.Id_Tour}</Text>
                                </View>

                                <Text style={StyleAll.text}>{c.Tour_Name}</Text>
                            </Card.Content>
                            <Card.Cover style={StyleAll.imgincard} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.cover}` }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:30 }}>
                                <Icon size={20} source="calendar-month-outline" color="#F4A460" />
                                <Text style={stylesTour.text2}> {moment(c.DatePost).fromNow()}</Text>
                            </View>

                            <Card.Actions>
                                {user === null ? <>
                                    <Text style={stylesTour.text2}>Vui lòng <Text style={[StyleTour.loginn, StyleTour.text1]} onPress={() => navigation.navigate("login")}>đăng nhập</Text> để có những trải nghiệm tốt nhất cùng Ethereal_Travel</Text>
                                </> : <>
                                    <TouchableOpacity onPress={() => navigation.navigate("tourdetail", { 'tour_id': c.id })} key={c.id}><Text style={stylesTour.text3}>Xem thêm <Icon source="island" size={30} color="#666" /></Text></TouchableOpacity>
                                </>}
                            </Card.Actions>
                        </Card>
                    )}
                    {!hasNextPage && tour.length > 0 && <Text style={{ textAlign: 'center', color: '#808080', marginVertical: 15 }}>Đã tải hết các chuyến đi.</Text>}
                    {tour.length === 0 && !loading && <Text style={{ textAlign: 'center', color: '#808080', marginVertical: 15 }}>Không có chuyến đi nào phù hợp với tìm kiếm của bạn.</Text>}
                </>}
            </ScrollView>
        </SafeAreaView>
    );
};

const stylesTour = StyleSheet.create({
    text1: {
        fontSize: 17,
        fontWeight: 'normal',
        marginLeft: 5,
        color: 'black', // Xám trung tính
    },
    text2: {
        fontSize: 15,
        marginBottom: 8,
        color: '#808080', // Xám trung tính
    },
    text3: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#666',
        fontStyle:"italic",
        marginBottom:20
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#808080',
    },
});

export default Tour;
