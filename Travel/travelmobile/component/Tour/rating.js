import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  userName: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  averageRatingContainer: {
    marginTop: 20,
  },
  averageRatingText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 5,
},
});

const renderStars = (count = 0) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon key={i} name={i <= count ? 'star' : 'staro'}  size={30}  color="#fdd835" style={styles.star}/>
       
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

const RatingComponent = ({ userRating, allRatings }) => {
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    const totalStars = ratings.reduce((sum, rating) => sum + rating.NumberOfStar, 0);
    return totalStars / ratings.length;
  };

  const average = calculateAverageRating(allRatings);

  return (
    <View>
      {allRatings && allRatings.length > 0 && (
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>Đánh giá trung bình:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:30, marginTop:20 }}>
            {renderStars(Math.round(average))}
            <Text style={{ marginLeft: 8, fontWeight:'bold' }}>({average.toFixed(1)})</Text>
          </View>
          <Text style={{fontStyle:'italic', fontSize:15, marginLeft:225, marginBottom:8}}>Tổng số đánh giá: {allRatings.length}</Text>
           <View style={styles.separator} />
        </View>
      )}
     
    </View>
  );
};



export default RatingComponent;


