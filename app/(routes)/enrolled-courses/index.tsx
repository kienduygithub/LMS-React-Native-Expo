import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader";
import useUser from "@/hooks/useUser";
import { URL_SERVER } from "@/utils/url";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
    const [courses, setCourses] = useState<CoursesType[]>([]);
    const [loader, setLoader] = useState(false);
    const { loading, user } = useUser();

    useEffect(() => {
        FetchCoursesOfUser();
    }, [loader, user]);

    const FetchCoursesOfUser = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/get-courses`);
            const courses: CoursesType[] = response.data.courses;
            const data = courses.filter((i: CoursesType) => {
                return user?.courses?.some((d: any) => d._id === i._id)
            });
            setCourses(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {loader || loading ? (
                <Loader />
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={courses}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id + ""}
                        renderItem={({ item }) => <CourseCard item={item} />}
                    />
                </SafeAreaView>
            )}
        </>
    )
}

export default index;