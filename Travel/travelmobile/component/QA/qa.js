
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';


const questions = [
  {
    id: 0,
    text: "Bạn dự định đi du lịch vào thời điểm nào trong năm?",
    options: [
      { text: "Mùa xuân (tháng 3 - 5)", nextQuestionMap:  1},
      { text: "Mùa hè (tháng 6 - 8)", nextQuestionMap: 1},
      { text: "Mùa thu (tháng 9 - 11)", nextQuestionMap: 1},
      { text: "Mùa đông (tháng 12 - 2)", nextQuestionMap: 1},
      { text: "Tôi chưa có kế hoạch cụ thể", nextQuestionMap: 1},
    ],
    type:"single_choice",
    order:"0"
  },
  {
    id: 1,
    text: "Bạn muốn du lịch ở đâu?",
    options: [
      { text: "Núi, Rừng", nextQuestionMap:  2},
      { text: "Biển", nextQuestionMap: 2},
      { text: "Thành phố", nextQuestionMap: 2},
      { text: "Cao nguyên", nextQuestionMap: 2},
    ],
    type:"single_choice",
    order:"1"
  },
    {
      id: 2,
      text: "Mục đích du lịch của bạn trong chuyến đi này là gì?",
      options: [
        { text: "Du lịch khám phá thiên nhiên", nextQuestionMap: 3},
        { text: "Du lịch văn hóa, lịch sử", nextQuestionMap:  12},
        { text: "Du lịch nghỉ dưỡng, thư giãn", nextQuestionMap: 17},
      ],
      type:"single_choice",
      order:"2"
    },
    {
      id: 3,
      text: "Du lịch khám phá thiên nhiên, bạn có muốn trải nghiệm các trò chơi mạo hiểm(leo núi, vượt thác, nhảy dù,...)không?",
      options: [
        { text: "Mình muốn trải nghiệm các trò chơi mạo hiểm", nextQuestionMap: 4 },
        { text: "Mình KHÔNG thích chơi các trò chơi mạo hiểm", nextQuestionMap: 4 },
      ],
      type:"single_choice",
      order:"3"
    },
    {
        id: 4,
        text: "Bạn có muốn tìm hiểu về các loài động vật, thực vật hoang dã không?",
        options: [
          { text: "Mình muốn tìm hiểu về các loài động vật/thực vật hoang dã", nextQuestionMap:  5},
          { text: "Mình KHÔNG thích tìm hiểu về các loài động /thực vật hoang dã lắm", nextQuestionMap: 5},
        ],
        type:"single_choice",
        order:"4"
      },
      {
        id: 5,
        text: "Bạn có muốn trải nghiệm các hoạt động gần gũi với thiên nhiên không?",
        options: [
          { text: "Mình muốn trải nghiệm các hoạt động gần gũi với thiên nhiên(đi bộ đường dài/leo núi/cắm trại/chèo thuyền kayak)", nextQuestionMap:  6},
          { text: "Mình KHÔNG muốn trải nghiệm các hoạt động gần gũi với thiên nhiên", nextQuestionMap: 6},
        ],
        type:"single_choice",
        order:"5"
      },
      {
        id: 6,
        text: "Bạn sẽ du lịch với ai?",
        options: [
          { text: "Du lịch với gia đình", nextQuestionMap:  7},
          { text: "Du lịch với bạn bè", nextQuestionMap: 7},
          { text: "Du lịch với người yêu", nextQuestionMap: 7},
          { text: "Du lịch một mình", nextQuestionMap: 7},
        ],
        type:"single_choice",
        order:"6"
      },
      {
        id: 7,
        text: "Bạn đang ở đâu?",
        options: [
            { value: "An Giang", text: "An Giang" },
            { value: "Bà Rịa - Vũng Tàu", text: "Bà Rịa - Vũng Tàu" },
            { value: "Bạc Liêu", text: "Bạc Liêu" },
            { value: "Bắc Giang", text: "Bắc Giang" },
            { value: "Bắc Kạn", text: "Bắc Kạn" },
            { value: "Bắc Ninh", text: "Bắc Ninh" },
            { value: "Bến Tre", text: "Bến Tre" },
            { value: "Bình Dương", text: "Bình Dương" },
            { value: "Bình Định", text: "Bình Định" },
            { value: "Bình Phước", text: "Bình Phước" },
            { value: "Bình Thuận", text: "Bình Thuận" },
            { value: "Cà Mau", text: "Cà Mau" },
            { value: "Cao Bằng", text: "Cao Bằng" },
            { value: "Cần Thơ", text: "Cần Thơ" },
            { value: "Đà Nẵng", text: "Đà Nẵng" },
            { value: "Đắk Lắk", text: "Đắk Lắk" },
            { value: "Đắk Nông", text: "Đắk Nông" },
            { value: "Điện Biên", text: "Điện Biên" },
            { value: "Đồng Nai", text: "Đồng Nai" },
            { value: "Đồng Tháp", text: "Đồng Tháp" },
            { value: "Gia Lai", text: "Gia Lai" },
            { value: "Hà Giang", text: "Hà Giang" },
            { value: "Hà Nam", text: "Hà Nam" },
            { value: "Hà Nội", text: "Hà Nội" },
            { value: "Hà Tĩnh", text: "Hà Tĩnh" },
            { value: "Hải Dương", text: "Hải Dương" },
            { value: "Hải Phòng", text: "Hải Phòng" },
            { value: "Hậu Giang", text: "Hậu Giang" },
            { value: "Hòa Bình", text: "Hòa Bình" },
            { value: "Hưng Yên", text: "Hưng Yên" },
            { value: "Khánh Hòa", text: "Khánh Hòa" },
            { value: "Kiên Giang", text: "Kiên Giang" },
            { value: "Kon Tum", text: "Kon Tum" },
            { value: "Lai Châu", text: "Lai Châu" },
            { value: "Lạng Sơn", text: "Lạng Sơn" },
            { value: "Lào Cai", text: "Lào Cai" },
            { value: "Lâm Đồng", text: "Lâm Đồng" },
            { value: "Long An", text: "Long An" },
            { value: "Nam Định", text: "Nam Định" },
            { value: "Nghệ An", text: "Nghệ An" },
            { value: "Ninh Bình", text: "Ninh Bình" },
            { value: "Ninh Thuận", text: "Ninh Thuận" },
            { value: "Phú Thọ", text: "Phú Thọ" },
            { value: "Phú Yên", text: "Phú Yên" },
            { value: "Quảng Bình", text: "Quảng Bình" },
            { value: "Quảng Nam", text: "Quảng Nam" },
            { value: "Quảng Ngãi", text: "Quảng Ngãi" },
            { value: "Quảng Ninh", text: "Quảng Ninh" },
            { value: "Quảng Trị", text: "Quảng Trị" },
            { value: "Sóc Trăng", text: "Sóc Trăng" },
            { value: "Sơn La", text: "Sơn La" },
            { value: "Tây Ninh", text: "Tây Ninh" },
            { value: "Thái Bình", text: "Thái Bình" },
            { value: "Thái Nguyên", text: "Thái Nguyên" },
            { value: "Thanh Hóa", text: "Thanh Hóa" },
            { value: "Thừa Thiên Huế", text: "Thừa Thiên Huế" },
            { value: "Tiền Giang", text: "Tiền Giang" },
            { value: "Trà Vinh", text: "Trà Vinh" },
            { value: "Tuyên Quang", text: "Tuyên Quang" },
            { value: "Vĩnh Long", text: "Vĩnh Long" },
            { value: "Vĩnh Phúc", text: "Vĩnh Phúc" },
            { value: "Yên Bái", text: "Yên Bái" },
            { value: "Hồ Chí Minh", text: "Hồ Chí Minh" }
        ],
        type: "dropdown",
        order: "7"
    }
      ,{
        id: 8,
        text: "Bạn dự định chuyến đi của mình kéo dài bao lâu?",
        options: [
          { text: "1-2 ngày", nextQuestionMap:  null},
          { text: "3-5 ngày", nextQuestionMap: null},
          { text: "1 tuần", nextQuestionMap: null},
          { text: "Hơn tuần", nextQuestionMap: null},
          { text: "Tôi không biết nữa", nextQuestionMap: null},
        ],
        type:"single_choice",
        order:"8"
      },
      {
        id: 9,
        text: "Khi nghĩ đến du lịch văn hóa và lịch sử, điều gì là quan trọng nhất đối với bạn trong chuyến đi?",
        options: [
          { text: "Được khám phá những câu chuyện và ý nghĩa ẩn sau các di tích, hiện vật.", nextQuestionMap:  10},
          { text: "Trải nghiệm và hòa mình vào không khí, phong tục tập quán độc đáo của địa phương.", nextQuestionMap: 10},
          { text: "Chiêm ngưỡng vẻ đẹp kiến trúc cổ kính và nghệ thuật truyền thống.", nextQuestionMap: 10},
          { text: "Tìm hiểu về những sự kiện và nhân vật lịch sử quan trọng.", nextQuestionMap: 10},
          { text: "Kết hợp du lịch văn hóa, lịch sử với các hoạt động khác như ẩm thực, thiên nhiên.", nextQuestionMap: 10},
        ],
        type:"multiple_choice",
        order:"9"
      },
      {
        id: 10,
        text: "Bạn quan tâm đến điều gì nhất khi tham quan bảo tàng (về chiến tranh hoặc di sản)?",
        options: [
          { text: "Các câu chuyện lịch sử và ý nghĩa văn hóa.", nextQuestionMap:  11},
          { text: "Hiện vật và kiến trúc độc đáo.", nextQuestionMap: 11},
          { text: "Những câu chuyện cá nhân và trải nghiệm con người.", nextQuestionMap: 11},
          { text: "Tôi thích khám phá nhiều khía cạnh khác nhau.", nextQuestionMap: 11},
        ],
        type:"multiple_choice",
        order:"10"
      },
      {
        id: 11,
        text: "Bạn muốn trải nghiệm điều gì ở các tour du lịch sinh thái, du lịch cộng đồng (ví dụ: làm bánh dân gian, làm thủ công mỹ nghệ, câu cá, bắt cá, team_building, ....)?",
        nextQuestionMap: {default:"6"},
        type:"text_input",
        order:"11"
      },
      {
        id: 12,
        text: "Mục đích chính của chuyến đi nghỉ dưỡng này của bạn là gì?",
        options: [
          { text: "Giảm căng thẳng", nextQuestionMap:  13},
          { text: "Phục hồi năng lượng", nextQuestionMap: 13},
          { text: "Tận hưởng thời gian riêng", nextQuestionMap: 13},
          { text: "Gắn kết gia đình/bạn bè", nextQuestionMap: 13},
        ],
        type:"single_choice",
        order:"12"
      },
      {
        id: 13,
        text: "Bạn có quan tâm đến các hoạt động cụ thể nào trong chuyến đi nghỉ dưỡng không?",
        options: [
          { text: "Spa", nextQuestionMap:  6},
          { text: "Yoga/Meditation", nextQuestionMap: 6},
          { text: "Đọc sách", nextQuestionMap: 6},
          { text: "Bơi lội", nextQuestionMap: 6},
          { text: "Đi dạo", nextQuestionMap: 6},
          { text: "Ngắm cảnh", nextQuestionMap: 6},
          { text: "Thưởng thức ẩm thực", nextQuestionMap: 6}
        ],
        type:"multiple_choice",
        order:"13"
      }
      
  ];


const QuestionScreen = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [Result, setResult]= useState('');
  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  const handleAnswer = (answer) => {
    setAnswersHistory([...answersHistory, { questionId: currentQuestionId, answer }]);
    if (answer.nextQuestionId !== null) {
      setCurrentQuestionId(answer.nextQuestionId);
    } else {
      setCurrentQuestionId(null); // Kết thúc khi nextQuestionId là null
    }
    answersHistory.map((item,index)=>(
      setResult(Result.concat(`${item.answer.text},`))
    ));
    
  };

  if (!currentQuestion) {
    console.log(Result);
    answersHistory.map((item,index)=>(
      console.log(`Câu ${item.questionId}: ${item.answer.text}`)
    ));

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Đã hoàn thành!</Text>
        <Text style={styles.resultTitle}>Kết quả:</Text>
        {answersHistory.map((item, index) => (
          <Text key={index} style={styles.resultItem}>
            {`Câu ${item.questionId}: ${item.answer.text}`}
          </Text>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {currentQuestion.answers.map((answer, index) => (
        <TouchableOpacity
          key={index}
          style={styles.answerButton}
          onPress={() => handleAnswer(answer)}
        >
          <Text style={styles.answerText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  answerButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  resultItem: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default QuestionScreen;



// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// const questions = [
//   {
//     id: 1,
//     question: "Bạn thích những loại trái cây nào?",
//     answers: [
//       { id: 1, text: "Táo" },
//       { id: 2, text: "Chuối" },
//       { id: 3, text: "Cam" },
//       { id: 4, text: "Dâu" },
//     ],
//     multipleChoice: true,
//   },
//   {
//     id: 2,
//     question: "Thủ đô của Việt Nam là gì?",
//     answers: [
//       { id: 1, text: "Hà Nội" },
//       { id: 2, text: "Hồ Chí Minh" },
//       { id: 3, text: "Đà Nẵng" },
//     ],
//     multipleChoice: false,
//   },
//   // ... các câu hỏi khác
// ];

// const QuestionComponent = ({ question, onAnswer }) => {
//   const [selectedAnswers, setSelectedAnswers] = useState([]);

//   const toggleAnswer = (answerId) => {
//     if (question.multipleChoice) {
//       if (selectedAnswers.includes(answerId)) {
//         setSelectedAnswers(selectedAnswers.filter((id) => id !== answerId));
//       } else {
//         setSelectedAnswers([...selectedAnswers, answerId]);
//       }
//     } else {
//       setSelectedAnswers([answerId]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.question}>{question.question}</Text>
//       {question.answers.map((answer) => (
//         <TouchableOpacity
//           key={answer.id}
//           style={[
//             styles.answerButton,
//             selectedAnswers.includes(answer.id) && styles.selectedAnswer,
//           ]}
//           onPress={() => toggleAnswer(answer.id)}
//         >
//           <Text style={styles.answerText}>{answer.text}</Text>
//         </TouchableOpacity>
//       ))}
//       <TouchableOpacity style={styles.submitButton} onPress={() => onAnswer(selectedAnswers)}>
//         <Text style={styles.submitButtonText}>Gửi</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   question: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   answerButton: {
//     padding: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//   },
//   selectedAnswer: {
//     backgroundColor: 'lightblue',
//   },
//   answerText: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: 'green',
//     padding: 15,
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// const QuestionScreen = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const handleAnswer = (answers) => {
//     console.log("Câu trả lời đã chọn:", answers);
//     // Xử lý kết quả ở đây
//     setCurrentQuestionIndex(currentQuestionIndex + 1);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {currentQuestionIndex < questions.length && (
//         <QuestionComponent
//           question={questions[currentQuestionIndex]}
//           onAnswer={handleAnswer}
//         />
//       )}
//     </ScrollView>
//   );
// };

// export default QuestionScreen;