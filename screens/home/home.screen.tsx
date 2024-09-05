import HeaderComponent from "@/components/header";
import HomeBannerSlider from "@/components/home-banner-slider";
import SearchInput from "@/components/search.input";
import { ScrollView, Text, View } from "react-native"

const HomeScreen = () => {
    return (
        <View>
            <HeaderComponent />
            <SearchInput homeScreen={true} />
            <ScrollView showsVerticalScrollIndicator={false}
                style={{}}
            >
                <HomeBannerSlider />
            </ScrollView>
        </View>
    )
}

export default HomeScreen;