import { Dimensions, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    heading: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    body: {
        fontSize: 14,
        color: '#737373',
    },
    dividerLine: {
        marginTop: 16,
        marginBottom: 16,
        width,
        height: 8,
        backgroundColor: "#f5f5f5",
        marginHorizontal: -16
    }
})