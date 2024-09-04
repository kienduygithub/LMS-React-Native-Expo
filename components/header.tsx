import useUser from "@/hooks/useUser";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import UserImage from "@/assets/images/icons/User.png";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 16,
        width: "90%",
    },

    headerWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },

    image: {
        width: 45,
        height: 45,
        marginRight: 8,
        borderRadius: 100,
    },

    text: {
        fontSize: 16,
    },

    bellButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#E1E2E5",
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },

    bellIcon: {
        alignSelf: "center",
    },

    bellContainer: {
        width: 20,
        height: 20,
        backgroundColor: "#2467EC",
        position: "absolute",
        borderRadius: 50,
        right: -5,
        top: -5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    helloText: { color: "#7C7C80", fontSize: 14 },
})

const HeaderComponent = () => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        loadCartItems();
    }, []);

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_700Bold
    })

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const loadCartItems = async () => {
        const cart: any = await AsyncStorage.getItem("cart");
        setCartItems(JSON.parse(cart));
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                    <Image
                        style={styles.image}
                        source={user?.avatar ? user.avatar : UserImage}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.helloText, { fontFamily: "Raleway_700Bold" }]}>
                        Xin chào,
                    </Text>
                    <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
                        {user?.name ? user.name : "Người dùng ^^"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.bellButton}
                onPress={() => console.log("Đi đến trang cart")}
            >
                <Feather name="shopping-bag" size={26} color={"black"} />
                <View style={styles.bellContainer}>
                    <Text style={{ color: "#fff", fontSize: 14 }}>
                        {cartItems?.length > 0 ? cartItems.length : 0}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default HeaderComponent;