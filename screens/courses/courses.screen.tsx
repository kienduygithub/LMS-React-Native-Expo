import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader";
import { URL_SERVER } from "@/utils/url";
import { Nunito_400Regular, Nunito_700Bold, Nunito_500Medium, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import axios from "axios";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const CoursesScreen = () => {
    const [courses, setCourses] = useState<CoursesType[]>([]);
    const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        FetchCategories();
    }, []);

    const FetchCategories = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-layout/Categories`);
            setCategories(response.data.layout.categories);
            FetchCourses();
        } catch (error) {
            console.log(error);
        }
    }

    const FetchCourses = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses(response.data.courses);
            setOriginalCourses(response.data.courses);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    let [fontsLoaded, fontsError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Raleway_600SemiBold,
    });

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const OnHandleCategories = (c: string) => {
        setActiveCategory(c);
        if (c === "All") {
            setCourses(originalCourses);
        } else {
            const filteredCourses = originalCourses.filter(
                (i: CoursesType) => i.categories === c
            );
            setCourses(filteredCourses);
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ padding: 10 }}>
                        <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: activeCategory === "All" ? "#2467EC" : "#000",
                                    borderRadius: 20,
                                    paddingHorizontal: 20,
                                    marginRight: 5
                                }}
                                onPress={() => OnHandleCategories("All")}
                            >
                                <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600" }}>
                                    Tất cả
                                </Text>
                            </TouchableOpacity>
                            {categories?.map((item: any, index: number) => (
                                <TouchableOpacity
                                    style={{
                                        padding: 10,
                                        backgroundColor: activeCategory === item?.title ? "#2467EC" : "#000",
                                        borderRadius: 50,
                                        paddingHorizontal: 20,
                                        marginHorizontal: 15,
                                    }}
                                    onPress={() => OnHandleCategories(item?.title)}
                                >
                                    <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600" }}>
                                        {item?.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView style={{ marginHorizontal: 15, gap: 12 }}>
                            {courses?.map((item: CoursesType, index: number) => (
                                <CourseCard item={item} key={index} />
                            ))}
                        </ScrollView>
                        {courses?.length === 0 && (
                            <Text style={{ textAlign: "center", paddingTop: 50, fontSize: 18 }}>
                                Không có dữ liệu
                            </Text>
                        )}
                    </View>
                </SafeAreaView>
            )}
        </>
    )
}

export default CoursesScreen;