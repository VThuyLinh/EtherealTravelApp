

import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Chip, DataTable, Icon, Searchbar, SegmentedButtons, Text} from "react-native-paper";
import React, { useContext, useState } from "react";
import APIs, { endpoints } from "../../config/APIs";
import moment from "moment";
import { isCloseToBottom } from "../Utils/util";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Image } from "react-native";

import { MyUserContext } from "../../config/context";

import Location from "../Location/Location";
import StyleAll from "../../style/StyleAll";
import StyleTour from "../../style/StyleTour";

const TourPicker = ({ setDepartureTime }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDateText, setSelectedDateText] = useState("  Chọn ngày khởi hành bạn muốn tìm");
    

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
        setDepartureTime(formattedDate); 
    };

    return (
        <View style={styles1.container}>
            <TouchableOpacity style={styles1.dateButton} onPress={showDatePicker}>
                
                    <Icon style={styles1.calendarIcon} size={30} source="calendar-month" color={"#008080"} />
                    <Text>
                     {selectedDateText}
                </Text>
            </TouchableOpacity>

            {/* <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date" // Chuyển mode thành "date" để chọn ngày
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            /> */}
        </View>
    );
};

const styles1 = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Để nút ở giữa (tùy chọn)
        marginBottom: 5,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: "center", // Giả sử có màu nền cho nút
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    calendarIcon: {
        marginRight: 10,
        marginTop:10
    },
    dateText: {
        fontSize: 16,
        color: '#36454F', // Đen than
    },
});

const Tour = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [tour, setTour] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [DeparturePlace, setDeparturePlace] = React.useState("");
    const [Destination, setDestination] = React.useState("");
    const [DepartureTime, setDepartureTime] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [refreshing, setrefreshing] = React.useState(false);
   
    const [value, setValue] = React.useState('Destination');
    const [q, setQ] = React.useState('');
    
    const loadTour = async () => {
        try {
            setLoading(true);
            const res = await APIs.get(`${endpoints['tour']}?noidi=${DeparturePlace}&noiden=${Destination}&thoigiandi=${DepartureTime}&Price=${price}&page=${page}`);
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
            console.error("Lỗi", ex);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadTour();
    }, [DeparturePlace, DepartureTime, Destination, page, price]);

    React.useEffect(() => {
        setPage(1);
        setHasNextPage(true);
    }, [Destination, DeparturePlace, DepartureTime, price]);

    const onRefresh = React.useCallback(() => {
        setrefreshing(true);
        setPage(1);
        setHasNextPage(true);
        loadTour();
        setTimeout(() => {
            setrefreshing(false);
        }, 1000);
    }, [DeparturePlace, DepartureTime, Destination, price]);

    const search = (value, callback) => {
        setPage(1);
        callback(value);
        setQ(value);
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
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={'pink'} />
                        <Text style={styles.loadingText}>Đang làm mới...</Text>
                    </View>
                )}
                <View>
                    <Searchbar
                        style={StyleAll.sear}
                        value={q}
                        placeholder="Tìm chuyến đi..."
                        placeholderTextColor="#A9A9A9"
                        onChangeText={t => value === 'Destination' ? search(t, setDestination) : value === 'DeparturePlace' ? search(t, setDeparturePlace) : search(t, setPrice)}
                    />
                    <TourPicker setDepartureTime={setDepartureTime} />
                    <SegmentedButtons
                        style={StyleAll.sty}
                        density="small"
                        value={value}
                        onValueChange={t => { setValue(t); setQ(""); }}
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
                    />
                </View>

                {loading ? <ActivityIndicator style={{ marginVertical: 20 }} color={'pink'} /> : <>
                    {tour.map(c =>
                        <Card mode="elevated" style={StyleAll.card} key={c.Id_Tour}>
                            <Card.Content>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Icon size={30} source="barcode" color="#36454F" />
                              <Text style={styles.text1}> {c.Id_Tour}</Text>
                              </View>
                                
                                <Text style={StyleAll.text}>{c.Tour_Name}</Text>
                            </Card.Content>
                            <Card.Cover style={StyleAll.imgincard} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.cover}` }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:30 }}>
                            <Icon size={20} source="calendar-month-outline" color="#F4A460" />
                            <Text style={StyleAll.text2}> {moment(c.DatePost).fromNow()}</Text>
                            </View>
                           
                            <Card.Actions>
                                {user === null ? <>
                                    <Text style={styles.text2}>Vui lòng <Text style={[StyleTour.loginn, StyleTour.text1]} onPress={() => navigation.navigate("login")}>đăng nhập</Text> để có những trải nghiệm tốt nhất cùng Ethereal_Travel</Text>
                                </> : <>
                                    <TouchableOpacity onPress={() => navigation.navigate("tourdetail", { 'tour_id': c.id })} key={c.id}><Text style={styles.text3}>Xem thêm <Icon source="island" size={30} color="#666" /></Text></TouchableOpacity>
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

const styles = StyleSheet.create({
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