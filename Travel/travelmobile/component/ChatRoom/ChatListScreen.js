import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database, ref, onValue, get, query, orderByChild, limitToLast, remove } from '../ChatRoom/firebaseConfig1.js';
import { MyUserContext } from '../../config/context.js';
import { Avatar } from 'react-native-paper';

const ChatListScreen = () => {
  const nav = useNavigation();
  const user = React.useContext(MyUserContext);
  const [chatRooms, setChatRooms] = React.useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user && user.id) {
      const userChatRoomsRef = ref(database, `users/${user.id}/chatRooms`);
      const unsubscribe = onValue(userChatRoomsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const roomIds = Object.keys(data);
          const fetchRooms = async () => {
            const roomsData = [];
            for (const roomId of roomIds) {
              const roomRef = ref(database, `chatRooms/${roomId}`);
              try {
                const roomSnapshot = await get(roomRef);
                if (roomSnapshot.exists()) {
                  const room = roomSnapshot.val();
                  const memberIds = Object.keys(room.members || {});
                  const membersInfo = await Promise.all(
                    memberIds.map(async (memberId) => {
                      const userRef = ref(database, `users/${memberId}`);
                      const userSnapshot = await get(userRef);
                      return userSnapshot.exists() ? { id: memberId, ...userSnapshot.val() } : null;
                    }).filter(Boolean)
                  );

                  const messagesRef = ref(database, `chatRooms/${roomId}/messages`);
                  const messagesSnapshot = await get(query(messagesRef, orderByChild('timestamp'), limitToLast(1)));
                  const lastMessage = messagesSnapshot.val() ? Object.values(messagesSnapshot.val())[0] : null;

                  roomsData.push({ id: roomId, ...room, membersInfo, lastMessage });
                }
              } catch (error) {
                console.error("Lỗi khi tải thông tin phòng chat:", roomId, error);
              }
            }
            setChatRooms(roomsData);
            setLoading(false);
          };
          fetchRooms();
        } else {
          setChatRooms([]);
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user ? user.id : null]);

  const navigateToChatRoom = (chatRoomId) => {
    nav.navigate('ChatRoom', { chatRoomId: chatRoomId });
  };

  const navigateToCreateChatRoom = () => {
    nav.navigate('CreateChatRoom', { userlogin: user });
  };

  const handleDeleteRoom = async (roomId, creatorId) => {
    if (user && user.id === creatorId) {
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc chắn muốn xóa phòng chat này?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              try {
                const roomRef = ref(database, `chatRooms/${roomId}`);
                await remove(roomRef);

                const roomSnapshot = await get(ref(database, `chatRooms/${roomId}`));
                if (roomSnapshot.exists() && roomSnapshot.val().members) {
                  for (const memberId in roomSnapshot.val().members) {
                    const userRoomRef = ref(database, `users/${memberId}/chatRooms/${roomId}`);
                    await remove(userRoomRef);
                  }
                }
                const creatorRoomRef = ref(database, `users/${creatorId}/chatRooms/${roomId}`);
                await remove(creatorRoomRef);

                console.log(`Đã xóa phòng chat thành công: ${roomId}`);
                const updatedChatRooms = chatRooms.filter(room => room.id !== roomId);
                setChatRooms(updatedChatRooms);
                Alert.alert('Thành công', 'Phòng chat đã được xóa.'); // Thêm thông báo thành công

              } catch (error) {
                console.error("Lỗi khi xóa phòng chat:", error);
                Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xóa phòng chat.');
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Không được phép',
        'Chỉ người tạo phòng chat mới có thể xóa phòng này.',
      );
    }
  };

  const renderItem = ({ item }) => {
    const membersToDisplay = Object.keys(item.memberAvatars || {}).slice(0, 3);
    const isCreator = item.creatorId === user?.id;

    return (
      <TouchableOpacity style={styles.roomItem} onPress={() => navigateToChatRoom(item.id)}>
        <View style={styles.roomItemContainer}>
          <View style={styles.avatarsContainer}>
            {membersToDisplay.map((memberId, index) => {
              const avatarUrl = item.memberAvatars[memberId];
              return avatarUrl ? (
                <Avatar.Image
                  key={memberId}
                  source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${avatarUrl}` }}
                  size={30}
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? -15 : 0,
                      zIndex: 3 - index,
                    },
                  ]}
                />
              ) : (
                <Avatar.Text
                  key={memberId}
                  size={30}
                  label="?"
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? -15 : 0,
                      zIndex: 3 - index,
                    },
                  ]}
                />
              );
            })}
            {Object.keys(item.memberAvatars || {}).length > 3 && (
              <View style={[styles.extraMembers, { marginLeft: -15 }]}>
                <Text style={{ fontSize: 12, color: '#555' }}>+{Object.keys(item.memberAvatars).length - 3}</Text>
              </View>
            )}
          </View>
          <Text style={styles.roomName}>Nhóm {item.name}</Text>
        </View>
        {item.lastMessage && item.lastMessage.userName && item.lastMessage.text && (
          <Text style={styles.lastMessage}>
            {item.lastMessage.userName}: {item.lastMessage.text}
          </Text>
        )}
        {isCreator && (
          <TouchableOpacity onPress={() => handleDeleteRoom(item.id, item.creatorId)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Đang tải danh sách chat...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Chat</Text>
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Tạo Phòng Chat Mới" onPress={navigateToCreateChatRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roomItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  extraMembers: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  roomName: {
    fontSize: 16,
    flexShrink: 1,
  },
  lastMessage: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    flexShrink: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ChatListScreen;

