import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Button, Card, Chip, DataTable, Icon, Searchbar, SegmentedButtons, Text } from "react-native-paper"
import React, { useContext, useState } from "react"
import APIs, { endpoints } from "../../config/APIs"
import moment from "moment"


import { isCloseToBottom } from "../Utils/util"

import { Image } from "react-native"
import StyleAll from "../../style/StyleAll"
import { MyUserContext } from "../../config/context"
import StyleTour from "../../style/StyleTour"










const Hotel =({navigation}) =>
    {
        const user= useContext(MyUserContext);  
        
        const [hotel,setHotel]=React.useState([]);
        const[address, setAddress]=React.useState('');
       
        const [page, setPage]= React.useState(1);
        const [loading, setLoading] = React.useState(false);
        

    const loadHotel = async () => {
        if (page > 0) {
            let url = `${endpoints['hotel']}?addess=${address}&page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if (page === 1) 
                    {setHotel(res.data.results) 
                    console.info(res.data.results)}
                else if (page > 1)
                    setHotel(current => {
                        return [...current, ...res.data.results]
                    });
                // if (res.data.count === null) 
                //     console.log("không tìm thấy") 
                //     setPage(0);
            } catch (ex) {
                console.error("Lỗi",ex);
            } finally {
                setLoading(false);
            }
        }
    }

   

        React.useEffect(()=>{
             loadHotel();
            },[page,address]);


        
        
            const loadMore = ({nativeEvent}) => {
                if (loading===false && isCloseToBottom(nativeEvent)) {
                    console.log(page);
                    setPage(parseInt(page) + 1);
                    
                }
            }
            


            const search = (value, callback) => {
                setPage(1);
                callback(value);
                setAddress(value);
            }


            const items = [1, 2, 3, 4, 5,6,7];
        return(
            
        <View style={StyleAll.container}>
        
            <RefreshControl onRefresh={() => loadTour()} />
            <ScrollView onScroll={loadMore}>
            
            <Text style={StyleAll.tourspage}> Where do you like to stay ? </Text>
            
            <View>
                
                <Searchbar style={StyleAll.sear} value={address} placeholder="Tìm địa chỉ..." onChangeText={t => search(t, setAddress)} />
                
                
            </View>
            
            
            
            {loading ? <ActivityIndicator/>:<>
                {hotel.map(c=> 
                <Card mode="elevated" style={styles.card} key={c.id}> 
                    <Card.Content>
                    <Text style={styles.tieude}>{c.nameofhotel}</Text>
                    </Card.Content>
                    {loading && <ActivityIndicator />}
                    <Card.Cover style={StyleAll.imgincard} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.image}` }}/>
                    
                    <Text style={styles.text4}><Icon size={20} source="home-city"/> {c.address}</Text>
                    <Card.Actions>
                    {user===null?<>
                        <Text style={styles.text2}>Vui lòng <Text style={[StyleTour.loginn, StyleTour.text1]} onPress={()=> navigation.navigate("login")}>đăng nhập</Text> để có những trải nghiệm tốt nhất cùng Ethereal_Travel</Text>
                    </>:<>
                    <TouchableOpacity onPress={()=>navigation.navigate("hoteldetail",{'hotel_id':c.id})} key={c.id}><Text style={styles.text3}><Icon color="#153050" size={15} name="mountain-sun"></Icon>Xem thêm</Text></TouchableOpacity>
                    </>}
                    </Card.Actions>
                </Card>)}
            </>}   
           <View style={{ flexDirection: 'row' }}>
               { items.map((item) => <Button title="a"></Button>)}
           </View>
            </ScrollView>
        </View>
        
        );
    }
    
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
    }
})
export default Hotel;