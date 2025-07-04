import React from "react";
import { ScrollView, Dimensions, Text, View, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@/zustand/stores";
import ImageLoader from "@/components/ImageLoader";
import IconButton from "@/components/buttons/IconButton";
import TopTabs from "@/components/general/TopTabs";
import CourseCard from "@/components/general/CourseCard";
import BottomName from "@/components/profile/home/BottomName";



const { width } = Dimensions.get('window');

function Header() {
  const user = useUserStore(state => state);
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {user.profile_image && (
          <ImageLoader size={48} uri={user.profile_image} border={1} />
        )}
        <View style={{ gap: 6, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerName}
          >{user.first_name}</Text>
          <Text style={styles.secondaryHeaderText}>
            AI Enthusiast
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <IconButton>
          <Image
            source={require("@/assets/images/profile/home/notifications.png")}
            style={styles.headerIcon}
          />
        </IconButton>
        <IconButton>
          <Image
            source={require("@/assets/images/jobs/Chats.png")}
            style={styles.headerIcon}
          />
        </IconButton>
      </View>
    </View>
  );
}

const HandsOnProjects = () => {
  return (
    <View style={handsOnProjectsStyles.container}>
      <Text style={handsOnProjectsStyles.heading}>Hands on Projects</Text>
      <View style={handsOnProjectsStyles.linesContainer}>
        {
          Array.from({ length: 50 }).map((_, index) => (
            <View key={index} style={handsOnProjectsStyles.line}>
            </View>
          ))
        }
      </View>
    </View>
  )
}

const handsOnProjectsStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#202020',
    gap: 8,
    borderRadius: 12,
  },
  heading: {
    fontSize: 11,
    color: '#a6a6a6',
  },
  linesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 4,
    height: 32,
    backgroundColor: '#545454',
    borderRadius: 2
  }
})

const Content = () => {
  return (
    <View style={{ gap: 16 }}>
      <CourseCard
        name="Build a Chatbot using GPT-3 / GPT-4 API"
        time="6 Weeks"
      />
      <CourseCard
        name="Text Sumarization Tool"
        time="6 Weeks"
      />
      <CourseCard
        name="Sentiment Analysis App"
        time="6 Weeks"
      />
      <CourseCard
        name="Fake News Detector"
        time="6 Weeks"
      />
      <CourseCard
        name="Named Entity Recognition (NER) System"
        time="6 Weeks"
      />
      <CourseCard
        name="Email Spam Classifier"
        time="6 Weeks"
      />
      <CourseCard
        name="Question Answering System"
        time="6 Weeks"
      />
      <CourseCard
        name="Language Translator"
        time="6 Weeks"
      />
      <CourseCard
        name="Topic Modeling Tool (LDS, NMF)"
        time="6 Weeks"
      />
      <CourseCard
        name="Auto Text Generation App"
        time="6 Weeks"
      />
    </View>
  )
}


export default function Project() {
  const scrollRef = React.useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: 'white' }}
      ref={scrollRef}
      scrollEnabled={scrollEnabled}
    >
      <Header />
      <HandsOnProjects />
      <View style={{ marginHorizontal: -16, marginTop: 48 }}>
        <TopTabs
          setScrollEnabled={setScrollEnabled}

          tabs={[
            {
              name: "Text",
              content: <Content />,
            },
            {
              name: "Image",
              content: <Content />,
            },
            {
              name: "Video",
              content: <Content />,
            },
            {
              name: "Audio",
              content: <Content />,
            },
            {
              name: "Multimedia",
              content: <Content />,
            },
            {
              name: "Visuals",
              content: <Content />,
            },
            {
              name: "Transformers",
              content: <Content />,
            }
          ]}
        />
      </View>
      <BottomName />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "bold",
    width: width - 192,
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
})

