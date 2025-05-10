import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import StyleAll from "../../style/StyleAll"
import { ActivityIndicator, Button, Card, Chip, Searchbar, Text } from "react-native-paper"
import React, { useContext } from "react"
import APIs, { endpoints } from "../../config/APIs"
import moment from "moment"

import Icon from "react-native-vector-icons/FontAwesome6"
import { MyUserContext } from "../../config/context"
import StyleTour from "../../style/StyleTour"
import { isCloseToBottom } from "../Utils/util"

const News =({navigation}) =>
    {
        const [news,setNews]=React.useState([]);
        const [page,setPage]=React.useState(1);
        const [content, setContent]= React.useState('');
        const [name, setName]= React.useState('');
        const [loading, setLoading]= React.useState(false);
        const user= useContext(MyUserContext);

        const loadNews = async () =>{
            try{
                let res= await APIs.get(`${endpoints['news']}?page=${page}&name=${content}`);
                setLoading(true);
                if (page === 1) 
                    {setNews(res.data.results) 
                    console.info(res.data.results)}
                else if (page > 1)
                    setNews(current => {
                        return [...current, ...res.data.results]
                    });
               
            }
            catch (ex){
                console.error(ex);
                
            }
        }
        const loadMore = ({nativeEvent}) => {
            if (loading===false && isCloseToBottom(nativeEvent)) {
                console.log(page);
                setPage(parseInt(page) + 1);
                
            }
        }
        const search = (value, callback) => {
            setPage(1);
            callback(value);
            setContent(value);
        }
        React.useEffect(()=>{
             loadNews();
            },[content,name]);

        return(
        <View style={StyleAll.container}>
             <View>
            <Searchbar style={StyleAll.sear} value={content} placeholder="Tìm bài báo..." onChangeText={t => search(t, setContent)} />
            </View>
            
            <ScrollView onScroll={loadMore}>
            {news === null ? <ActivityIndicator/>:<>
                {news.map(c=> 
                <Card mode="elevated" style={styles.car} key={c.id} >
                    <Card.Content>
                    <Text style={StyleAll.text1}>{c.Name_News}</Text>
                    </Card.Content>
                    <Card.Cover source={{ uri:`https://res.cloudinary.com/dqcjhhtlm/${c.image_thumbnail}` }} />
                    <Text style={StyleAll.text2}>  <Icon name="calendar" size={15}/> {moment(c.DatePost).fromNow()}</Text>
                   
                    <Card.Actions>
                    {user===null?<>
                        <Text style={StyleTour.text1}>Vui lòng <Text style={[StyleTour.loginn, StyleTour.text1]}onPress={()=> navigation.navigate("Login")}>đăng nhập</Text> để có những trải nghiệm tốt nhất cùng Ethereal_Travel</Text>
                    </>:<>
                    <TouchableOpacity onPress={()=>navigation.navigate("newsdetail",{'news_id':c.id})} key={c.id}><Text style={styles.text3}><Icon color="#666" size={20} name="book"></Icon>  Xem thêm</Text></TouchableOpacity>
                    </>}
                    </Card.Actions>
                </Card>)}
            </>}   
            </ScrollView>
        </View>
        
        );
    }
const styles= StyleSheet.create({
    text3: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#666', 
        fontStyle:"italic",
        marginBottom:10
    },
    car:{
        marginBottom:20,
        marginTop:10
    },
})
export default News;