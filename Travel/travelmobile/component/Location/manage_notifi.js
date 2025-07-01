import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native'; 


const LOCATION_NOTIFICATION_TASK = 'location-notification-task';
const API_CHECK_LOCATION = 'https://thuylinh.pythonanywhere.com/CheckLocation/';
const NOTIFIED_MEMORIES_KEY = 'notifiedMemories'; 


const LOCATION_ACCURACY = Location.Accuracy.Balanced; 
const LOCATION_DISTANCE_INTERVAL = 500; 
const LOCATION_DEFERRED_UPDATES_INTERVAL = 10000; 

const PROXIMITY_THRESHOLD_METERS = 100;

const COOLDOWN_PERIOD_MILLIS = 24 * 60 * 60 * 1000; // 24 giờ


TaskManager.defineTask(LOCATION_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error("Lỗi tác vụ nền vị trí:", error);
        return;
    }
    if (data && data.locations) {
        const currentLocation = data.locations[0];
        if (!currentLocation) {
            console.log("Không có dữ liệu vị trí trong tác vụ nền.");
            return;
        }

        const { latitude, longitude } = currentLocation.coords;
        console.log(`Vị trí nền cập nhật: Lat: ${latitude}, Long: ${longitude}`);

        try {
           
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.warn("Không tìm thấy token. Không thể kiểm tra kỷ niệm.");
                
                return;
            }

      
            let notifiedMemories = {};
            try {
                const storedNotified = await AsyncStorage.getItem(NOTIFIED_MEMORIES_KEY);
                if (storedNotified) {
                    notifiedMemories = JSON.parse(storedNotified);
                }
            } catch (e) {
                console.error("Lỗi đọc notifiedMemories:", e);
            }

            // Xóa các kỷ niệm đã hết thời gian cooldown
            const now = Date.now();
            for (const id in notifiedMemories) {
                if (now - notifiedMemories[id] > COOLDOWN_PERIOD_MILLIS) {
                    delete notifiedMemories[id];
                }
            }

            // Gọi API CheckLocation
            const response = await axios.get(API_CHECK_LOCATION, {
                params: {
                    latitude: latitude.toFixed(6), 
                    longitude: longitude.toFixed(6), 
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const nearbyMemories = response.data; 

            if (nearbyMemories && nearbyMemories.length > 0) {
                for (const memory of nearbyMemories) {
                    
                    if (!notifiedMemories[memory.id] || (now - notifiedMemories[memory.id] > COOLDOWN_PERIOD_MILLIS)) {
                        console.log(`Tìm thấy kỷ niệm gần đó: ${memory.content}`);

                        // Gửi thông báo
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "Kỷ niệm cũ ở gần đây!",
                                body: `Bạn đã ghé thăm nơi này vào: "${memory.content}". Nhấn để xem lại!`,
                                data: { memoryId: memory.id, location: { latitude, longitude } },
                            },
                            trigger: null, 
                        });

                        
                        notifiedMemories[memory.id] = now;
                    }
                }
                
                await AsyncStorage.setItem(NOTIFIED_MEMORIES_KEY, JSON.stringify(notifiedMemories));
            } else {
                console.log("Không có kỷ niệm nào ở gần vị trí hiện tại.");
            }

        } catch (apiError) {
            console.error('Lỗi khi gọi API CheckLocation:', apiError.response ? apiError.response.data : apiError.message);
           
        }
    }
});


 
export const startBackgroundLocationTracking = async () => {
    // Yêu cầu quyền vị trí nền
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
        Alert.alert('Quyền vị trí bị từ chối', 'Cần quyền truy cập vị trí để theo dõi địa điểm.');
        return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
        Alert.alert('Quyền vị trí nền bị từ chối', 'Ứng dụng cần quyền vị trí nền để thông báo về kỷ niệm khi bạn không dùng ứng dụng.');
        return false;
    }

    // Yêu cầu quyền thông báo
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    if (notificationStatus.status !== 'granted') {
        Alert.alert('Quyền thông báo bị từ chối', 'Ứng dụng cần quyền thông báo để hiển thị các kỷ niệm.');
        return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_NOTIFICATION_TASK);
    if (!isRegistered) {
        try {
            await Location.startLocationUpdatesAsync(LOCATION_NOTIFICATION_TASK, {
                accuracy: LOCATION_ACCURACY,
                distanceInterval: LOCATION_DISTANCE_INTERVAL,
                deferredUpdatesInterval: LOCATION_DEFERRED_UPDATES_INTERVAL,
                
            });
            console.log("Đã bắt đầu theo dõi vị trí nền để thông báo kỷ niệm.");
            return true;
        } catch (e) {
            console.error("Lỗi khi bắt đầu theo dõi vị trí nền:", e);
            Alert.alert("Lỗi", "Không thể bắt đầu theo dõi vị trí nền.");
            return false;
        }
    } else {
        console.log("Tác vụ theo dõi vị trí đã được đăng ký.");
        return true;
    }
};


export const stopBackgroundLocationTracking = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_NOTIFICATION_TASK);
    if (isRegistered) {
        try {
            await Location.stopLocationUpdatesAsync(LOCATION_NOTIFICATION_TASK);
            console.log("Đã dừng theo dõi vị trí nền.");
            return true;
        } catch (e) {
            console.error("Lỗi khi dừng theo dõi vị trí nền:", e);
            Alert.alert("Lỗi", "Không thể dừng theo dõi vị trí nền.");
            return false;
        }
    } else {
        console.log("Tác vụ theo dõi vị trí chưa được đăng ký.");
        return false;
    }
};

