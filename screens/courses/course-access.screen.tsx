import QuestionsCard from "@/components/cards/question.card";
import ReviewCard from "@/components/cards/review.card";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Toast } from "react-native-toast-notifications";
import WebView from "react-native-webview";

const styles = StyleSheet.create({
    button: {
        width: widthPercentageToDP("40%"),
        height: 40,
        backgroundColor: "#2467EC",
        marginVertical: 10,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});

const CourseAccessScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { courseData } = useLocalSearchParams();
    const data: CoursesType = JSON.parse(courseData as string);

    const [courseContentData, setCourseContentData] = useState<CourseDataType[]>([]);
    const [activeVideo, setActiveVideo] = useState(0);
    const [activeButton, setActiveButton] = useState("About");
    const [isExpanded, setIsExpanded] = useState(false);
    const [question, setQuestion] = useState("");
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState("");
    const [reviewAvailable, setReviewAvailable] = useState(false);

    useEffect(() => {
        const subscription = async () => {
            await FetchCourseContent();
            const isReviewAvailable = data.reviews.find(
                (i: any) => i.user._id === user?._id
            )
            if (isReviewAvailable) {
                setReviewAvailable(true);
            }
        }
        subscription();
    }, [])

    const FetchCourseContent = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const response = await axios.get(`${URL_SERVER}/get-course-content/${data._id}`, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            })
            setIsLoading(false);
            setCourseContentData(response.data.content);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            router.push("/(routes)/course-details");
        }
    }

    const OnHandleQuestionSubmit = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            await axios.put(`${URL_SERVER}/add-question`, {
                question: question,
                courseId: data._id,
                contentId: courseContentData[activeVideo]._id
            }, {
                headers: {
                    "access-token": accessToken,
                    "refresh-token": refreshToken
                }
            });
            setQuestion("");
            Toast.show("Câu hỏi đã tạo mới thành công!", {
                placement: "bottom",
                type: "success"
            });
            await FetchCourseContent();
        } catch (error) {
            console.log(error);
        }
    }

    const OnHandleReviewSubmit = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            const response = await axios.put(`${URL_SERVER}/add-review/${data._id}`,
                { review, rating },
                {
                    headers: {
                        "access-token": accessToken,
                        "refresh-token": refreshToken
                    }
                }
            );
            setRating(1);
            setReview("");
            router.push({
                pathname: "/(routes)/course-details",
                params: { item: JSON.stringify(data) }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const RenderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <FontAwesome
                        name={i <= rating ? "star" : "star-o"}
                        size={20}
                        color={"#FF8D07"}
                        style={{ marginHorizontal: 2, marginBottom: 10 }}
                    />
                </TouchableOpacity>
            )
        }
        return stars;
    }
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <View style={{ width: "100%", aspectRatio: 18 / 9, borderRadius: 10 }}>
                        <WebView
                            source={{ uri: courseContentData[activeVideo]?.videoUrl! }}
                            allowsFullscreenVideo={true}
                        />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: `${activeVideo === 0 && '#ccc'}` }]}
                            disabled={activeVideo === 0}
                            onPress={() => setActiveVideo(activeVideo - 1)}
                        >
                            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
                                {"Quay lại"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setActiveVideo(activeVideo + 1)}
                        >
                            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
                                {"Tiếp theo"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {activeVideo + 1}. {courseContentData[activeVideo]?.title}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10,
                            marginHorizontal: 0,
                            backgroundColor: "#E1E9F8",
                            borderRadius: 50,
                            gap: 10,
                            justifyContent: "space-between"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 36,
                                backgroundColor: activeButton === "About" ? "#2467EC" : "transparent",
                                borderRadius: activeButton === "About" ? 50 : 0
                            }}
                            onPress={() => setActiveButton("About")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "About" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 36,
                                borderRadius: activeButton === "Q&A" ? 50 : 0,
                                backgroundColor: activeButton === "Q&A" ? "#2467EC" : "transparent"
                            }}
                            onPress={() => setActiveButton("Q&A")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Q&A" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Hỏi đáp
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                borderRadius: activeButton === "Reviews" ? 50 : 0,
                                backgroundColor: activeButton === "Reviews" ? "#2467EC" : "transparent"
                            }}
                            onPress={() => setActiveButton("Reviews")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Reviews" ? "#FFF" : "#000",
                                    fontFamily: "Nunito_600SemiBold"
                                }}
                            >
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {activeButton === "About" && (
                        <View
                            style={{
                                marginHorizontal: 10,
                                marginVertical: 25,
                                paddingHorizontal: 0
                            }}
                        >
                            <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                                Chi tiết khóa học
                            </Text>
                            <Text
                                style={{
                                    color: "#525258",
                                    fontSize: 16,
                                    marginTop: 10,
                                    textAlign: "justify",
                                    fontFamily: "Nunito_500Medium"
                                }}
                            >
                                {isExpanded ?
                                    data?.description
                                    :
                                    data?.description.slice(0, 302)
                                }
                            </Text>
                            {data?.description.length > 302 && (
                                <TouchableOpacity
                                    style={{ marginTop: 3 }}
                                    onPress={() => setIsExpanded(!isExpanded)}
                                >
                                    <Text
                                        style={{
                                            color: "#2467EC",
                                            fontSize: 14
                                        }}
                                    >
                                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                                        {isExpanded ? "-" : "+"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    {activeButton === "Q&A" && (
                        <View style={{ flex: 1 }}>
                            <View>
                                <TextInput
                                    value={question}
                                    onChangeText={(v) => setQuestion(v)}
                                    placeholder="Đặt câu hỏi..."
                                    style={{
                                        marginVertical: 20,
                                        flex: 1,
                                        textAlignVertical: "top",
                                        justifyContent: "flex-start",
                                        backgroundColor: "#FFF",
                                        borderRadius: 10,
                                        height: 100,
                                        padding: 10
                                    }}
                                    multiline
                                />
                                <View
                                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                                >
                                    <TouchableOpacity
                                        style={styles.button}
                                        disabled={question === ""}
                                        onPress={() => OnHandleQuestionSubmit()}
                                    >
                                        <Text
                                            style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}
                                        >
                                            Gửi câu hỏi
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                {courseContentData[activeVideo]?.questions
                                    ?.slice()
                                    ?.reverse()
                                    .map((item: CommentType, index: number) => (
                                        <QuestionsCard
                                            item={item}
                                            key={index}
                                            fetchCourseContent={FetchCourseContent}
                                            courseData={data}
                                            contentId={courseContentData[activeVideo]?._id}
                                        />
                                    ))}
                            </View>
                        </View>
                    )}
                    {activeButton === "Reviews" && (
                        <View style={{ marginHorizontal: 5, marginVertical: 25 }}>
                            {!reviewAvailable && (
                                <View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                paddingBottom: 10,
                                                paddingLeft: 2,
                                                paddingRight: 5
                                            }}
                                        >
                                            Đưa ra đánh giá:
                                        </Text>
                                        {RenderStars()}
                                    </View>
                                    <TextInput
                                        value={review}
                                        onChangeText={(v) => setReview(v)}
                                        placeholder="Đưa ra đánh giá..."
                                        style={{
                                            flex: 1,
                                            textAlignVertical: "top",
                                            justifyContent: "flex-start",
                                            backgroundColor: "white",
                                            borderRadius: 10,
                                            height: 100,
                                            padding: 10
                                        }}
                                        multiline
                                    />
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            disabled={review === ""}
                                            onPress={() => OnHandleReviewSubmit()}
                                        >
                                            <Text
                                                style={{
                                                    color: "#FFF",
                                                    fontSize: 16,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Gửi Đánh giá
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={{ rowGap: 25 }}>
                                {data?.reviews?.map((item: ReviewType, index: number) => (
                                    <ReviewCard item={item} key={index} />
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </>
    )
}

export default CourseAccessScreen;