import React, { useContext, useEffect, useState } from "react"
import { MyUserContext } from "../../config/context"
import axios from "axios";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { Text, TextInput } from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const RejectTour=()=>{

    const user= useContext(MyUserContext);
    const [tour, setTour]= React.useState([]);
    const [loading, setLoading]= React.useState(false);
    const [idbooktour, setIdbooktour]= React.useState('');
    const [token, setToken]= React.useState('');
    const navigation= useNavigation();

    const loadTour=async()=>{
        try{
            let res= await axios.get('https://thuylinh.pythonanywhere.com/BookTour/')
            setTour(res.data);
            console.info("Hello",res.data);
        }
        catch(ex)
        {
            console.warn(ex.request);
        }
        finally{
            setLoading(false)
        }
    }
    const reject = async (id) => {
        let formData={
            State:"Reject"       
        }
        console.warn(id);
        setLoading(loading?true:false)
        AsyncStorage.getItem("token").then((value)=>{
            setToken(value)})
            console.warn(token);
        setLoading(true)
        try {
            axios.patch(`https://thuylinh.pythonanywhere.com/BookTour/${id}/`,formData,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            
        })
            .then((respone)=>console.log(respone))
            .catch((err)=>console.error(err.request))

            setTimeout(() => {
                navigation.navigate('MyTour')
            }, 500);
            
        } catch (ex) {
            console.log(ex);
            
           
        } finally {
            setLoading(false);
        }
    }
   

    return (
        <View style={[StyleAll.container]}>
        <View style={styles.center}>
             <Text style={styles.tieude}>Ethereal_Travel</Text>
        </View>
        <View style={styles.center}>
             <Text style={styles.title}>Hủy tour</Text>
        </View>
        
        <View style={{marginTop:20, marginLeft:25, marginRight:25, marginBottom:10}}>
               <TextInput placeholder="Mã đặt tour" style={styles.ip} onChangeText={(value)=>setIdbooktour(value)}></TextInput>
        </View>
       <View >
             <View style={{ marginLeft:25, marginRight:25}}>
                
                 <TextInput placeholder="Cho chúng tôi biết lý do được không" style={styles.ip}></TextInput>
             </View>
             <TouchableOpacity style={styles.button} onPress={()=>{loadTour()}}>
                <Text>Xác thực</Text>
             </TouchableOpacity>
             {tour.map(t=>{
                if(t.id_booktour==idbooktour){
                    return(
                        <TouchableOpacity style={styles.button} onPress={()=>{reject(`${t.id}`); Alert.alert('Hủy thành công' )}} >
                            <Text style={{fontSize:18, fontWeight:'bold', marginTop:10, marginLeft:40}}>Hủy tour</Text>
                        </TouchableOpacity>
                    )
                }
                else{
                    return(
                       <></>
                    )
                }
                })}
             
             
        </View>
       
    </View>
    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        paddingHorizontal:30
    },tinyLogo: {
        marginTop:20,
        marginLeft:5,
        width: 400,
        height: 200,
      },tinyLogo1: {
        marginTop:5,
        marginLeft:5,
        width: 400,
      },
    tieude:{
        fontWeight:'bold',
        fontSize:30, 
        marginTop:10, 
        color:'black',
    },
    button:{
        backgroundColor:"#b2dbbf",
        color:"white",
        textAlign:"center",
        marginTop:20,
        height:45,
        width:160,
        marginLeft:230,
        borderRadius:20
    },
    center:{alignItems:'center'},
    title:{
        fontWeight:'bold',
        fontSize:30, 
        color:'black'
    },form:{
        marginTop:30
    },ip:{
        borderBottomWidth:1,
        backgroundColor:'#fff',
        borderColor:'green',
        paddingLeft:10
    },ip:{
        borderBottomWidth:1,
        backgroundColor:'#fff',
        borderColor:'green',
        paddingLeft:10,
        height:50
    },alertTitle: {
        color: 'red', // Change the title color
      },
      alertMessage: {
        color: 'blue', // Change the message color
      },
      alertButton: {
        color: 'green', // Change the button color
      },});
export default RejectTour;