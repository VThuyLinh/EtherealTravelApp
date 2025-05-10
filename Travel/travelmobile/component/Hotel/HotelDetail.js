import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import React, { useContext } from "react";
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
// import { useCurrencyFormatter } from 'react-native-currency-formatter';

const HotelDetail = ({ navigation,route }) => {
    const [hoteldetail, setHotelDetail] = React.useState([]);
    const [album, setAlbum]= React.useState([]);
    const [like, setLike]= React.useState([]);
    const [token, setToken]= React.useState([]);
    const [image, setImage]= React.useState([]);
    const [room, setRoom]= React.useState([]);
    const [chooseRoom, setChooseRoom]= React.useState(null);
    const [active, setActive] = React.useState(false);
    const nav = useNavigation();
    const hotel_id = route.params?.hotel_id;
    const [place, setPlace]= React.useState([]);
    const { width } = useWindowDimensions();
    const loadHotelDetail = async() => {
        try {

           
            let res = await APIs.get(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/`);
            let res2 = await APIs.get(`https://thuylinh.pythonanywhere.com/Place/`);
            let res3 = await APIs.get(`https://thuylinh.pythonanywhere.com/HotelRoom/`);
            setPlace(res2.data);
            setHotelDetail(res.data);
            setAlbum(res.data.album)
            setLike(res.data.like_hotel)
            setRoom(res3.data)
            let res1= await APIs.get(endpoints["image"]);
            setImage(res1.data);
            
            AsyncStorage.getItem("token").then((value)=>{
                setToken(value)
            })
           
        } catch (ex) {
            console.error("hello",ex.request);
        }
    }
    

    const user= useContext(MyUserContext);  

    React.useEffect(() => {
        loadHotelDetail();
    }, [hotel_id]);

    
    const [loading, setLoading] = React.useState(false);
   

    
  

    
    const create_like= async() =>{
        setLoading(true);
        let formData={
            Active:true
        }
        try {
            setActive(active? false: true);
            axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`,formData,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((respone)=>console.log("clike",respone))
            .catch((err)=>console.error("clike",err.request))

            
              
        } catch (ex) {
            console.log(ex.request);
        } finally {
            setLoading(false);
        }
    }
    const dislike= async() =>{
        setLoading(true);
        let formData={
            Active:false
        }
        try {
            setActive(active? false: true);
            axios.post(`https://thuylinh.pythonanywhere.com/Hotel/${hotel_id}/like_hotel/`,formData,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((respone)=>console.log("dlike",respone))
            .catch((err)=>console.error("dlike",err.request))
            
        } catch (ex) {
            console.log(ex.request);
        } finally {
            setLoading(false);
        }
    }


    
    const loadMore = () => {
        
    }
   
    
    return (
        <View style={StyleAll.container}>
            <RefreshControl onRefresh={() => loadHotelDetail()} />
           <ScrollView style={[StyleAll.container, StyleAll.margin]} onScroll={loadMore} >
            {hoteldetail===null?<ActivityIndicator animating={true} color={'blue'} />:
                <Card style={StyleAll.bgrcolor}>
                    <Card.Content>
                    {/* .slice(0,10) */}
                        <Text variant="titleLarge" style={StyleAll.text3}>{hoteldetail.nameofhotel}</Text>
                        <Text style={styles.text4}><Icon size={20} source="home-city"/> {hoteldetail.address}</Text>
                        {place.map(p=>{
                            if(p.id==hoteldetail.place)
                            {
                                return(
                                    <Text style={styles.text4}><Icon size={20} source="map-marker"/> {p.Place_Name}</Text>
                                )
                            }
                            else
                            {
                                return(<></>)
                            }
                        })}
                        <RenderHTML contentWidth={width} source={{html: hoteldetail.descriptions}} />
                    </Card.Content>
      
                 {image.map(i=>{
                    if(i.album_id==album)
                    {
                        return (
                            <Card style={{marginTop:15}}>
                                <Card.Cover source={{
                            uri: `https://res.cloudinary.com/dqcjhhtlm/${i.Path}`}} />
                            </Card>
                           
                        )
                    }
                    
                 })}
                
                    <View >
                <Text style={styles.tieude1}>---- Hãy chọn loại phòng ----</Text>
                    <RadioButton.Group onValueChange={newValue => setChooseRoom(newValue)} value={chooseRoom} >
                        {room.map(r=>{
                            if(r.id_hotel==hotel_id)
                            {
                                return(
                                    <Card style={styles.card1}>
                                    <Card.Content>
                                        <RadioButton value={r.id_room.id}/>
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={{marginLeft:15, fontSize:20,fontWeight:'bold'}}>{r.id_room.name}</Text>
                                            <Text style={{marginLeft:30,marginTop:4, fontSize:16}}>{r.Price}/ 1 đêm</Text>
                                        </View>
                                        {r.BreakfastOrNone==true?<>
                                            <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="food"/> Bao gồm ăn sáng</Text>
                                        </>:<>
                                        </>}
                                        <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="shower"/> Toilet riêng</Text>
                                        <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="air-conditioner"/> Có máy lạnh</Text>
                                        <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="wifi"/> Wifi trong phòng</Text>
                                        <Text style={{marginTop:5,marginLeft:30}}><Icon size={15} source="car-convertible"/> Gần chợ, ATM, trung tâm</Text>
                                        <Text style={{marginTop:5,marginLeft:10}}>{r.id_room.description}</Text>
                                    </Card.Content>
                                </Card>
                            )}})}
                    </RadioButton.Group> 
                       
                    </View>
                    <Card style={styles.card2}>
                    <Card.Content>
                        <Icon size={20} source="bell-alert"/>
                        <Text> Tất cả loại phòng nêu trên của khách sạn này đã được khách sạn/resort quy định sẵn số người dùng trong 1 phòng, nếu như quý khách muốn tăng thêm người sẽ phải chịu phụ thu thêm tại quầy check in của khách sạn</Text>
                    </Card.Content>
                    </Card>
                    {chooseRoom===null?<>
                        <TouchableOpacity disabled={true} style={styles.button} key={hotel_id} onPress={()=>nav.navigate("bookhotel",{"hotel_id":hotel_id,"room_id":chooseRoom})}>
                    <Text style={{marginLeft:40, fontSize:20,fontWeight:'bold', marginTop:10}}><Icon size={20} source="bed"/> Đặt phòng</Text></TouchableOpacity>
                    </>:<>
                    <TouchableOpacity style={styles.button} key={hotel_id} onPress={()=>nav.navigate("bookhotel",{"hotel_id":hotel_id,"room_id":chooseRoom})}>
                    <Text style={{marginLeft:40, fontSize:20,fontWeight:'bold', marginTop:10}}><Icon size={20} source="bed"/> Đặt phòng</Text></TouchableOpacity>
                    </>}
                    
                </Card>
            }

           </ScrollView>
           </View>
         
    );
};
const styles= StyleSheet.create({
    text1:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:8,
        marginLeft:10
    },
    tieude:{
        fontWeight:'bold',
        fontSize:25, 
        marginTop:10, 
        color:'black',
        marginBottom:10
    },
    tieude1:{
        fontWeight:'bold',
        fontSize:25, 
        marginTop:10, 
        color:'black',
        marginBottom:10,
        marginLeft:15
    }, text2:{
        fontSize:15,
        marginBottom:8,
        marginLeft:10
    }, text4:{
        fontSize:15,
        marginBottom:8,
        marginLeft:10,
        marginTop:10
    }, text3:{
        fontSize:18,
        marginBottom:8,
        marginLeft:0,
        fontWeight:'bold'
    },card:{
        backgroundColor:"#d6e7ee",
        marginBottom:30,
        marginLeft:8,
        marginRight:8,
        marginTop:10,
        height:400
    },card1:{
        backgroundColor:"beige",
        marginBottom:30,
        marginLeft:8,
        marginRight:8,
        marginTop:10,
        height:320
    },card2:{
        backgroundColor:"#ffcac8",
        borderWidth:1,
        borderColor:"red",
        marginBottom:30,
        marginLeft:8,
        marginRight:8,
        marginTop:10,
        height:150
    },button:{
        backgroundColor:"pink",
        color:"white",
        textAlign:"center",
        marginTop:15,
        marginBottom:50,
        height:45,
        width:220,
        marginLeft:100,
        borderRadius:20
    }
})
export default HotelDetail;