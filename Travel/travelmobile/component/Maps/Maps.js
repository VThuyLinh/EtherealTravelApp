// import MapView, { Marker } from 'react-native-maps';
// import React, { useCallback, useContext, useEffect, useState } from "react"
// import { Alert, FlatList, PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { DataTable, SegmentedButtons, Text } from 'react-native-paper';
// import * as Locationn from 'expo-location';
// import { MyUserContext } from '../../config/context';
// import axios from 'axios';
// import Geolocation from 'react-native-geolocation-service'
// import StyleAll from '../../style/StyleAll';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';


// const Maps = () => {

//   const [kd, setKD] = useState('');
//   const [vd, setVD] = useState('');
//   const [location, setLocation] = useState('');
//   const [loc, setLoc] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const user = useContext(MyUserContext);
//   const [token, setToken] = useState('');
//   const [places, setPlaces] = useState([]);
//   const [find, setfind] = React.useState('13000');
//   const [showResults, setShowResults] = useState(false); // New state variable

//   const [markerCoordinate, setMarkerCoordinate] = useState({
//     latitude: 10.8231,
//     longitude: 106.6297,
//   });

//   let locc = '';

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         // Đặt lại tất cả các state về giá trị ban đầu ở đây
//         setKD('');
//         setVD('');
//         setLocation('');
//         setLoc([]);
//         setLoading(false);
//         setToken('');
//         setPlaces([]);
//         setfind('13000');
//         setShowResults(false);
//         setMarkerCoordinate({
//           latitude: 10.8231,
//           longitude: 106.6297,
//         });
//         // Có thể cần đặt lại các state khác
//       };
//     }, []) // Empty dependency array vì bạn muốn cleanup chạy mỗi khi component mất focus
//   );

//   const getLocation = async () => {

//     let { status } = await Locationn.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setLocation({
//         errMsg: 'Quyền định vị chưa được cấp'
//       })
//     }
//     setLoc(await Locationn.getCurrentPositionAsync({}));
//     locc = await Locationn.getCurrentPositionAsync({});
//     setLocation(locc.coords.longitude + "-" + locc.coords.latitude)
//     setKD(locc.coords.longitude)
//     setVD(locc.coords.latitude)


//     let formData = {
//       kdo: `${locc.coords.latitude}`,
//       vdo: `${locc.coords.longitude}`,
//       diadiem: "Viet Nam",
//       locationofuser: `${user.id}`,
//     }

//     setLoading(loading ? true : false)
//     AsyncStorage.getItem("token").then((value) => {
//       setToken(value)
//     })
//     console.warn(token);
//     setLoading(true)
//     try {
//       let res = await axios.post(`https://thuylinh.pythonanywhere.com/Location/`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       })
//      setTimeout(10000);
//      getNearbyPlace();

//     } catch (ex) {
//       console.log(ex);


//     } finally {
//       setLoading(false);
//     }


//   }


//   const restaurant = () => {
//     setfind('13000')
//   }
//   const coffee = () => {
//     setfind('13034')
//   }


//   const mall = () => {
//     setfind('17114')
//   }

//   const cinema = () => {
//     setfind('10032')
//   }

//   const bank = () => {
//     setfind('11045')
//   }
//   const atm = () => {
//     setfind('11044')
//   }

//   const getNearbyPlace = async () => {
//     try {
//       let res = await axios.get(`https://api.foursquare.com/v3/places/search?ll=${vd.toString()},${kd.toString()}&radius=1500&categories=${find.toString()}`, {
//         headers: {
//           'Authorization': `fsq31odvGRZyYcF3RoAhDmuWgkRFms1Tjn+GR+ix0EN666g=`,
//         },
//       });
//       setPlaces(res.data.results);
//       setShowResults(true); // Show the results
//       // console.error(res.data.results)
//       // Hiển thị danh sách nhà hàng trên bản đồ
//     } catch (error) {
//       console.warn(error.info);
//     }
//   };


//   const initialRegion = {
//     latitude: markerCoordinate.latitude, // Vĩ độ HCM
//     longitude: markerCoordinate.longitude, // Kinh độ HCM
//     latitudeDelta: 0.2922,
//     longitudeDelta: 0.2421,
//   };


//   return (

//     <View style={styles.container}>
     
//       <View style={styles.row2} >
//         <MapView style={styles.map} region={initialRegion}>
//           <Marker coordinate={{ latitude: parseFloat(vd), longitude: parseFloat(kd) }} pinColor='red' title='Bạn đang ở đây nè' />
//           {places.map(place => (
//             <Marker
//               key={place.place_id}
//               coordinate={{
//                 latitude: parseFloat(place.lat),
//                 longitude: parseFloat(place.lon),
//               }}
//               title={place.display_name}
//               draggable
//             />
//           ))}
//         </MapView>

//       </View>
//       <View style={styles.row3} >
//         {/* <TouchableOpacity onPress={()=>restaurant()}><Text>Restaurant</Text></TouchableOpacity>
//                         <TouchableOpacity onPress={()=>mall()}><Text>Mall</Text></TouchableOpacity>
//                         <TouchableOpacity onPress={()=>cinema()}><Text>Cinema</Text></TouchableOpacity>
//                         <TouchableOpacity onPress={()=>bank()}><Text>Bank</Text></TouchableOpacity>
//                         <TouchableOpacity onPress={()=>coffee()}><Text>Coffee</Text></TouchableOpacity>

//                         <TouchableOpacity onPress={()=>atm()}><Text>ATM</Text></TouchableOpacity> */}
//         <SegmentedButtons
//           style={styles.sear}
//           density="small"
//           value={find}
//           onValueChange={t => { setfind(t) }}
//           buttons={[
//             {
//               value: '13000',
//               label: 'Restaurant',
//               labelStyle: { fontSize: 8 },
//               icon: 'silverware-fork-knife'


//             },
//             {
//               value: '17114',
//               label: 'Mall',
//               labelStyle: { fontSize: 8 },
//               icon: 'shopping'
//             },
//             {
//               value: '10024',
//               label: 'Theatre',
//               labelStyle: { fontSize: 8 },
//               icon: 'video-vintage'
//             },
//             {
//               value: '11045',
//               label: 'Bank',
//               labelStyle: { fontSize: 8 },
//               icon: 'bank'
//             },
//             {
//               value: '11044',
//               label: 'ATM',
//               labelStyle: { fontSize: 8 },
//               icon: 'cash-100'
//             },
//           ]}
//         />
         
//         <View style={{ alignItems: 'center' }}>
//           <TouchableOpacity style={styles.button2} onPress={() => { getLocation(), Alert.alert('Lưu thành công') }} >
//             <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>Nhấn vào đây để xem mình đang ở đâu nè</Text>
//           </TouchableOpacity>

//       </View>
       
//         {showResults && (
//           <>
//             <DataTable.Header>
//               <DataTable.Title>Tên</DataTable.Title>
//               <DataTable.Title>Địa chỉ</DataTable.Title>
//             </DataTable.Header>
//             <FlatList data={places} key={({ item }) => { item.fsq_id }} onEndReachedThreshold={10} renderItem={({ item }) =>
//               <View>
//                 <DataTable>
//                   <DataTable.Row>
//                     <DataTable.Cell><Text style={{ width: 300, fontSize: 10 }}>{item.name}</Text></DataTable.Cell>
//                     <DataTable.Cell><Text style={{ width: 200, fontSize: 10, flexWrap: 'wrap' }}>{item.location.address}</Text></DataTable.Cell>
//                   </DataTable.Row>
//                 </DataTable>
//               </View>}
//               keyExtractor={item => item.place_id} />
//           </>
//         )}

//       </View>
//     </View>


//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // Container chiếm toàn bộ màn hình
//     flexDirection: 'column', // Các hàng được xếp theo chiều dọc
//   },
  
//   row2: {
//     flex: 2.8,
//     textAlign: 'center'
//   },
//   row3: {
//     flex: 1.5, // Hàng 3 chiếm 1/3 màn hình

//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   button1:{
//             width:350,
//             height:30,
//             marginLeft:25,
//             borderRadius:25,
//             textAlign:'center',
    
//           },
//           button2:{
//             width:380,
//             height:60,
//             marginLeft:5,
//             marginTop:5,
//             borderRadius:25,
//             textAlign:'center',
//           },
//               sear:{ 
//       backgroundColor:"#FAF0E6",
//       marginLeft:10,marginRight:10, marginTop:5,
//       borderRadius:15,
//   }
// });

// export default Maps;



import MapView, { Marker } from 'react-native-maps';
import React, { useCallback, useContext, useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataTable, SegmentedButtons, Text } from 'react-native-paper';
import * as Locationn from 'expo-location';
import { MyUserContext } from '../../config/context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Maps = () => {
  const [kd, setKD] = useState('');
  const [vd, setVD] = useState('');
  const [location, setLocation] = useState('');
  const [loc, setLoc] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useContext(MyUserContext);
  const [token, setToken] = useState('');
  const [places, setPlaces] = useState([]);
  const [find, setfind] = useState('13000');
  const [showResults, setShowResults] = useState(false);

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 10.8231,
    longitude: 106.6297,
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setKD('');
        setVD('');
        setLocation('');
        setLoc([]);
        setLoading(false);
        setToken('');
        setPlaces([]);
        setfind('13000');
        setShowResults(false);
        setMarkerCoordinate({
          latitude: 10.8231,
          longitude: 106.6297,
        });
      };
    }, [])
  );

  useEffect(() => {
    if (vd && kd) {
      getNearbyPlace();
    }
  }, [vd, kd, find]);

  const getLocation = async () => {
    let { status } = await Locationn.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation({
        errMsg: 'Quyền định vị chưa được cấp'
      });
      return;
    }
    try {
      const locResult = await Locationn.getCurrentPositionAsync({});
      setLocation(locResult.coords.longitude + "-" + locResult.coords.latitude);
      setKD(locResult.coords.longitude);
      setVD(locResult.coords.latitude);

      const formData = {
        kdo: `${locResult.coords.latitude}`,
        vdo: `${locResult.coords.longitude}`,
        diadiem: "Viet Nam",
        locationofuser: `${user.id}`,
      };

      setLoading(true);
      const tokenValue = await AsyncStorage.getItem("token");
      setToken(tokenValue);

      const res = await axios.post(`https://thuylinh.pythonanywhere.com/Location/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      console.log("Lưu vị trí thành công:", res.data);
    } catch (ex) {
      console.error("Lỗi lưu vị trí:", ex);
    } finally {
      setLoading(false);
    }
  };

  const getNearbyPlace = async () => {
    if (!vd || !kd) {
      console.warn("Chưa có thông tin vị trí.");
      return;
    }
    try {
      const res = await axios.get(`https://api.foursquare.com/v3/places/search?ll=${vd.toString()},${kd.toString()}&radius=1500&categories=${find.toString()}`, {
        headers: {
          'Authorization': `fsq31odvGRZyYcF3RoAhDmuWgkRFms1Tjn+GR+ix0EN666g=`,
        },
      });
      console.log("Dữ liệu địa điểm lân cận:", res.data.results);
      setPlaces(res.data.results);
      setShowResults(true);
    } catch (error) {
      console.error("Lỗi khi lấy địa điểm lân cận:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row2}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: markerCoordinate.latitude,
            longitude: markerCoordinate.longitude,
            latitudeDelta: 0.2922,
            longitudeDelta: 0.2421,
          }}
        >
          {vd && kd && (
            <Marker
              coordinate={{ latitude: parseFloat(vd), longitude: parseFloat(kd) }}
              pinColor="red"
              title="Bạn đang ở đây nè"
            />
          )}
          {places.map((place) => (
            <Marker
              key={place.fsq_id}
              coordinate={{
                latitude: place.geocodes?.main?.latitude || place.location?.lat || markerCoordinate.latitude,
                longitude: place.geocodes?.main?.longitude || place.location?.lon || markerCoordinate.longitude,
              }}
              title={place.name}
            />
          ))}
        </MapView>
      </View>
      <View style={styles.row3}>
        <SegmentedButtons
          style={styles.sear}
          density="small"
          value={find}
          onValueChange={(t) => { setfind(t) }}
          buttons={[
            { value: '13000', label: 'Restaurant', labelStyle: { fontSize: 8 }, icon: 'silverware-fork-knife' },
            { value: '17114', label: 'Mall', labelStyle: { fontSize: 8 }, icon: 'shopping' },
            { value: '10024', label: 'Theatre', labelStyle: { fontSize: 8 }, icon: 'video-vintage' },
            { value: '11045', label: 'Bank', labelStyle: { fontSize: 8 }, icon: 'bank' },
            { value: '11044', label: 'ATM', labelStyle: { fontSize: 8 }, icon: 'cash-100' },
          ]}
        />
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.button2} onPress={() => getLocation()} >
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}> Nhấn vào đây để xem mình đang ở đâu nè</Text>
          </TouchableOpacity>
        </View>
        {showResults && places.length > 0 && (
          <>
            <DataTable.Header>
              <DataTable.Title>Tên</DataTable.Title>
              <DataTable.Title>Địa chỉ</DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={places}
              keyExtractor={(item) => item.fsq_id}
              renderItem={({ item }) => (
                <View>
                  <DataTable>
                    <DataTable.Row>
                      <DataTable.Cell><Text style={{ width: 300, fontSize: 10 }}>{item.name}</Text></DataTable.Cell>
                      <DataTable.Cell><Text style={{ width: 200, fontSize: 10, flexWrap: 'wrap' }}>{item.location?.formatted_address || item.location?.address || 'Không có địa chỉ'}</Text></DataTable.Cell>
                    </DataTable.Row>
                  </DataTable>
                </View>
              )}
            />
          </>
        )}
        {showResults && places.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>Không tìm thấy địa điểm nào gần đây.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  row2: {
    flex: 2.8,
    textAlign: 'center'
  },
  row3: {
    flex: 1.5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button2: {
    width: 380,
    height: 40,
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2f7',
  },
  sear: {
    backgroundColor: "#FAF0E6",
    marginLeft: 10, marginRight: 10, marginTop: 5,
    borderRadius: 15,
  }
});

export default Maps;