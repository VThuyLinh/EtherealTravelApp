import axios from "axios";

const BASE_URL='https://thuylinh.pythonanywhere.com'
export const endpoints = {
    'tour':'/Tour/',
    'hotel':'/Hotel/',
    'hotelr':'/HotelRoom/',
    'bhotel':'/BookHotel/',
    'news':'/News/',
    'tourdetail':(tour_id) => `/TourDetail/${tour_id}/`,
    'newsdetail':(news_id)=> `/NewsDetail/${news_id}/`,
    'image':`/Image/`,
    'login': '/o/token/',
    'current-user': '/User/current-user/',
    'signup':'/Customer/',
    'user':'/User/',
    'booktour':'/BookTourTravel/',
    'booktourdetail':'/BookTourDetail/',
    'cmt_blog': (blog_id) => `/Blog/${blog_id}/add_comments_blog/`,
    'cmt_tour': (tour_id) => `/TourDetail/${tour_id}/add_comments/`,
    'cmt_news': (news_id) => `/News/${news_id}/add_comments_news/`,
    'like_news': (news_id) => `/NewsDetail/${news_id}/like_news/`,
    'like_tour': (tour_id) => `/TourDetail/${tour_id}/like_tour/`,
    'like_blog': (blog_id) => `/BlogDetail/${blog_id}/like_news/`,
    'like_hotel': (hotel_id) => `/HotelDetail/${hotel_id}/like_hotel/`,
    'rating_tour': (tour_id) => `/TourDetail/${tour_id}/create_rating_tour/`,
    'blog':'/BlogAll/',
    'blogdetail':(blog_id) => `/Blog/${blog_id}/`,
    'booktour':'/BookTour/',
    'tag':'/Tag/',
};

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});