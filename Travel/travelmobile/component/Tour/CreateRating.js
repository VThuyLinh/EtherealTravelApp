import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Icon, TextInput, Button } from 'react-native-paper';

const CreateRating = ({ onSubmitRating }) => {
    const [starCount, setStarCount] = useState(0);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');


    const forbiddenWords = ["từ cấm 1", "từ cấm 2", "từ cấm 3"];

    const containsForbiddenWord = (text) => {
        const lowerCaseText = text.toLowerCase();
        return forbiddenWords.some(word => lowerCaseText.includes(word));
    };

    const handleStarPress = (selectedStars) => {
        setStarCount(selectedStars);
    };

    const handleNoteChange = (text) => {
        setNote(text);
        setError('');
    };

    const handleSubmit = () => {
        if (starCount > 0) {
            if (containsForbiddenWord(note)) {
                setError(`Nhận xét của bạn đang có từ cấm vui lòng sửa lại nhé!`);
                return;
            }
            onSubmitRating(starCount, note); // Truyền cả note
            setStarCount(0); // Reset state sau khi submit
            setNote('');
        } else {
            Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá.');
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleStarPress(i)} style={styles.starButton}>
                    <Icon
                        source="star"
                        size={styles.starIcon.size}
                        color={i <= starCount ? '#ffc107' : '#ccc'} // Màu vàng tươi cho sao đã chọn
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.starContainer}>{stars}</View>;
    };

    return (
         <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
              style={styles.container}>
        <View style={styles.container}>
            <Text style={styles.title}>Đánh giá của bạn</Text>
            {renderStars()}
            <View style={styles.separator} />
            <TextInput
                label="Nhận xét"
                value={note}
                onChangeText={handleNoteChange}
                multiline
                style={[styles.noteInput,error && styles.errorInput]}
                placeholder="Chia sẻ thêm về trải nghiệm của bạn..." // Thêm placeholder
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}><Icon source="emoticon" size={22} color="#fff" style={styles.submitButtonIcon} /> Gửi đánh giá</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom:30
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        fontSize:12,
        color: 'red',
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    starButton: {
        padding: 5,
    },
    starIcon: {
        size: 40,
    },
    noteInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        marginBottom: 30,
        fontSize: 16,
        textAlignVertical: 'top',

    },
    submitButton: {
        backgroundColor: '#FFA500',
        borderRadius: 8,
        paddingVertical: 10,
        marginBottom:15
    },
    submitButtonIcon: {
        marginTop:2 
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginVertical: 5,
    },
});

export default CreateRating;