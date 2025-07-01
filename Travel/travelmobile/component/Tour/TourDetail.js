import { ActivityIndicator, Alert, Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
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
import CreateRating from "./CreateRating";
import BackButton from "../Back/ButtonBack";
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
    const [hasRated, setHasRated] = React.useState(false);
    const [note, setNote]=React.useState("")
   
    const [active, setActive] = React.useState(false);
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
        if (res.data && res.data.transport_segments && res.data.transport_segments.length > 0) {
    // Lấy đối tượng transport từ phần tử đầu tiên của mảng transport_segments
    const firstTransportSegment = res.data.transport_segments[0];
            if (firstTransportSegment.transport && firstTransportSegment.transport.Name) {
                setPTien(firstTransportSegment.transport.Name);
                setLis(firstTransportSegment.transport.License)
            } else {
                console.warn("Không tìm thấy thuộc tính 'transport' hoặc 'Name' trong phân đoạn vận chuyển đầu tiên.");
                setPTien(null); // Hoặc giá trị mặc định khác
            }
        } else {
            console.warn("Không có dữ liệu 'transport_segments' hoặc mảng rỗng.");
            setPTien(null); // Hoặc giá trị mặc định khác
        }
        setGioKH(res.data.DepartureTime.DepartureTime)
        setAnh(res.data.album.id)
        setImage(res.data.album.images)

        setComment(res.data.cmt_tour)
        setRating(res.data.rating_tour)
        setLike(res.data.like_tour)
        const userRating = res.data.rating_tour.find(r => r.id_user === user?.id);
        setHasRated(!!userRating);
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
        loadTourDetail();
      }, [tour_id, user?.id]);

   
    const [loading, setLoading] = React.useState(false);
    const [hasViewedRating, setHasViewedRating] = React.useState(false);
    
    
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
            // Gọi hàm loadTourDetail() trực tiếp khi điều kiện được đáp ứng
            loadTourDetail(); 
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
        create_cmt(commentContent, image); 
    };

    const updateState = (field, value) => {
        setCommentTour( t => {
            return { ...t, [field]: value }
        })
        console.log(cmtTour);
    }


    // const ImageCarousel = ({ image }) => {
    //     console.log(image)
    //     const data= axios.get(`https://thuylinh.pythonanywhere.com/Image/${image}/`)
    //     console.log(data);
    
    //     const renderItem = ({}) => (
    //         <Card style={styles.card}>
    //             <Card.Cover
    //                 source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.Path}` }}
    //                 style={styles.cover}
    //                 resizeMode="contain" 
    //             />
    //         </Card>
    //     );
    
    //     return (
    //         <View style={styles.container}>
    //             <FlatList
    //                 data={data}
    //                 renderItem={renderItem}
    //                 keyExtractor={(item) => item.id.toString()} 
    //                 horizontal={true}
    //                 pagingEnabled={true} 
    //                 showsHorizontalScrollIndicator={true} 
    //             />
    //         </View>
    //     );
    // };


    const ImageCarousel = ({ images }) => {
const [imagePaths, setImagePaths] = React.useState([]);

React.useEffect(() => {
    const fetchImages = async () => {
        if (!images || images.length === 0) {
            setImagePaths([]);
            return;
        }
        try {
            const fetchedPaths = await Promise.all(
                images.map(async (imageId) => {
                    const response = await axios.get(`https://thuylinh.pythonanywhere.com/Image/${imageId}/`);
                    return response.data.Path;
                })
            );
            setImagePaths(fetchedPaths);
        } catch (error) {
            console.error("Lỗi khi fetch ảnh:", error);
            setImagePaths([]);
        }
    };

    fetchImages();
}, [images]);

const renderItem = ({ item }) => (
    <Card style={styles.card}>
        <Card.Cover
            source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item}` }}
            style={styles.cover}
            resizeMode="contain"
        />
    </Card>
);

return (
    <View style={styles.container}>
        <FlatList
            data={imagePaths}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={true}
        />
    </View>
);
    };


     const RatingCommentTabs = ({ RatingCount, commentCount, renderRatings, renderComments }) => {

            const [activeTab, setActiveTab] = React.useState('cmt');
            const handleTabPress = (tabName) => {
            setActiveTab(tabName);
            if (tabName === 'rating') { setHasViewedRating(true); }};
            return (
                <View style={styles.container1}>
                    <View style={styles.tabBar}>
                        <TouchableOpacity key="cmt" style={[styles.tabItem, activeTab === 'cmt' && styles.activeTab]} onPress={() => handleTabPress('cmt')}>
                            <Text style={[styles.tabText, activeTab === 'cmt' && styles.activeTabText]}>
                                Bình luận ({commentCount})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity key="rating" style={[styles.tabItem, activeTab === 'rating' && styles.activeTab]} onPress={() => handleTabPress('rating')}>
                        <Text style={[styles.tabText, activeTab === 'cmt' && styles.activeTabText]}> Đánh giá ({RatingCount})</Text>
                        </TouchableOpacity>
                        </View>
            
                
        
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center", marginBottom: 10 }}>Đánh giá chất lượng chuyến đi</Text>
      
          <View>
            <RatingComponent userRating={userRating} allRatings={rating} />
          </View>
      
          <View>
            {hasRated ? (
              <View style={styles.myRatingContainer}>
                <Avatar.Image size={40} style={styles.myAvatar} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${userRating?.avatar}` }} />
                <View style={styles.myRatingMiddle}>
                  <Text style={styles.myUserName}>{userRating?.user}</Text>
                  <View style={styles.starRow}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Icon
                        key={i}
                        source="star"
                        size={20}
                        color={i < userRating?.NumberOfStar ? 'orange' : 'grey'}
                      />
                    ))}
                  </View>
                </View>
                {userRating?.note ? <Text style={styles.myNote}>{userRating.note}</Text> : null}
              </View>
            ) : (
              <View>
                <Text style={{ fontSize: 11, fontStyle: 'italic', color: '#777', marginTop: 10 }}>Bạn chưa đánh giá hãy đánh giá nào.</Text>
                <CreateRating onSubmitRating={create_rating} />
              </View>
            )}
      
            <View style={styles.horizontalLine}></View>
            <Text style={{ marginTop: 10, fontWeight: 'bold', marginBottom: 10 }}>Đánh giá khác:</Text>
            {rating
              .map(r => (
                <View key={r.id} style={styles.otherRatingItem}>
                  <Avatar.Image size={40} style={styles.otherAvatar} source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${r.avatar}` }} />
                  <View style={styles.otherRatingMiddle}>
                    <Text style={styles.otherUserName}>{r.user}</Text>
                    <View style={styles.starRow}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Icon
                          key={i}
                          source="star"
                          size={15}
                          color={i < r.NumberOfStar ? 'orange' : 'grey'}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.otherNote}>{r.note}</Text>
                </View>
              ))}
          </View>
        </View>
      );
    const renderCommentsSection = () => (
                        <View>
                        {cmt.length > 0 ? (
                          <>
                           <CommentInput onCommentSubmit={handleCreateNewComment} />
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
                           
                          </>
                        ) : (
                          <CommentInput onCommentSubmit={handleCreateNewComment} />
                        )}
                      </View>
                    );


    

                    const create_rating = async (starCount, note) => { // Nhận thêm tham số note
                        if (hasRated) {
                            Alert.alert("Thông báo", "Bạn đã đánh giá tour này rồi.");
                            return;
                        }
                        setLoading(true);
                        try {
                            console.log(starCount, note, tour_id); // Log để kiểm tra giá trị
                            const res = await axios.post(
                                `https://thuylinh.pythonanywhere.com/TourDetail/${tour_id}/create_rating_tour/`,
                                { NumberOfStar: parseInt(starCount), note: note }, // Gửi cả note
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
                
                            console.log("rating", res);
                            if (user?.id) {
                                setRating(prevRating => [...prevRating, { id: user.id, NumberOfStar: starCount, note: note }]);
                            }
                            if (res.status === 201) {
                                setHasRated(true); // Cập nhật trạng thái sau khi đánh giá thành công
                                loadTourDetail(); // Tải lại dữ liệu để cập nhật giao diện
                            }
                        } catch (ex) {
                            console.error(ex.request);
                            if (ex.response?.status === 400 && ex.response?.data?.detail) {
                                Alert.alert("Lỗi", ex.response.data.detail);
                            } else {
                                Alert.alert("Lỗi", "Đã có lỗi khi đánh giá. Vui lòng thử lại.");
                            }
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
              <View >
            <BackButton />
        </View>
            <ScrollView
            style={[StyleAll.container, StyleAll.margin]}
            onScroll={loadMore}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={()=>loadTourDetail()} 
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
                <Card style={StyleAll.bgrcolor} key={tourdetail.id}>
                    <Card.Content>
                    {/* .slice(0,10) */}
                        <Text variant="titleLarge" style={StyleAll.text3}>{tourdetail.Tour_Name}</Text>
                        <Text style={StyleAll.text4}>{tourdetail.Days} ngày {tourdetail.Nights==0 ?'':`${tourdetail.Nights} đêm`} </Text>
                        <Text style={StyleTour.text1}>Nơi đi: {noidi}</Text>
                        <Text style={StyleTour.text1}>Nơi đến : {noiden}</Text>
                        <Text style={StyleTour.text1}>Phương tiện : {ptien}</Text>
                        <Text style={StyleTour.text1}>Số hiệu : {lis}</Text>
                        <Text style={StyleTour.text1}>Ngày khởi hành :  {(new Date(tourdetail.DepartureDay)).toLocaleDateString()}</Text>
                        <Text style={StyleTour.text1}>Giờ khởi hành : {gkhanh}</Text>
                        <Text style={StyleTour.text1}>Giá vé người lớn : {tourdetail.Adult_price}  VNĐ</Text>
                        <Text style={StyleTour.text1}>Giá vé trẻ em : {tourdetail.Children_price} VNĐ</Text>
                        <RenderHTML contentWidth={width} source={{html: tourdetail.Description}} />
                    </Card.Content>



                {anh && image.length > 0 && (
                            <ImageCarousel key={anh} albumId={anh} images={image} />
                        )}

                        
                
               
                <View style={{ flexDirection: 'row', alignItems: 'center' , backgroundColor:"#f6EEE8"}}>
    <Text style={{ marginRight: 8 }}>  {like.filter(l => l.Active === true).length}</Text>
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
        <Icon source="heart" color={like.some(l => l.id === user?.id && l.Active) ? MD3Colors.error50 : MD3Colors.secondary50}  size={30}/>
    </TouchableOpacity>
</View>


                <RatingCommentTabs RatingCount={rating ? rating.length : 0} commentCount={cmt ? cmt.length : 0}
                renderRatings={renderRatingsSection}
                renderComments={renderCommentsSection}
            />   


           
                </Card>
            }


            
<View style={{marginTop:20, marginBottom:10}}>
            <Button style={{width:300, marginLeft:50, backgroundColor:"#CC5500",marginBottom: 80}}  icon="bag-personal" mode="contained"  onPress={()=>navigation.navigate("booktour",{'id_tour_id':tour_id,'Adult_price':tourdetail.Adult_price,'Children_price':tourdetail.Children_price,'Tour_Name':tourdetail.Tour_Name,'lisence':lis,'DeparturePlace':noidi,'Destination':noiden,'vehicle':ptien,'DepartureDay':`${(new Date(tourdetail.DepartureDay)).toLocaleDateString()}`,'DepartureTime':gkhanh,'Days':tourdetail.Days,'Nights':tourdetail.Nights})} key={tour_id} >
            <Text style={{fontSize: 18}}>Đặt chuyến đi</Text></Button>
            </View>
            
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
    container2: {
        flex: 1,
        backgroundColor: '#FFFAF0', 
    },
    container: {
        marginTop: 15,
        width: width, // Đảm bảo FlatList có chiều rộng bằng màn hình
        height: 300, 
        backgroundColor:"#FFFAF0",
       
    },
    card: {
        width: 400, // Mỗi Card chiếm toàn bộ chiều rộng
        margin: 0,
        backgroundColor:"#f6EEE8",
        borderRadius:0
    },
    cover: {
        backgroundColor:"#f6EEE8",
        marginLeft:5,
        marginRight:30,
        width: width,
        height: 300, // Chiều cao ảnh bằng chiều cao khung
    },
    container1: {
        width: '100%',
        backgroundColor: '#FFFAF0', // Màu nền tương tự Facebook
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
        color: '#1877f2',
        fontWeight: 'bold', // Màu chữ xám Facebook
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
        borderBottomColor: '#D3D3D3',
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
      myRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
      },
      myAvatar: {
        marginTop: 0,
        marginRight: 10,
      },
      myRatingRight: {
        flex: 1,
        justifyContent: 'space-between',
      },
      starRow: {
        flexDirection: 'row',
        marginBottom: 5,
      },
      myNote: {
        fontSize: 14,
        color: 'grey',
        fontStyle: 'italic',
        marginLeft:10
      },
      otherRatingItem: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Để avatar và phần bên phải căn chỉnh top
        marginBottom: 10,
      },
      otherAvatar: {
        marginRight: 10,
        marginTop: 2, // Điều chỉnh nếu cần để căn chỉnh với dòng đầu tiên của note
      },
      otherRatingRight: {
        flex: 1,
      },
      otherNote: {
        fontSize: 14,
        color: 'grey',
        marginLeft:30
      },
      horizontalLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginVertical: 10,
      },
})



