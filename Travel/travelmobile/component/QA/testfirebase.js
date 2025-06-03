// import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
// import { addDoc, collection, onSnapshot, serverTimestamp } from "@firebase/firestore";
// import { FIRESTORE_DB } from "./firebaseConfig.js";
// import { Icon } from "react-native-paper";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { MyUserContext } from "../../config/context.js";

// const question_collection = collection(FIRESTORE_DB, "question");

// const Testfirebase = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const nav = useNavigation();
//   const user = useContext(MyUserContext);
//   const [textInputValue, setTextInputValue] = useState('');
//   const textInputRef = useRef(null);
//   const bannedWords = ["từ cấm 1", "từ cấm 2", "từ nhạy cảm 3"];

//   const finishSurveyAndNavigate = useCallback((answersToProcess) => {
//     console.log("Survey finished. Finalizing answers.");
//     const finalAnswers = answersToProcess || selectedAnswers;
//     console.log("Collected Answers (using provided state):", finalAnswers);

//     const question9Id = '9';

//     if (finalAnswers.hasOwnProperty(question9Id)) {
//       console.log(`[DEBUG] Câu trả lời riêng của câu 9 (ID: ${question9Id}) trong finishSurveyAndNavigate:`, finalAnswers[question9Id]);
//     } else {
//       console.log(`[DEBUG] Không tìm thấy câu trả lời trong state được truyền cho câu 9 (ID: ${question9Id})`);
//       console.log("[DEBUG] State được truyền vào finishSurveyAndNavigate:", finalAnswers);
//     }

//     const finalAnswerArray = questions.map(q => {
//       const answer = finalAnswers[q.id];

//       if (q.id === question9Id) {
//         console.log(`[DEBUG] Processing answer for question 9 (ID: ${q.id}) within map loop using provided state:`, answer);
//       }

//       if (answer === undefined || answer === null) {
//         return '';
//       }

//       if (q.type === 'multiple_choice' && Array.isArray(answer)) {
//         return answer.join(',');
//       }

//       return String(answer);
//     });

//     const finalAnswerString = finalAnswerArray.join('#');

//     console.log('Final Answer String:', finalAnswerString);

//     nav.navigate('Answer', { userAnswers: finalAnswerString });

//     // Optionally, save the answer string to Firestore here if needed
//     // ... (đoạn code lưu Firestore của bạn, giữ nguyên) ...

//   }, [questions, selectedAnswers, nav]);

//   const processNavigationLogic = useCallback((questionId, answer, latestSelectedAnswers) => {
//     console.log(`Processing navigation for question ${questionId} with answer:`, answer);
//     const currentQuestion = questions.find(q => q.id === questionId);

//     if (!currentQuestion) {
//       console.error(`Question with ID ${questionId} not found.`);
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setTextInputValue('');
//       } else {
//         finishSurveyAndNavigate(latestSelectedAnswers);
//       }
//       return;
//     }

//     let nextQuestionId = null;

//     if (currentQuestion.type === 'single_choice') {
//       nextQuestionId = currentQuestion?.nextQuestionMap?.[answer];
//     } else if (currentQuestion.type === 'text_input') {
//       nextQuestionId = currentQuestion?.nextQuestionMap?.default;
//     } else if (currentQuestion.type === 'multiple_choice') {
//       nextQuestionId = currentQuestion?.nextQuestionMap?.default;
//     }

//     console.log("Determined nextQuestionId:", nextQuestionId);

//     if (nextQuestionId === "null" || nextQuestionId == null) {
//       console.log("Navigation target indicates survey end ('null' string or null/undefined). Finishing survey.");
//       finishSurveyAndNavigate(latestSelectedAnswers);
//       return;
//     }

//     if (nextQuestionId !== undefined && nextQuestionId !== null) {
//       const nextQuestionIndex = questions.findIndex(q => q.id === nextQuestionId);

//       if (nextQuestionIndex !== -1) {
//         console.log(`Navigating to question index ${nextQuestionIndex} (ID: ${nextQuestionId})`);
//         setCurrentQuestionIndex(nextQuestionIndex);
//         const nextQuestion = questions[nextQuestionIndex];
//         setTextInputValue(nextQuestion?.type === 'text_input' ? (latestSelectedAnswers?.[nextQuestion?.id] || '') : '');
//         return;
//       } else {
//         console.warn(`Configured nextQuestionId "${nextQuestionId}" not found. Falling back to sequential navigation.`);
//       }
//     }

//     const sequentialNextIndex = currentQuestionIndex + 1;
//     console.log(`Falling back to sequential navigation. Checking index ${sequentialNextIndex}.`);
//     if (sequentialNextIndex < questions.length) {
//       console.log(`Navigating to next sequential question at index ${sequentialNextIndex}`);
//       setCurrentQuestionIndex(sequentialNextIndex);
//       const nextQuestion = questions[sequentialNextIndex];
//       setTextInputValue(nextQuestion?.type === 'text_input' ? (latestSelectedAnswers?.[nextQuestion?.id] || '') : '');
//     } else {
//       console.log("End of sequential questions. Finishing survey.");
//       finishSurveyAndNavigate(latestSelectedAnswers);
//     }

//   }, [questions, currentQuestionIndex, finishSurveyAndNavigate]);

//   const loadQuestions = useCallback(() => {
//     console.log('Tải lại câu hỏi.');
//     setLoading(true);
//     setCurrentQuestionIndex(0);
//     setSelectedAnswers({});
//     setTextInputValue('');

//     const unsubscribe = onSnapshot(
//       question_collection,
//       (snapshot) => {
//         const questionsData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           options: Array.isArray(doc.data().options)
//             ? doc.data().options.map((opt) => String(opt).trim())
//             : [],
//         }));
//         const sortedQuestions = [...questionsData].sort(
//           (a, b) => (a.order !== undefined ? parseInt(a.order) : Infinity) - (b.order !== undefined ? parseInt(b.order) : Infinity)
//         );
//         setQuestions(sortedQuestions);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Lỗi khi lấy dữ liệu câu hỏi:", error);
//         setError(error.message);
//         setLoading(false);
//         Alert.alert("Lỗi", "Không thể tải câu hỏi.");
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       const unsubscribe = loadQuestions();
//       return () => {
//         unsubscribe();
//       };
//     }, [loadQuestions])
//   );

//   const handleAnswerSelection = useCallback((selectedOption) => {
//     const currentQuestion = questions[currentQuestionIndex];
//     const questionId = currentQuestion.id;

//     setSelectedAnswers(prevAnswers => {
//       const newAnswers = { ...prevAnswers };
//       if (currentQuestion?.type === 'multiple_choice') {
//         const existingAnswers = newAnswers[questionId] || [];
//         if (existingAnswers.includes(selectedOption)) {
//           newAnswers[questionId] = existingAnswers.filter(answer => answer !== selectedOption);
//         } else {
//           newAnswers[questionId] = [...existingAnswers, selectedOption];
//         }
//       } else if (currentQuestion?.type === 'single_choice') {
//         newAnswers[questionId] = selectedOption;
//         processNavigationLogic(questionId, selectedOption, newAnswers);
//       }
//       return newAnswers;
//     });
//   }, [questions, currentQuestionIndex, processNavigationLogic]);

//   const handleTextInputChange = useCallback((text) => {
//     setTextInputValue(text);
//     // Kiểm tra từ cấm khi người dùng nhập liệu
//     const lowerCaseText = text.toLowerCase();
//     const hasBannedWord = bannedWords.some(word => lowerCaseText.includes(word));
  
//     if (hasBannedWord) {
//      Alert.alert(
//       "Cảnh báo",
//       "Câu trả lời của bạn chứa từ ngữ không phù hợp. Vui lòng kiểm tra lại.",
//       [{ text: "OK" }]
//      );
//      setTextInputValue('');
//     }
//    }, [bannedWords, setTextInputValue]);

//   const handleTextInputSubmit = useCallback(() => {
//     const currentQuestion = questions[currentQuestionIndex];
//     const questionId = currentQuestion.id;
//     setSelectedAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: textInputValue }));
//     processNavigationLogic(questionId, textInputValue, selectedAnswers);
//     setTextInputValue('');
//     if (textInputRef.current) {
//       textInputRef.current.blur();
//     }
//   }, [questions, currentQuestionIndex, textInputValue, processNavigationLogic, selectedAnswers, textInputRef]);

//   const handleNextQuestion = useCallback(() => {
//     const currentQuestion = questions[currentQuestionIndex];
//     const questionId = currentQuestion.id;
//     processNavigationLogic(questionId, null, selectedAnswers);
//   }, [questions, currentQuestionIndex, processNavigationLogic, selectedAnswers]);

//   if (loading) return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Đang tải câu hỏi...</Text></View>;
//   if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>Lỗi: {error}</Text></View>;
//   if (questions.length === 0) return <View style={styles.noQuestionsContainer}><Text style={styles.noQuestionsText}>Không có câu hỏi nào.</Text></View>;

//   const currentQuestion = questions[currentQuestionIndex];
//   if (!currentQuestion) {
//     return <View style={styles.errorContainer}><Text style={styles.errorText}>Không tìm thấy câu hỏi hiện tại.</Text></View>;
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <View style={styles.container}>
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionText}>
//             Câu {currentQuestionIndex + 1}: {currentQuestion?.text}
//           </Text>
//           {currentQuestion?.type === 'multiple_choice' && (
//             <Text style={styles.multipleChoiceHint}>
//               Đây là câu hỏi chọn nhiều đáp án, chọn đáp án rồi bấm mũi tên chuyển tiếp
//             </Text>
//           )}
//         </View>

//         <View style={styles.answersContainer}>
//           <ScrollView
//             contentContainerStyle={{ flexGrow: 1 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             {currentQuestion?.type === 'multiple_choice' &&
//               currentQuestion?.options?.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.answerButton,
//                     selectedAnswers[currentQuestion.id]?.includes(option) && styles.selectedAnswerButton,
//                   ]}
//                   onPress={() => handleAnswerSelection(option)}
//                 >
//                   <Text style={styles.answerButtonText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}

//             {currentQuestion?.type === 'single_choice' &&
//               currentQuestion?.options?.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.answerButton,
//                     selectedAnswers[currentQuestion.id] === option && styles.selectedAnswerButton,
//                   ]}
//                   onPress={() => handleAnswerSelection(option)}
//                 >
//                   <Text style={styles.answerButtonText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}

//             {currentQuestion?.type === 'text_input' && (
//               <TextInput
//                 style={styles.textInput}
//                 value={textInputValue}
//                 onChangeText={handleTextInputChange}
//                 placeholder="Nhập câu trả lời của bạn"
//                 onSubmitEditing={handleTextInputSubmit}
//                 blurOnSubmit={false}
//                 ref={textInputRef}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 onFocus={() => console.log('TextInput được focus')}
//               />
//             )}
//           </ScrollView>
//         </View>

//         <View>
//           {currentQuestion?.type === 'text_input' ? (
//             <TouchableOpacity onPress={handleTextInputSubmit} style={styles.navButton}>
//               <Text style={{ color: 'white', fontSize: 18, marginRight: 5 }}>Gửi</Text>
//               <Icon size={24} source="arrow-right" color={'white'} />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               onPress={handleNextQuestion}
//               style={[styles.navButton, currentQuestion?.type === 'single_choice' && styles.disabledButton]}
//               disabled={currentQuestion?.type === 'single_choice'}
//             >
//               <Icon size={24} source="arrow-right" color={'white'} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#E8F1FD",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "#E8F1FD",
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "#E8F1FD",
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//   },
//   noQuestionsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "#E8F1FD",
//     padding: 20,
//   },
//   noQuestionsText: {
//     fontSize: 18,
//     color: 'gray',
//     textAlign: 'center',
//   },
//   questionContainer: {
//     backgroundColor: "white",
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     width: "100%",
//     alignItems: "center",
//     elevation: 3,
//     minHeight: 100,
//     justifyContent: 'center',
//   },
//   questionText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   multipleChoiceHint: {
//     fontSize: 12,
//     fontStyle: 'italic',
//     color: 'gray',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   answersContainer: {
//     width: "100%",
//     flex: 1,
//     marginBottom: 20,
//   },
//   answerButton: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     alignItems: "center",
//     elevation: 2,
//     borderColor: "#8FD9C4",
//     borderWidth: 1,
//   },
//   answerButtonText: {
//     fontSize: 18,
//     color: "#333",
//     textAlign: 'center',
//   },
//   selectedAnswerButton: {
//     backgroundColor: '#A7F3D0',
//     borderColor: '#16A34A',
//     borderWidth: 2,
//   },
//   textInput: {
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 12,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     fontSize: 18,
//     backgroundColor: 'white',
//     width: '100%',
//     minHeight: 100,
//   },
//   navigationContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//     paddingHorizontal: 10,
//     backgroundColor: "white",
//     borderRadius: 15,
//     paddingVertical: 10,
//     elevation: 3,
//   },
//   progressIndicator: {
//     // Style here if needed
//   },
//   progressText: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: 'bold',
//   },
//   navButton: {
//     backgroundColor: "#8FD9C4",
//     borderRadius: 15,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft:'80%'
//   },
//   disabledButton: {
//     backgroundColor: "lightgray",
//   },
// });

// export default Testfirebase;


import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { addDoc, collection, onSnapshot, serverTimestamp } from "@firebase/firestore";
import { FIRESTORE_DB } from "./firebaseConfig.js";
import { Icon } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MyUserContext } from "../../config/context.js";

const question_collection = collection(FIRESTORE_DB, "question");

const Testfirebase = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [textInputValue, setTextInputValue] = useState('');
  const textInputRef = useRef(null);
  const bannedWords = ["từ cấm 1", "từ cấm 2", "từ nhạy cảm 3"];

  const finishSurveyAndNavigate = useCallback((answersToProcess) => {
    console.log("Survey finished. Finalizing answers.");
    const finalAnswers = answersToProcess || selectedAnswers;
    console.log("Collected Answers (using provided state):", finalAnswers);

    const question9Id = '9';

    if (finalAnswers.hasOwnProperty(question9Id)) {
      console.log(`[DEBUG] Câu trả lời riêng của câu 9 (ID: ${question9Id}) trong finishSurveyAndNavigate:`, finalAnswers[question9Id]);
    } else {
      console.log(`[DEBUG] Không tìm thấy câu trả lời trong state được truyền cho câu 9 (ID: ${question9Id})`);
      console.log("[DEBUG] State được truyền vào finishSurveyAndNavigate:", finalAnswers);
    }

    const finalAnswerArray = questions.map(q => {
      const answer = finalAnswers[q.id];

      if (q.id === question9Id) {
        console.log(`[DEBUG] Processing answer for question 9 (ID: ${q.id}) within map loop using provided state:`, answer);
      }

      if (answer === undefined || answer === null) {
        return '';
      }

      if (q.type === 'multiple_choice' && Array.isArray(answer)) {
        return answer.join(',');
      }

      return String(answer);
    });

    const finalAnswerString = finalAnswerArray.join('#');

    console.log('Final Answer String:', finalAnswerString);

    nav.navigate('Answer', { userAnswers: finalAnswerString });

    // Optionally, save the answer string to Firestore here if needed
    // ... (đoạn code lưu Firestore của bạn, giữ nguyên) ...

  }, [questions, selectedAnswers, nav]);

  const processNavigationLogic = useCallback((questionId, answer, latestSelectedAnswers) => {
    console.log(`Processing navigation for question ${questionId} with answer:`, answer);
    const currentQuestion = questions.find(q => q.id === questionId);

    if (!currentQuestion) {
      console.error(`Question with ID ${questionId} not found.`);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTextInputValue('');
      } else {
        finishSurveyAndNavigate(latestSelectedAnswers);
      }
      return;
    }

    let nextQuestionId = null;

    if (currentQuestion.type === 'single_choice') {
      nextQuestionId = currentQuestion?.nextQuestionMap?.[answer];
    } else if (currentQuestion.type === 'text_input') {
      nextQuestionId = currentQuestion?.nextQuestionMap?.default;
    } else if (currentQuestion.type === 'multiple_choice') {
      nextQuestionId = currentQuestion?.nextQuestionMap?.default;
    }

    console.log("Determined nextQuestionId:", nextQuestionId);

    if (nextQuestionId === "null" || nextQuestionId == null) {
      console.log("Navigation target indicates survey end ('null' string or null/undefined). Finishing survey.");
      finishSurveyAndNavigate(latestSelectedAnswers);
      return;
    }

    if (nextQuestionId !== undefined && nextQuestionId !== null) {
      const nextQuestionIndex = questions.findIndex(q => q.id === nextQuestionId);

      if (nextQuestionIndex !== -1) {
        console.log(`Navigating to question index ${nextQuestionIndex} (ID: ${nextQuestionId})`);
        setCurrentQuestionIndex(nextQuestionIndex);
        const nextQuestion = questions[nextQuestionIndex];
        setTextInputValue(nextQuestion?.type === 'text_input' ? (latestSelectedAnswers?.[nextQuestion?.id] || '') : '');
        return;
      } else {
        console.warn(`Configured nextQuestionId "${nextQuestionId}" not found. Falling back to sequential navigation.`);
      }
    }

    const sequentialNextIndex = currentQuestionIndex + 1;
    console.log(`Falling back to sequential navigation. Checking index ${sequentialNextIndex}.`);
    if (sequentialNextIndex < questions.length) {
      console.log(`Navigating to next sequential question at index ${sequentialNextIndex}`);
      setCurrentQuestionIndex(sequentialNextIndex);
      const nextQuestion = questions[sequentialNextIndex];
      setTextInputValue(nextQuestion?.type === 'text_input' ? (latestSelectedAnswers?.[nextQuestion?.id] || '') : '');
    } else {
      console.log("End of sequential questions. Finishing survey.");
      finishSurveyAndNavigate(latestSelectedAnswers);
    }

  }, [questions, currentQuestionIndex, finishSurveyAndNavigate]);

  const loadQuestions = useCallback(() => {
    console.log('Tải lại câu hỏi.');
    setLoading(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTextInputValue('');

    const unsubscribe = onSnapshot(
      question_collection,
      (snapshot) => {
        const questionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          options: Array.isArray(doc.data().options)
            ? doc.data().options.map((opt) => String(opt).trim())
            : [],
        }));
        const sortedQuestions = [...questionsData].sort(
          (a, b) => (a.order !== undefined ? parseInt(a.order) : Infinity) - (b.order !== undefined ? parseInt(b.order) : Infinity)
        );
        setQuestions(sortedQuestions);
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy dữ liệu câu hỏi:", error);
        setError(error.message);
        setLoading(false);
        Alert.alert("Lỗi", "Không thể tải câu hỏi.");
      }
    );
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = loadQuestions();
      return () => {
        unsubscribe();
      };
    }, [loadQuestions])
  );

  const handleAnswerSelection = useCallback((selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id;

    setSelectedAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      if (currentQuestion?.type === 'multiple_choice') {
        const existingAnswers = newAnswers[questionId] || [];
        if (existingAnswers.includes(selectedOption)) {
          newAnswers[questionId] = existingAnswers.filter(answer => answer !== selectedOption);
        } else {
          newAnswers[questionId] = [...existingAnswers, selectedOption];
        }
      } else if (currentQuestion?.type === 'single_choice') {
        newAnswers[questionId] = selectedOption;
        processNavigationLogic(questionId, selectedOption, newAnswers);
      }
      return newAnswers;
    });
  }, [questions, currentQuestionIndex, processNavigationLogic]);

  const handleTextInputChange = useCallback((text) => {
    setTextInputValue(text);
    // Kiểm tra từ cấm khi người dùng nhập liệu
    const lowerCaseText = text.toLowerCase();
    const hasBannedWord = bannedWords.some(word => lowerCaseText.includes(word));
 
    if (hasBannedWord) {
     Alert.alert(
      "Cảnh báo",
      "Câu trả lời của bạn chứa từ ngữ không phù hợp. Vui lòng kiểm tra lại.",
      [{ text: "OK" }]
     );
     setTextInputValue('');
    }
   }, [bannedWords, setTextInputValue]);

  const handleTextInputSubmit = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id;
    setSelectedAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: textInputValue }));
    processNavigationLogic(questionId, textInputValue, selectedAnswers);
    setTextInputValue('');
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
  }, [questions, currentQuestionIndex, textInputValue, processNavigationLogic, selectedAnswers, textInputRef]);

  const handleNextQuestion = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id;
    processNavigationLogic(questionId, null, selectedAnswers);
  }, [questions, currentQuestionIndex, processNavigationLogic, selectedAnswers]);

  // Hàm xử lý khi nhấn nút thoát
  const handleExitButtonPress = useCallback(() => {
    Alert.alert(
      "Xác nhận thoát",
      "Bạn có chắc chắn muốn thoát khỏi khảo sát và về trang chủ không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Thoát",
          onPress: () => nav.navigate("Home1") // Điều hướng về màn hình Home1
        }
      ],
      { cancelable: false }
    );
  }, [nav]);

  if (loading) return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Đang tải câu hỏi...</Text></View>;
  if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>Lỗi: {error}</Text></View>;
  if (questions.length === 0) return <View style={styles.noQuestionsContainer}><Text style={styles.noQuestionsText}>Không có câu hỏi nào.</Text></View>;

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>Không tìm thấy câu hỏi hiện tại.</Text></View>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Câu {currentQuestionIndex + 1}: {currentQuestion?.text}
          </Text>
          {currentQuestion?.type === 'multiple_choice' && (
            <Text style={styles.multipleChoiceHint}>
              Đây là câu hỏi chọn nhiều đáp án, chọn đáp án rồi bấm mũi tên chuyển tiếp
            </Text>
          )}
        </View>

        <View style={styles.answersContainer}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {currentQuestion?.type === 'multiple_choice' &&
              currentQuestion?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answerButton,
                    selectedAnswers[currentQuestion.id]?.includes(option) && styles.selectedAnswerButton,
                  ]}
                  onPress={() => handleAnswerSelection(option)}
                >
                  <Text style={styles.answerButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}

            {currentQuestion?.type === 'single_choice' &&
              currentQuestion?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answerButton,
                    selectedAnswers[currentQuestion.id] === option && styles.selectedAnswerButton,
                  ]}
                  onPress={() => handleAnswerSelection(option)}
                >
                  <Text style={styles.answerButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}

            {currentQuestion?.type === 'text_input' && (
              <TextInput
                style={styles.textInput}
                value={textInputValue}
                onChangeText={handleTextInputChange}
                placeholder="Nhập câu trả lời của bạn"
                onSubmitEditing={handleTextInputSubmit}
                blurOnSubmit={false}
                ref={textInputRef}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => console.log('TextInput được focus')}
              />
            )}
          </ScrollView>
        </View>

        {/* --- DÒNG THÊM MỚI --- */}
        <View style={styles.bottomNavigation}>
          {/* Nút thoát */}
          <TouchableOpacity 
            onPress={handleExitButtonPress} 
            style={styles.exitButton}
          >
            <Text style={styles.buttonText}>Thoát</Text>
          </TouchableOpacity>

          {/* Nút chuyển câu hỏi */}
          {currentQuestion?.type === 'text_input' ? (
            <TouchableOpacity onPress={handleTextInputSubmit} style={styles.navButton}>
              <Text style={styles.buttonText}>Gửi</Text>
              <Icon size={24} source="arrow-right" color={'white'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNextQuestion}
              style={[styles.navButton, currentQuestion?.type === 'single_choice' && styles.disabledButton]}
              disabled={currentQuestion?.type === 'single_choice'} // Disable for single choice as it auto-advances
            >
              <Text style={styles.buttonText}>Tiếp theo</Text>
              <Icon size={24} source="arrow-right" color={'white'} />
            </TouchableOpacity>
          )}
        </View>
        {/* --- KẾT THÚC DÒNG THÊM MỚI --- */}

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F1FD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E8F1FD",
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E8F1FD",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E8F1FD",
    padding: 20,
  },
  noQuestionsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    minHeight: 100,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  multipleChoiceHint: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },
  answersContainer: {
    width: "100%",
    flex: 1,
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    borderColor: "#8FD9C4",
    borderWidth: 1,
  },
  answerButtonText: {
    fontSize: 18,
    color: "#333",
    textAlign: 'center',
  },
  selectedAnswerButton: {
    backgroundColor: '#A7F3D0',
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: 'white',
    width: '100%',
    minHeight: 100,
  },
  // Style mới cho container chứa các nút điều hướng
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Căn đều các nút ra hai bên
    alignItems: 'center',
    width: '100%', // Chiếm toàn bộ chiều rộng
    marginTop: 10, // Khoảng cách với phần nội dung phía trên
    paddingHorizontal: 5, // Đảm bảo không sát mép
  },
  navButton: {
    backgroundColor: "#8FD9C4",
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row', // Để icon và text trên cùng một hàng
    alignItems: 'center',
    justifyContent: 'center',
    // margin-left cũ bị bỏ, thay bằng flexbox justify-content
    minWidth: 120, // Đặt chiều rộng tối thiểu để nút trông cân đối
  },
  disabledButton: {
    backgroundColor: "lightgray",
  },
  exitButton: {
    backgroundColor: "#DC3545", // Màu đỏ cho nút thoát
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120, // Đặt chiều rộng tối thiểu để nút trông cân đối
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5, // Khoảng cách giữa text và icon
  },
});

export default Testfirebase;