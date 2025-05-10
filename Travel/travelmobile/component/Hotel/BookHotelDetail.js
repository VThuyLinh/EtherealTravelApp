import { Linking, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native"
import StyleAll from "../../style/StyleAll"
import { ActivityIndicator, Button, Card, Chip, List, Text } from "react-native-paper"
import React, { useContext, useState } from "react"
import APIs, { endpoints } from "../../config/APIs"
import moment from "moment"

import Icon from "react-native-vector-icons/FontAwesome6"
import { MyDispatchContext, MyUserContext } from "../../config/context"
import StyleTour from "../../style/StyleTour"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { isCloseToBottom } from "../Utils/util"







const BookHotelDetail =({navigation}) =>
    {
        const user= useContext(MyUserContext);
        let date= new Date();
        
        const [bookhoteldetail, setBookHotelDetail]=React.useState([]);
        const [hotel, setHotel]=React.useState([]);
        const [active, setActive]=React.useState(true);
        const [token, setToken]= React.useState('');
        const [room, setRoom]= React.useState('');
        const [loading, setLoading] = React.useState(false);
        const loadBookHotelDetail = async () =>{
            try{
                setLoading(true)
                let res= await APIs.get(endpoints['bhotel']);
                setBookHotelDetail(res.data);
                let res1= await APIs.get(endpoints['hotel']);
                setHotel(res1.data.results);
                let res2= await APIs.get(endpoints['hotelr']);
                setRoom(res2.data);
               
               
            }
            catch (ex){
                console.error(ex);
            }
        }
        const payment = async (id) => {
            let formData={
                State:"Paid"       
            }
            setLoading(loading?true:false)
            AsyncStorage.getItem("token").then((value)=>{
                setToken(value)})
                console.warn(token);
            setLoading(true)
            try {
                axios.patch(`https://thuylinh.pythonanywhere.com/BookHotel/${id}/`,formData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
            })
                .then((respone)=>console.log(respone))
                .catch((err)=>console.error(err.request))
                
            } catch (ex) {
                console.log(ex);
                
               
            } finally {
                setLoading(false);
            }
        }
        
        const reject = async (id) => {
            let formData={
                State:"Reject"       
            }
            setLoading(loading?true:false)
            AsyncStorage.getItem("token").then((value)=>{
                setToken(value)})
                console.warn(token);
            setLoading(true)
            try {
                axios.patch(`https://thuylinh.pythonanywhere.com/BookHotel/${id}/`,formData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
            })
                .then((respone)=>console.log(respone))
                .catch((err)=>console.error(err.request))
               
              
                   
                
            } catch (ex) {
                console.log(ex);
                
               
            } finally {
                setLoading(false);
            }
        }


        const complete = async (id) => {
            let formData={
                State:"Complete"       
            }
            setLoading(loading?true:false)
            AsyncStorage.getItem("token").then((value)=>{
                setToken(value)})
                console.warn(token);
            setLoading(true)
            try {
                axios.patch(`https://thuylinh.pythonanywhere.com/BookHotel/${id}/`,formData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
            })
                .then((respone)=>console.log(respone))
                .catch((err)=>console.error(err.request))
               
              
                   
                
            } catch (ex) {
                console.log(ex);
                
               
            } finally {
                setLoading(false);
            }
        }
  

        React.useEffect(()=>{
             loadBookHotelDetail();
            },[]);
            

            const loadMore = () => {
                if (loading==false) {
                    setActive(active?true:false);
                    
                }
            }

        return(
        <View style={StyleAll.container}>
            <RefreshControl onRefresh={() => loadBookHotelDetail()} />
            <ScrollView onScroll={loadMore}>  
                {bookhoteldetail.map(c=> c.id_user_book_hotel!==user.id?<>
                    
                </>:<>
                {bookhoteldetail === null ? <><ActivityIndicator/> 
                <Text>Hiện tại bạn chưa có đặt chỗ nghỉ dưỡng nào. Hãy chọn cho mình 
                        <Text onPress={()=> navigation.navigate("hotel")}>khách sạn</Text> để có những phút giây thư giãn</Text></>:<>
                    <Card mode="elevated" style={StyleTour.card}>
                        <Card.Content>
                        <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginBottom:8}} />
                        <Text style={StyleTour.text2}>Thông tin người đặt</Text>
                        <Text style={StyleTour.text1}>Người đặt : {user.first_name+" " + user.last_name}</Text>
                        <Text style={StyleTour.text1}>Số điện thoại : {user.sdt}</Text>
                        <Text style={StyleTour.text3}>Email nhận hóa đơn : {user.email}</Text>
                        <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom:8, marginTop:8  }} />
                        <Text style={StyleTour.text2}>Thông tin khách sạn</Text>
                        
                        {hotel.map(ho=>
                            <View>
                                <Text style={StyleTour.text1}>{ho.nameofhotel}</Text>
                                <Text style={StyleTour.text1}>Địa chỉ:{ho.address}</Text>
                               
                            </View>
                        )}
                        

                        <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom:8, marginTop:8  }} />
                        <Text style={StyleTour.text2}>Thông tin đặt khách sạn</Text>
                        <Text style={StyleTour.text1}>Mã đặt phòng :{c.id_book_hotel}</Text>
                        <Text style={StyleTour.text1}>Ngày checkin : {c.Checkin}</Text>
                        <Text style={StyleTour.text1}>Ngày check out :{c.Checkout}</Text>
                        
                        {room.map(ro=>{
                            if(ro.id==c.Room)
                            {
                                return(<>
                                    <Text style={StyleTour.text1}>Loại phòng:{ro.name}</Text>
                                    <Text style={StyleTour.text1}>Thông tin phòng:{ro.description}</Text></>
                                )
                            }
                        })}
                       
                        <Text style={StyleTour.text1}>Tổng tiền :{c.price}</Text>
                        <View style={{ width: '100%', height: 1.5, backgroundColor: 'black', marginBottom:8, marginTop:8  }} />
                        
                        {c.State==="Wait for Paid"?<>
                        <View style={{ flexDirection: 'row' }}>
                        <Button style={StyleTour.btn1a} onPress={()=>{payment(`${c.id}`)}}><Text style={StyleTour.text22}>Thanh toán</Text></Button>
                        <Button style={StyleTour.btn1b} onPress={()=>reject(`${c.id}`)}><Text style={StyleTour.text22}>Hủy</Text></Button>
                        </View>
                        </>:<></>}

                        {c.State==='Paid'?
                        <>
                            <Text>Hãy bỏ đồ vào vali và chuẩn bị nghỉ dưỡng thôi</Text>
                           <View style={{ flexDirection: 'row' }}>
                           <Button style={StyleTour.btn2} ><Text style={StyleTour.text21}>{c.State}</Text></Button>
                           <Button style={StyleTour.btn1b} onPress={()=>reject(`${c.id}`)}><Text style={StyleTour.text22}>Hủy</Text></Button>
                           </View>
                        </>:<></>}

                        {c.State==='Complete'?
                        <>
                            <Button style={StyleTour.btn1} ><Text style={StyleTour.text21}>{c.State}</Text></Button>
                        </>:<></>}
                        {c.State==='Reject'?
                        <>
                            <Button style={StyleTour.btn3} ><Text style={StyleTour.text21}>{c.State}</Text></Button>
                        </>:<></>}
                        
                        {c.State==='Complete'?
                        <>
                            <Button style={StyleTour.btn1} ><Text style={StyleTour.text21}>{c.State}</Text></Button>
                        </>:<></>}
                        
                        
                        
                        </Card.Content>
                    </Card></>}
                    
                        
               
                </>)}
    
            </ScrollView>
        </View>
        
        );
    }

export default BookHotelDetail;
 