// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';

// const PlaceList = ({ places, userAnswers }) => {
//     if (!places || places.length === 0) {
//         return <Text style={styles.emptyText}>Không có dữ liệu địa điểm phù hợp.</Text>;
//     }
//     console.log("answer",userAnswers)
//     const dauCauTraLoi = "#";
//     const cacPhanCauTraLoi = userAnswers ? userAnswers.split(dauCauTraLoi) : [];
//     const muaDaChon = cacPhanCauTraLoi[0] ? cacPhanCauTraLoi[0].trim().toLowerCase() : '';
//     const loaiHinhdulich= cacPhanCauTraLoi[4]? cacPhanCauTraLoi[0].trim().toLowerCase() : '';
//     let hoatDongsLoc = [];
//     if(cacPhanCauTraLoi[2] === "Du lịch văn hóa, lịch sử" && cacPhanCauTraLoi.length > 5) {
//         const hoatDongString = cacPhanCauTraLoi[9] ? cacPhanCauTraLoi[9].trim() : '';
//         // Tách chuỗi dựa trên dấu phẩy hoặc dấu chấm phẩy theo sau bởi dấu cách hoặc hết chuỗi
//         const multipleChoices = hoatDongString.split(/[,.]\s*/).map(choice => choice.trim().toLowerCase());
//         hoatDongsLoc = multipleChoices.filter(choice => choice !== '');
//     } else if (cacPhanCauTraLoi[2] === "Du lịch nghỉ dưỡng, thư giãn") {
//         hoatDongsLoc = cacPhanCauTraLoi.slice(11).map(part => part.trim().toLowerCase()).filter(part => part !== '');
//     } else {
//         hoatDongsLoc = cacPhanCauTraLoi.slice(3, 6).map(part => part.trim().toLowerCase()).filter(part => part !== '');
//     }
//     let mucDichDuLich = '';
//     if (cacPhanCauTraLoi.length > 6) {
//         mucDichDuLich = cacPhanCauTraLoi[6].trim().toLowerCase();
//     }
//     let sinhthaiDuLich = '';
//     if (cacPhanCauTraLoi.length > 6) {
//         sinhthaiDuLich = cacPhanCauTraLoi[10].trim().toLowerCase();
//         console.warn('stdl',sinhthaiDuLich);
//     }
    
    

//     let thoigiankhampha = '';
//     if (cacPhanCauTraLoi.length > 6) {
//         thoigiankhampha = cacPhanCauTraLoi[8].trim().toLowerCase();
//     }
//     let diadiemkhoihanh = '';
//     if (cacPhanCauTraLoi.length > 6) {
//         diadiemkhoihanh = cacPhanCauTraLoi[7].trim().toLowerCase();
//     }

//     const renderHoatDong = (hoatDongObject, hoatDongLoc) => {
//         if (hoatDongObject && Object.entries(hoatDongObject).length > 0) {
//             const hoatDongHienThi = {};
//             for (const key in hoatDongObject) {
//                 if (hoatDongLoc.some(loc => key.toLowerCase().includes(loc))) {
//                     hoatDongHienThi[key] = hoatDongObject[key];
//                 }
//             }

//             if (Object.entries(hoatDongHienThi).length > 0) {
//                 return (
//                     <View style={styles.sectionContainer}>
//                         <Text style={styles.sectionTitle}>Hoạt động:</Text>
//                         {Object.entries(hoatDongHienThi).map(([key, value],index) => (
//                             <Text key={`${key}-${index}`} style={styles.listItem}>
//                                 <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
//                                 <Text>{value}</Text>
//                             </Text>
//                         ))}
//                     </View>
//                 );
//             }
//         }
//         return null;
//     };

//     const renderItem = ({ item }) => {
//         let thoiGianHienThi = null;
//         let thoiGianVe= null;
//         let khoihanh= null;
//         let trainghiemdl= null;

//         if (item.thoigian) {
//             for (const key in item.thoigian) {
//                 if (key.toLowerCase().includes(muaDaChon)) {
//                     thoiGianHienThi = { [key]: item.thoigian[key] };
//                     break;
//                 }
//             }
//         }
//         if (item.end) {
//             for (const key in item.end) {
//                 if (key.toLowerCase().includes(thoigiankhampha)) {
//                     thoiGianVe = { [key]: item.end[key] };
//                     break;
//                 }
//             }
//         }
//         if (item.start) {
//             for (const key in item.start) {
//                 if (key.toLowerCase().includes(diadiemkhoihanh)) {
//                     khoihanh = { [key]: item.start[key] };
//                     break;
//                 }
//             }
//         }

//         if (item.trainghiem) {
//             for (const key in item.trainghiem) {
//                 if (key.toLowerCase().includes(sinhthaiDuLich)) {
//                      trainghiemdl= { [key]: item.trainghiem[key] };
//                     break;
//                 }
//             }
//         }

//         const coHoatDongPhuHop = hoatDongsLoc.length === 0 || (item.hoatdong && Object.keys(item.hoatdong).some(key => hoatDongsLoc.some(loc => key.toLowerCase().includes(loc))));
//         const hienThiDiaDiem = (muaDaChon === '' || thoiGianHienThi !== null ||thoiGianVe !== null ||khoihanh!==null || trainghiemdl!==null) && coHoatDongPhuHop;

//         if (!hienThiDiaDiem) {
//             return null;
//         }

//         return (
//             <View style={styles.placeItem}>
//                 <Text style={styles.placeName}>{item.name}</Text>
//                 {item.address && <Text style={styles.placeInfo}><Text style={{fontWeight:'bold'}}>Địa chỉ:</Text> {item.address}</Text>}
//                 {item.describe && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Mô tả:</Text> {item.describe}</Text>}

//                 {renderHoatDong(item.hoatdong, hoatDongsLoc)}

//                 {item.luutru && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Lưu trữ:</Text> {item.luutru}</Text>}
//                 {item.nhahang && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Nhà hàng:</Text>{item.nhahang}</Text>}

//                 {thoiGianHienThi && Object.entries(thoiGianHienThi).length > 0 && (
//                     <View>
//                         {Object.entries(thoiGianHienThi).map(([key, value]) => (
//                             <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Thời gian lý tưởng:</Text> {value}</Text>
//                         ))}
//                     </View>
//                 )}
//                 {trainghiemdl && Object.entries(trainghiemdl).length > 0 && (
//                     <View>
//                         {Object.entries(trainghiemdl).map(([key, value]) => (
//                             <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Trải nghiệm hoạt động {key}:</Text> {value}</Text>
//                         ))}
//                     </View>
//                 )}

//                 {item.with && Object.entries(item.with).length > 0 && (
//                     <View>
//                         {Object.entries(item.with)
//                             .filter(([key]) => key.toLowerCase().includes(mucDichDuLich))
//                             .map(([key, value]) => (
//                                 <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Du lịch với:</Text> {value}</Text>
//                             ))}
//                     </View>
//                 )}

//                 {thoiGianVe && Object.entries(thoiGianVe).length > 0 && (
//                     <View>
//                         {Object.entries(thoiGianVe).map(([key, value]) => (
//                             <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Thời gian khám phá gợi ý:</Text> {value}</Text>
//                         ))}
//                     </View>
//                 )}

//                 {khoihanh && Object.entries(khoihanh).length > 0 &&(
//                     <View>
//                         {Object.entries(khoihanh).map(([key, value]) => (
//                             <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Xuất phát từ:</Text> {value}</Text>
//                         ))}
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={places}
//                 keyExtractor={item => item.id}
//                 renderItem={renderItem}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     emptyText: {
//         fontSize: 16,
//         textAlign: 'center',
//         marginTop: 50,
//         color: '#777',
//     },
//     placeItem: {
//         backgroundColor: '#F5FFFA',
//         padding: 15,
//         marginBottom: 10,
//         borderRadius: 8,
//         elevation: 3,
//     },
//     placeName: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#666666',
//     },
//     placeInfo: {
//         fontSize: 16,
//         color: '#555',
//         marginBottom: 5,
//     },
//     placeDescription: {
//         fontSize: 16,
//         color: '#333',
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
//         color: 'black',
//         marginBottom: 5,
//     },
//     listItem: {
//         fontSize: 15,
//         color: '#777',
//         marginBottom: 3,
//     },
// });

// export default PlaceList;




import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const PlaceList = ({ places, userAnswers }) => {
    if (!places || places.length === 0) {
        return <Text style={styles.emptyText}>Không có dữ liệu địa điểm phù hợp.</Text>;
    }
    console.log("userAnswers trong PlaceList:", userAnswers);

    const dauCauTraLoi = "#";
    const cacPhanCauTraLoi = userAnswers ? userAnswers.split(dauCauTraLoi) : [];

    // console.log("Các phần câu trả lời (split):", cacPhanCauTraLoi); // Thêm log để kiểm tra

    // Lấy các phần từ userAnswers, đảm bảo an toàn với độ dài mảng
    const muaDaChon = cacPhanCauTraLoi[0] ? cacPhanCauTraLoi[0].trim().toLowerCase() : '';
    // Sửa lỗi: loaiHinhdulich nên lấy từ index 4 (theo format userAnswers bạn cung cấp)
    const loaiHinhDuLichTongQuan = cacPhanCauTraLoi[2] ? cacPhanCauTraLoi[2].trim() : ''; // "Du lịch văn hóa, lịch sử", "Du lịch nghỉ dưỡng, thư giãn", "Du lịch khám phá thiên nhiên"

    let hoatDongsLoc = [];
    if (loaiHinhDuLichTongQuan === "Du lịch văn hóa, lịch sử") {
        const hoatDongString = cacPhanCauTraLoi[9] ? cacPhanCauTraLoi[9].trim() : '';
        hoatDongsLoc = hoatDongString.split(/[,.]\s*/).map(choice => choice.trim().toLowerCase()).filter(choice => choice !== '');
    } else if (loaiHinhDuLichTongQuan === "Du lịch nghỉ dưỡng, thư giãn") {
        // slice(11) nếu các hoạt động là từ phần thứ 11 trở đi (ví dụ: "spa", "yoga")
        hoatDongsLoc = cacPhanCauTraLoi.slice(11).map(part => part.trim().toLowerCase()).filter(part => part !== '');
    } else if (loaiHinhDuLichTongQuan === "Du lịch khám phá thiên nhiên") { // Giả định đây là case else của bạn
        // Lấy các hoạt động như "trải nghiệm trò chơi mạo hiểm", "tìm hiểu động vật/thực vật hoang dã", "gần gũi thiên nhiên"
        hoatDongsLoc = cacPhanCauTraLoi.slice(3, 6).map(part => part.trim().toLowerCase()).filter(part => part !== '');
    }
    // console.log("hoatDongsLoc:", hoatDongsLoc); // Thêm log để kiểm tra

    const mucDichDuLich = cacPhanCauTraLoi[6] ? cacPhanCauTraLoi[6].trim().toLowerCase() : '';
    // Sửa lỗi: sinhthaiDuLich đang lấy giá trị là mô tả hoạt động thiên nhiên (vd: "mình muốn trải nghiệm...")
    // Cần xem xét lại userAnswers để lấy đúng từ khóa cho trainghiemdl.
    // Tạm thời, tôi sẽ điều chỉnh để nó có thể khớp với các key trong 'trainghiem'
    let sinhthaiDuLich = '';
    // Nếu cacPhanCauTraLoi[10] là "Mình muốn trải nghiệm các hoạt động gần gũi với thiên nhiên"
    // mà key trong item.trainghiem là "trồng rau" hoặc "ăn ở nhà dân"
    // => Cần tìm cách ánh xạ hoặc lọc thông minh hơn.
    // Hiện tại, tôi sẽ lấy các phần liên quan đến trải nghiệm từ userAnswers
    // và xem xét xem chúng có trong item.trainghiem hay không.
    // Giả định `userAnswers` có thể có các từ khóa như "câu cá", "ngủ ở nhà dân", "trồng rau", "ăn ở nhà dân" ở đâu đó.
    // Nếu bạn muốn lọc theo những keyword này, hãy đảm bảo chúng tồn tại trong cacPhanCauTraLoi.
    // Ví dụ, nếu cacPhanCauTraLoi[5] là "câu cá"
    // sinhthaiDuLich = cacPhanCauTraLoi[5] ? cacPhanCauTraLoi[5].trim().toLowerCase() : '';
    // Trong ví dụ log của bạn, `sinhthaiDuLich` là "mình muốn trải nghiệm các hoạt động gần gũi với thiên nhiên".
    // Key trong `trainghiem` là "câu cá", "ngủ ở nhà dân", "trồng rau", "ăn ở nhà dân".
    // Điều này sẽ không bao giờ khớp. Cần làm rõ cách bạn muốn lọc `trainghiem`.
    // Nếu mục đích là hiển thị tất cả các trải nghiệm nếu user chọn "Du lịch khám phá thiên nhiên"
    // thì không cần lọc theo `sinhthaiDuLich` mà hiển thị tất cả `item.trainghiem`.
    // Tạm thời tôi sẽ để nguyên logic sinhthaiDuLich để bạn có thể debug và điều chỉnh.
    sinhthaiDuLich = cacPhanCauTraLoi[10] ? cacPhanCauTraLoi[10].trim().toLowerCase() : '';
    // console.warn('sinhthaiDuLich:', sinhthaiDuLich); // Thêm log để kiểm tra

    const thoigiankhampha = cacPhanCauTraLoi[8] ? cacPhanCauTraLoi[8].trim().toLowerCase() : '';
    const diadiemkhoihanh = cacPhanCauTraLoi[7] ? cacPhanCauTraLoi[7].trim().toLowerCase() : '';

    const renderHoatDong = (hoatDongObject, hoatDongLoc) => {
        if (!hoatDongObject || Object.entries(hoatDongObject).length === 0) {
            return null;
        }

        const hoatDongHienThi = {};
        if (hoatDongLoc.length === 0) {
            // Nếu không có hoạt động cụ thể nào được chọn, hiển thị tất cả các hoạt động của địa điểm
            return (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Hoạt động:</Text>
                    {Object.entries(hoatDongObject).map(([key, value], index) => (
                        <Text key={`${key}-${index}`} style={styles.listItem}>
                            <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
                            <Text>{value}</Text>
                        </Text>
                    ))}
                </View>
            );
        }

        // Lọc hoạt động dựa trên hoatDongLoc
        for (const key in hoatDongObject) {
            if (hoatDongLoc.some(loc => key.toLowerCase().includes(loc))) {
                hoatDongHienThi[key] = hoatDongObject[key];
            }
        }

        if (Object.entries(hoatDongHienThi).length > 0) {
            return (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Hoạt động:</Text>
                    {Object.entries(hoatDongHienThi).map(([key, value], index) => (
                        <Text key={`${key}-${index}`} style={styles.listItem}>
                            <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
                            <Text>{value}</Text>
                        </Text>
                    ))}
                </View>
            );
        }
        return null;
    };

    const renderItem = ({ item }) => {
        let thoiGianHienThi = null;
        let thoiGianVe = null;
        let khoihanh = null;
        let trainghiemdl = null;

        // Lọc theo mùa đã chọn (muaDaChon)
        if (item.thoigian && muaDaChon) {
            for (const key in item.thoigian) {
                if (key.toLowerCase().includes(muaDaChon)) {
                    thoiGianHienThi = { [key]: item.thoigian[key] };
                    break;
                }
            }
        }

        // Lọc theo thời gian khám phá (thoigiankhampha)
        if (item.end && thoigiankhampha) {
            for (const key in item.end) {
                // Kiểm tra nếu key trong item.end (vd: "1 tuần", "1-2 ngày") chứa thoigiankhampha (vd: "1-2 ngày")
                if (key.toLowerCase().includes(thoigiankhampha)) {
                    thoiGianVe = { [key]: item.end[key] };
                    break;
                }
            }
        }
        
        // Lọc theo địa điểm khởi hành (diadiemkhoihanh)
        if (item.start && diadiemkhoihanh) {
            for (const key in item.start) {
                 // Kiểm tra nếu key trong item.start (vd: "An Giang", "Bình Thuận") chứa diadiemkhoihanh (vd: "an giang")
                if (key.toLowerCase().includes(diadiemkhoihanh)) {
                    khoihanh = { [key]: item.start[key] };
                    break;
                }
            }
        }

        // Lọc theo trải nghiệm sinh thái (sinhthaiDuLich)
        if (item.trainghiem && sinhthaiDuLich) {
            // Đây là phần cần được điều chỉnh nhiều nhất tùy thuộc vào cách bạn ánh xạ
            // "sinhthaiDuLich" từ userAnswers sang các key trong "item.trainghiem"
            // Ví dụ: nếu userAnswers có "câu cá", thì sinhthaiDuLich sẽ là "câu cá".
            // Hiện tại, "sinhthaiDuLich" đang là "mình muốn trải nghiệm các hoạt động gần gũi với thiên nhiên"
            // nên sẽ không bao giờ khớp với "câu cá", "ngủ ở nhà dân" trong item.trainghiem.
            // Giải pháp tạm thời: nếu bạn muốn hiển thị tất cả các "trainghiem" khi chọn loại hình "Du lịch khám phá thiên nhiên",
            // thì có thể bỏ qua bước lọc bằng `sinhthaiDuLich` ở đây và hiển thị toàn bộ `item.trainghiem`
            // hoặc phải có một ánh xạ rõ ràng hơn giữa user input và các key `trainghiem`.
            for (const key in item.trainghiem) {
                if (key.toLowerCase().includes(sinhthaiDuLich) || sinhthaiDuLich.includes(key.toLowerCase())) {
                    trainghiemdl = { [key]: item.trainghiem[key] };
                    break;
                }
            }
            // Nếu không tìm thấy, và sinhthaiDuLich là một câu chung chung, bạn có thể hiển thị tất cả các trải nghiệm
            if (!trainghiemdl && loaiHinhDuLichTongQuan === "Du lịch khám phá thiên nhiên") {
                trainghiemdl = item.trainghiem; // Hiển thị tất cả các trải nghiệm nếu loại hình là khám phá thiên nhiên
            }
        }

        // --- KHÔNG CẦN LỌC `hienThiDiaDiem` Ở ĐÂY NỮA ---
        // Vì `places` đã được lọc ở `PredictScreen` để chỉ chứa địa điểm mong muốn.
        // Mục đích của `PlaceList` là hiển thị thông tin của địa điểm đó.
        // Các điều kiện trên (`thoiGianHienThi`, v.v.) chỉ dùng để quyết định CÓ HIỂN THỊ chi tiết đó hay không,
        // chứ không quyết định CÓ HIỂN THỊ TOÀN BỘ ĐỊA ĐIỂM đó hay không.

        return (
            <View style={styles.placeItem}>
                <Text style={styles.placeName}>{item.name}</Text>
                {item.address && <Text style={styles.placeInfo}><Text style={{ fontWeight: 'bold' }}>Địa chỉ:</Text> {item.address}</Text>}
                {item.describe && <Text style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Mô tả:</Text> {item.describe}</Text>}

                {renderHoatDong(item.hoatdong, hoatDongsLoc)}

                {item.luutru && <Text style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Lưu trữ:</Text> {item.luutru}</Text>}
                {item.nhahang && <Text style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Nhà hàng:</Text>{item.nhahang}</Text>}

                {thoiGianHienThi && Object.entries(thoiGianHienThi).length > 0 && (
                    <View>
                        {Object.entries(thoiGianHienThi).map(([key, value]) => (
                            <Text key={key} style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Thời gian lý tưởng:</Text> {value}</Text>
                        ))}
                    </View>
                )}

                {trainghiemdl && Object.entries(trainghiemdl).length > 0 && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Trải nghiệm:</Text>
                        {Object.entries(trainghiemdl).map(([key, value]) => (
                            <Text key={key} style={styles.listItem}>
                                <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
                                <Text>{value}</Text>
                            </Text>
                        ))}
                    </View>
                )}

                {item.with && Object.entries(item.with).length > 0 && mucDichDuLich && (
                    <View>
                        {Object.entries(item.with)
                            .filter(([key]) => key.toLowerCase().includes(mucDichDuLich))
                            .map(([key, value]) => (
                                <Text key={key} style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Du lịch với:</Text> {value}</Text>
                            ))}
                    </View>
                )}

                {thoiGianVe && Object.entries(thoiGianVe).length > 0 && (
                    <View>
                        {Object.entries(thoiGianVe).map(([key, value]) => (
                            <Text key={key} style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Thời gian khám phá gợi ý:</Text> {value}</Text>
                        ))}
                    </View>
                )}

                {khoihanh && Object.entries(khoihanh).length > 0 && (
                    <View>
                        {Object.entries(khoihanh).map(([key, value]) => (
                            // Kiểm tra lại key vì key.toLowerCase().includes(diadiemkhoihanh) ở trên
                            // sẽ giữ nguyên key gốc như "An Giang" hoặc "Bình Thuận"
                            <Text key={key} style={styles.placeDescription}><Text style={{ fontWeight: 'bold' }}>Xuất phát từ:</Text> {value}</Text>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={places}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10, // Thêm padding để nội dung không bị sát mép trên
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
        color: '#777',
    },
    placeItem: {
        backgroundColor: '#F5FFFA',
        padding: 15,
        marginHorizontal: 15, // Thêm margin ngang để không bị sát mép
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000', // Đổ bóng nhẹ cho đẹp hơn
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    placeName: {
        fontSize: 22, // Tăng kích thước chữ
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333', // Màu sắc đậm hơn
        textAlign: 'center', // Căn giữa tên địa điểm
    },
    placeInfo: {
        fontSize: 15,
        color: '#555',
        marginBottom: 5,
        lineHeight: 22, // Tăng khoảng cách dòng
    },
    placeDescription: {
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
        lineHeight: 22,
    },
    sectionContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#007bff',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    listItem: {
        fontSize: 15,
        color: '#777',
        marginBottom: 3,
    },
});

export default PlaceList;