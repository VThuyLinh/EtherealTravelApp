
// import React, { useState, useEffect, useCallback } from "react";
// import { View, Text, styles1heet, FlatList } from "react-native";
// import { collection, onSnapshot } from "@firebase/firestore";
// import { FIRESTORE_DB } from "./firebaseConfig.js";
// import { useNavigation } from "@react-navigation/native";
// import { MyUserContext } from "../../config/context.js";

// const place_collection = collection(FIRESTORE_DB, "place");

// const Readdatatest = () => {
//     const [place, setPlaces] = React.useState([]);
//     const [loading, setLoading] = React.useState(true);
//     const [error, setError] = React.useState(null);
//     const user = React.useContext(MyUserContext);
//     const nav = useNavigation();

//     const loadPlace = useCallback(() => {
//         console.log('Tải lại dữ liệu địa điểm.');
//         setLoading(true);

//         const unsubscribe = onSnapshot(
//             place_collection,
//             (snapshot) => {
//                 const placeData = snapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setPlaces(placeData);
//                 setLoading(false);
//             },
//             (error) => {
//                 console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
//                 setError(error.message);
//                 setLoading(false);
//             }
//         );
//         return () => unsubscribe();
//     }, []);

//     React.useEffect(() => {
//         const unsubscribeFocus = nav.addListener('focus', loadPlace);
//         return unsubscribeFocus;
//     }, [loadPlace]);

//     if (loading) return <Text style={styles1.loadingText}>Đang tải dữ liệu địa điểm...</Text>;
//     if (error) return <Text style={styles1.errorText}>Lỗi: {error}</Text>;
//     if (place.length === 0) return <Text style={styles1.emptyText}>Không có dữ liệu địa điểm.</Text>;

//     return (
//         <View style={styles1.container}>
//             <FlatList
//                 data={place}
//                 keyExtractor={item => item.id}
//                 renderItem={({ item }) => (
//                     <View style={styles1.placeItem}>
//                         <Text style={styles1.placeName}>{item.name}</Text>
//                         {item.address && <Text style={styles1.placeInfo}>Địa chỉ: {item.address}</Text>}
//                         {item.describe && <Text style={styles1.placeDescription}>Mô tả: {item.describe}</Text>}

//                         {item.hoatdong && Object.entries(item.hoatdong).length > 0 && (
//                         <View style={styles1.sectionContainer}>
//                             <Text style={styles1.sectionTitle}>Hoạt động:</Text>
//                             {Object.entries(item.hoatdong).map(([key, value]) => (
//                                 <Text key={key} style={styles1.listItem}>
//                                     <Text style={{ fontWeight: 'bold' }}>{key}: </Text>{value}
//                                 </Text>
//                             ))}
//                         </View>
//                     )}

//                         {item.luutru && <Text style={styles1.placeInfo}>Lưu trữ: {item.luutru}</Text>}
//                         {item.nhahang && <Text style={styles1.placeInfo}>Nhà hàng: {item.nhahang}</Text>}

//                         {item.thoigian && Object.entries(item.thoigian).length > 0 && (
//                             <View style={styles1.sectionContainer}>
//                                 <Text style={styles1.sectionTitle}>Thời gian lý tưởng:</Text>
//                                 {Object.entries(item.thoigian).map(([key, value]) => (
//                                     <Text key={key} style={styles1.listItem}>
//                                         <Text style={{ fontWeight: 'bold' }}>{key}: </Text>{value}
//                                     </Text>
//                                 ))}
//                             </View>
//                         )}

//                         {item.with && Object.entries(item.with).length > 0 && (
//                             <View style={styles1.sectionContainer}>
//                                 <Text style={styles1.sectionTitle}>Phù hợp đi với:</Text>
//                                 {Object.entries(item.with).map(([key, value]) => (
//                                     <Text key={key} style={styles1.listItem}>
//                                         <Text style={{ fontWeight: 'bold' }}>{key}: </Text>{value}
//                                     </Text>
//                                 ))}
//                             </View>
//                         )}

//                         {item.end && Object.entries(item.end).length > 0 && (
//                             <View style={styles1.sectionContainer}>
//                                 <Text style={styles1.sectionTitle}>Thời gian khám phá gợi ý:</Text>
//                                 {Object.entries(item.end).map(([key, value]) => (
//                                     <Text key={key} style={styles1.listItem}>
//                                         <Text style={{ fontWeight: 'bold' }}>{key}: </Text>{value}
//                                     </Text>
//                                 ))}
//                             </View>
//                         )}

//                         {/* Trường 'start' (63 tỉnh thành) có thể hiển thị dưới dạng danh sách nếu cần */}
//                         {item.start && item.start.length > 0 && (
//                             <View style={styles1.sectionContainer}>
//                                 <Text style={styles1.sectionTitle}>Tỉnh thành:</Text>
//                                 <Text style={styles1.listItem}>- {item.start.join(', ')}</Text>
//                             </View>
//                         )}
//                     </View>
//                 )}
//             />
//         </View>
//     );
// };

// const styles1 = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#f4f4f4',
//     },
//     loadingText: {
//         fontSize: 18,
//         textAlign: 'center',
//         marginTop: 50,
//     },
//     errorText: {
//         fontSize: 18,
//         color: 'red',
//         textAlign: 'center',
//         marginTop: 50,
//     },
//     emptyText: {
//         fontSize: 16,
//         textAlign: 'center',
//         marginTop: 50,
//         color: '#777',
//     },
//     placeItem: {
//         backgroundColor: 'white',
//         padding: 15,
//         marginBottom: 10,
//         borderRadius: 8,
//         elevation: 3,
//     },
//     placeName: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#333',
//     },
//     placeInfo: {
//         fontSize: 16,
//         color: '#555',
//         marginBottom: 5,
//     },
//     placeDescription: {
//         fontSize: 16,
//         color: '#666',
//         marginBottom: 10,
//     },
//     sectionContainer: {
//         marginTop: 10,
//         marginBottom: 10,
//         paddingLeft: 10,
//         borderLeftWidth: 3,
//         borderLeftColor: '#007bff',
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     listItem: {
//         fontSize: 14,
//         color: '#777',
//         marginBottom: 3,
//     },
// });

// export default Readdatatest;

import { Text } from "react-native"
const Readdatatest =()=>{
    return(
        <Text>Hello</Text>
    )
}
export default Readdatatest;