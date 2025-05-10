// import React, { useState } from "react"
// import { FlatList, StyleSheet, View } from "react-native";
// import StyleAll from "../../style/StyleAll";
// import * as GoogleGenerativeAI from "@google/generative-ai"
// import { ActivityIndicator, Text, TextInput } from "react-native-paper";

// const GeminiChat=()=>{
//     const [messages, setMessages]= React.useState([]);
//     const [userInput, setUserInput]= React.useState("");
//     const [loading, setLoading]=React.useState(false);

//     const API_KEY ="AIzaSyBLkjeOc2OJzpl1BvbQan7FRVRgKgWerwc";
    
//     React.useEffect(()=>{
//         const Chat=async()=>{
//             const genAI = new  GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
//             const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//             const prompt = "Hello";    
//             const result = await model.generateContent(prompt);
//             const response= result.response;
//             const text= response.text();
//             console.log(text);

//             setMessages([
//                 {
//                     text,user:false,
//                 },
//             ]);

//         };
//         Chat();
//     },[]);

//     const SendMessage=async()=>{
//         setLoading(true);
//         const userMessage={text:userInput, user:true};
//         setMessages([...messages, userMessage]);
//         const genAI = new  GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//         const prompt = userMessage.text;    
//         const result = await model.generateContent(prompt);
//         const response= result.response;
//         const text= response.text();
//         setMessages([...messages,{text,user:false}]);
//         setUserInput("");
//         setLoading(false);
//     }

//     const renderChat=({item})=>(
//         <View style={styles.messageContainer}>
//             <Text style={[styles.messageText, item.user && styles.userMessage]}>{item.text}</Text>
//         </View>

//     );
    
//     return (          

// <View style={styles.container}>
//         <Text style={styles.tieude}>Ethereal Travel </Text>
//             <FlatList
//                 data={messages}
//                 renderItem={renderChat}
//                 keyExtractor={(item)=>item.text}
                
//             />
//             <View>
//                 <TextInput placeholder="Gõ tin nhắn"
//                 onChangeText={setUserInput}
//                 value={userInput}
//                 onSubmitEditing={SendMessage}
//                 style={styles.ip}
//                 placeholderTextColor="pink"/>
//                 {loading &&(
//                     <ActivityIndicator 
//                     size="small"
//                     color="black"/>
//                 )}
//         </View>
//         </View>
        
//     )
// }
// const styles= StyleSheet.create({
//     container:{
//         flex:1,
//         backgroundColor:'#ffffff',
//         paddingHorizontal:30
//     },tinyLogo: {
//         marginTop:20,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },tinyLogo1: {
//         marginTop:5,
//         marginLeft:5,
//         width: 400,
//         height: 200,
//       },
//     tieude:{
//         fontWeight:'bold',
//         fontSize:30, 
//         marginTop:10, 
//         color:'black',
//         marginLeft:80
//     },
//     messageContainer:{
//         padding:10,
//         marginVertical:5
//     },
//     messageText:{
//         fontSize:16
//     },
//     userMessage:{
//         backgroundColor:"#f0f0f0"
//     },
//     button:{
//         backgroundColor:"#b2dbbf",
//         color:"white",
//         textAlign:"center",
//         marginTop:20,
//         height:45,
//         width:160,
//         marginLeft:230,
//         borderRadius:20
//     },
//     center:{alignItems:'center'},
//     title:{
//         fontWeight:'bold',
//         fontSize:30, 
//         color:'black'
//     },form:{
//         marginTop:30
//     },ip:{
//         borderBottomWidth:1,
//         backgroundColor:'#fff',
//         borderColor:'green',
//         paddingLeft:10
//     }});


// export default GeminiChat;

import React from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { ActivityIndicator, Text, TextInput, Icon } from "react-native-paper";

const GeminiChat = () => {
    const [messages, setMessages] = React.useState([]);
    const [userInput, setUserInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const API_KEY = "AIzaSyBLkjeOc2OJzpl1BvbQan7FRVRgKgWerwc"; 

    React.useEffect(() => {
        const Chat = async () => {
            const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const initialPrompt = "Chào bạn! Tôi là chatbot hỗ trợ du lịch Việt Nam. Bạn có câu hỏi nào về các địa điểm, thông tin hoặc kinh nghiệm du lịch ở Việt Nam không?";
            const result = await model.generateContent(initialPrompt);
            const response = result.response;
            const text = response.text();
            console.log("Tin nhắn khởi đầu:", text);

            setMessages([
                {
                    text, user: false,
                },
            ]);
        };
        Chat();
    }, []);

    const SendMessage = async () => {
        if (userInput.trim() === "") return; // Không gửi tin nhắn trống
        setLoading(true);
        const userMessage = { text: userInput, user: true };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setUserInput(""); // Clear input ngay sau khi gửi

        try {
            const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Thêm hướng dẫn về phạm vi câu trả lời
            const prompt = `Trả lời các câu hỏi liên quan đến du lịch ở Việt Nam. Nếu câu hỏi không liên quan đến du lịch Việt Nam, hãy trả lời một cách lịch sự rằng bạn chỉ có thể hỗ trợ thông tin về du lịch Việt Nam. Câu hỏi của người dùng là: "${userInput}"`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            setMessages(prevMessages => [...prevMessages, { text, user: false }]);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            // Hiển thị thông báo lỗi cho người dùng nếu cần
        } finally {
            setLoading(false);
        }
    };

    const renderChat = ({ item }) => (
        <View style={[
            styles.messageContainer,
            item.user ? styles.userMessageContainer : styles.botMessageContainer,
        ]}>
            <Text style={[styles.messageText, item.user && styles.userText]}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.tieude}>Ethereal Travel Chat</Text>
            <FlatList
                data={messages}
                renderItem={renderChat}
                keyExtractor={(item, index) => index.toString()} // Sử dụng index làm key
                inverted // Hiển thị tin nhắn mới nhất ở dưới cùng
                contentContainerStyle={{ paddingBottom: 70 }} // Để không bị che khuất bởi input
            />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Gõ tin nhắn..."
                    onChangeText={setUserInput}
                    value={userInput}
                    style={styles.input}
                    placeholderTextColor="#999"
                    onSubmitEditing={SendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={SendMessage} disabled={loading || userInput.trim() === ""}>
                    <Icon source="send" size={24} color="#fff" />
                </TouchableOpacity>
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color="black"
                        style={styles.loadingIndicator}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FFFA',
        paddingHorizontal: 5,
        paddingTop: 20,
    },
    tieude: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 10,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        maxWidth: '80%',
    },
    botMessageContainer: {
        backgroundColor: '#e0f7fa',
        alignSelf: 'flex-start',
    },
    userMessageContainer: {
        backgroundColor: '#dcedc8',
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: 16,
        color: 'black',
    },
    userText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',

    },
    input: {
        flex: 1,


        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        height: 40
    },
    sendButton: {
        backgroundColor: '#66CDAA',
        borderRadius: 25,
        padding: 10,
    },
    loadingIndicator: {
        marginLeft: 10,
    },
});

export default GeminiChat;