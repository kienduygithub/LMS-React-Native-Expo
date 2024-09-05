import { URL_SERVER } from "@/utils/url";
import { Nunito_700Bold } from "@expo-google-fonts/nunito";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react"
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CourseCard from "./cards/course.card";

const styles = StyleSheet.create({
    filteringContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
    },

    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },

    searchIconContainer: {
        width: 36,
        height: 36,
        backgroundColor: "#2467EC",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: "black",
        paddingVertical: 10,
        width: 271,
        height: 48,
    },
});

const SearchInput = ({ homeScreen }: { homeScreen?: boolean }) => {
    const [value, setValue] = useState("");
    const [courses, setCourses] = useState([]);
    const [filterdCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        loadAllCourses();
    }, []);

    const loadAllCourses = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            setCourses(response.data.courses);
            if (!homeScreen) {
                setFilteredCourses(response.data.courses);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (homeScreen && value === "") {
            setFilteredCourses([]);
        } else if (value) {
            const filterd = courses.filter((course: CoursesType) => course.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredCourses(filterd);
        } else if (!homeScreen) {
            setFilteredCourses(courses);
        }
    }, [value, courses])

    let [fontsLoaded, fontError] = useFonts({
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const renderCourseItem = ({ item }: { item: CoursesType }) => (
        <TouchableOpacity
            style={{
                backgroundColor: "#fff",
                padding: 10,
                width: widthPercentageToDP("90%"),
                marginLeft: "1.5%",
                flexDirection: "row"
            }}
            onPress={() => router.push({
                pathname: "/(routes)/course-details",
                params: { item: JSON.stringify(item) }
            })}
        >
            <Image
                source={{ uri: item.thumbnail.url }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
            />
            <View style={{
                flexDirection: "column",
                paddingLeft: 10,
                gap: 10,
                width: widthPercentageToDP("75%")
            }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontFamily: "Nunito_700Bold"
                    }}
                >
                    {item.name}
                </Text>
                <Text
                    style={{ fontSize: 12 }}
                >
                    {item.tags}
                </Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View>
            <View style={styles.filteringContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.input, { fontFamily: 'Nunito_700Bold' }]}
                        placeholder="Search"
                        onChangeText={(v) => setValue(v)}
                        placeholderTextColor={"#C67CCC"}
                    />
                    <TouchableOpacity
                        style={styles.searchIconContainer}
                        onPress={() => router.push("/(tabs)/search")}
                    >
                        <AntDesign name="search1" size={20} color={"#fff"} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                width: 600,
                marginLeft: 14,
                marginTop: 10
            }}>
                <FlatList
                    style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        width: "100%"
                    }}
                    data={filterdCourses}
                    keyExtractor={(item: CoursesType) => item._id}
                    renderItem={
                        homeScreen ?
                            renderCourseItem
                            :
                            ({ item }) => <CourseCard item={item} key={item._id} />
                    }
                />
            </View>
            {!homeScreen && (
                <>
                    {filterdCourses.length === 0 && (
                        <Text>
                            Không tồn tại dữ liệu để hiển thị!
                        </Text>
                    )}
                </>
            )}
        </View>
    )

}

export default SearchInput;