import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
    easy: number;
    medium: number;
    hard: number;
};

const DifficultyBar: React.FC<Props> = ({
    easy,
    medium,
    hard,
}) => {
    const total = easy + medium + hard;

    if (total <= 0) {
        return <View style={styles.container} />;
    }

    const easyWidth = easy
    const mediumWidth = medium
    const hardWidth = hard

    return (
        <View style={styles.container}>
            <View style={[styles.segment, {
                width: `${easyWidth}%`,
                backgroundColor: "#aab9ff",
            }]} />

            <View style={[styles.segment, {
                width: `${mediumWidth}%`,
                backgroundColor: "#7c93ff",
            }]} />

            <View style={[styles.segment, {
                width: `${hardWidth}%`,
                backgroundColor: "#5170ff",
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 30,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        overflow: "hidden",
        flexDirection: "row",
    },
    segment: {
        height: "100%",
    },
});

export default DifficultyBar;