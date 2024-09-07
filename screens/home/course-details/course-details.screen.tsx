import ReviewCard from "@/components/cards/review.card";
import CourseLesson from "@/components/course-lesson";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const CourseDetailsScreen = () => {
    const [activeButton, setActiveButton] = useState("About");
    const { user, loading } = useUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const { item } = useLocalSearchParams();
    const courseData: CoursesType = JSON.parse(item as string);
    const [checkPurchased, setCheckPurchased] = useState(false);

    useEffect(() => {
        if (user?.courses.find((i: any) => i._id === courseData._id)) {
            setCheckPurchased(true);
        }
    }, [user])

    const OnHandleAddToCart = async () => {
        const existingCartData = await AsyncStorage.getItem("cart");
        const cartData = existingCartData ? JSON.parse(existingCartData) : [];
        const itemExists = cartData.some((item: any) => item._id === courseData._id)
        if (!itemExists) {
            cartData.push(courseData);
            await AsyncStorage.setItem("cart", JSON.stringify(cartData));
        }

        router.push("/(routes)/cart");
    }

    let [fontsLoaded, fontError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_600SemiBold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaView>
            {loading ? (
                <Loader />
            ) : (
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginHorizontal: 16 }}>
                            <View
                                style={{
                                    position: "absolute",
                                    zIndex: 1,
                                    backgroundColor: "#FFB013",
                                    borderRadius: 54,
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    marginTop: 8,
                                    marginLeft: 20
                                }}
                            >
                                <Text style={{ color: "black", fontSize: 14, fontFamily: "Nunito_600SemiBold" }}>
                                    Bán chạy
                                </Text>
                            </View>
                            <View style={{ position: "absolute", zIndex: 14, right: 0 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: "#141517",
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        borderRadius: 3,
                                        marginTop: 8,
                                        marginRight: 8,
                                    }}
                                >
                                    <FontAwesome name="star" size={14} color={"#FFB800"} />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: 4,
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        {courseData?.ratings}
                                    </Text>
                                </View>
                            </View>
                            <Image
                                source={{ uri: courseData?.thumbnail.url! }}
                                style={{ width: "100%", height: 230, borderRadius: 6 }}
                            />
                            <Text
                                style={{
                                    marginHorizontal: 16,
                                    marginTop: 15,
                                    fontSize: 20,
                                    fontWeight: "600",
                                    fontFamily: "Raleway_700Bold",
                                }}
                            >
                                {courseData?.name}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingRight: 10,
                                    paddingTop: 5
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingRight: 10,
                                        paddingTop: 5
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: "row" }}
                                    >
                                        <Text
                                            style={{
                                                color: "#000",
                                                fontSize: 22,
                                                marginLeft: 10,
                                                paddingVertical: 10,
                                            }}
                                        >
                                            ${courseData?.price}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#808080",
                                                fontSize: 20,
                                                marginLeft: 10,
                                                textDecorationLine: "line-through",
                                            }}
                                        >
                                            ${courseData?.estimatedPrice}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 15 }}>
                                    {courseData?.purchased} students
                                </Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                                    Các yêu cầu của khóa học
                                </Text>
                                {courseData?.prerequisites.map(
                                    (item: PrerequisiteType, index: number) => (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                width: "95%",
                                                paddingVertical: 5,
                                            }}
                                        >
                                            <Ionicons name="checkmark-done-outline" size={18} />
                                            <Text style={{ paddingLeft: 5, fontSize: 16 }}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                                    Lợi ích khóa học mang lại
                                </Text>
                                {courseData?.benefits.map((item: BenefitType, index: number) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: "row",
                                            width: "95%",
                                            paddingVertical: 5
                                        }}
                                    >
                                        <Ionicons name="checkmark-done-outline" size={18} />
                                        <Text style={{ paddingLeft: 5, fontSize: 16 }}>
                                            {item.title}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    marginTop: 25,
                                    marginHorizontal: 16,
                                    backgroundColor: "#E1E9F8",
                                    borderRadius: 50
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 42,
                                        backgroundColor: activeButton === "About" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "About" ? 50 : 0
                                    }}
                                    onPress={() => setActiveButton("About")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "About" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold"
                                        }}
                                    >
                                        Thông tin
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 42,
                                        backgroundColor:
                                            activeButton === "Lessons" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "Lessons" ? 50 : 0,
                                    }}
                                    onPress={() => setActiveButton("Lessons")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "Lessons" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        Bài giảng
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 42,
                                        backgroundColor:
                                            activeButton === "Reviews" ? "#2467EC" : "transparent",
                                        borderRadius: activeButton === "Reviews" ? 50 : 0,
                                    }}
                                    onPress={() => setActiveButton("Reviews")}
                                >
                                    <Text
                                        style={{
                                            color: activeButton === "Reviews" ? "#fff" : "#000",
                                            fontFamily: "Nunito_600SemiBold",
                                        }}
                                    >
                                        Nhận xét
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {activeButton === "About" && (
                                <View
                                    style={{
                                        marginHorizontal: 16,
                                        marginVertical: 25,
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                                        Thông tin khóa học
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#525258",
                                            fontSize: 16,
                                            marginTop: 10,
                                            textAlign: "justify",
                                            fontFamily: "Nunito_500Medium",
                                        }}
                                    >
                                        {isExpanded
                                            ? courseData?.description
                                            : courseData?.description.slice(0, 302)}
                                    </Text>
                                    {courseData?.description.length > 302 && (
                                        <TouchableOpacity
                                            style={{ marginTop: 3 }}
                                            onPress={() => setIsExpanded(!isExpanded)}
                                        >
                                            <Text
                                                style={{
                                                    color: "#2467EC",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {isExpanded ? "Show Less" : "Show More"}
                                                {isExpanded ? "-" : "+"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                            {activeButton === "Lessons" && (
                                <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
                                    <CourseLesson courseDetails={courseData} />
                                </View>
                            )}
                            {activeButton === "Reviews" && (
                                <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
                                    <View style={{ rowGap: 25 }}>
                                        {courseData?.reviews?.map(
                                            (item: ReviewType, index: number) => (
                                                <ReviewCard item={item} key={index} />
                                            )
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            backgroundColor: "#FFFF",
                            marginHorizontal: 16,
                            paddingVertical: 11,
                            marginBottom: 10
                        }}
                    >
                        {checkPurchased === true ? (
                            <TouchableOpacity
                                style={{ backgroundColor: "#2467EC", paddingVertical: 16, borderRadius: 4 }}
                                onPress={() => router.push("/(routes)/course-access")}
                            >
                                <Text
                                    style={{ textAlign: "center", color: "#FFFF", fontSize: 16, fontFamily: "Nunito_600SemiBold" }}
                                >
                                    Di chuyển đến khóa học
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#2467EC",
                                    paddingVertical: 16,
                                    borderRadius: 4
                                }}
                                onPress={() => OnHandleAddToCart()}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "#FFFF",
                                        fontSize: 16,
                                        fontFamily: "Nunito_600SemiBold"
                                    }}
                                >
                                    Thêm vào giỏ
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

export default CourseDetailsScreen;