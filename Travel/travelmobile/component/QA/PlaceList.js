import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const PlaceList = ({ places, userAnswers }) => {
    if (!places || places.length === 0) {
        return <Text style={styles.emptyText}>Không có dữ liệu địa điểm phù hợp.</Text>;
    }
    console.log("answer",userAnswers)
    const dauCauTraLoi = "#";
    const cacPhanCauTraLoi = userAnswers ? userAnswers.split(dauCauTraLoi) : [];
    const muaDaChon = cacPhanCauTraLoi[0] ? cacPhanCauTraLoi[0].trim().toLowerCase() : '';
    const loaiHinhdulich= cacPhanCauTraLoi[4]? cacPhanCauTraLoi[0].trim().toLowerCase() : '';
    let hoatDongsLoc = [];
    if(cacPhanCauTraLoi[2] === "Du lịch văn hóa, lịch sử" && cacPhanCauTraLoi.length > 5) {
        const hoatDongString = cacPhanCauTraLoi[9] ? cacPhanCauTraLoi[9].trim() : '';
        // Tách chuỗi dựa trên dấu phẩy hoặc dấu chấm phẩy theo sau bởi dấu cách hoặc hết chuỗi
        const multipleChoices = hoatDongString.split(/[,.]\s*/).map(choice => choice.trim().toLowerCase());
        hoatDongsLoc = multipleChoices.filter(choice => choice !== '');
    } else if (cacPhanCauTraLoi[2] === "Du lịch nghỉ dưỡng, thư giãn") {
        hoatDongsLoc = cacPhanCauTraLoi.slice(11).map(part => part.trim().toLowerCase()).filter(part => part !== '');
    } else {
        hoatDongsLoc = cacPhanCauTraLoi.slice(3, 6).map(part => part.trim().toLowerCase()).filter(part => part !== '');
    }
    let mucDichDuLich = '';
    if (cacPhanCauTraLoi.length > 6) {
        mucDichDuLich = cacPhanCauTraLoi[6].trim().toLowerCase();
    }
    let sinhthaiDuLich = '';
    if (cacPhanCauTraLoi.length > 6) {
        sinhthaiDuLich = cacPhanCauTraLoi[10].trim().toLowerCase();
        console.warn('stdl',sinhthaiDuLich);
    }
    
    

    let thoigiankhampha = '';
    if (cacPhanCauTraLoi.length > 6) {
        thoigiankhampha = cacPhanCauTraLoi[8].trim().toLowerCase();
    }
    let diadiemkhoihanh = '';
    if (cacPhanCauTraLoi.length > 6) {
        diadiemkhoihanh = cacPhanCauTraLoi[7].trim().toLowerCase();
    }

    const renderHoatDong = (hoatDongObject, hoatDongLoc) => {
        if (hoatDongObject && Object.entries(hoatDongObject).length > 0) {
            const hoatDongHienThi = {};
            for (const key in hoatDongObject) {
                if (hoatDongLoc.some(loc => key.toLowerCase().includes(loc))) {
                    hoatDongHienThi[key] = hoatDongObject[key];
                }
            }

            if (Object.entries(hoatDongHienThi).length > 0) {
                return (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Hoạt động:</Text>
                        {Object.entries(hoatDongHienThi).map(([key, value],index) => (
                            <Text key={`${key}-${index}`} style={styles.listItem}>
                                <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
                                <Text>{value}</Text>
                            </Text>
                        ))}
                    </View>
                );
            }
        }
        return null;
    };

    const renderItem = ({ item }) => {
        let thoiGianHienThi = null;
        let thoiGianVe= null;
        let khoihanh= null;
        let trainghiemdl= null;

        if (item.thoigian) {
            for (const key in item.thoigian) {
                if (key.toLowerCase().includes(muaDaChon)) {
                    thoiGianHienThi = { [key]: item.thoigian[key] };
                    break;
                }
            }
        }
        if (item.end) {
            for (const key in item.end) {
                if (key.toLowerCase().includes(thoigiankhampha)) {
                    thoiGianVe = { [key]: item.end[key] };
                    break;
                }
            }
        }
        if (item.start) {
            for (const key in item.start) {
                if (key.toLowerCase().includes(diadiemkhoihanh)) {
                    khoihanh = { [key]: item.start[key] };
                    break;
                }
            }
        }

        if (item.trainghiem) {
            for (const key in item.trainghiem) {
                if (key.toLowerCase().includes(sinhthaiDuLich)) {
                     trainghiemdl= { [key]: item.trainghiem[key] };
                    break;
                }
            }
        }

        const coHoatDongPhuHop = hoatDongsLoc.length === 0 || (item.hoatdong && Object.keys(item.hoatdong).some(key => hoatDongsLoc.some(loc => key.toLowerCase().includes(loc))));
        const hienThiDiaDiem = (muaDaChon === '' || thoiGianHienThi !== null ||thoiGianVe !== null ||khoihanh!==null || trainghiemdl!==null) && coHoatDongPhuHop;

        if (!hienThiDiaDiem) {
            return null;
        }

        return (
            <View style={styles.placeItem}>
                <Text style={styles.placeName}>{item.name}</Text>
                {item.address && <Text style={styles.placeInfo}><Text style={{fontWeight:'bold'}}>Địa chỉ:</Text> {item.address}</Text>}
                {item.describe && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Mô tả:</Text> {item.describe}</Text>}

                {renderHoatDong(item.hoatdong, hoatDongsLoc)}

                {item.luutru && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Lưu trữ:</Text> {item.luutru}</Text>}
                {item.nhahang && <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Nhà hàng:</Text>{item.nhahang}</Text>}

                {thoiGianHienThi && Object.entries(thoiGianHienThi).length > 0 && (
                    <View>
                        {Object.entries(thoiGianHienThi).map(([key, value]) => (
                            <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Thời gian lý tưởng:</Text> {value}</Text>
                        ))}
                    </View>
                )}
                {trainghiemdl && Object.entries(trainghiemdl).length > 0 && (
                    <View>
                        {Object.entries(trainghiemdl).map(([key, value]) => (
                            <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Trải nghiệm hoạt động {key}:</Text> {value}</Text>
                        ))}
                    </View>
                )}

                {item.with && Object.entries(item.with).length > 0 && (
                    <View>
                        {Object.entries(item.with)
                            .filter(([key]) => key.toLowerCase().includes(mucDichDuLich))
                            .map(([key, value]) => (
                                <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Du lịch với:</Text> {value}</Text>
                            ))}
                    </View>
                )}

                {thoiGianVe && Object.entries(thoiGianVe).length > 0 && (
                    <View>
                        {Object.entries(thoiGianVe).map(([key, value]) => (
                            <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Thời gian khám phá gợi ý:</Text> {value}</Text>
                        ))}
                    </View>
                )}

                {khoihanh && Object.entries(khoihanh).length > 0 &&(
                    <View>
                        {Object.entries(khoihanh).map(([key, value]) => (
                            <Text style={styles.placeDescription}><Text style={{fontWeight:'bold'}}>Xuất phát từ:</Text> {value}</Text>
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
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
    },
    placeName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#666666',
    },
    placeInfo: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    placeDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
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

