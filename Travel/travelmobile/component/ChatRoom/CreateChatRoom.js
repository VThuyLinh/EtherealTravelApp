import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Button } from 'react-native';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import { database, ref, push, set, get } from '../ChatRoom/firebaseConfig1.js';

const CreateChatRoomScreen = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [allUsers, setAllUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [errorLoadingUsers, setErrorLoadingUsers] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [createdRoomsCount, setCreatedRoomsCount] = React.useState(0);
  const [chatRoomName, setChatRoomName] = useState(''); // State cho tên phòng chat
  const currentUser = route.params;
  const ha = currentUser ? currentUser.userlogin : null;

  const loadUser = async () => {
    setLoadingUsers(true);
    setErrorLoadingUsers(null);
    try {
      const response = await axios.get(`https://thuylinh.pythonanywhere.com/Customer/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const otherUsers = response.data.filter(u => ha && u.id !== ha.id);
      setAllUsers(otherUsers);
      setFilteredUsers(otherUsers);
      setLoadingUsers(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      setErrorLoadingUsers("Không thể tải danh sách người dùng.");
      setLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    loadUser();
    if (ha && ha.id) {
      const createdRoomsRef = ref(database, `users/${ha.id}/createdChatRooms`);
      get(createdRoomsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setCreatedRoomsCount(Object.keys(snapshot.val()).length);
          } else {
            setCreatedRoomsCount(0);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy số lượng phòng chat đã tạo:", error);
        });
    }
  }, [ha ? ha.id : null]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (selectedUser) => {
    if (selectedUsers.some(u => u.id === selectedUser.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== selectedUser.id));
    } else {
      setSelectedUsers([...selectedUsers, selectedUser]);
    }
  };

  const isUserSelected = (u) => {
    return selectedUsers.some(selected => selected.id === u.id);
  };

//   const handleCreateChatRoom = async () => {
//     if (!ha || !ha.id) {
//       alert("Thông tin người dùng hiện tại không hợp lệ.");
//       return;
//     }

//     if (createdRoomsCount >= 4) {
//       alert("Bạn đã đạt đến giới hạn 4 phòng chat đã tạo.");
//       return;
//     }

//     if (selectedUsers.length === 0) {
//       alert("Vui lòng chọn ít nhất một người dùng để tạo phòng chat.");
//       return;
//     }

//     if (chatRoomName.trim() === '') {
//       alert("Vui lòng nhập tên cho phòng chat.");
//       return;
//     }

//     const chatRoomsRef = ref(database, 'chatRooms');
//     const newChatRoomRef = push(chatRoomsRef);
//     const newChatRoomId = newChatRoomRef.key;

//     const members = {};
//     members[ha.id] = true;
//     selectedUsers.forEach(u => (members[u.id] = true));

//     const chatRoomData = {
//       creatorId: ha.id,
//       members: members,
//       createdAt: new Date().getTime(),
//       name: chatRoomName, // Lưu tên phòng chat
      
//     };

//     try {
//       await set(ref(database, `chatRooms/${newChatRoomId}`), chatRoomData);
//       const allMembers = [ha, ...selectedUsers];
//       for (const member of allMembers) {
//         if (member && member.id) {
//           await set(ref(database, `users/${member.id}/chatRooms/${newChatRoomId}`), true);
//         } else {
//           console.warn("Không thể thêm phòng chat vào user có ID không xác định:", member);
//         }
//       }
//       alert("Phòng chat đã được tạo thành công!");
//       navigation.navigate('ChatRoom', { chatRoomId: newChatRoomId });
//     } catch (error) {
//       console.error("Lỗi khi tạo phòng chat:", error);
//       alert("Đã có lỗi xảy ra khi tạo phòng chat.");
//     }
//   };


const handleCreateChatRoom = async () => {
    if (!ha || !ha.id) {
      alert("Thông tin người dùng hiện tại không hợp lệ.");
      return;
    }

    if (createdRoomsCount >= 4) {
      alert("Bạn đã đạt đến giới hạn 4 phòng chat đã tạo.");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Vui lòng chọn ít nhất một người dùng để tạo phòng chat.");
      return;
    }

    if (chatRoomName.trim() === '') {
      alert("Vui lòng nhập tên cho phòng chat.");
      return;
    }

    const chatRoomsRef = ref(database, 'chatRooms');
    const newChatRoomRef = push(chatRoomsRef);
    const newChatRoomId = newChatRoomRef.key;

    const members = {};
    members[ha.id] = true;
    selectedUsers.forEach(u => (members[u.id] = true));

    const memberAvatars = {};

    const fetchAvatar = async (userId) => {
      const userSnapshot = await get(ref(database, `users/${userId}/Avatar`));
      return userSnapshot.val();
    };

    memberAvatars[ha.id] = ha.Avatar || (ha.id && await fetchAvatar(ha.id));

    for (const user of selectedUsers) {
      memberAvatars[user.id] = user.Avatar || (user.id && await fetchAvatar(user.id));
    }

    const chatRoomData = {
      creatorId: ha.id,
      members: members,
      createdAt: new Date().getTime(),
      name: chatRoomName,
      creatorAvatar: memberAvatars[ha.id],
      memberAvatars: memberAvatars,
    };

    try {
      // 1. Lưu thông tin phòng chat (bao gồm memberAvatars) vào node 'chatRooms'
      await set(ref(database, `chatRooms/${newChatRoomId}`), chatRoomData);

      // 2. Lưu ID phòng chat đã TẠO vào node 'createdChatRooms' của người dùng hiện tại
      await set(ref(database, `users/${ha.id}/createdChatRooms/${newChatRoomId}`), true);

      // 3. Lưu ID phòng chat mà người dùng THAM GIA vào node 'chatRooms' của tất cả các thành viên
      const allMembers = [ha, ...selectedUsers];
      for (const member of allMembers) {
        if (member && member.id) {
          await set(ref(database, `users/${member.id}/chatRooms/${newChatRoomId}`), true);
        } else {
          console.warn("Không thể thêm phòng chat vào user có ID không xác định:", member);
        }
      }

      alert("Phòng chat đã được tạo thành công!");
      navigation.navigate('ChatRoom', { chatRoomId: newChatRoomId });

    } catch (error) {
      console.error("Lỗi khi tạo phòng chat:", error);
      alert("Đã có lỗi xảy ra khi tạo phòng chat.");
    }
  };
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        isUserSelected(item) && styles.selectedUserItem,
      ]}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.userItemContainer}>
        {item.Avatar ? (
          <Avatar.Image
            source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${item.Avatar}` }}
            size={40}
          />
        ) : (
          <Avatar.Text label={item.username ? item.username.charAt(0).toUpperCase() : '?'} size={40} />
        )}
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
  if (loadingUsers) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
      </View>
    );
  }

  if (errorLoadingUsers) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorLoadingUsers}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Phòng Chat Mới</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Nhập tên phòng chat"
        value={chatRoomName}
        onChangeText={setChatRoomName}
      />
      <Text style={styles.subtitle}>Chọn người dùng để thêm vào phòng chat:</Text>
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={styles.subtitle}>Đã chọn:</Text>
          <View style={styles.selectedUsersList}>
            {selectedUsers.map(u => (
              <TouchableOpacity key={u.id} onPress={() => handleSelectUser(u)}>
                <Text style={styles.selectedUserText}>{u.username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <Button title="Tạo Phòng Chat" onPress={handleCreateChatRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  userItem: {
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  selectedUserItem: {
    backgroundColor: '#e0f7fa',
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  username: {
    fontSize: 16,
    color: '#333',
    marginLeft: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  selectedUsersContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedUserText: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#d1c4e9',
    borderRadius: 5,
    color: 'white',
    marginBottom: 5,
  },
});

export default CreateChatRoomScreen;