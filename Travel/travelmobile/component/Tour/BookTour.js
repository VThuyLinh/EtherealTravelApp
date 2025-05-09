

// import { View, Text, Image, ScrollView, Platform, KeyboardAvoidingView, StyleSheet, Alert } from "react-native";
// import { Avatar, Button, Card, Dialog, HelperText, PaperProvider, Portal, TextInput, TouchableRipple } from "react-native-paper";
// import StyleAll from "../../style/StyleAll";
// import APIs, { endpoints } from "../../config/APIs";
// import { useNavigation } from "@react-navigation/native";
// import React, { useContext} from "react";
// import { useState } from "react";
// import { MyUserContext } from "../../config/context";
// import { formatCurrency, getSupportedCurrencies } from "react-native-format-currency";
// import Code from "../../component/code/code"
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { mdiGmail } from "@mdi/js";

// const generateRandomString = () =>  {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const randomLength = 8;
//     let randomString = '';
//     for (let i = 0; i < randomLength; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         randomString += characters.charAt(randomIndex);
//     }
//     return `BT${randomString}`;
// };

// const sendBookingConfirmationEmail = async (emailData, navigation) => { // Nhận navigation
//     try {
//         const emailRes = await axios.post('https://vothuylinh.pythonanywhere.com/send-booking-confirmation', emailData, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log("Gửi email thành công:", emailRes.data);
//         Alert.alert(
//             "Thành công",
//             "Đặt tour thành công! Hóa đơn đã được gửi đến email của bạn.",
//             [
//                 {
//                     text: "OK",
//                     onPress: () => {
//                         navigation.navigate('MyTour'); // Sử dụng navigation được truyền vào
//                     }
//                 }
//             ]
//         );
//     } catch (error) {
//         console.log("Lỗi gửi email:", error);
//         if (error.response) {
//             console.log("Lỗi response khi gửi email:", error.response.data);
//             console.log("Lỗi response khi gửi email:", error.response);
//             Alert.alert("Lỗi", `Gửi email không thành công: ${JSON.stringify(error.response.data)}`);
//         } else {
//             Alert.alert("Lỗi", "Đã có lỗi xảy ra khi gửi email.");
//         }
//     } finally {
//         navigation.navigate('Home1'); // Sử dụng navigation được truyền vào
//     }
// };

// const BookTour =({route})=>{
//     const user = useContext(MyUserContext);
//     const navigation = useNavigation(); // Lấy đối tượng navigation

//     const id_tour_id = route.params?.id_tour_id;
//     const Adult_price = route.params?.Adult_price;
//     const Children_price = route.params?.Children_price;
//     const DeparturePlace = route.params?.DeparturePlace;
//     const Destination = route.params?.Destination;
//     const vehicle= route.params?.vehicle;
//     const DepartureDay = route.params?.DepartureDay;
//     const DepartureTime = route.params?.DepartureTime;
//     const Days= route.params?.Days;
//     const Tour_Name= route.params?.Tour_Name;
//     const Nights= route.params?.Nights;
//     const [qadult, setQAdult] = React.useState('');
//     const [token, setToken]= React.useState('');
//     const [qchildren, setQChildren] = React.useState('');
//     const [code, setCode]= React.useState('');
//     const [loading, setLoading] = React.useState(false);

//     const booktour = async () => {
//         const bookingCode = generateRandomString(); // Tạo mã đặt tour trước
//         setCode(bookingCode);

//         let formData={
//             id_booktour: bookingCode, // Sử dụng mã đã tạo
//             Quantity_Adult: qadult,
//             Quantity_Children: qchildren || 0,
//             Price: (parseInt(qadult || 0)*Adult_price + parseInt(qchildren || 0)*Children_price),
//             id_customer_bt: user.id,
//             id_tour_id: id_tour_id,
//             email: user.email,
//         }
//         AsyncStorage.getItem("token").then((value)=>{
//             setToken(value)})
//             console.warn(token);
//         setLoading(true)
//         try {
//             const res = await axios.post(`https://thuylinh.pythonanywhere.com/BookTour/${id_tour_id}/`,formData,{
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json' // Thay đổi Content-Type nếu backend nhận JSON
//                 },
//             });
//             console.log("Đặt tour thành công:", res.data);

//             const emailData = {
//                 id_booktour: bookingCode, // Sử dụng mã đã tạo
//                 id_tour_id: id_tour_id,
//                 email: user.email,
//                 tour_name: Tour_Name,
//                 adultCount: qadult,
//                 childrenCount: qchildren || "0",
//                 Price: formData.Price,
//                 name: `${user.first_name} ${user.last_name}`,
//                 departure_day: "2025-05-10",
//                 departure_time: DepartureTime,
//                 departure_place: DeparturePlace,
//                 destination: Destination,
//                 days: Days,
//                 nights: Nights,
//                 adult_price: Adult_price,
//                 children_price: Children_price,
//                 id_customer_bt: user.id,
//             };
//             sendBookingConfirmationEmail(emailData, navigation); // Truyền navigation
//         } catch (ex) {
//             console.log("Lỗi đặt tour:", ex);
//             if (ex.response) {
//                 console.log("Lỗi response:", ex.response.data);
//             }
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <View>
//             <ScrollView>
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//             <Card>
//                 <Card.Content>
//                     <Text>Thông tin chuyến đi</Text>
//                     <Text>Tour_Name :{Tour_Name}</Text>
//                     <Text>Nơi đi :{DeparturePlace}</Text>
//                     <Text>Nơi đến :{Destination}</Text>
//                     <Text>Ngày khởi hành:{DepartureDay}</Text>
//                     <Text>Giờ khởi hành:{DepartureTime}</Text>
//                     <Text> {Days} Ngày {Nights} Đêm</Text>
//                     <Text>Phương tiện :{vehicle}</Text>
//                 </Card.Content>
//                 <Card.Content>
//                     <Text>Thông tin người đặt</Text>
//                     <Text>Họ tên :{user.first_name} {user.last_name}</Text>
//                     <Text>Email :{user.email}</Text>
//                     <Text>Sdt :{user.sdt}</Text>
//                 </Card.Content>
//             </Card>
//             <TextInput placeholder="Người lớn" style={style.ip} onChangeText={(value)=>setQAdult(value)} keyboardType="numeric"></TextInput>
//             <TextInput placeholder="Trẻ em" style={style.ip} onChangeText={(value)=>setQChildren(value)} keyboardType="numeric"></TextInput>
//             <Text>Tổng tiền vé người lớn : {(parseInt(qadult || 0)*Adult_price)}</Text>
//             <Text>Tổng tiền vé trẻ em : {(parseInt(qchildren || 0)*Children_price)}</Text>
//             <Text>Tổng tiền : {(parseInt(qadult || 0)*Adult_price)+(parseInt(qchildren || 0)*Children_price)}</Text>
//             </KeyboardAvoidingView>

//             <Button style={StyleAll.margin}  loading={loading} icon="bag-personal" mode="contained"
//                 onPress ={booktour} >
//                     Đặt chuyến đi
//             </Button>

//             </ScrollView>
//         </View>
//         )
// }
// const style= StyleSheet.create({
//     ip:{
//         borderBottomWidth:1,
//         backgroundColor:'#fff',
//         borderColor:'green',
//         paddingLeft:10
//     }
// })
// export default BookTour;



import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  TextInput,
  useTheme,
} from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../config/context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomLength = 8;
  let randomString = "";
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return `BT${randomString}`;
};

const sendBookingConfirmationEmail = async (emailData, navigation) => {
  try {
    const emailRes = await axios.post(
      "https://vothuylinh.pythonanywhere.com/send-booking-confirmation",
      emailData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Gửi email thành công:", emailRes.data);
    Alert.alert(
      "Thành công",
      "Đặt tour thành công! Hóa đơn đã được gửi đến email của bạn.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("MyTour");
          },
        },
      ]
    );
  } catch (error) {
    console.log("Lỗi gửi email:", error);
    if (error.response) {
      console.log("Lỗi response khi gửi email:", error.response.data);
      console.log("Lỗi response khi gửi email:", error.response);
      Alert.alert(
        "Lỗi",
        `Gửi email không thành công: ${JSON.stringify(error.response.data)}`
      );
    } else {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi gửi email.");
    }
  } finally {
    navigation.navigate("Home1");
  }
};

const BookTour = ({ route }) => {
  const user = useContext(MyUserContext);
  const navigation = useNavigation();
  const theme = useTheme();

  const id_tour_id = route.params?.id_tour_id;
  const Adult_price = route.params?.Adult_price;
  const Children_price = route.params?.Children_price;
  const DeparturePlace = route.params?.DeparturePlace;
  const Destination = route.params?.Destination;
  const vehicle = route.params?.vehicle;
  const DepartureDay = route.params?.DepartureDay;
  const DepartureTime = route.params?.DepartureTime;
  const Days = route.params?.Days;
  const Tour_Name = route.params?.Tour_Name;
  const Nights = route.params?.Nights;
  const [qadult, setQAdult] = useState("");
  const [token, setToken] = useState("");
  const [qchildren, setQChildren] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const booktour = async () => {
    const bookingCode = generateRandomString();
    setCode(bookingCode);

    let formData = {
      id_booktour: bookingCode,
      Quantity_Adult: qadult,
      Quantity_Children: qchildren || 0,
      Price:
        parseInt(qadult || 0) * Adult_price +
        parseInt(qchildren || 0) * Children_price,
      id_customer_bt: user.id,
      id_tour_id: id_tour_id,
      email: user.email,
    };
    AsyncStorage.getItem("token").then((value) => setToken(value));
    console.warn(token);
    setLoading(true);
    try {
      const res = await axios.post(
        `https://thuylinh.pythonanywhere.com/BookTour/${id_tour_id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Đặt tour thành công:", res.data);

      const emailData = {
        id_booktour: bookingCode,
        id_tour_id: id_tour_id,
        email: user.email,
        tour_name: Tour_Name,
        adultCount: qadult,
        childrenCount: qchildren || "0",
        Price: formData.Price,
        name: `${user.first_name} ${user.last_name}`,
        departure_day: "2025-05-10",
        departure_time: DepartureTime,
        departure_place: DeparturePlace,
        destination: Destination,
        days: Days,
        nights: Nights,
        adult_price: Adult_price,
        children_price: Children_price,
        id_customer_bt: user.id,
      };
      sendBookingConfirmationEmail(emailData, navigation);
    } catch (ex) {
      console.log("Lỗi đặt tour:", ex);
      if (ex.response) {
        console.log("Lỗi response:", ex.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Card style={styles.card}>
            <Card.Title title="Thông tin chuyến đi" />
            <Card.Content>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Tên tour:</Text> {Tour_Name}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Nơi đi:</Text> {DeparturePlace}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Nơi đến:</Text> {Destination}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Ngày khởi hành:</Text>{" "}
                {DepartureDay}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Giờ khởi hành:</Text>{" "}
                {DepartureTime}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Thời gian:</Text> {Days} Ngày{" "}
                {Nights} Đêm
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Phương tiện:</Text> {vehicle}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Thông tin người đặt" />
            <Card.Content>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Họ tên:</Text> {user.first_name}{" "}
                {user.last_name}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Email:</Text> {user.email}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>SĐT:</Text> {user.sdt}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Số lượng hành khách" />
            <Card.Content>
              <TextInput
                label="Người lớn"
                style={styles.input}
                onChangeText={(value) => setQAdult(value)}
                keyboardType="numeric"
              />
              <TextInput
                label="Trẻ em"
                style={styles.input}
                onChangeText={(value) => setQChildren(value)}
                keyboardType="numeric"
              />
              <Text style={styles.priceText}>
                Tổng tiền vé người lớn:{" "}
                {(parseInt(qadult || 0) * Adult_price).toLocaleString()} VNĐ
              </Text>
              <Text style={styles.priceText}>
                Tổng tiền vé trẻ em:{" "}
                {(parseInt(qchildren || 0) * Children_price).toLocaleString()}{" "}
                VNĐ
              </Text>
              <Text style={styles.totalPrice}>
                Tổng tiền:{" "}
                {(
                  parseInt(qadult || 0) * Adult_price +
                  parseInt(qchildren || 0) * Children_price
                ).toLocaleString()}{" "}
                VNĐ
              </Text>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>

        <Button
          style={{margin:5, backgroundColor:'#385D8D'}}
          loading={loading}
          icon="bag-personal"
          mode="contained"
          onPress={booktour}
        >
          Đặt chuyến đi
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor:"#F0F8FF"
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  priceText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    color: "#385D8D",
  },
});

export default BookTour;