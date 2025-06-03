// import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
// import React, { useContext } from "react";
// import APIs, { authApi, endpoints } from "../../config/APIs";
// import { Avatar, Button, Card, Dialog, Icon, List, MD3Colors, Portal, RadioButton, TextInput } from "react-native-paper";
// import RenderHTML from "react-native-render-html";
// import { Intl } from 'react-native';
// import moment from "moment";
// import StyleAll from "../../style/StyleAll";
// import { MyUserContext } from "../../config/context";
// import StyleTour from "../../style/StyleTour";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { isCloseToBottom } from "../Utils/util";
// // import { useCurrencyFormatter } from 'react-native-currency-formatter';

// const HotelDetail = ({ navigation,route }) => {
//     const [hoteldetail, setHotelDetail] = React.useState([]);
//     const [album, setAlbum]= React.useState([]);
//     const [like, setLike]= React.useState([]);
//     const [token, setToken]= React.useState([]);
//     const [image, setImage]= React.useState([]);
//     const [room, setRoom]= React.useState([]);
//     const [chooseRoom, setChooseRoom]= React.useState(null);
//     const [active, setActive] = React.useState(false);
//     const nav = useNavigation();
//     const hotel_id = route.params?.hotel_id;
//     const [place, setPlace]= React.useState([]);
//     const { width } = useWindowDimensions();
//     const loadHotelDetail = async() => {
//         try {

           
//             let res = await APIs.get(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/`);
//             let res2 = await APIs.get(`https://thuylinh.pythonanywhere.com/Place/`);
//             let res3 = await APIs.get(`https://thuylinh.pythonanywhere.com/HotelRoom/`);
//             setPlace(res2.data);
//             setHotelDetail(res.data);
//             setAlbum(res.data.album)
//             setLike(res.data.like_hotel)
//             setRoom(res3.data)
//             let res1= await APIs.get(endpoints["image"]);
//             setImage(res1.data);
            
//             AsyncStorage.getItem("token").then((value)=>{
//                 setToken(value)
//             })
           
//         } catch (ex) {
//             console.error("hello",ex.request);
//         }
//     }
    

//     const user= useContext(MyUserContext);  

//     React.useEffect(() => {
//         loadHotelDetail();
//     }, [hotel_id]);

    
//     const [loading, setLoading] = React.useState(false);
   

    
  

    
//     const create_like= async() =>{
//         setLoading(true);
//         let formData={
//             Active:true
//         }
//         try {
//             setActive(active? false: true);
//             axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`,formData,{
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             })
//             .then((respone)=>console.log("clike",respone))
//             .catch((err)=>console.error("clike",err.request))

            
              
//         } catch (ex) {
//             console.log(ex.request);
//         } finally {
//             setLoading(false);
//         }
//     }
//     const dislike= async() =>{
//         setLoading(true);
//         let formData={
//             Active:false
//         }
//         try {
//             setActive(active? false: true);
//             axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`,formData,{
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             })
//             .then((respone)=>console.log("dlike",respone))
//             .catch((err)=>console.error("dlike",err.request))
            
//         } catch (ex) {
//             console.log(ex.request);
//         } finally {
//             setLoading(false);
//         }
//     }


    
//     const loadMore = () => {
        
//     }
   
    
//     return (
//         <View style={StyleAll.container}>
//             <RefreshControl onRefresh={() => loadHotelDetail()} />
//            <ScrollView style={[StyleAll.container, StyleAll.margin]} onScroll={loadMore} >
//             {hoteldetail===null?<ActivityIndicator animating={true} color={'blue'} />:
//                 <Card style={StyleAll.bgrcolor}>
//                     <Card.Content>
//                     {/* .slice(0,10) */}
//                         <Text variant="titleLarge" style={StyleAll.text3}>{hoteldetail.nameofhotel}</Text>
//                         <Text style={styles.text4}><Icon size={20} source="home-city"/> {hoteldetail.address}</Text>
//                         {place.map(p=>{
//                             if(p.id==hoteldetail.place)
//                             {
//                                 return(
//                                     <Text style={styles.text4}><Icon size={20} source="map-marker"/> {p.Place_Name}</Text>
//                                 )
//                             }
//                             else
//                             {
//                                 return(<></>)
//                             }
//                         })}
//                         <RenderHTML contentWidth={width} source={{html: hoteldetail.descriptions}} />
//                     </Card.Content>
      
//                  {image.map(i=>{
//                     if(i.album_id==album)
//                     {
//                         return (
//                             <Card style={{marginTop:15}}>
//                                 <Card.Cover source={{
//                             uri: `https://res.cloudinary.com/dqcjhhtlm/${i.Path}`}} />
//                             </Card>
                           
//                         )
//                     }
                    
//                  })}
                
//                     <View >
//                 <Text style={styles.tieude1}>---- Hãy chọn loại phòng ----</Text>
//                     <RadioButton.Group onValueChange={newValue => setChooseRoom(newValue)} value={chooseRoom} >
//                         {room.map(r=>{
//                             if(r.id_hotel==hotel_id)
//                             {
//                                 return(
//                                     <Card style={styles.card1}>
//                                     <Card.Content>
//                                         <RadioButton value={r.id_room.id}/>
//                                         <View style={{flexDirection:"row"}}>
//                                             <Text style={{marginLeft:15, fontSize:20,fontWeight:'bold'}}>{r.id_room.name}</Text>
//                                             <Text style={{marginLeft:30,marginTop:4, fontSize:16}}>{r.Price}/ 1 đêm</Text>
//                                         </View>
//                                         {r.BreakfastOrNone==true?<>
//                                             <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="food"/> Bao gồm ăn sáng</Text>
//                                         </>:<>
//                                         </>}
//                                         <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="shower"/> Toilet riêng</Text>
//                                         <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="air-conditioner"/> Có máy lạnh</Text>
//                                         <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="wifi"/> Wifi trong phòng</Text>
//                                         <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="car-convertible"/> Gần chợ, ATM, trung tâm</Text>
//                                         <Text style={{marginTop:5,marginLeft:10}}>{r.id_room.description}</Text>
//                                     </Card.Content>
//                                 </Card>
//                             )}})}
//                     </RadioButton.Group> 
                       
//                     </View>
//                     <Card style={styles.card2}>
//                     <Card.Content>
//                         <Icon size={20} source="bell-alert"/>
//                         <Text> Tất cả loại phòng nêu trên của khách sạn này đã được khách sạn/resort quy định sẵn số người dùng trong 1 phòng, nếu như quý khách muốn tăng thêm người sẽ phải chịu phụ thu thêm tại quầy check in của khách sạn</Text>
//                     </Card.Content>
//                     </Card>
//                     {chooseRoom===null?<>
//                         <TouchableOpacity disabled={true} style={styles.button} key={hotel_id} onPress={()=>nav.navigate("bookhotel",{"hotel_id":hotel_id,"room_id":chooseRoom})}>
//                     <Text style={{marginLeft:40, fontSize:20,fontWeight:'bold', marginTop:10}}><Icon size={20} source="bed"/> Đặt phòng</Text></TouchableOpacity>
//                     </>:<>
//                     <TouchableOpacity style={styles.button} key={hotel_id} onPress={()=>nav.navigate("bookhotel",{"hotel_id":hotel_id,"room_id":chooseRoom})}>
//                     <Text style={{marginLeft:40, fontSize:20,fontWeight:'bold', marginTop:10}}><Icon size={20} source="bed"/> Đặt phòng</Text></TouchableOpacity>
//                     </>}
                    
//                 </Card>
//             }

//            </ScrollView>
//            </View>
         
//     );
// };
// const styles= StyleSheet.create({
//     text1:{
//         fontSize:20,
//         fontWeight:'bold',
//         marginBottom:8,
//         marginLeft:10
//     },
//     tieude:{
//         fontWeight:'bold',
//         fontSize:25, 
//         marginTop:10, 
//         color:'black',
//         marginBottom:10
//     },
//     tieude1:{
//         fontWeight:'bold',
//         fontSize:25, 
//         marginTop:10, 
//         color:'black',
//         marginBottom:10,
//         marginLeft:15
//     }, text2:{
//         fontSize:15,
//         marginBottom:8,
//         marginLeft:10
//     }, text4:{
//         fontSize:15,
//         marginBottom:8,
//         marginLeft:10,
//         marginTop:10
//     }, text3:{
//         fontSize:18,
//         marginBottom:8,
//         marginLeft:0,
//         fontWeight:'bold'
//     },card:{
//         backgroundColor:"#d6e7ee",
//         marginBottom:30,
//         marginLeft:8,
//         marginRight:8,
//         marginTop:10,
//         height:400
//     },card1:{
//         backgroundColor:"beige",
//         marginBottom:30,
//         marginLeft:8,
//         marginRight:8,
//         marginTop:10,
//         height:320
//     },card2:{
//         backgroundColor:"#ffcac8",
//         borderWidth:1,
//         borderColor:"red",
//         marginBottom:30,
//         marginLeft:8,
//         marginRight:8,
//         marginTop:10,
//         height:150
//     },button:{
//         backgroundColor:"pink",
//         color:"white",
//         textAlign:"center",
//         marginTop:15,
//         marginBottom:50,
//         height:45,
//         width:220,
//         marginLeft:100,
//         borderRadius:20
//     }
// })
// export default HotelDetail;

import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    FlatList,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import APIs, { authApi, endpoints } from "../../config/APIs";
import { Avatar, Button, Card, Dialog, Icon, List, MD3Colors, Portal, RadioButton, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { Intl } from 'react-native';
import moment from "moment";
import StyleAll from "../../style/StyleAll";
import { MyUserContext } from "../../config/context";
import StyleTour from "../../style/StyleTour";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { isCloseToBottom } from "../Utils/util";
import BackButton from "../Back/ButtonBack";
// import { useCurrencyFormatter } from 'react-native-currency-formatter';

const HotelDetail = ({ navigation, route }) => {
    const [hoteldetail, setHotelDetail] = useState([]);
    const [album, setAlbum] = useState(null);
    const [like, setLike] = useState([]);
    const [token, setToken] = useState(null);
    const [images, setImages] = useState([]);
    const [room, setRoom] = useState([]);
    const [chooseRoom, setChooseRoom] = useState(null);
    const [active, setActive] = useState(false);
    const nav = useNavigation();
    const hotel_id = route.params?.hotel_id;
    const [place, setPlace] = useState([]);
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHotelDetail = useCallback(async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const res = await APIs.get(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/`);
            const res2 = await APIs.get(`https://thuylinh.pythonanywhere.com/Place/`);
            const res3 = await APIs.get(`https://thuylinh.pythonanywhere.com/HotelRoom/`);
            const res1 = await APIs.get(endpoints["image"]);

            setPlace(res2.data);
            setHotelDetail(res.data);
            setAlbum(res.data.album);
            setLike(res.data.like_hotel);
            setRoom(res3.data);
            setImages(res1.data.filter(img => img.album_id === res.data.album));

            AsyncStorage.getItem("token").then((value) => {
                setToken(value);
            });
        } catch (ex) {
            console.error("Lỗi load chi tiết khách sạn:", ex.request);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [hotel_id, endpoints]);

    const user = useContext(MyUserContext);

    useEffect(() => {
        loadHotelDetail();
    }, [loadHotelDetail]);

    const create_like = async () => {
        if (!token) {
            nav.navigate("login");
            return;
        }
        setLoading(true);
        let formData = {
            Active: true
        };
        try {
            setActive(prevActive => !prevActive);
            const response = await axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("Thích:", response.data);
            loadHotelDetail();
        } catch (err) {
            console.error("Lỗi thích:", err.request);
        } finally {
            setLoading(false);
        }
    };

    const dislike = async () => {
        if (!token) {
            nav.navigate("login");
            return;
        }
        setLoading(true);
        let formData = {
            Active: false
        };
        try {
            setActive(prevActive => !prevActive);
            const response = await axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("Bỏ thích:", response.data);
            loadHotelDetail();
        } catch (ex) {
            console.error("Lỗi bỏ thích:", ex.request);
        } finally {
            setLoading(false);
        }
    };

    const renderImageItem = ({ item }) => (
        <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.Path}` }} style={styles.imageCover} resizeMode="cover" />
        </Card>
    );

    if (loading) {
        return <ActivityIndicator style={StyleAll.loading} size="large" color={'blue'} />;
    }

    return (
        <View style={StyleAll.container}>
            <View >
            <BackButton />
            </View>
            <RefreshControl refreshing={refreshing} onRefresh={loadHotelDetail} />
            <ScrollView style={[StyleAll.container, StyleAll.margin]}>
                <Card style={StyleAll.bgrcolor}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.hotelName}>{hoteldetail.nameofhotel}</Text>
                        <View style={styles.locationContainer}>
                            <Icon size={20} source="home-city" style={styles.locationIcon} />
                            <Text style={styles.locationText}>{hoteldetail.address}</Text>
                        </View>
                        {place.map(p => (
                            p.id === hoteldetail.place && (
                                <View style={styles.placeContainer} key={p.id}>
                                    <Icon size={20} source="map-marker" style={styles.placeIcon} />
                                    <Text style={styles.placeText}>{p.Place_Name}</Text>
                                </View>
                            )
                        ))}
                    </Card.Content>

                    {images.length > 0 && (
                        <View style={styles.imageCarouselContainer}>
                            <FlatList
                                data={images}
                                renderItem={renderImageItem}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal={true}
                                pagingEnabled={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}

                    <Card.Content style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>Mô tả:</Text>
                        <RenderHTML contentWidth={width} source={{ html: hoteldetail.descriptions }} />
                    </Card.Content>
                </Card>

                <View style={styles.roomSelectionContainer}>
                    <Text style={styles.roomSelectionTitle}>---- Hãy chọn loại phòng ----</Text>
                    <RadioButton.Group onValueChange={newValue => setChooseRoom(newValue)} value={chooseRoom}>
                        {room.filter(r => r.id_hotel === hotel_id).map(r => (
                            <Card style={styles.roomCard} key={r.id_room.id}>
                                <Card.Content>
                                    <View style={styles.roomHeader}>
                                        <RadioButton value={r.id_room.id} />
                                        <View style={styles.roomNamePrice}>
                                            <Text style={styles.roomName}>{r.id_room.name}</Text>
                                            <Text style={styles.roomPrice}>{r.Price}/ đêm</Text>
                                        </View>
                                    </View>
                                    {r.BreakfastOrNone && <Text style={styles.roomAmenity}><Icon size={15} source="food" /> Bao gồm ăn sáng</Text>}
                                    <Text style={styles.roomAmenity}><Icon size={15} source="shower" /> Toilet riêng</Text>
                                    <Text style={styles.roomAmenity}><Icon size={15} source="air-conditioner" /> Có máy lạnh</Text>
                                    <Text style={styles.roomAmenity}><Icon size={15} source="wifi" /> Wifi trong phòng</Text>
                                    <Text style={styles.roomAmenity}><Icon size={15} source="car-convertible" /> Gần chợ, ATM, trung tâm</Text>
                                    <Text style={styles.roomDescription}>{r.id_room.description}</Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </RadioButton.Group>
                </View>

                <Card style={styles.importantNoteCard}>
                    <Card.Content>
                        <View style={styles.importantNoteHeader}>
                            <Icon size={20} source="bell-alert" color={MD3Colors.error50} />
                            <Text style={styles.importantNoteTitle}> Lưu ý quan trọng</Text>
                        </View>
                        <Text style={styles.importantNoteText}> Tất cả loại phòng nêu trên của khách sạn này đã được khách sạn/resort quy định sẵn số người dùng trong 1 phòng, nếu như quý khách muốn tăng thêm người sẽ phải chịu phụ thu thêm tại quầy check in của khách sạn</Text>
                    </Card.Content>
                </Card>

                <TouchableOpacity
                    style={[styles.bookButton, chooseRoom === null && styles.disabledButton]}
                    key={hotel_id}
                    onPress={() => chooseRoom && nav.navigate("bookhotel", { "hotel_id": hotel_id, "room_id": chooseRoom })}
                    disabled={chooseRoom === null}
                >
                    <Icon size={20} source="bed" color="white" style={styles.bookButtonIcon} />
                    <Text style={styles.bookButtonText}>Đặt phòng</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    hotelName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationIcon: {
        marginRight: 5,
        color: '#757575',
    },
    locationText: {
        fontSize: 16,
        color: '#757575',
    },
    placeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    placeIcon: {
        marginRight: 5,
        color: '#757575',
    },
    placeText: {
        fontSize: 16,
        color: '#757575',
    },
    descriptionContainer: {
        marginTop: 15,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    imageCarouselContainer: {
        marginTop: 15,
        marginBottom: 15,
        height: 300,
    },
    imageCard: {
        width: 400,
        marginRight: 20,
        borderRadius: 0,
    },
    imageCover: {
        height: 300,
    },
    roomSelectionContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    roomSelectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 15,
    },
    roomCard: {
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 8,
        elevation: 2,
    },
    roomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    roomNamePrice: {
        marginLeft: 15,
        flexDirection: 'column',
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    roomPrice: {
        fontSize: 16,
        color: '#388e3c',
    },
    roomAmenity: {
        fontSize: 15,
        color: '#757575',
        marginLeft: 35,
        marginBottom: 3,
    },
    roomDescription: {
        fontSize: 16,
        color: 'black',
        marginTop: 10,
        marginLeft: 10,
    },
    importantNoteCard: {
        backgroundColor: '#ffe0b2',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 8,
    },
    importantNoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    importantNoteTitle: {
        fontWeight: 'bold',
        color: MD3Colors.error50,
        marginLeft: 5,
    },
    importantNoteText: {
        color: 'black',
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: 'pink',
        color: 'white',
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 50,
        flexDirection: 'row',
    },
    bookButtonText: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    bookButtonIcon: {
        color: 'white',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

export default HotelDetail;