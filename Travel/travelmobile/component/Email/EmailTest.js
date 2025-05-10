

import { Linking, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import React, { useContext } from "react";
import { MyUserContext } from "../../config/context";
import { useNavigation } from "@react-navigation/native";

const EmailTest = ({ route }) => {
  const {
    id_booktour,
    id_tour_id,
    adultCount,
    childrenCount,
    totalPrice,
    Tour_Name,
    DeparturePlace,
    Destination,
    DepartureDay,
    DepartureTime,
    Days,
    Nights,
    Adult_price,
    Children_price,
    user,
  } = route.params || {};

  const nav= useNavigation();

  const sendmail = async () => {
    if (!route.params) {
      console.warn("Không có thông tin hóa đơn để gửi email.");
      return;
    }

    const emailSubject = `Hóa đơn đặt tour: ${Tour_Name} - Mã đơn hàng: ${id_booktour}`;
    // const htmlBody = `
    //   <html>
    //   <head>
    //     <style>
    //       body { font-family: Arial, sans-serif; }
    //       h2 { color: #007bff; }
    //       p { margin-bottom: 10px; }
    //       strong { font-weight: bold; }
    //       table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //       th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    //       th { background-color: #f2f2f2; }
    //     </style>
    //   </head>
    //   <body>
    //     <h2>Xin chào ${user?.first_name} ${user?.last_name},</h2>
    //     <p>Cảm ơn bạn đã đặt tour <strong>${Tour_Name}</strong> với mã đơn hàng: <strong>${id_booktour}</strong>!</p>
    //     <p>Dưới đây là chi tiết hóa đơn của bạn:</p>

    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Mục</th>
    //           <th>Chi tiết</th>
    //           <th>Giá</th>
    //           <th>Số lượng</th>
    //           <th>Tổng</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         <tr>
    //           <td>Tour</td>
    //           <td>${Tour_Name} (${Days} ngày ${Nights} đêm)</td>
    //           <td>${Adult_price} VNĐ/người lớn<br>${Children_price} VNĐ/trẻ em</td>
    //           <td>${adultCount} người lớn<br>${childrenCount} trẻ em</td>
    //           <td>${(parseInt(adultCount || 0) * Adult_price) + (parseInt(childrenCount || 0) * Children_price)} VNĐ</td>
    //         </tr>
    //         <tr>
    //           <td colspan="4" style="text-align: right;"><strong>Tổng cộng:</strong></td>
    //           <td><strong>${totalPrice} VNĐ</strong></td>
    //         </tr>
    //       </tbody>
    //     </table>

    //     <p><strong>Thông tin chuyến đi:</strong></p>
    //     <ul>
    //       <li>Nơi đi: ${DeparturePlace}</li>
    //       <li>Nơi đến: ${Destination}</li>
    //       <li>Ngày khởi hành: ${(new Date(DepartureDay)).toLocaleDateString()}</li>
    //       <li>Giờ khởi hành: ${DepartureTime}</li>
    //     </ul>

    //     <p>Vui lòng kiểm tra kỹ thông tin trên. Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi.</p>
    //     <p>Chúc bạn có một chuyến đi vui vẻ!</p>
    //     <p>Trân trọng,<br/>Đội ngũ [Tên công ty/ứng dụng của bạn]</p>
    //   </body>
    //   </html>
    // `;









    const htmlBody=`Xin chào ${user?.first_name} ${user?.last_name},

        Thông tin chi tiết đặt tour:
        - Tên tour: ${Tour_Name}
        - Ngày khởi hành: ${DepartureDay}
        - Giờ khởi hành: ${DepartureTime}

        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận chi tiết chuyến đi.

        Trân trọng,
        Đội ngũ Ethereal Travel`
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedHtmlBody = encodeURIComponent(htmlBody);
    const mailtoUrl = `mailto:${user?.email || 'vthuylinh135@gmail.com'}?subject=${encodedSubject}&body=${encodedHtmlBody}`;
    console.log("Độ dài URL mailto:", mailtoUrl.length);
    console.log("Mailto URL:", mailtoUrl);
    Linking.openURL(mailtoUrl);
    setTimeout(10000);
    nav.navigate('MyTour');
  };

  React.useEffect(() => {
    sendmail(); // Gọi hàm gửi email ngay khi component được mount
  }, [route.params]); // Theo dõi sự thay đổi của route.params

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Đang chuẩn bị gửi email hóa đơn...</Text>
      <Text style={{ fontStyle: 'italic', marginTop: 10 }}>Vui lòng kiểm tra ứng dụng email của bạn.</Text>
      
    </View>
  );
};

export default EmailTest;