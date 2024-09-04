import HeaderComponent from "@/components/header";
import { ScrollView, Text, View } from "react-native"

const HomeScreen = () => {
    return (
        <View>
            <HeaderComponent />
            <ScrollView style={{ flex: 1 }}>
                <Text>
                    Home Screen
                </Text>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;