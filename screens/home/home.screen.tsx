import HeaderComponent from "@/components/header";
import SearchInput from "@/components/search.input";
import { ScrollView, Text, View } from "react-native"

const HomeScreen = () => {
    return (
        <View>
            <HeaderComponent />
            <SearchInput homeScreen={true} />
            <ScrollView style={{ flex: 1 }}>
                <Text>
                    Home Screen
                </Text>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;