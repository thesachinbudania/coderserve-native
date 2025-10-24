import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import Degree from "@/components/jobs/resume/Degree";
import HighSchool from "@/components/jobs/resume/highSchool";
import React, { SetStateAction } from "react";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";

type TopNavProps = {
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

export function TopNav({ page, setPage }: TopNavProps) {
  const leftArrow = require("@/assets/images/arrows/left.png");
  const leftActive = require("@/assets/images/arrows/left-active.png");
  const leftMuted = require("@/assets/images/arrows/left-muted.png");
  const rightArrow = require("@/assets/images/arrows/right.png");
  const rightActive = require("@/assets/images/arrows/right-active.png");
  const rightMuted = require("@/assets/images/arrows/right-muted.png");
  return (
    <View style={styles.topNavContainer}>
      <Pressable
        style={styles.buttonContainer}
        onPress={() => setPage(page - 1)}
        disabled={page === 0}
      >
        {({ pressed }) => (
          <Image
            source={page === 0 ? leftMuted : pressed ? leftActive : leftArrow}
            style={styles.arrowButton}
          />
        )}
      </Pressable>
      <Text>{page === 0 ? "Degree" : "High School"}</Text>
      <Pressable
        onPress={() => setPage(page + 1)}
        style={styles.buttonContainer}
        disabled={page === 1}
      >
        {({ pressed }) => (
          <Image
            source={
              page === 1 ? rightMuted : pressed ? rightActive : rightArrow
            }
            style={styles.arrowButton}
          />
        )}
      </Pressable>
    </View>
  );
}

export const measureY = async (ref: React.RefObject<any>) => {
  let pos = null;
  //@ts-ignore
  await ref.current?.measure((x, y, width, height, pageX, pageY) => {
    pos = pageY;
  });
  return pos;
};

export const setSuggestions = (
  text: string,
  setSuggestions: React.Dispatch<SetStateAction<any[]>>,
  suggestions: any[],
) => {
  const lowerSearch = text.toLowerCase();
  if (text.length === 0) {
    setSuggestions([]);
    return;
  }
  const matches = suggestions
    .filter((role) => role.toLowerCase().includes(lowerSearch))
    .slice(0, 3);

  setSuggestions(matches);
};

export default function Education() {
  const [showHeader, setShowHeader] = React.useState(true);
  let editDegree = null;
  const currentDegrees = useJobsState(state => state.degrees);
  const { edit, id } = useResumeEdit(state => state);
  if (edit && id) {
    editDegree = currentDegrees?.find((degree) => degree.id === id);
  }
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [page, setPage] = React.useState(editDegree ? editDegree.type : 0);
  return (
    <PageLayout
      headerTitle="Education"
      showHeader={showHeader}
      scrollEnabled={scrollEnabled}
    >
      {page === 0 ? (
        <Degree
          setShowHeader={setShowHeader}
          page={page}
          setPage={setPage}
          setScrollEnabled={setScrollEnabled}
        />
      ) : (
        <HighSchool
          route={null}
          setShowHeader={setShowHeader}
          page={page}
          setPage={setPage}
          setScrollEnabled={setScrollEnabled}
        />
      )}
    </PageLayout>
  );
}

export const styles = StyleSheet.create({
  topNavContainer: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 45,
    alignItems: "center",
    borderRadius: 8,
  },
  label: {
    fontSize: 11,
    marginBottom: 8,
    color: "#a6a6a6",
  },
  arrowButton: {
    width: 18,
    height: 18,
  },
  buttonContainer: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
