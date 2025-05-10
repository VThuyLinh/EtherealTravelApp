// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import axios from 'axios';
// import { collection, onSnapshot } from "@firebase/firestore";
// import { FIRESTORE_DB } from "./firebaseConfig.js";
// import { useNavigation } from "@react-navigation/native";
// import { MyUserContext } from "../../config/context.js";
// import PlaceList from './PlaceList'; // Import component PlaceList

// const place_collection = collection(FIRESTORE_DB, "place");

// const PredictScreen = ({ route }) => {
//     const { userAnswers } = route.params;
//     const [predictions, setPredictions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isPredictionRequested, setIsPredictionRequested] = useState(false);
//     const [places, setPlaces] = useState([]); // Đổi tên state thành places cho rõ ràng
//     const user = React.useContext(MyUserContext);
//     const nav = useNavigation();

//     const fetchPredictions = async () => {
//         const dau = "#";
//         const cac_phan = userAnswers.split(dau);
//         const answer = cac_phan.slice(0, 3).join(dau);

//         console.log("Dữ liệu gửi đi:", answer);
//         setLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('user_input', answer);

//         try {
//             const response = await axios.post(
//                 'https://thuylinhvo.pythonanywhere.com/predict_locations/',
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             console.log("Response data:", response.data);
//             setPredictions(response.data.predicted_locations);
//             console.warn("result", response.data.predicted_locations[0]);
//             const chuoi = response.data.predicted_locations;
//             console.log("chuoi", chuoi);
//         } catch (err) {
//             setError('Không thể kết nối đến server hoặc có lỗi xảy ra.');
//             console.error('Lỗi gọi API:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadPlace = useCallback(() => {
//         if (predictions && predictions.length > 0) {
//             console.log('Tải lại dữ liệu địa điểm và lọc theo dự đoán.');
//             setLoading(true);
//             setError(null);

//             const unsubscribe = onSnapshot(
//                 place_collection,
//                 (snapshot) => {
//                     const allPlacesData = snapshot.docs.map((doc) => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     }));

//                     const filteredPlaces = allPlacesData.filter(placeItem =>
//                         predictions.includes(placeItem.id)
//                     );

//                     setPlaces(filteredPlaces);
//                     setLoading(false);
//                 },
//                 (error) => {
//                     console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
//                     setError(error.message);
//                     setLoading(false);
//                 }
//             );
//             return () => unsubscribe();
//         } else {
//             setPlaces([]);
//             setLoading(false);
//             return () => {};
//         }
//     }, [predictions]);

//     React.useEffect(() => {
//         if (isPredictionRequested && predictions.length > 0) {
//             loadPlace();
//         }
//     }, [isPredictionRequested, predictions, loadPlace]);

//     const handlePredictButtonPress = () => {
//         setIsPredictionRequested(true);
//         fetchPredictions();
//         nav.navigate("Answer",{ userAnswers: userAnswers })
//     };

//     if (loading && isPredictionRequested) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#007AFF" />
//                 <Text style={styles.loadingText}>Đang tải dữ liệu địa điểm...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
//                     <Text style={styles.buttonText}>Thử lại</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {!isPredictionRequested && (
//                 <Text style={styles.title}>Nhấn nút để xem kết quả dự đoán:</Text>
//             )}
//             {!isPredictionRequested && (
//                 <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
//                     <Text style={styles.buttonText}>Dự đoán</Text>
//                 </TouchableOpacity>
//             )}

//             {isPredictionRequested && predictions.length > 0 && (
//                 <View style={styles.predictionContainer}>
                    
//                     <PlaceList places={places} userAnswers={userAnswers} /> {/* Truyền userAnswers xuống */}
//                 </View>
//             )}

//             {isPredictionRequested && predictions.length === 0 && !loading && !error && (
//                 <Text style={styles.noPredictions}>Không có dự đoán nào.</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#888',
//     },
//     errorText: {
//         fontSize: 18,
//         color: 'red',
//         textAlign: 'center',
//         marginBottom: 15,
//     },
//     predictionContainer: {
//         alignItems: 'flex-start',
//         flex: 1,
//         width: '100%',
//     },
//     noPredictions: {
//         fontSize: 16,
//         color: '#888',
//         marginTop: 20,
//         textAlign: 'center',
//     },
//     predictButton: {
//         backgroundColor: '#007AFF',
//         paddingVertical: 12,
//         paddingHorizontal: 25,
//         borderRadius: 8,
//         marginTop: 20,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default PredictScreen;


// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import axios from 'axios';
// import { collection, onSnapshot } from "@firebase/firestore";
// import { FIRESTORE_DB } from "./firebaseConfig.js";
// import { useNavigation } from "@react-navigation/native";
// import { MyUserContext } from "../../config/context.js";
// import PlaceList from './PlaceList'; // Import component PlaceList

// const place_collection = collection(FIRESTORE_DB, "place");

// const PredictScreen = ({ route }) => {
//     const { userAnswers } = route.params;
//     const [predictions, setPredictions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isPredictionRequested, setIsPredictionRequested] = useState(false);
//     const [places, setPlaces] = useState([]);
//     const user = React.useContext(MyUserContext);
//     const nav = useNavigation();
//     const [currentIndex, setCurrentIndex] = useState(0); // Thêm state để theo dõi index hiện tại

//     const fetchPredictions = async () => {
//         const dau = "#";
//         const cac_phan = userAnswers.split(dau);
//         const answer = cac_phan.slice(0, 3).join(dau);

//         console.log("Dữ liệu gửi đi:", answer);
//         setLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('user_input', answer);

//         try {
//             const response = await axios.post(
//                 'https://thuylinhvo.pythonanywhere.com/predict_locations/',
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             console.log("Response data:", response.data);
//             setPredictions(response.data.predicted_locations);
//             console.warn("result", response.data.predicted_locations[0]);
//             const chuoi = response.data.predicted_locations;
//             console.log("chuoi", chuoi);
//         } catch (err) {
//             setError('Không thể kết nối đến server hoặc có lỗi xảy ra.');
//             console.error('Lỗi gọi API:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadPlace = useCallback(() => {
//         if (predictions && predictions.length > 0) {
//             console.log('Tải lại dữ liệu địa điểm và lọc theo dự đoán.');
//             setLoading(true);
//             setError(null);

//             const unsubscribe = onSnapshot(
//                 place_collection,
//                 (snapshot) => {
//                     const allPlacesData = snapshot.docs.map((doc) => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     }));

//                     const filteredPlaces = allPlacesData.filter(placeItem =>
//                         predictions.includes(placeItem.id)
//                     );

//                     setPlaces(filteredPlaces);
//                     setLoading(false);
//                 },
//                 (error) => {
//                     console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
//                     setError(error.message);
//                     setLoading(false);
//                 }
//             );
//             return () => unsubscribe();
//         } else {
//             setPlaces([]);
//             setLoading(false);
//             return () => {};
//         }
//     }, [predictions]);

//     useEffect(() => {
//         if (isPredictionRequested && predictions.length > 0) {
//             loadPlace();
//         }
//     }, [isPredictionRequested, predictions, loadPlace]);

//     const handlePredictButtonPress = () => {
//         setIsPredictionRequested(true);
//         fetchPredictions();
//     };
//      const goToNextPlace = () => {
//         if (currentIndex < places.length - 1) {
//             setCurrentIndex(currentIndex + 1);
//         }
//     };

//     if (loading && isPredictionRequested) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#007AFF" />
//                 <Text style={styles.loadingText}>Đang tải dữ liệu địa điểm...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
//                     <Text style={styles.buttonText}>Thử lại</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {!isPredictionRequested && (
//                 <Text style={styles.title}>Nhấn nút để xem kết quả dự đoán:</Text>
//             )}
//             {!isPredictionRequested && (
//                 <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
//                     <Text style={styles.buttonText}>Dự đoán</Text>
//                 </TouchableOpacity>
//             )}

//             {isPredictionRequested && places.length > 0 && (
//                 <View style={styles.predictionContainer}>
//                     <PlaceList places={[places[currentIndex]]} userAnswers={userAnswers} />
//                      {currentIndex < places.length - 1 && (
//                         <TouchableOpacity style={styles.nextButton} onPress={goToNextPlace}>
//                             <Text style={styles.buttonText}>Tiếp theo</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             )}

//             {isPredictionRequested && places.length === 0 && !loading && !error && (
//                 <Text style={styles.noPredictions}>Không có dự đoán nào.</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#888',
//     },
//     errorText: {
//         fontSize: 18,
//         color: 'red',
//         textAlign: 'center',
//         marginBottom: 15,
//     },
//     predictionContainer: {
//         alignItems: 'flex-start',
//         flex: 1,
//         width: '100%',
//     },
//     noPredictions: {
//         fontSize: 16,
//         color: '#888',
//         marginTop: 20,
//         textAlign: 'center',
//     },
//     predictButton: {
//         backgroundColor: '#007AFF',
//         paddingVertical: 12,
//         paddingHorizontal: 25,
//         borderRadius: 8,
//         marginTop: 20,
//     },
//      nextButton: {
//         backgroundColor: '#007AFF',
//         paddingVertical: 12,
//         paddingHorizontal: 25,
//         borderRadius: 8,
//         marginTop: 20,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default PredictScreen;


import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { collection, onSnapshot } from "@firebase/firestore";
import { FIRESTORE_DB } from "./firebaseConfig.js";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../config/context.js";
import PlaceList from './PlaceList';

const place_collection = collection(FIRESTORE_DB, "place");

const PredictScreen = ({ route }) => {
    const { userAnswers } = route.params;
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPredictionRequested, setIsPredictionRequested] = useState(false);
    const [places, setPlaces] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [viewedIndices, setViewedIndices] = useState([]);
    const user = React.useContext(MyUserContext);
    const nav = useNavigation();

    const fetchPredictions = async () => {
        const dau = "#";
        const cac_phan = userAnswers.split(dau);
        const answer = cac_phan.slice(0, 3).join(dau);

        console.log("Dữ liệu gửi đi:", answer);
        setLoading(true); // Bắt đầu loading
        setError(null);

        const formData = new FormData();
        formData.append('user_input', answer);

        try {
            const response = await axios.post(
                'https://thuylinhvo.pythonanywhere.com/predict_locations/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log("Response data:", response.data);
            setPredictions(response.data.predicted_locations);
            console.warn("result", response.data.predicted_locations[0]);
            const chuoi = response.data.predicted_locations;
            console.log("chuoi", chuoi);
        } catch (err) {
            setError('Không thể kết nối đến server hoặc có lỗi xảy ra.');
            console.error('Lỗi gọi API:', err);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const loadPlace = useCallback(() => {
        if (predictions && predictions.length > 0 && currentIndex >= 0 && currentIndex < predictions.length) {
            console.log('Tải dữ liệu địa điểm cho dự đoán thứ', currentIndex + 1);
            setLoading(true); // Bắt đầu loading khi tải địa điểm
            setError(null);

            const unsubscribe = onSnapshot(
                place_collection,
                (snapshot) => {
                    const allPlacesData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    const filteredPlaces = allPlacesData.filter(placeItem =>
                        predictions.includes(placeItem.id)
                    );

                    const currentPlace = filteredPlaces.find(place => place.id === predictions[currentIndex]);
                    setPlaces(currentPlace ? [currentPlace] : []);
                    setLoading(false); // Kết thúc loading sau khi tải địa điểm
                },
                (error) => {
                    console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
                    setError(error.message);
                    setLoading(false); // Kết thúc loading trong trường hợp lỗi
                }
            );
            return () => unsubscribe();
        } else {
            setPlaces([]);
            setLoading(false);
            return () => {};
        }
    }, [predictions, currentIndex]);

    React.useEffect(() => {
        if (isPredictionRequested && predictions.length > 0 && currentIndex >= 0) {
            loadPlace();
        }
    }, [isPredictionRequested, predictions, currentIndex, loadPlace]);

    const handlePredictButtonPress = () => {
        setIsPredictionRequested(true);
        fetchPredictions();
    };

    const handleNextButtonPress = () => {
        if (currentIndex < predictions.length - 1) {
            if (!viewedIndices.includes(currentIndex) && currentIndex !== -1) {
                setViewedIndices([...viewedIndices, currentIndex]);
            }
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePreviousButtonPress = () => {
        if (viewedIndices.length > 0) {
            const previousIndex = viewedIndices[viewedIndices.length - 1];
            setViewedIndices(viewedIndices.slice(0, -1));
            setCurrentIndex(previousIndex);
        }
    };

    useEffect(() => {
        if (isPredictionRequested && predictions.length > 0 && currentIndex === -1 && !loading) {
            setCurrentIndex(0);
            nav.navigate("Answer", { userAnswers: userAnswers });
        }
    }, [isPredictionRequested, predictions, currentIndex, nav, userAnswers, loading]);

    if (loading && isPredictionRequested) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang xử lý và tải dữ liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
                    <Text style={styles.buttonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!isPredictionRequested && (
                <View style={styles.initialContainer}>
                    <Text style={styles.title}>Nhấn nút để xem kết quả dự đoán:</Text>
                    <TouchableOpacity style={styles.predictButton} onPress={handlePredictButtonPress}>
                        <Text style={styles.buttonText}>Dự đoán</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isPredictionRequested && predictions.length > 0 && currentIndex >= 0 && places.length > 0 && !loading && (
                <View style={styles.predictionContainer}>
                    <PlaceList places={places} userAnswers={userAnswers} />
                    <View style={styles.navigationButtons}>
                        {viewedIndices.length > 0 && (
                            <TouchableOpacity style={styles.previousButton} onPress={handlePreviousButtonPress}>
                                <Text style={styles.buttonText}>Quay lại</Text>
                            </TouchableOpacity>
                        )}
                        {currentIndex < predictions.length - 1 && (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNextButtonPress}>
                                <Text style={styles.buttonText}>Tiếp theo</Text>
                            </TouchableOpacity>
                        )}
                        {currentIndex === predictions.length - 1 && (
                            <Text style={styles.endMessage}>Đã hiển thị tất cả các địa điểm dự đoán.</Text>
                        )}
                    </View>
                </View>
            )}

            {isPredictionRequested && predictions.length === 0 && !loading && !error && (
                <Text style={styles.noPredictions}>Không có dự đoán nào.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Để loading ở giữa màn hình khi chưa có nội dung
    },
    initialContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
    predictionContainer: {
        alignItems: 'flex-start',
        flex: 1,
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    noPredictions: {
        fontSize: 16,
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    predictButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    previousButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    endMessage: {
        fontSize: 16,
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default PredictScreen;