import { View, Text, StyleSheet } from "react-native";
import BottomText from "./BottomName";
import React from "react";
import { EditResume } from "@/app/(protected)/jobs/resume/update/index";
import SmallTextButton from "@/components/buttons/SmallTextButton";
import { useRouter } from 'expo-router';

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

const StreakSquare = ({ intensity = 0 }: { intensity?: number }) => {
  return (
    <View style={{ width: 10, height: 10, backgroundColor: intensity === 0 ? '#f5f5f5' : intensity === 1 ? '#b7efd4' : intensity === 2 ? '#76e4af' : '#00bf63', borderRadius: 2 }} />
  )
}

export const StreakRate = () => {
  const router = useRouter();
  return (
    <View style={{ marginTop: 8, borderRadius: 12, padding: 16, borderColor: '#f5f5f5', borderWidth: 1 }}>
      {
        Array.from({ length: 7 }).map((_, rowIndex) => {
          return (
            <View key={rowIndex} style={{ flexDirection: 'row', marginBottom: 4, justifyContent: 'space-between' }}>
              {
                Array.from({ length: 26 }).map((_, colIndex) => {
                  return (
                    <View key={colIndex}>
                      <StreakSquare />
                    </View>
                  )
                })
              }
            </View>
          )
        }
        )
      }
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 4, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <Text style={{ color: "#a6a6a6", fontSize: 9 }}>Less</Text>
          <StreakSquare intensity={0} />
          <StreakSquare intensity={1} />
          <StreakSquare intensity={2} />
          <StreakSquare intensity={3} />
          <Text style={{ color: "#a6a6a6", fontSize: 9 }}>More</Text>
        </View>
        <View>
          <SmallTextButton title="Learn how we count Streak" style={{ fontSize: 9, textDecorationLine: 'underline', color: "#a6a6a6" }} onPress={() => router.push('/(protected)/talks/profile/streakCalculation')} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 32, gap: 16 }}>
        <View style={{ flex: 1 / 2, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
          <Text style={{ color: "#a6a6a6", fontSize: 11 }}> Streak Rate</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 8 }}>0.00</Text>
        </View>
        <View style={{ flex: 1 / 2, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
          <Text style={{ color: "#a6a6a6", fontSize: 11 }}> Current Streak</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 8 }}>0 Day</Text>
        </View>
      </View>
    </View>
  )
}

export default function ProfileContent({
  editable,
  setHeight,
}: {
  editable?: boolean;
  setHeight?: (height: number) => void;
}) {
  const lastHeightRef = React.useRef(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);


  return (
    <>
      <View style={styles.tabContent}>
        <EditResume showLess editable={editable} />
        <View style={{ paddingHorizontal: 16, marginTop: 48 }}>
          <Text style={[styles.detailsHeading]}>Streak</Text>
          <StreakRate />
        </View>
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
    marginTop: -32,
  },
});
