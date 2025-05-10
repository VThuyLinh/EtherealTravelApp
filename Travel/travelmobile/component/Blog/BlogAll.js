// import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native"
// import { ActivityIndicator, Avatar, Button, Card, Chip, DataTable, RadioButton, Searchbar, SegmentedButtons, Text, TextInput } from "react-native-paper"
// import React, { useState } from "react"
// import APIs, { endpoints } from "../../config/APIs"
// import moment from "moment"
// import Icon from "react-native-vector-icons/FontAwesome6"
// import { isCloseToBottom } from "../Utils/util"
// import StyleAll from "../../style/StyleAll"
// import { useNavigation } from "@react-navigation/native"



  
//   const styles1 = StyleSheet.create({
//     radioGroupContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       justifyContent: 'center', // Để các item nằm giữa màn hình theo chiều ngang
//       marginVertical: 10,
//       paddingHorizontal: 20, // Thêm padding để tránh quá sát lề màn hình
//     },
//     radioButtonItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginRight: 15,
//       marginBottom: 10,
//     },
//     radioLabel: {
//       fontSize: 16,
//       marginLeft: 8,
//     },
//   });


// const Blog =({navigation}) =>
//     {
//         const [blog,setBlog]=React.useState([]);
//         const [user,setUser]=React.useState([]);
//         const [page, setPage]= React.useState(1);
//         const [content, setContent]= React.useState('')
//         const [loading, setLoading] = React.useState(false);
//         const [tag, setTag] = React.useState('');
//         const [tagAll, setTagAll] = React.useState([]);
//         const [collapsed, setCollapsed] = React.useState(true);
//         const nav= useNavigation();
//         const [refreshing, setrefreshing]= React.useState(false);
//         const toggle = () => {setCollapsed(!collapsed);};
//         const [value1, setValue1]= React.useState('1');
//         const [hasNextPage, setHasNextPage] = useState(true); 
      

//         const loadBlog = async () => {


//                 try {
//                     setLoading(true);
//                     let res = await APIs.get(`${endpoints['blog']}?content=${content}&page=${page}&tag=${tag}`);
//                     if (res.data && Array.isArray(res.data.results)) {
//                       if (page === 1) {
//                         setBlog(res.data.results);
//                       } else if (page > 1) {
//                         setBlog(current => [...current, ...res.data.results]);
//                       }
//                       setHasNextPage(!!res.data.next); 
//                     } else {
//                       setHasNextPage(false);
//                     }
              
//                     let res1 = await APIs.get(endpoints['user']);
//                     setUser(res1.data)
//             } catch (ex) {
//                 console.log("Lỗi",ex.response);
//                 setHasNextPage(false)
//             } finally {
//                 setLoading(false);
//                 setHasNextPage(false)
//         }
//     }


//     const getAllTag= async()=>{
//         let res= await APIs.get(endpoints['tag'])
//         setTagAll(res.data)
//     }
//     React.useEffect(()=> {loadBlog(), getAllTag()  },[page,content,tag]);
//     React.useEffect(() => {
//         setPage(1); // Reset page về 1 khi content hoặc tag thay đổi
//         setBlog([]); // Reset blog khi content hoặc tag thay đổi
//         setHasNextPage(true); // Reset hasNextPage khi content hoặc tag thay đổi
//       }, [content, tag]);

//       const onRefresh = React.useCallback(() => {
//         setrefreshing(true);
//         setPage(1);
//         setHasNextPage(true);
//         loadBlog();
//       }, []);

        
//       const loadMore = ({ nativeEvent }) => {
//         if (!loading && hasNextPage && isCloseToBottom(nativeEvent)) {
//           console.log("Loading more - Current page:", page);
//           setPage(prevPage => prevPage + 1);
//         } else if (!hasNextPage && isCloseToBottom(nativeEvent)) {
//           console.log("Đã tải hết bài đăng.");
//         }
//       };
//     const search = (value, callback) => {
//         setPage(1);
//         callback(value);
//         setContent(value);}


        
//     return(
//         <View style={StyleAll.container}>
            
//             <ScrollView style={[StyleAll.container, StyleAll.margin]}  onScroll={loadMore} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={()=>loadBlog()}  />} >
//                         {refreshing && (
//                                         <View style={styles.loadingContainer}>
//                                             <ActivityIndicator size="large" color="#007bff" />
//                                             <Text style={styles.loadingText}>Đang làm mới...</Text>
//                                         </View>
//                                     )}
//             <TouchableOpacity style={styles.button} onPress={()=>nav.navigate("post")}>
//                 <Text style={styles.title}>+ Thêm bài đăng</Text>
//             </TouchableOpacity>
//             <View>
//                 <Searchbar style={StyleAll.sear} value={content} placeholder="Tìm bài đăng..." onChangeText={t => search(t, setContent)} />
//             </View>
 
//        <SegmentedButtons style={StyleAll.sty1}
//                           density="small"
//                           value={value1}
//                           onValueChange={t=> {setValue1(t),setTag(t)}}
//                           buttons={[
//                           {
//                               value:'1',
//                               label: 'Cẩm nang',
//                               icon:'bus-side'
                              
//                           },
//                           {
//                               value: '2',
//                               label: 'Chia sẻ',
//                               icon:'home-outline'
//                           },
//                           ]}
//                       />          

            
            
//             {loading ? <ActivityIndicator/>:<>
//                 {blog.map(b=> 
//                 <Card mode="elevated" style={[StyleAll.card1,{marginBottom:10, marginTop:25}]}  key={b.id} > 
//                     <Card.Content>
//                     {user.map(u=>{
//                         if(u.id==b.user_post)
//                         {
//                             return(
//                                 <View style={{ flexDirection: 'row' }} key={u.id}>
//                                     <Avatar.Image size={40} source={{uri: `https://res.cloudinary.com/dqcjhhtlm/${u.Avatar}`}}  />
//                                     <View style={{ flexDirection: 'col' }}>
//                                     <Text style={{marginLeft:20, fontSize:20}}>{u.username}</Text>
//                                     <Text style={StyleAll.text2}> {moment(b.DatePost).fromNow()}</Text>
//                                     </View>
//                                 </View>
//                             )
//                         }
//                     })}
                    
//                     <Text style={StyleAll.text}>{b.name}</Text>
//                     </Card.Content>
//                     {loading && <ActivityIndicator />}
//                     <Card.Cover style={StyleAll.imgincard} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${b.image}` }}/>  
                  
//                     <TouchableOpacity style={{marginLeft:240, marginTop:15}} onPress={()=>navigation.navigate("blogdetail",{'blog_id':b.id})} key={b.id}><Text style={styles.text3}><Icon color="#666" size={18} name="mountain-sun"></Icon>  Xem thêm</Text></TouchableOpacity>
                      
//                 </Card>)}

//             </>}   
           
//             </ScrollView>
//         </View>
        
//         );
//     }
//     const styles= StyleSheet.create({
//         container:{
//             flex:1,
//             backgroundColor:'#ffffff',
//             paddingHorizontal:30
//         },tinyLogo: {
//             marginTop:20,
//             marginLeft:5,
//             width: 400,
//             height: 200,
//           },tinyLogo1: {
//             marginTop:5,
//             marginLeft:5,
//             width: 400,
//             height: 200,
//           },
//         tieude:{
//             fontWeight:'bold',
//             fontSize:30, 
//             marginTop:10, 
//             color:'black',
//         },
//         button:{
//             backgroundColor:"#b2dbbf",
//             color:"white",
//             textAlign:"center",
//             marginTop:20,
//             height:45,
//             width:160,
//             marginLeft:230,
//             borderRadius:20,
//             marginBottom:10
//         },
//         center:{alignItems:'center'},
//         title:{
//             fontWeight:'bold',
//             fontSize:16, 
//             color:'black',
//             marginLeft:10,
//             marginTop:9
//         },form:{
//             marginTop:30
//         }, text3: {
//           fontSize: 15,
//           fontWeight: "bold",
//           color: '#666', 
//           fontStyle:"italic",
//           marginBottom:20
//       }
//         ,ip:{
//             borderBottomWidth:1,
//             backgroundColor:'#fff',
//             borderColor:'green',
//             paddingLeft:10
//         },alertTitle: {
//             color: 'red', // Change the title color
//           },
//           alertMessage: {
//             color: 'blue', // Change the message color
//           },
//           alertButton: {
//             color: 'green', // Change the button color
//           },radioGroupContainer: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             marginVertical: 10,
//           },
//           radioButtonItem: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginRight: 15,
//             marginBottom: 10,
//           },
//           radioLabel: {
//             fontSize: 16,
//             marginLeft: 8,
//           },});


// export default Blog;




import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Searchbar,
  Text,
  SegmentedButtons,
  useTheme,
} from "react-native-paper";
import APIs, { endpoints } from "../../config/APIs";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome6";
import { isCloseToBottom } from "../Utils/util";
import StyleAll from "../../style/StyleAll";
import { useNavigation } from "@react-navigation/native";

const Blog = ({ navigation }) => {
  const [blog, setBlog] = useState([]);
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("1"); // Mặc định tag là "1" (Cẩm nang)
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [value1, setValue1] = useState("1"); // Mặc định value là "1"
  const nav = useNavigation();
  const theme = useTheme();

  const loadBlog = async () => {
    try {
      setLoading(true);
      let res = await APIs.get(
        `${endpoints["blog"]}?content=${content}&page=${page}&tag=${tag}`
      );
      if (res.data && Array.isArray(res.data.results)) {
        if (page === 1) {
          setBlog(res.data.results);
        } else if (page > 1) {
          setBlog((current) => [...current, ...res.data.results]);
        }
        setHasNextPage(!!res.data.next);
      } else {
        setHasNextPage(false);
      }

      let res1 = await APIs.get(endpoints["user"]);
      setUser(res1.data);
    } catch (ex) {
      console.log("Lỗi load blog:", ex.response);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [page, content, tag]);

  useEffect(() => {
    setPage(1);
    setBlog([]);
    setHasNextPage(true);
  }, [content, tag]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasNextPage(true);
    loadBlog().finally(() => setRefreshing(false));
  }, []);

  const loadMore = ({ nativeEvent }) => {
    if (!loading && hasNextPage && isCloseToBottom(nativeEvent)) {
      console.log("Loading more - Current page:", page);
      setPage((prevPage) => prevPage + 1);
    } else if (!hasNextPage && isCloseToBottom(nativeEvent)) {
      console.log("Đã tải hết bài đăng.");
    }
  };

  const search = (value, callback) => {
    setPage(1);
    callback(value);
    setContent(value);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        onScroll={loadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={200}
      >
        {refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Đang làm mới...</Text>
          </View>
        )}

        <View style={styles.searchContainer}>
          <Searchbar
            style={styles.searchbar}
            value={content}
            placeholder="Tìm bài đăng..."
            onChangeText={(t) => search(t, setContent)}
          />
        </View>

        <SegmentedButtons
          style={styles.segmentedButtons}
          density="small"
          value={value1}
          onValueChange={(t) => {
            setValue1(t);
            // Cập nhật state tag dựa trên giá trị của nút được chọn
            if (t === "1") {
              setTag("1");
            } else if (t === "2") {
              setTag("2");
            }
          }}
          buttons={[
            { value: "1", label: "Cẩm nang", icon: "bus-side" },
            { value: "2", label: "Chia sẻ", icon: "home-outline" },
          ]}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => nav.navigate("post")}
        >
          <Text style={styles.addButtonText}>+ Thêm bài đăng</Text>
        </TouchableOpacity>

        {loading && page === 1 ? (
          <View style={styles.loadingInitial}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            {blog
              // Không cần lọc ở đây nữa vì API đã lọc dựa trên 'tag'
              .map((b) => (
                <Card
                  mode="elevated"
                  style={styles.card}
                  key={b.id}
                >
                  <Card.Content style={styles.cardContent}>
                    {user
                      .filter((u) => u.id === b.user_post)
                      .map((u) => (
                        <View style={styles.userInfo} key={u.id}>
                          <Avatar.Image
                            size={40}
                            source={{
                              uri: `https://res.cloudinary.com/dqcjhhtlm/${u.Avatar}`,
                            }}
                          />
                          <View style={styles.userDetails}>
                            <Text style={styles.username}>{u.username}</Text>
                            <Text style={styles.postDate}>
                              {moment(b.DatePost).fromNow()}
                            </Text>
                          </View>
                        </View>
                      ))}
                    <Text style={styles.blogTitle}>{b.name}</Text>
                  </Card.Content>
                  <Card.Cover
                    style={styles.cardCover}
                    source={{
                      uri: `https://res.cloudinary.com/dqcjhhtlm/${b.image}`,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() =>
                      navigation.navigate("blogdetail", { blog_id: b.id })
                    }
                    key={`readmore-${b.id}`}
                  >
                    <Text style={styles.readMoreText}>
                      <Icon color="#666" size={18} name="mountain-sun" /> Xem thêm
                    </Text>
                  </TouchableOpacity>
                </Card>
              ))}
            {loading && page > 1 && (
              <ActivityIndicator
                style={styles.loadMoreIndicator}
                color={theme.colors.primary}
              />
            )}
            {!hasNextPage && blog.length > 0 && (
              <Text style={styles.endOfListText}>Đã tải hết bài đăng.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  loadingInitial: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  addButton: {
    backgroundColor: "#006400",
    color: "white",
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    width: 180,
    marginLeft: 200,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchbar: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F8E0",
  },
  segmentedButtons: {
    marginBottom: 16,
    backgroundColor: "#F8FFF0",
    borderRadius: 25,
  },
  card: {
    marginBottom: 30,
    elevation: 3,
    borderRadius: 15,
    backgroundColor: "#F5FFFA",
  },
  cardContent: {
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userDetails: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postDate: {
    fontSize: 12,
    color: "#777",
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  cardCover: {
    height: 200,
    borderRadius: 25,
    width: 370,
    marginLeft: 4,
  },
  readMoreButton: {
    padding: 12,
    alignItems: "flex-end",
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#777",
    fontStyle: "italic",
  },
  loadMoreIndicator: {
    paddingVertical: 20,
  },
  endOfListText: {
    textAlign: "center",
    color: "#777",
    paddingVertical: 16,
    fontSize: 16,
  },
});

export default Blog;