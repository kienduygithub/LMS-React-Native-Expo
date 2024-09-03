import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        backgroundColor: "@2467EC",
        width: responsiveWidth(88),
        height: responsiveHeight(2.5),
        borderRadius: 5,
        marginHorizontal: 5
    },
    dotStyle: {
        borderRadius: 5,
        marginHorizontal: 5,
        height: responsiveHeight(2.5),
        width: responsiveWidth(2.5),
        backgroundColor: "#2467EC"
    },
    activeDotStyle: {
        borderRadius: 5,
        marginHorizontal: 5,
        height: responsiveHeight(2.5),
        width: responsiveWidth(2.5),
        backgroundColor: "#2467Ec"
    }
})