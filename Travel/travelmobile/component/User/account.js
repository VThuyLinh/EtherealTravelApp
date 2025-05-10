
import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { Avatar, Button, Card, List, useTheme } from "react-native-paper";
import StyleAll from "../../style/StyleAll";
import { MyDispatchContext, MyUserContext } from "../../config/context";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const Account = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const { colors } = useTheme();
    const nav = useNavigation();

    const log = () => {
        nav.navigate("login");
    };

    return (
        <SafeAreaView style={[StyleAll.container]}>
            {/* Ảnh bìa */}
            {user?.Cover && (
                <Image
                    style={styles.coverImage}
                    source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${user.Cover}` }}
                />
            )}

            <View style={styles.avatarContainer}>
                {user?.Avatar ? (
                    <Avatar.Image
                        size={120}
                        source={{ uri: `https://res.cloudinary.com/dqcjhhtlm/${user.Avatar}` }}
                    />
                ) : (
                    <Avatar.Icon size={120} icon="account-circle" />
                )}
                <Text style={styles.name}>{user?.last_name} {user?.first_name}</Text>
            </View>

            <Card style={styles.infoCard}>
                <Card.Content>
                    {user?.email && (
                        <List.Item
                            title={user.email}
                            left={() => <Icon name="envelope-open-text" size={20} color={colors.primary} />}
                        />
                    )}
                    {user?.address && (
                        <List.Item
                            title={user.address}
                            left={() => <Icon name="location-dot" size={20} color={colors.primary} />}
                        />
                    )}
                    {user?.sdt && (
                        <List.Item
                            title={user.sdt}
                            left={() => <Icon name="mobile-retro" size={20} color={colors.primary} />}
                        />
                    )}
                </Card.Content>
            </Card>

            <Button
                style={styles.logoutButton}
                icon={() => <Icon name="right-from-bracket" size={20} color="white" />}
                mode="contained"
                onPress={() => {
                    dispatch({ type: "logout" });
                    log();
                }}
            >
                <Text style={{fontSize:18}}>Đăng xuất</Text>
            </Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    coverImage: {
        height: 150,
        width: '100%',
        resizeMode: 'cover',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: -60, // Để avatar chồng lên ảnh bìa
        marginBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    infoCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 3,
        backgroundColor:'#f5f5f5'
    },
    logoutButton: {
        marginHorizontal: 120,
        paddingVertical: 8,
    },
});

export default Account;