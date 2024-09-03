import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SignUpScreen = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Text>
                        Đăng ký
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUpScreen;