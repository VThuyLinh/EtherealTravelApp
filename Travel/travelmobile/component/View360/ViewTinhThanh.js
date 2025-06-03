import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { WebView } from 'react-native-webview'; // Đảm bảo import WebView

const VIETNAM_CENTER = {
    latitude: 16.0, 
    longitude: 108.0,
    zoomLevel: 5, // Zoom level phù hợp với Leaflet
};

const Video360 = () => {
    const [selectedProvinceUrl, setSelectedProvinceUrl] = useState(null);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const webViewRef = useRef(null); // Ref cho WebView
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [mapReady, setMapReady] = useState(false); // State để biết khi nào bản đồ Leaflet đã sẵn sàng

    const vietnameseProvinces = [
        { id: 1, name: "Hà Nội",places:["Nhà hát Lớn Hà Nội","Hoàng Thành Thăng Long","Chùa Một Cột","Lăng Chủ tịch Hồ Chí Minh","Văn Miếu – Quốc Tử Giám"], foods: ["Bún chả Hà Nội","Phở","Bún đậu mắm tôm","Bánh cuốn","Chả cá"], url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/FClS4ni4zfo" title="Hà Nội Trong Tôi | Cảnh Đẹp Việt Nam | Flycam 4K" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 21.0278, longitude: 105.8342 },
        { id: 2, name: "Hồ Chí Minh",places:["Thảo Cầm Viên ","Dinh Độc Lập","Nhà thờ Đức Bà","Chợ Bến Thành","Metro Bến Thành - Suối Tiên"],foods:["Phở Sài Gòn","Cơm tấm","Bánh mì Sài Gòn","Gỏi cuốn"], url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/WrmAUYrB184" title="SAIGON, HO CHI MINH CITY, VIETNAM SKYLINE FLYCAM DRONE 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 10.7626, longitude: 106.6602 },
        { id: 3, name: "Đà Nẵng", url: "YOUR_DANANG_VIDEO_URL", latitude: 16.0478, longitude: 108.2209 },
        { id: 4, name: "Hải Phòng", url: "YOUR_HAIPHONG_VIDEO_URL", latitude: 20.8419, longitude: 106.7745 },
        { id: 5, name: "Cần Thơ", url: "YOUR_CANTHO_VIDEO_URL", latitude: 10.0347, longitude: 105.7856 },
        { id: 6, name: "An Giang", url: "YOUR_ANGIANG_VIDEO_URL", latitude: 10.7071, longitude: 105.1799 },
        { id: 7, name: "Bà Rịa - Vũng Tàu", url: "YOUR_BARIAVUNGTAU_VIDEO_URL", latitude: 10.4879, longitude: 107.1476 },
        { id: 8, name: "Bắc Giang", url: "YOUR_BACGIANG_VIDEO_URL", latitude: 21.2838, longitude: 106.2202 },
        { id: 9, name: "Bắc Kạn", url: "YOUR_BACKAN_VIDEO_URL", latitude: 22.1442, longitude: 105.8239 },
        { id: 10, name: "Bạc Liêu", url: "YOUR_BACLIEU_VIDEO_URL", latitude: 9.2841, longitude: 105.7227 },
        { id: 11, name: "Bắc Ninh", url: "YOUR_BACNINH_VIDEO_URL", latitude: 21.3309, longitude: 106.0781 },
        { id: 12, name: "Bến Tre", url: "YOUR_BENTRE_VIDEO_URL", latitude: 10.2401, longitude: 106.4050 },
        { id: 13, name: "Bình Định", url: "YOUR_BINHDINH_VIDEO_URL", latitude: 13.9000, longitude: 108.9000 },
        { id: 14, name: "Bình Dương", url: "YOUR_BINHDUNG_VIDEO_URL", latitude: 11.0420, longitude: 106.7948 },
        { id: 15, name: "Bình Phước", url: "YOUR_BINHPHUOC_VIDEO_URL", latitude: 11.7048, longitude: 106.5919 },
        { id: 16, name: "Bình Thuận", url: "YOUR_BINHTHUAN_VIDEO_URL", latitude: 11.0277, longitude: 108.0957 },
        { id: 17, name: "Cà Mau", url: "YOUR_CAMAU_VIDEO_URL", latitude: 9.1767, longitude: 105.1208 },
        { id: 18, name: "Cao Bằng", url: "YOUR_CAOBANG_VIDEO_URL", latitude: 22.8445, longitude: 106.2716 },
        { id: 19, name: "Đắk Lắk", url: "YOUR_DAKLAK_VIDEO_URL", latitude: 12.6718, longitude: 108.0341 },
        { id: 20, name: "Đắk Nông", url: "YOUR_DAKNONG_VIDEO_URL", latitude: 12.4789, longitude: 107.7048 },
        { id: 21, name: "Điện Biên", url: "YOUR_DIENBIEN_VIDEO_URL", latitude: 21.3900, longitude: 103.0278 },
        { id: 22, name: "Đồng Nai", url: "YOUR_DONGNAI_VIDEO_URL", latitude: 10.9449, longitude: 107.1682 },
        { id: 23, name: "Đồng Tháp", url: "YOUR_DONGTHAP_VIDEO_URL", latitude: 10.5718, longitude: 105.5145 },
        { id: 24, name: "Gia Lai", url: "YOUR_GIALAI_VIDEO_URL", latitude: 13.7833, longitude: 108.0167 },
        { id: 25, name: "Hà Giang", url: "YOUR_HAGIANG_VIDEO_URL", latitude: 22.8371, longitude: 105.3219 },
        { id: 26, name: "Hà Nam", url: "YOUR_HANAM_VIDEO_URL", latitude: 20.5667, longitude: 105.9167 },
        { id: 27, name: "Hà Tĩnh", url: "YOUR_HATINH_VIDEO_URL", latitude: 18.2167, longitude: 105.7167 },
        { id: 28, name: "Hậu Giang", url: "YOUR_HAUGIANG_VIDEO_URL", latitude: 9.7833, longitude: 105.5667 },
        { id: 29, name: "Hòa Bình", url: "YOUR_HOABINH_VIDEO_URL", latitude: 20.7000, longitude: 105.3333 },
        { id: 30, name: "Hưng Yên", url: "YOUR_HUNGYEN_VIDEO_URL", latitude: 20.8667, longitude: 106.0667 },
        { id: 31, name: "Khánh Hòa", url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/wiXL60wHv9U?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="Toàn Cảnh Thành Phố Nha Trang | Thành Phố Biển Mộng Mơ Và Bình Yên | Cảnh Đẹp Việt Nam | Flycam 4K" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 12.2500, longitude: 109.1167 },
        { id: 32, name: "Kiên Giang", url: "YOUR_KIENGIANG_VIDEO_URL", latitude: 10.0000, longitude: 105.0667 },
        { id: 33, name: "Kon Tum", url: "YOUR_KONTUM_VIDEO_URL", latitude: 14.3500, longitude: 107.9833 },
        { id: 34, name: "Lai Châu", url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/AQ2g3nU6H_I?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="Fansipan Legend | The City On Cloud Like Heaven | Beautiful VietNam | Flycam 4K" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 22.0500, longitude: 103.4000 },
        { id: 35, name: "Lâm Đồng", foods:["Bánh Tráng nướng ","Lẩu gà lá é","Sữa hạt","Bún cá"],places:["Quảng trường Lâm Viên","Khu du lịch Thác Datanla","ZooDoo","Vườn hoa thành phố Đà Lạt"], url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/Iv0CyN4Yh8w" title="Vẻ đẹp ngỡ ngàng của Đà lạt nhìn từ Flycam" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 11.9500, longitude: 107.7167 },
        { id: 36, name: "Lạng Sơn", url: "YOUR_LANGSON_VIDEO_URL", latitude: 21.8500, longitude: 106.7500 },
        { id: 37, name: "Lào Cai", url: "YOUR_LAOCAI_VIDEO_URL", latitude: 22.4833, longitude: 103.9667 },
        { id: 38, name: "Long An", url: "YOUR_LONGAN_VIDEO_URL", latitude: 10.6000, longitude: 106.0000 },
        { id: 39, name: "Nam Định", url: "YOUR_NAMDINH_VIDEO_URL", latitude: 20.4167, longitude: 106.1667 },
        { id: 40, name: "Nghệ An", url: "YOUR_NGHEAN_VIDEO_URL", latitude: 19.0000, longitude: 105.0000 },
        { id: 41, name: "Ninh Bình", url:`<iframe width="914" height="514" src="https://www.youtube.com/embed/jrObP0i5HRU?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="Hang Mua - Ninh Binh - Travel Appointments" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 20.3000, longitude: 105.9667 },
        { id: 42, name: "Ninh Thuận", url: "YOUR_NINHTHUAN_VIDEO_URL", latitude: 11.5667, longitude: 108.9167 },
        { id: 43, name: "Phú Thọ", url: "YOUR_PHUTHO_VIDEO_URL", latitude: 21.4000, longitude: 105.2500 },
        { id: 44, name: "Phú Yên", url: "YOUR_PHUYEN_VIDEO_URL", latitude: 13.0833, longitude: 109.3000 },
        { id: 45, name: "Quảng Bình", url: "YOUR_QUANGBINH_VIDEO_URL", latitude: 17.5000, longitude: 106.2500 },
        { id: 46, name: "Quảng Nam", url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/6F0Txznaq78?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="Ba Na Hills - The Way To Heaven" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 15.5000, longitude: 108.0000 },
        { id: 47, name: "Quảng Ngãi", url: "YOUR_QUANGNGAI_VIDEO_URL", latitude: 15.1000, longitude: 108.8000 },
        { id: 48, name: "Quảng Ninh", url: "YOUR_QUANGNINH_VIDEO_URL", latitude: 21.0000, longitude: 107.3333 },
        { id: 49, name: "Quảng Trị", url: "YOUR_QUANGTRI_VIDEO_URL", latitude: 16.7500, longitude: 107.0000 },
        { id: 50, name: "Sóc Trăng", url: "YOUR_SOCTRANG_VIDEO_URL", latitude: 9.6000, longitude: 105.9667 },
        { id: 51, name: "Sơn La", url: "YOUR_SONLA_VIDEO_URL", latitude: 21.3333, longitude: 104.0000 },
        { id: 52, name: "Tây Ninh", url: "YOUR_TAYNINH_VIDEO_URL", latitude: 11.3000, longitude: 106.2000 },
        { id: 53, name: "Thái Bình", url: "YOUR_THAIBINH_VIDEO_URL", latitude: 20.5000, longitude: 106.3333 },
        { id: 54, name: "Thái Nguyên", url: "YOUR_THAINGUYEN_VIDEO_URL", latitude: 21.5833, longitude: 105.8333 },
        { id: 55, name: "Thanh Hóa", url: "YOUR_THANHHOA_VIDEO_URL", latitude: 19.8000, longitude: 105.6000 },
        { id: 56, name: "Thừa Thiên Huế", url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/nVsRP3Pqesk?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="The Ancient Capital Hue | A Henritage Destination| Beautiful Viet Nam| Flycam 4k" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 16.1500, longitude: 107.8000 },
        { id: 57, name: "Tiền Giang", url: "YOUR_TIENGIANG_VIDEO_URL", latitude: 10.5000, longitude: 106.3000 },
        { id: 58, name: "Trà Vinh", url: "YOUR_TRAVINH_VIDEO_URL", latitude: 9.9347, longitude: 106.3467 },
        { id: 59, name: "Tuyên Quang", url: "YOUR_TUYENQUANG_VIDEO_URL", latitude: 21.8478, longitude: 105.3042 },
        { id: 60, name: "Vĩnh Long", url: "YOUR_VINHLONG_VIDEO_URL", latitude: 10.2497, longitude: 105.9743 },
        { id: 61, name: "Vĩnh Phúc", url: "YOUR_VINHPHUC_VIDEO_URL", latitude: 21.3000, longitude: 105.6000 },
        { id: 62, name: "Yên Bái", url: `<iframe width="914" height="514" src="https://www.youtube.com/embed/nrqqqAZ2ZgY?list=PLF-PWvBMO86aW4N-dwDRs8xZxqgGcPPjd" title="Mu Cang Chai - The Most Majestic Terraces Of Vietnam" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, latitude: 21.7000, longitude: 104.9000 },
    ];

    useEffect(() => {
        if (shouldNavigate) {
            navigation.navigate("video", {
                'url': selectedProvinceUrl,
                'foods': selectedFoods,
                'places': selectedPlaces,
            });
            setShouldNavigate(false); 
        }
    }, [shouldNavigate, navigation, selectedProvinceUrl, selectedFoods, selectedPlaces]);
    
    // Hàm gửi tin nhắn tới WebView
    const postMessageToWebView = useCallback((message) => {
        if (webViewRef.current && mapReady) { // Chỉ gửi khi WebView và bản đồ đã sẵn sàng
            webViewRef.current.postMessage(JSON.stringify(message));
        }
    }, [mapReady]);

    // Thêm markers lên bản đồ Leaflet sau khi bản đồ sẵn sàng
    useEffect(() => {
        if (mapReady) {
            vietnameseProvinces.forEach(province => {
                postMessageToWebView({
                    type: 'addMarker',
                    id: String(province.id), // ID phải là string
                    lat: province.latitude,
                    lng: province.longitude,
                    title: province.name,
                });
            });
        }
    }, [mapReady, vietnameseProvinces, postMessageToWebView]);

    const handleLocationPress = (url, foods, places) => {
        setSelectedProvinceUrl(url);
        setSelectedFoods(foods);
        setSelectedPlaces(places);
        setShouldNavigate(true);
    };

    const handleSearchSubmit = () => {
        Keyboard.dismiss();
        const foundProvince = vietnameseProvinces.find(province =>
            province.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (foundProvince) {
            // Gửi tin nhắn để WebView di chuyển bản đồ đến vị trí tỉnh thành tìm thấy
            postMessageToWebView({
                type: 'panTo',
                lat: foundProvince.latitude,
                lng: foundProvince.longitude,
                zoom: 8, // Zoom level khi tìm thấy
            });
        } else {
            Alert.alert('Thông báo', 'Không tìm thấy tỉnh thành này!');
        }
    };

    const updateSearch = (text) => {
        setSearchText(text);
    };

    // Xử lý tin nhắn nhận được từ WebView
    const onMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapReady') {
            console.log('Leaflet map is ready!');
            setMapReady(true); // Đặt trạng thái bản đồ sẵn sàng
        } else if (data.type === 'markerClick') {
            // Xử lý khi marker được click từ WebView
            const clickedProvince = vietnameseProvinces.find(p => String(p.id) === data.id);
            if (clickedProvince) {
                handleLocationPress(clickedProvince.url, clickedProvince.foods, clickedProvince.places);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Nhập tên tỉnh thành..."
                onChangeText={updateSearch}
                value={searchText}
                onSubmitEditing={handleSearchSubmit}
                style={styles.searchBar}
            />
            
            <WebView
                ref={webViewRef}
                originWhitelist={['*']} // Cho phép WebView load nội dung từ mọi nguồn
                source={require('./map.html')} // Load file HTML cục bộ
                style={styles.map}
                onMessage={onMessage} // Lắng nghe tin nhắn từ WebView
                javaScriptEnabled={true} // Bật JavaScript trong WebView
                domStorageEnabled={true} // Bật DOM Storage
                allowFileAccess={true} // Cho phép truy cập file (cần cho Android để load local HTML)
                allowUniversalAccessFromFileURLs={true} // Tương tự cho Android
                mixedContentMode="always" 
                onLoadEnd={() => console.log('WebView finished loading.')}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}// Cho phép HTTP và HTTPS (có thể cần nếu dùng tile server HTTP)
                // for android 5.0+ you may need to enable hardwareAcceleration
                // Please check your device's support for hardware acceleration in webview
                // userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36" // Optional: để giả lập user agent desktop
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        margin: 10,
        borderRadius: 8,
    },
    map: {
        flex: 1,
        // Đặt border để dễ thấy ranh giới của WebView
        // borderWidth: 1,
        // borderColor: 'blue',
    },
});

export default Video360;