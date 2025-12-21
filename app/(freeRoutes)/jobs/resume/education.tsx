import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import Degree from "@/components/jobs/resume/Degree";
import HighSchool from "@/components/jobs/resume/highSchool";
import React, { SetStateAction } from "react";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";
import { TopNav, measureY, setSuggestions, styles } from "@/components/jobs/resume/educationUtils";

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
