import { View, Text, StyleSheet } from "react-native";
import BottomText from "@/components/profile/home/BottomName";
import React from "react";
import { ResumeDetails } from "@/app/(protected)/jobs/resume/index";
import { useRouter } from 'expo-router';
import { StreakRate } from "@/components/profile/home/ProfileContent";

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

function Square({ level = 0 }: { level?: number }) {
  const colors = ['#f5f5f5', '#b7efd4', '#76e4af', '#00bf63'];
  return (
    <View style={{ width: 10, height: 10, backgroundColor: colors[level], borderRadius: 2 }} />
  )
}

export function LearningStreak() {
  const router = useRouter();
  return (
    <>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: 'bold' }}>Learning Streak</Text>
       <StreakRate /> 
    </>
  )
}

export default function ProfileContent() {
  return (
    <>
      <View style={styles.tabContent}>
        <ResumeDetails showLess={true} />
        <LearningStreak />
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
  },
});
