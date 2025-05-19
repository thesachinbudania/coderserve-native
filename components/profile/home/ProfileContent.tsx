import { View, Text, StyleSheet } from "react-native";
import BottomText from "./BottomName";
import React from "react";
import { EditResume } from "@/app/(protected)/jobs/resume/editResume";

export function ProfileSection({
  title,
  content,
  onPress = () => { },
}: {
  title: string;
  content: string;
  onPress?: () => void;
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <View>
      <Text style={styles.detailsHeading}>{title}</Text>
      <Text style={styles.detailsContent}>
        {content}{" "}
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
      </Text>
    </View>
  );
}

export default function ProfileContent() {
  return (
    <>
      <View style={styles.tabContent}>
        <EditResume addFooterOnUnmount={true} />
      </View>
      <BottomText />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {},
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
  tabContent: {
    flex: 1,
    flexGrow: 1,
    marginHorizontal: -16,
  },
});
