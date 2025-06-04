import { View, Text, StyleSheet } from "react-native";
import BottomText from "@/components/profile/home/BottomName";
import React from "react";
import { ResumeDetails } from "@/app/(protected)/jobs/resume/index";
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
  return (
    <>
      <Text style={{ marginTop: 48, fontSize: 15, fontWeight: 'bold' }}>Learning Streak</Text>
      <View style={{ marginTop: 8, padding: 16, borderRadius: 12, borderColor: '#f5f5f5', borderWidth: 1 }}>
        <View style={{ gap: 4 }}>
          {
            Array.from({ length: 7 }).map((_, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                  Array.from({ length: 26 }).map((_, index) => (
                    <Square key={index} />
                  ))
                }
                <Square />
              </View>
            ))
          }
        </View>
        <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 9 }}>Less</Text>
            <Square level={0} />
            <Square level={1} />
            <Square level={2} />
            <Square level={3} />
            <Text style={{ fontSize: 9 }}>More</Text>
          </View>
          <Text style={{ fontSize: 9, textDecorationLine: 'underline' }}>Learn how we count Learning Streak</Text>
        </View>
        <View style={{ marginTop: 48, flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 / 2, alignItems: 'center', gap: 4, padding: 16, borderColor: '#eeeeee', backgroundColor: '#f5f5f5', borderWidth: 1, borderRadius: 8 }}>
            <Text style={{ fontSize: 11 }}>Longest Streak</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>0 Days</Text>
          </View>
          <View style={{ flex: 1 / 2, alignItems: 'center', gap: 4, padding: 16, borderColor: '#eeeeee', backgroundColor: '#f5f5f5', borderWidth: 1, borderRadius: 8 }}>
            <Text style={{ fontSize: 11 }}>Current Streak</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>0 Days</Text>
          </View>

        </View>
      </View>
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
