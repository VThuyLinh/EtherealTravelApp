import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import * as Locationn from 'expo-location';


const NearbySearch = () => {
    const [location, setLocation]= useState('');
    const [places, setPlaces] = useState([]);


    const getLocation= async()=>{

        let{status}= await Locationn.requestForegroundPermissionsAsync();
        if(status!=='granted')
        {
            setLocation({
                errMsg:'Quyền định vị chưa được cấp'
            })
        }
        setLoc(await Locationn.getCurrentPositionAsync({}));
        locc=await Locationn.getCurrentPositionAsync({});
        setLocation(locc.coords.longitude+"-"+locc.coords.latitude)
        setKD(locc.coords.longitude)
        setVD(locc.coords.latitude)
        setLoading(loading?true:false)
    AsyncStorage.getItem("token").then((value)=>{
        setToken(value)})
        console.warn(token);
    setLoading(true)
    
    console.warn(res.request);
    setLoading(false);}

    React.useEffect(() => {
        const fetchNearby = async () => {
            const location = await getLocation();
            if (location) {
                const nearbyPlaces = await getNearbyPlaces(location.latitude, location.longitude);
                setPlaces(nearbyPlaces);
            }
        };
        fetchNearby();
    }, []);


   


    const API_KEY = 'AIzaSyCYyeg1-9NXZzJTe8ZiYYW7qXuN6qR9QjI'; 

const getNearbyPlaces = async (latitude, longitude, radius = 1500, type = 'restaurant') => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        return [];
    }
};

    return (
        <View>
            <FlatList
                data={places}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item.place_id}
            />
        </View>
    );
};

export default NearbySearch;
 
