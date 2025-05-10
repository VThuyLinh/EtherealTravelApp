import { View, Text, Image, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Avatar, Button, Card, Dialog, HelperText, Icon, PaperProvider, Portal, RadioButton, TextInput, TouchableRipple } from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import APIs, { endpoints } from "../../config/APIs";

import { useNavigation } from "@react-navigation/native";
import React, { useContext} from "react";
import { useState } from "react";
import { MyUserContext } from "../../config/context";
import { Alert } from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from "react-native-safe-area-context";


const BookHotel =({route})=>{
    const user = useContext(MyUserContext);
    const [token, setToken]= React.useState('');
    const [show, setShow]= React.useState(false);
    const [show1, setShow1]= React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [checkin, setCheckin] = React.useState(new Date());
    const [checkout, setCheckout] = React.useState(new Date());
    const [guest, setGuest]= React.useState(true);
    const [price, setPrice]= React.useState('');
    const nav = useNavigation();
    const hotel_id=route.params?.hotel_id;
    const room_id=route.params?.room_id;

   
    const onChange =(event, selectedDate)=>{
        const currentDate= selectedDate;
        setShow(false);
        setCheckin(currentDate);
    }
    const onChange1 =(event, selectedDate)=>{
        const currentDate= selectedDate;
        setShow1(false);
        setCheckout(currentDate);
    }
   
   
    const generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 10; 
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
    
        }
       
    
      };

    const bookhotel = async () => {
                let res = await APIs.get(`https://thuylinh.pythonanywhere.com/HotelRoom/${room_id}/`)
                setPrice(res.data.Price)
                let tien= price;
                console.warn(res.data.Price)
                console.warn(code)

                const cin= parseInt(checkin.toLocaleDateString().slice(0,2));
                const cout= parseInt(checkout.toLocaleDateString().slice(0,2));
                
                let formData={
                    id_book_hotel: code,
                    GuestOrSomeone: true,
                    Checkin: checkin.toLocaleDateString(),
                    Checkout: checkout.toLocaleDateString(),
                    id_hotel: hotel_id,
                    id_user_book_hotel: user.id,
                    price: parseInt(tien* parseInt(cout-cin)),
                    Room: room_id
                }
                AsyncStorage.getItem("token").then((value)=>{
                    setToken(value)})
                    console.warn(token);
                setLoading(true)
                try {
                    axios.post(`https://thuylinh.pythonanywhere.com/BookHotel/`,formData,{
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                })
                    .then((respone)=>console.log(respone))
                    .catch((err)=>console.error(err.request))
                    nav.navigate("Home");
                  
                       
                    
                } catch (ex) {
                    console.log(ex);
                    
                   
                } finally {
                    setLoading(false);
                }
            }
     
            
 
    return (
    <View>
            <ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>

            <RadioButton.Group onValueChange={newValue => setGuest(newValue)} value={guest} >
                
                        <Card>
                            <Card.Content>
                            <View style={{flexDirection:"row"}}>
                                <RadioButton value="true" />
                                <Text style={{fontSize:20, fontWeight:'bold'}}>Khách nội địa</Text>
                            </View>
                            <Text style={{marginLeft:30, fontSize:13}}> Hãy chọn vào ô này nếu như bạn là người có quốc tịch Việt Nam</Text>
                            </Card.Content>
                        </Card>
                        <Card style={{marginTop:15}}>
                            <Card.Content>
                            <View style={{flexDirection:"row"}}>
                                <RadioButton value="false" />
                                <Text style={{fontSize:20, fontWeight:'bold'}}>Khách nước ngoài</Text>
                            </View>
                            <Text style={{marginLeft:30, fontSize:13}}> Hãy chọn vào ô này nếu như bạn là người có quốc tịch nước khác</Text>
                            </Card.Content>
                        </Card>
            </RadioButton.Group> 
               
            </View>
            
            <SafeAreaView>
            
            <TouchableOpacity style={style.button1} onPress={()=>setShow(true)}><Text style={{fontSize:20, fontWeight:"bold", marginLeft:80, marginTop:5, color:"green"}}>Checkin</Text>
                {show && (
                    // <DateTimePicker 
                    //  value={checkin}
                    //  mode="date"
                    //  is24Hour={true}
                    //  onChange={onChange}/>
                    <></>
                )}
            </TouchableOpacity>
            <Text>Ngày check in:{checkin.toLocaleDateString()}</Text>
      </SafeAreaView>


      <SafeAreaView>
            
      <TouchableOpacity style={style.button2} onPress={()=>setShow1(true)}><Text style={{fontSize:20, fontWeight:"bold", marginLeft:80, marginTop:5, color:"#FBD6E3"}}>Checkout</Text>
                {show1 && (
                    // <DateTimePicker 
                    //  value={checkout}
                    //  mode="date"
                    //  is24Hour={true}
                    //  onChange={onChange1}/>
                    <></>
                )}
            </TouchableOpacity>
            <Text>Ngày check out:{checkout.toLocaleDateString()}</Text>
      </SafeAreaView>
     
    
   

            

            
            </KeyboardAvoidingView>

            <TouchableOpacity  style={style.button} onPress ={()=> { bookhotel();generateRandomString()}} >
                    <Text><Icon size={20} source="bed"/>Đặt phòng</Text> 
            </TouchableOpacity>
            
        </ScrollView>
    </View>
    )
}


const style= StyleSheet.create({
    button:{
        backgroundColor:"#b2dbbf",
        color:"white",
        textAlign:"center",
        marginTop:20,
        height:45,
        width:160,
        marginLeft:230,
        borderRadius:20
    },button1:{
        backgroundColor:"#b2dbbf",
        color:"white",
        textAlign:"center",
        marginTop:20,
        height:45,
        width:250,
        marginLeft:85,
        borderRadius:20
    },button2:{
        backgroundColor:"#F2594B",
        textAlign:"center",
        marginTop:20,
        height:45,
        width:250,
        marginLeft:85,
        borderRadius:20
    },ip:{
        borderBottomWidth:1,
       
        paddingLeft:10,
        marginTop:10
    },text1:{
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
        height:290
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
export default BookHotel;