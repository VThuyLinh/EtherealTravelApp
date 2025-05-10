import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper"



const Logout =()=>{
    const nav= useNavigation();
    return (
        <Button title="Log out" onPress={()=>nav.navigate("login")}/>
    )
}
export default Logout;