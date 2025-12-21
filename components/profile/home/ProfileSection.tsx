import { View, Text, StyleSheet } from "react-native";
import React from "react";

export function ProfileSection({
    title,
    content,
    onPress = () => { },
    editable = true
}: {
    title: string;
    content: string;
    onPress?: () => void;
    editable?: boolean;
}) {
    const [pressed, setPressed] = React.useState(false);
    return (
        <View>
            <Text style={styles.detailsHeading}>{title}</Text>
            <Text style={styles.detailsContent}>
                {content}{" "}
                {
                    editable && (
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: pressed ? "#006dff" : "black",
                            }}
                            onPress={onPress}
                            suppressHighlighting={true}
                            onPressIn={() => setPressed(true)}
                            onPressOut={() => setPressed(false)}
                        >
                            add now
                        </Text>
                    )
                }
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    detailsHeading: {
        fontWeight: "bold",
        fontSize: 15,
    },
    detailsContent: {
        fontSize: 13,
        color: "#a6a6a6",
        textAlign: "justify",
        marginTop: 8,
        verticalAlign: "bottom",
    },
});
