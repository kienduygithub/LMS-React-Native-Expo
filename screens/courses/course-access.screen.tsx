import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native"
import { Toast } from "react-native-toast-notifications";

const CourseAccessScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { courseData } = useLocalSearchParams();
    const data: CoursesType = JSON.parse(courseData as string);

    const [courseContentData, setCourseContentData] = useState<CourseDataType[]>([]);
    const [activeVideo, setActiveVideo] = useState(0);
    const [activeButton, setActiveButton] = useState("About");
    const [isExpand, setIsExpanded] = useState(false);
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
            const response = await axios.put(`${URL_SERVER}/add-question`, {
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
                        size={25}
                        color={"#FF8D07"}
                        style={{ marginHorizontal: 4, marginTop: 5 }}
                    />
                </TouchableOpacity>
            )
        }
        return stars;
    }
    return (
        <View>
            <Text>
                Course Access Screen
            </Text>
        </View>
    )
}

export default CourseAccessScreen;