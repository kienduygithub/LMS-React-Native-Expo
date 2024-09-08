import { URL_SERVER } from "@/utils/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native"

const CartScreen = () => {
    const [cartItems, setCartItems] = useState<CoursesType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const FetchCartUser = async () => {
        try {
            const cart: any = await AsyncStorage.getItem("cart");
            setCartItems(JSON.parse(cart));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        FetchCartUser();
    }, [])

    const OnRefresh = async () => {
        setRefreshing(true);
        const cart: any = await AsyncStorage.getItem("cart");
        setCartItems(cart);
        setRefreshing(false);
    }

    const CalculateTotalPrice = () => {
        const totalPrice = cartItems.reduce(
            (total, item) => total + item.price,
            0
        );
        return totalPrice.toFixed(2);
    }

    const OnHandleCourseDetails = (courseDetails: any) => {
        router.push({
            pathname: "/(routes)/course-details",
            params: { item: JSON.stringify(courseDetails) }
        })
    }

    const OnHandleRemoveItem = async (item: any) => {
        const existingCartData = await AsyncStorage.getItem("cart");
        const cartData = existingCartData ? JSON.parse(existingCartData) : [];
        const updatedCartData = cartData.filter((i: any) => i._id !== item._id);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCartData));
        setCartItems(updatedCartData);
    }

    const OnHandlePayment = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const amount = Math.round(
                cartItems.reduce((total, item) => total + item.price, 0) * 100
            );
            const paymentIntentResponse = await axios.post(
                `${URL_SERVER}/payment`,
                { amount },
                {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                }
            );
            const { client_secret: clientSecret } = paymentIntentResponse.data;
            const initSheetResponse = await initPaymentSheet({
                merchantDisplayName: "Becodemy Private Ltd.",
                paymentIntentClientSecret: clientSecret
            });

            if (initSheetResponse.error) {
                console.error(initSheetResponse.error);
                return;
            }
            const paymentResponse = await presentPaymentSheet();
            if (paymentResponse.error) {
                console.error(paymentResponse.error);
            } else {
                await CreateOrder(paymentResponse);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const CreateOrder = async (paymentResponse: any) => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            await axios.post(`${URL_SERVER}/create-mobile-order`, {
                courseId: cartItems[0]._id,
                payment_info: paymentResponse
            }, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            });
            setOrderSuccess(true);
            AsyncStorage.removeItem("cart");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            <Text>Cart Screen</Text>
        </View>
    )
}

export default CartScreen;