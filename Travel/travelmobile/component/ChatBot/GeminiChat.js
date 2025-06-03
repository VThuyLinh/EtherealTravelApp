import React, { useState } from "react"
import { FlatList, StyleSheet, View } from "react-native";
import StyleAll from "../../style/StyleAll";
import * as GoogleGenerativeAI from "@google/generative-ai"
import { ActivityIndicator, Text, TextInput } from "react-native-paper";

const GeminiChat=()=>{
    const [messages, setMessages]= React.useState([]);
    const [userInput, setUserInput]= React.useState("");
    const [loading, setLoading]=React.useState(false);

    const API_KEY ="AIzaSyBLkjeOc2OJzpl1BvbQan7FRVRgKgWerwc";
    
    React.useEffect(()=>{
        const Chat=async()=>{
            const genAI = new  GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = "Hello";    
            const result = await model.generateContent(prompt);
            const response= result.response;
            const text= response.text();
            console.log(text);

            setMessages([
                {
                    text,user:false,
                },
            ]);

        };
        Chat();
    },[]);

    const SendMessage=async()=>{
        setLoading(true);
        const userMessage={text:userInput, user:true};
        setMessages([...messages, userMessage]);
        const genAI = new  GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = userMessage.text;    
        const result = await model.generateContent(prompt);
        const response= result.response;
        const text= response.text();
        setMessages([...messages,{text,user:false}]);
        setUserInput("");
        setLoading(false);
    }

    const renderChat=({item})=>(
        <View style={styles.messageContainer}>
            <Text style={[styles.messageText, item.user && styles.userMessage]}>{item.text}</Text>
        </View>

    );
    
    return (          

<View style={styles.container}>
        <Text style={styles.tieude}>Ethereal Travel </Text>
            <FlatList
                data={messages}
                renderItem={renderChat}
                keyExtractor={(item)=>item.text}
                
            />
            <View>
                <TextInput placeholder="Gõ tin nhắn"
                onChangeText={setUserInput}
                value={userInput}
                onSubmitEditing={SendMessage}
                style={styles.ip}
                placeholderTextColor="pink"/>
                {loading &&(
                    <ActivityIndicator 
                    size="small"
                    color="black"/>
                )}
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
        height: 200,
      },
    tieude:{
        fontWeight:'bold',
        fontSize:30, 
        marginTop:10, 
        color:'black',
        marginLeft:80
    },
    messageContainer:{
        padding:10,
        marginVertical:5
    },
    messageText:{
        fontSize:16
    },
    userMessage:{
        backgroundColor:"#f0f0f0"
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
    }});


export default GeminiChat;
