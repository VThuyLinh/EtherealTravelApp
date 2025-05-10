import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MyUserContext } from '../../config/context';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [active, setActive] = React.useState('');

    const handleItemPress = (route) => {
        setActive(route);
        navigation.navigate(route); // Điều hướng đến màn hình khác
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Drawer.Section title="Chức năng">
                    <Drawer.Item
                        label="Tài khoản"
                        active={active === 'Account'}
                        onPress={() => handleItemPress('Account')}
                        icon={() => <Icon name="account" size={25} />}
                    />
                    <Drawer.Item
                        label="Chuyến đi của tôi"
                        active={active === 'MyTour'}
                        onPress={() => handleItemPress('MyTour')}
                        icon={() => <Icon name="ticket-account" size={25} />}
                    />
                    <Drawer.Item
                        label="Nhật ký"
                        active={active === 'BlogTab'}
                        onPress={() => handleItemPress('BlogTab')}
                        icon={() => <Icon name="notebook" size={25} />}
                    />
                    <Drawer.Item
                        label="ChatBot 24/7"
                        active={active === 'Chat'}
                        onPress={() => handleItemPress('Chat')}
                        icon={() => <Icon name="robot" size={25} />}
                    />
                    <Drawer.Item
                        label="Tin tức"
                        active={active === 'NewsTab'}
                        onPress={() => handleItemPress('NewsTab')}
                        icon={() => <Icon name="newspaper-variant-multiple-outline" size={25} />}
                    />
                    <Drawer.Item
                        label="Vị trí"
                        active={active === 'Location'}
                        onPress={() => handleItemPress('Location')}
                        icon={() => <Icon name="map-marker" size={25} />}
                    />
                    <Drawer.Item
                        label="Sổ kỷ niệm"
                        active={active === 'Memory'}
                        onPress={() => handleItemPress('Memory')}
                        icon={() => <Icon name="map-marker" size={25} />}
                    />
                    <Drawer.Item
                        label="Khách sạn"
                        active={active === 'Hotel'}
                        onPress={() => handleItemPress('Hotel')}
                        icon={() => <Icon name="domain" size={25} />}
                    />
                    
                    <Drawer.Item
                        label="Tìm kiếm xung quanh"
                        active={active === 'Maps'}
                        onPress={() => handleItemPress('Maps')}
                        icon={() => <Icon name="store-search" size={25} />}
                    />
                    <Drawer.Item
                        label="Email"
                        active={active === 'Mail'}
                        onPress={() => handleItemPress('Mail')}
                        icon={() => <Icon name="mailbox" size={25} />}
                    />
                    <Drawer.Item
                        label="Du lịch VR"
                        active={active === 'ViewTab'}
                        onPress={() => handleItemPress('ViewTab')}
                        icon={() => <Icon name="virtual-reality" size={25} />}
                    />
                    <Drawer.Item
                        label="Chat"
                        active={active === 'ChatTab'}
                        onPress={() => handleItemPress('ChatTab')}
                        icon={() => <Icon name="chat" size={25} />}
                    />
                    <Drawer.Item
                        label="Khảo sát"
                        active={active === 'QuestionAnswer'}
                        onPress={() => handleItemPress('QuestionAnswer')}
                        icon={() => <Icon name="head-question" size={25} />}
                    />
                    {/* Thêm các mục menu khác */}
                </Drawer.Section>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 20,
    },
});

export default MenuScreen;