import { Text, View } from "react-native";
import {
    Nunito_400Regular,
    Nunito_600SemiBold
} from "@expo-google-fonts/nunito";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { LinearGradient } from "expo-linear-gradient";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperData } from "@/constants/constants";
import { router } from "expo-router";
import { commonStyles } from "@/styles/common/common.styles";
import { styles } from "@/styles/onboarding/onboard";
const WelcomeIntroScreen = () => {
    const [fontsLoaded, fontsError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_600SemiBold
    })

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    const renderItem = (item: onboardingSwiperDataType) => {
        // <LinearGradient
        //     colors={["#E5ECF9", "#F6F7F9", "#E8EEF9"]}
        //     style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        // >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>{item.description}</Text>
        </View>
        // </LinearGradient>
    }

    return (
        // <AppIntroSlider
        //     renderItem={renderItem}
        //     data={onboardingSwiperData}
        //     onDone={() => {
        //         // router.push("/login")
        //     }}
        //     onSkip={() => {
        //         // router.push("/login")
        //     }}
        //     renderNextButton={() => {
        //         <View style={commonStyles.buttonContainer}>
        //             <Text
        //                 style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
        //             >
        //                 Tiếp tục
        //             </Text>
        //         </View>
        //     }}
        //     renderDoneButton={() => {
        //         <View style={commonStyles.buttonContainer}>
        //             <Text
        //                 style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
        //             >
        //                 Hoàn thành
        //             </Text>
        //         </View>
        //     }}
        //     showSkipButton={false}
        //     dotStyle={commonStyles.dotStyle}
        //     bottomButton={true}
        //     activeDotStyle={commonStyles.activeDotStyle}
        // />
        <View>
            <Text>CC</Text>
        </View>
    )
}

export default WelcomeIntroScreen;