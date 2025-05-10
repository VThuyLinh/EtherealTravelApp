import { ActivityIndicator, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import React, { useContext } from "react";
import APIs, { authApi, endpoints } from "../../config/APIs";
import { Avatar, Button, Card, Dialog, Icon, List, MD3Colors, Portal, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { Intl } from 'react-native';
import moment from "moment";
import StyleAll from "../../style/StyleAll";
import { MyUserContext } from "../../config/context";
import StyleTour from "../../style/StyleTour";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import CommentInput from "../Tour/CMT";

const { width } = Dimensions.get('window');
// import { useCurrencyFormatter } from 'react-native-currency-formatter';

const BlogDetail = ({ navigation,route }) => {
    const [blogdetail, setBlogDetail] = React.useState([]);
    const [cmt, setComment]= React.useState([]);
    const [like, setLike]= React.useState([]);
    const [token, setToken]= React.useState([]);
    const [active, setActive] = React.useState(false);
    const [userall,setuserAll]= React.useState([]);
    const blog_id = route.params?.blog_id;
    const [refreshing, setrefreshing]= React.useState(false);
    
    const { width } = useWindowDimensions();
    const loadBlogDetail = async() => {
        setLoading(true);
        try {
            let res = await APIs.get(endpoints["blogdetail"](blog_id));
            let res1 = await APIs.get(endpoints['user']);
            setBlogDetail(res.data);
            setComment(res.data.cmt_blog)
            setuserAll(res1.data)
            setLike(res.data.like_blog)
            AsyncStorage.getItem("token").then((value)=>{
                setToken(value)
           
            })
           
        } catch (ex) {
            console.error("Lỗi khi tải lại chi tiết tour:", ex);
        } finally {
            setrefreshing(false);
            console.log("Trang đã được tải lại.");
        }
    }

    const user= useContext(MyUserContext);  

    React.useEffect(() => {
        loadBlogDetail();
    }, [blog_id]);
  
    
    const [loading, setLoading] = React.useState(false);

    const updateState = (field, value) => {
        setComment( t => {
            return { ...t, [field]: value }
        })
        console.log(cmt);
    }
    

    
    const create_cmt = async (content) => {
        let formData={
            content:content,
        }
        
        setLoading(true)
        try {
            axios.post(`https://thuylinh.pythonanywhere.com/Blog/${blog_id}/add_comments_blog/`,formData,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            .then((respone)=>console.log(respone))
            .catch((err)=>console.error(err.request))
               
            
        } catch (ex) {
            console.log(cmt);
            if (res.status === 201)
                nav.navigate("blog");
            
           
        } finally {
            setLoading(false);
        }
    }



           

    // const updateState = (field, value) => {
    //     setCommentBlog( t => {
    //         return { ...t, [field]: value }
    //     })
    //     console.log(cmtTour);
    // }


   
    const create_like = async () => {
        setLoading(true);
        try {
            setActive(true);
            const res = await axios.post(`https://thuylinh.pythonanywhere.com/Blog/${blog_id}/like_blog/`, { Active: true }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("blike", "thành công");
    
            // Cập nhật state like trực tiếp
            if (user?.id) {
                setLike(prevLike => [...prevLike, { id: user.id, Active: true }]);
            }
        } catch (ex) {
            console.error(ex.request);
            // Xử lý lỗi
        } finally {
            setLoading(false);
        }
    };
    

    const dislike = async () => {
        setLoading(true);
        try {
            setActive(false);
            const res = await axios.post(`https://thuylinh.pythonanywhere.com/Blog/${blog_id}/like_blog/`, { Active: false }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("dblike", "thành công");
            // Cập nhật state like trực tiếp
            if (user?.id) {
                setLike(prevLike => prevLike.filter(l => l.id !== user.id));
            }
        } catch (ex) {
            console.error(ex.request);
            // Xử lý lỗi nếu cần (ví dụ: hiển thị thông báo cho người dùng)
        } finally {
            setLoading(false);
        }
    };





  



    const CommentTabs = ({ commentCount, renderComments }) => {
            const [activeTab, setActiveTab] = React.useState('cmt');
        
            const handleTabPress = (tabName) => {
                setActiveTab(tabName);
            };
        
            return (
                <View style={styles.container1}>
                    {/* Thanh tab */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity style={[styles.tabItem, activeTab === 'cmt' && styles.activeTab]} onPress={() => handleTabPress('cmt')}>
                            <Text style={[styles.tabText, activeTab === 'cmt' && styles.activeTabText]}>
                                Bình luận ({commentCount})
                            </Text>
                        </TouchableOpacity>
                    </View>
        
                    {/* Nội dung tab */}
                    <View style={styles.tabContent}>
                        
                        {activeTab === 'cmt' && renderComments()}
                    </View>
                </View>
            );
        };

    const handleCreateNewComment = (commentContent) => {
            console.log('Nội dung bình luận đã được kiểm tra:', commentContent);
            // Gọi hàm create_cmt của bạn ở đây để gửi bình luận lên server
            create_cmt(commentContent);
          };


        const renderCommentsSection = () => (
            <View>
            {cmt.length > 0 ? (
              <>
                  {cmt.map(c => (
                    <View style={styles.commentContainer} key={c.id_blog}>
                      <Avatar.Image size={40} style={styles.avatar1} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.avatar}` }} />
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.userName1}>{c.user}</Text>
                        <Text>{c.content}</Text>
                      </View>
                    </View>
                  ))}
                {/* <Button style={{backgroundColor:'white', width:220, marginLeft:150, height:40, alignContent:'center'}}  icon="bag-personal" mode="contained"  onPress={()=>showCMT()} > */}
                <CommentInput onCommentSubmit={handleCreateNewComment} />
              </>
            ) : (
            
                <CommentInput onCommentSubmit={handleCreateNewComment} />
            )}
          </View>
        );
   
        const loadMore = async ({ nativeEvent }) => {
        };

    
   
    
    return (
       
           <View style={StyleAll.container}>
            <ScrollView
                        style={[StyleAll.container, StyleAll.margin]}
                        onScroll={loadMore}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={()=>loadBlogDetail()} // Gọi trực tiếp loadTourDetail
                            />
                        }
                    >
            {refreshing && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007bff" />
                                <Text style={styles.loadingText}>Đang làm mới...</Text>
                            </View>
                        )}
            
            {blogdetail===null?<ActivityIndicator animating={true} color={'blue'} />:
                <Card  style={styles.card} key={blogdetail.id}>
                    <Card.Content style={styles.content}>
                    <Text variant="titleLarge" style={styles.title}>{blogdetail.name}</Text>
                        {userall.map(u=>{
                        if(u.id==blogdetail.user_post)
                        {
                            return(
                                <View>
                                <View style={styles.authorContainer}>
                                <Avatar.Image size={40} source={{uri: `https://res.cloudinary.com/dqcjhhtlm/${u.Avatar}`}}  />
                                <Text style={{marginLeft:10}}>{u.username}</Text>
                                </View>

                                <View style={styles.blogContent}>
                                    <RenderHTML contentWidth={width} source={{ html: blogdetail.content }} />
                                 </View>
                                 </View>
                                 )
                                }
                            })}
                            </Card.Content>
                            </Card>}
                               

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 10, fontSize:15 }}>{like.length}</Text>
                    <TouchableOpacity onPress={() => {
                        if (user) {
                           const hasLiked = like.some(l => l.id === user.id && l.Active);
                            if (hasLiked) {
                                dislike();} 
                            else {
                                create_like();}
                            } 
                        else { console.warn("Thông tin người dùng không khả dụng.");}}}>                             
                            <Icon source="heart" color={like.some(l => l.id === user?.id && l.Active) ? MD3Colors.error50 : MD3Colors.secondary50} size={25}/>
                    </TouchableOpacity>
                </View>
                   
                
                    

                   
                    
                        

                    <CommentTabs commentCount={cmt ? cmt.length : 0} renderComments={renderCommentsSection}/>
                    

           </ScrollView>
           </View>
         
    );
};

export default BlogDetail;


const styles = StyleSheet.create({
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    container: {
        marginTop: 15,
        width: width, // Đảm bảo FlatList có chiều rộng bằng màn hình
        height: 300, // Điều chỉnh chiều cao khung ảnh theo ý muốn
    },
    card: {
        width: width, // Mỗi Card chiếm toàn bộ chiều rộng
        margin: 0,
    },
    cover: {
        width: width,
        height: 300, // Chiều cao ảnh bằng chiều cao khung
    },
    container1: {
        width: '100%',
        backgroundColor: '#f0f2f5', // Màu nền tương tự Facebook
        borderRadius: 5,
        overflow: 'hidden', // Để bo tròn góc không bị tràn
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1877f2', // Màu xanh Facebook
    },
    tabText: {
        fontSize: 14,
        color: '#65676b', // Màu chữ xám Facebook
    },
    activeTabText: {
        color: '#1877f2',
        fontWeight: 'bold',
    },
    tabContent: {
        padding: 10,
    },
    ratingContainer: {
        marginVertical: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    starContainer: {
        flexDirection: 'row',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    thankYouText: {
        marginTop: 10,
        color: 'green',
    },
    otherRatingsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    otherRatingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        marginLeft: 15,
        marginRight: 15,
        fontWeight: 'bold',
    },
    yourRatingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addRatingContainer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addRatingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loginToRateText: {
        marginTop: 20,
        fontStyle: 'italic',
        color: 'grey',
    },
    commentContainer: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'flex-start',
      },
      avatar1: {
        marginBottom: 0,
        marginRight: 10,
      },
      commentTextContainer: {
        flex: 1,
      },
      userName1: {
        fontWeight: 'bold',
        marginBottom: 2,
      },
      horizontalLine: {
        borderBottomWidth: 1, // Độ dày của đường kẻ
        borderBottomColor: 'gray', // Màu của đường kẻ
        marginVertical: 10, // Khoảng cách trên và dưới đường kẻ (tùy chọn)
      },

      card: {
        backgroundColor: '#fff', // Hoặc StyleAll.bgrcolor nếu bạn muốn giữ lại
        margin: 10,
        borderRadius: 8,
        elevation: 2, // Tạo hiệu ứng đổ bóng nhẹ
      },
      content: {
        padding: 16,
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333', // Màu chữ tiêu đề
      },
      authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      avatar: {
        marginRight: 10,
      },
      authorInfo: {
        flexDirection: 'column',
      },
      username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
      },
      date: {
        fontSize: 12,
        color: '#777',
      },
      blogContent: {
        marginTop: 15,
        paddingHorizontal: 5, // Thêm một chút padding cho nội dung
      },
})