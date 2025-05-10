import { ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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
import { isCloseToBottom } from "../Utils/util";
import CommentInput from "./CMT";
import RatingComponent from "./rating";
const { width } = Dimensions.get('window');

// import { useCurrencyFormatter } from 'react-native-currency-formatter';

const TestTourDetail = ({ navigation,route }) => {
    const [tourdetail, setTourDetail] = React.useState([]);
    const [noidi, setNoidi]= React.useState([]);
    const [noiden, setNoiden]= React.useState([]);
    const [ptien, setPTien]= React.useState([]);
    const [lis, setLis]= React.useState([]);
    const [gkhanh, setGioKH]= React.useState([]);
    const [nkhanh, setNgayKH]= React.useState([]);
    const [anh, setAnh]= React.useState([]);
    const [cmt, setComment]= React.useState([]);
    const [rating, setRating]= React.useState([]);
    const [cmtTour, setCommentTour]= React.useState([]);
    const [like, setLike]= React.useState([]);
    const [token, setToken]= React.useState([]);
    const [image, setImage]= React.useState([]);
    
   
    const [active, setActive] = React.useState(false);
    const [active1, setActive1] = React.useState(false);
    const [active2, setActive2] = React.useState(false);
    const [active3, setActive3] = React.useState(false);
    const [active4, setActive4] = React.useState(false);
    const [active5, setActive5] = React.useState(false);
    const nav = useNavigation();
    const tour_id = route.params?.tour_id;
    
    const { width } = useWindowDimensions();


    const [refreshing, setRefreshing] = React.useState(false);


    const loadTourDetail = async () => {
        setRefreshing(true);
        try {
        let res = await APIs.get(endpoints["tourdetail"](tour_id));
        setTourDetail(res.data);
        setNoidi(res.data.DeparturePlace.Place_Name)
        setNoiden(res.data.Destination.Place_Name)
        setPTien(res.data.vehicle.Name)
        setGioKH(res.data.DepartureTime.DepartureTime)
        setAnh(res.data.album.id)
        setComment(res.data.cmt_tour)
        setRating(res.data.rating_tour)
        setLike(res.data.like_tour)
        setLis(res.data.vehicle.License)
        let res1= await APIs.get(endpoints["image"]);
        setImage(res1.data);
        
        
        AsyncStorage.getItem("token").then((value)=>{
            setToken(value)
        })
    }
    catch (ex) {
        console.error("Lỗi khi tải lại chi tiết tour:", ex);
    } finally {
        setRefreshing(false);
        console.log("Trang đã được tải lại");
    }
};
   
    
    const user= useContext(MyUserContext);  
    

    React.useEffect(() => {
        loadTourDetail()
    }, [tour_id]);

   
    const [loading, setLoading] = React.useState(false);
    const [hasViewedRating, setHasViewedRating] = React.useState(false);
    const [showCommentInput, setShowCommentInput] = React.useState(false);
    
    
    const create_cmt = async (content, image) => {
        try {
            const formData = {
              content: content,
              image: image,
            };
        let res = await APIs.post(
            `https://thuylinh.pythonanywhere.com/TourDetail/${tour_id}/add_comments/`,
            formData,
            {
              headers: { 'Authorization': `Bearer ${token}`,"Content-Type": "multipart/form-data" },
            }
          );
    
          if (res.status === 201) {
            Alert.alert("Thành công", "Đăng bài thành công!", [
              { text: "OK", onPress: () => nav.goBack() },
            ]);
          }
        } catch (ex) {
          console.error("Lỗi bình luận:", ex);
        }finally {
            setLoading(false);
        }
    };

    const handleCreateNewComment = (commentContent, image) => {
        console.log('Nội dung bình luận đã được kiểm tra:', commentContent);
        console.log('Đường dẫn ảnh từ CommentInput (Cloudinary):', image);
        create_cmt(commentContent, image); // Pass the Cloudinary URL to create_cmt
    };

    const updateState = (field, value) => {
        setCommentTour( t => {
            return { ...t, [field]: value }
        })
        console.log(cmtTour);
    }


    const ImageCarousel = ({ albumId, images }) => {
        // Lọc ảnh dựa trên albumId
        const filteredImages = images.filter(i => i.album_id === albumId);
    
        const renderItem = ({ item }) => (
            <Card style={styles.card}>
                <Card.Cover
                    source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.Path}` }}
                    style={styles.cover}
                    resizeMode="contain" // Để đảm bảo toàn bộ ảnh hiển thị vừa khung
                />
            </Card>
        );
    
        return (
            <View style={styles.container}>
                <FlatList
                    data={filteredImages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} // Sử dụng một thuộc tính duy nhất làm key
                    horizontal={true}
                    pagingEnabled={true} // Tạo hiệu ứng "snap" khi vuốt qua từng ảnh
                    showsHorizontalScrollIndicator={true} // Ẩn thanh cuộn ngang (tùy chọn)
                />
            </View>
        );
    };



    const RatingCommentTabs = ({ RatingCount, commentCount, renderRatings, renderComments }) => {
        const [activeTab, setActiveTab] = React.useState('cmt');
    
        const handleTabPress = (tabName) => {
            setActiveTab(tabName);
            if (tabName === 'rating') {
                setHasViewedRating(true);
            }
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
                    <TouchableOpacity style={[styles.tabItem, activeTab === 'rating' && styles.activeTab]} onPress={() => handleTabPress('rating')}>
                    <Text style={[styles.tabText, activeTab === 'cmt' && styles.activeTabText]}>
                            Đánh giá ({RatingCount})
                        </Text>
                    </TouchableOpacity>
                </View>
    
                {/* Nội dung tab */}
                <View style={styles.tabContent}>
                    
                    {activeTab === 'cmt' && renderComments()}
                    {activeTab === 'rating' && renderRatings()}
                </View>
            </View>
        );
    };


    const create_like = async () => {
        setLoading(true);
        try {
            setActive(true);
            const res = await axios.post(`https://thuylinh.pythonanywhere.com/TourDetail/${tour_id}/like_tour/`, { Active: true }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("clike", res);
    
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
            const res = await axios.post(`https://thuylinh.pythonanywhere.com/TourDetail/${tour_id}/like_tour/`, { Active: false }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("dlike", res.data);
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


    const loadMore = async ({ nativeEvent }) => {

    };

   

   


    const renderRatingsSection = () => (
        <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Đánh giá chuyến đi</Text>

            <View>
                <RatingComponent userRating={userRating} allRatings={rating} />
            </View>
       
           
            <View>
                {userRating ? (
                  <View style={{marginTop:10}}>
                      <View style={styles.horizontalLine}></View>
                      <Text>Bạn đã đánh giá: </Text>
                  <View key={userRating.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Avatar.Image size={40} style={{marginTop:30}} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${userRating.avatar}` }}/>
                  <Text style={styles.userName}>{userRating.user}:</Text>
                  {renderStars(userRating.NumberOfStar)}
                  </View>
                  <Text style={{fontStyle:'italic', fontSize:10, marginLeft:30, color:'grey'}}>Bạn có thể nhấp vào số sao để thay đổi đánh giá cho tour </Text>
                  </View>
              ) : (
                  <View>
                  <Text>Bạn chưa đánh giá hãy đánh giá nào.</Text>
                  <View>
                          {renderStars()}
                         
                      </View>
              </View>
              )}

                
                <View style={styles.horizontalLine}></View>
                <Text style={{ marginTop: 10, fontWeight: 'bold', marginBottom:30}}>Đánh giá của mọi người:</Text>
                {rating.map(r => (
                    <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Avatar.Image size={40} style={{marginBottom:15}} source={{uri: `https://res.cloudinary.com/dqcjhhtlm/${r.avatar}`}} />
                        <Text style={{ marginRight: 5 }}>{r.user}:</Text>
                        {renderStars(r.NumberOfStar)}
                    </View>
                ))}
            </View>
        
    </View>
    );

    

    
    const renderCommentsSection = () => (
                        <View>
                        {cmt.length > 0 ? (
                          <>
                              {cmt.map(c => (
                                <View style={styles.commentContainer} key={c.id}>
                                  <Avatar.Image size={40} style={styles.avatar1} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.avatar}` }} />
                                  <View style={styles.commentTextContainer}>
                                    <Text style={styles.userName1}>{c.user}</Text>
                                    <Text>{c.content}</Text>
                                  </View>
                                  {c.image ? <Image source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${c.image}` }} style={{ width: 80, height: 80 }} /> : null}
                                </View>
                              ))}
                            <CommentInput onCommentSubmit={handleCreateNewComment} />
                          </>
                        ) : (
                          <CommentInput onCommentSubmit={handleCreateNewComment} />
                        )}
                      </View>
                    );


    

    const create_rating = async (starCount) => {
        try {
            console.log(starCount,tour_id)
            const res = await axios.post(`https://thuylinh.pythonanywhere.com/TourDetail/${tour_id}/create_rating_tour/`, { NumberOfStar: parseInt(starCount) }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("rating", res);
            if (user?.id) {
                setRating(prevRating => [...prevRating, { id: user.id, NumberOfStar: starCount }]);
            }
        } catch (ex) {
            console.error(ex.request);
            // Xử lý lỗi
        } finally {
            setLoading(false);
        }
    };
   


   

    const userRating = rating.find(r => r.id_user === user.id);

    const renderStars = (currentRating) => {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(
                    <TouchableOpacity key={i} onPress={() => create_rating(i)}>
                        <Icon
                            source="star"
                            size={30}
                            color={i <= currentRating ? 'orange' : 'grey'}
                        />
                    </TouchableOpacity>
                );
            }
            return <View style={{ flexDirection: 'row' }}>{stars}</View>;
        };
    
    return (
        <View style={StyleAll.container}>
            
            <ScrollView
            style={[StyleAll.container, StyleAll.margin]}
            onScroll={loadMore}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={()=>loadTourDetail()} // Gọi trực tiếp loadTourDetail
                />
            }
        >
            {refreshing && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Đang làm mới...</Text>
                </View>
            )}
           
            {tourdetail===null?<ActivityIndicator animating={true} color={'blue'} />:
                <Card style={StyleAll.bgrcolor}>
                    <Card.Content>
                    {/* .slice(0,10) */}
                        <Text variant="titleLarge" style={StyleAll.text3}>{tourdetail.Tour_Name}</Text>
                        <Text style={StyleAll.text4}>{tourdetail.Days} ngày {tourdetail.Nights==0 ?'':`${tourdetail.Nights} đêm`} </Text>
                        <Text style={StyleTour.text1}>Nơi đi: {noidi}</Text>
                        <Text style={StyleTour.text1}>Nơi đến : {noiden}</Text>
                        <Text style={StyleTour.text1}>Phương tiện : {ptien}</Text>
                        <Text style={StyleTour.text1}>Ngày khởi hành :  {(new Date(tourdetail.DepartureDay)).toLocaleDateString()}</Text>
                        <Text style={StyleTour.text1}>Giờ khởi hành : {gkhanh}</Text>
                        <Text style={StyleTour.text1}>Giá vé người lớn : {tourdetail.Adult_price}  VNĐ</Text>
                        <Text style={StyleTour.text1}>Giá vé trẻ em : {tourdetail.Children_price} VNĐ</Text>
                        <RenderHTML contentWidth={width} source={{html: tourdetail.Description}} />
                    </Card.Content>



                {anh && image.length > 0 && (
                                <ImageCarousel albumId={anh} images={image} />
                            )}
                
               
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ marginRight: 8 }}>{like.filter(l => l.Active === true).length}</Text>
    <TouchableOpacity onPress={() => {
        if (user) {
            const hasLiked = like.some(l => l.id === user.id && l.Active);
            if (hasLiked) {
                dislike();
            } else {
                create_like();
            }
        } else {
            console.warn("User information is not available.");
        }
    }}>
        <Icon
            source="heart"
            color={like.some(l => l.id === user?.id && l.Active) ? MD3Colors.error50 : MD3Colors.secondary50}
            size={30}
        />
    </TouchableOpacity>
</View>


                <RatingCommentTabs RatingCount={rating ? rating.length : 0} commentCount={cmt ? cmt.length : 0}
                renderRatings={renderRatingsSection}
                renderComments={renderCommentsSection}
            />
                   
                   
                    <Button style={StyleAll.margin}  icon="bag-personal" mode="contained"  onPress={()=>navigation.navigate("booktour",{'id_tour_id':tour_id,'Adult_price':tourdetail.Adult_price,'Children_price':tourdetail.Children_price,'Tour_Name':tourdetail.Tour_Name,'lisence':lis,'DeparturePlace':noidi,'Destination':noiden,'vehicle':ptien,'DepartureDay':nkhanh,'DepartureTime':gkhanh,'Days':tourdetail.Days,'Nights':tourdetail.Nights})} key={tour_id} >
                    Đặt chuyến đi</Button>
                </Card>
            }

           </ScrollView>
           </View>
         
    );
};

export default TestTourDetail;

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
    firstCommentButton: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: '#fff',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                marginVertical: 10,
            },
            firstCommentText: {
                color: '#777',
                marginRight: 10,
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
})



