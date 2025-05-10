

import React, { useContext, useReducer } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TourDetail from './component/Tour/TourDetail';
import { NavigationContainer } from '@react-navigation/native';
import { MyReducer } from './config/reducer';
import { MyDispatchContext, MyUserContext } from './config/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Drawer, Icon, PaperProvider } from 'react-native-paper';
import Signup from './component/User/Signup.js';
import Account from './component/User/account';
import BookTour from './component/Tour/BookTour.js';
import News from './component/News/News.js';
import NewsDetail from './component/News/NewDetail.js';
import Tour from './component/Tour/AllTour.js';
import BookTourDetail from './component/Tour/BookTourDetail.js';
import Blog from './component/Blog/BlogAll.js';
import PostBlog from './component/Blog/PostBlog.js';
import BlogDetail from './component/Blog/BlogDetail.js';
import Login from './component/User/Login.js';
import Location from './component/Location/Location.js';
import EmailTest from './component/Email/EmailTest.js';
import GeminiChat from './component/ChatBot/GeminiChat.js';
import Maps from './component/Maps/Maps.js';
import Hotel from './component/Hotel/AllHotel.js';
import HotelDetail from './component/Hotel/HotelDetail.js';
import BookHotel from './component/Hotel/BookHotel.js';
import Payment from './component/Pay/Payment.js';
import Reject from './component/Tour/RejectTour.js';
import BookHotelDetail from './component/Hotel/BookHotelDetail.js';
import Test from './component/Test.js';
import NearBy from './component/Maps/Nearby.js';
import View360 from './component/View360/ViewTinhThanh.js';
import Video360 from './component/View360/iFrameVideo360.js';

import MenuScreen from './component/Menu/MenuScreen.js';
import Forgot from './component/User/ForgotPassword.js';
import Reset from './component/User/ResetPassword.js';
import { Text, View } from 'react-native';
import test from './component/QA/testfirebase.js';
import Answer from './component/QA/PredictScreen.js';
import TestData from './component/QA/readdateffirease.js';
import ChatScreen from './component/ChatRoom/ChatScreen.js';
import CreateChatRoomScreen from './component/ChatRoom/CreateChatRoom.js';
import ChatListScreen from './component/ChatRoom/ChatListScreen.js';
import Memory from './component/Location/Memory.js';









const Stack = createNativeStackNavigator();
const ViewStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="View" component={View360} options={{ title: "View" }} />
      <Stack.Screen name="video" component={Video360} options={{ title: "video" }} />
    </Stack.Navigator>
  );
};



const BlogStack = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen name="Blog" component={Blog} options={{ title: "Blog", tabBarIcon: () => <Icon size={30} color="black" source="post" />}} />
      <Stack.Screen name='blogdetail' component={BlogDetail} options={{title: 'Chi tiết bài đăng'}} />
    </Stack.Navigator>
  );
};


const NewsStack = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen name="News" component={News} options={{title: "Tin tức", tabBarIcon: () => <Icon size={30} color="black" source="newspaper-variant-multiple-outline" />}} />
       <Stack.Screen name='newsdetail' component={NewsDetail} options={{title: 'Chi tiết tin tức'}} />
    </Stack.Navigator>
  );
};

const AnswerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Test1" component={test} options={{title: "QAQ", tabBarIcon: () => <Icon size={30} color="black" source="circle" />}}/>
      <Stack.Screen name="Answer" component={Answer} options ={{title:"Answer"}}/>
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="ChatRoom" component={ChatScreen} options={{title:'Phòng Chat'}} />
      <Stack.Screen name="CreateChatRoom" component={CreateChatRoomScreen} options={{ title: 'Tạo Phòng Chat' }} />
    </Stack.Navigator>
  );
};






const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='tour' component={Tour} options={{ headerShown: false }} />
      <Stack.Screen name='tourdetail' component={TourDetail} options={{ headerShown: false }} />
      <Stack.Screen name='booktour' component={BookTour} options={{ headerShown: false }} />
      <Stack.Screen name='hoteldetail' component={HotelDetail} options={{ headerShown: false }}/>
      <Stack.Screen name='bookhotel' component={BookHotel} options={{ headerShown: false }} />
    
      <Stack.Screen name='reject' component={Reject} options={{ headerShown: false }} />
      <Stack.Screen name="Reset" component={Reset} options={{ title: "ResetPassword" }} />
     
      
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();


const MyTab = () => {
  const user = useContext(MyUserContext); 

  return (
    <Tab.Navigator screenOptions={{tabBarHideOnKeyboard:true}}>
       
      
     
     
      {user === null?<>
        <Tab.Screen name="Home" component={MyStack} options={{title: "Home", tabBarLabelStyle:{width:240, marginLeft:10}, tabBarItemStyle:{marginLeft:10}, tabBarIcon: () =><Icon size={30} color="black" source="airballoon" />}} />
        <Tab.Screen name="Singup" component={Signup} options={{tabBarLabelStyle:{width:100, marginLeft:5},tabBarItemStyle:{marginLeft:150}, title: "Đăng ký", tabBarIcon: () => <Icon size={30} color="black" source="account-plus" />}} />
        <Tab.Screen name="login" component={Login} options={{ tabBarLabelStyle:{width:200},tabBarItemStyle:{marginLeft:150},title: "Đăng nhập", tabBarIcon: () => <Icon size={30} color="black" source="account-check" />}}/>
        <Tab.Screen name="Reset" component={Reset} options={{tabBarIcon: ()=>null,tabBarButton: () => null}}/>
        <Tab.Screen name="Forgot" component={Forgot} options={{tabBarIcon: ()=>null,tabBarButton: () => null}}/>
        
      </>:<>
      <Tab.Screen name="Home1" component={MyStack} options={{title: "Home", tabBarLabelStyle:{width:200, marginLeft:10}, tabBarItemStyle:{marginLeft:50}, tabBarIcon: () =><Icon size={30} color="black" source="airballoon" />}} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{tabBarLabelStyle:{width:100, marginLeft:5},tabBarItemStyle:{marginLeft:150}, title: "Menu", tabBarIcon: ({ color }) => <Icon size={30} color={color} source="menu" /> }} />
      <Tab.Screen name="Account" component={Account} options={{tabBarLabelStyle:{width:200},tabBarItemStyle:{marginLeft:150},title: "Account", tabBarIcon: () => <Icon size={30} color="black" source="account" />}} />
      <Tab.Screen name="MyTour" component={BookTourDetail} options={{ tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="ChatTab" component={ChatStack} options={{ tabBarIcon: () =>null,tabBarButton: () => null }} />
      <Tab.Screen name="BlogTab" component={BlogStack} options={{ tabBarIcon: ()=>null,tabBarButton: () => null }} />
      <Tab.Screen name="NewsTab" component={NewsStack} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Chat" component={GeminiChat} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Location" component={Location} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Memory" component={Memory} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Hotel" component={Hotel} options={{tabBarIcon: ()=>null,tabBarButton: () => null}}/>
      <Tab.Screen name="Maps" component={Maps} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="login" component={Login} options={{ tabBarIcon: () =>null,tabBarButton: () => null}}/>
      <Tab.Screen name="NearBy" component={NearBy} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Mail" component={EmailTest} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="Test" component={Test} options={{tabBarIcon: ()=>null,tabBarButton: () => null}}/>
      <Tab.Screen name="ViewTab" component={ViewStack} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name="QuestionAnswer" component={AnswerStack} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name='payment' component={Payment} options={{tabBarIcon: ()=>null,tabBarButton: () => null}} />
      <Tab.Screen name='post' component={PostBlog} options={{tabBarIcon: ()=>null,tabBarButton: () => null}}/>
      
{/* <Tab.Screen name="BookHotel" component={BookHotelDetail} options={{title: "Hoteldetail", tabBarIcon: () => <Icon size={30} color="black" source="newspaper-variant-multiple-outline" />}} /> */}
     
      
        
      </>
}
    </Tab.Navigator>
      
  );
}

export default function App() {
  const [user, dispatch]= useReducer(MyReducer, null)
  return (

    <NavigationContainer>
      <MyUserContext.Provider value={user}>
      <PaperProvider>
        <MyDispatchContext.Provider value={dispatch}>
          <MyTab/>
        </MyDispatchContext.Provider>
        </PaperProvider>
      </MyUserContext.Provider>
    </NavigationContainer>
    
  );
}

