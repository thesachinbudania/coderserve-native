import Layout from "@/components/general/PageLayout";
import { View, StyleSheet } from "react-native";
import BottomName from "@/components/profile/home/BottomName";
import { EditResume } from "@/app/(protected)/jobs/resume/update/index";
import { useUserStore } from "@/zustand/stores";
import { Image, Text } from 'react-native';
import BackgroundImageLoader from "@/components/BackgroundImageLoader";
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import ImageLoader from "@/components/ImageLoader";
import ProfileButton from "@/components/general/ProfileButton";
import { LearningStreak } from "@/components/talks/home/ProfileContent";



export default function() {
  const user = useUserStore(state => state);
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingBottom: -64 }}>
      <Layout
        headerTitle="Update Profile"
        bottomPadding={false}
      >
        <View style={styles.container}>
          <View style={{ marginHorizontal: -16 }}>
            {
              user.background_type === 'default' ?
                // @ts-ignore
                <Image source={BackgroundMapping[user.background_pattern_code]} style={styles.bgImage} /> :
                user.background_image &&
                <BackgroundImageLoader size={164} uri={user.background_image} />

            }
          </View>
          <View style={styles.profileRow}>
            {user.profile_image &&
              <ImageLoader
                size={96}
                uri={user.profile_image}
              />}
          </View>
          <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
<Text style={{color: "#004aad", marginTop: 8, fontSize: 13, fontWeight: "bold"}}>Ranked #50</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
        </View>
        <View style={{ marginHorizontal: -16, marginTop: 16 }}>
          <EditResume showLess />
          <View style={{ marginHorizontal: 16 }}>
            <LearningStreak />
          </View>
        </View>
        <BottomName />
      </Layout>
    </View>
  );
}

export const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: 164,
  },
  profileRow: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: -32
  },
  countRow: {
    flexDirection: 'row',
    width: '70%',
    marginLeft: 32,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },

  name: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 16,
  },
  username: {
    marginTop: 8,
    fontSize: 13,
    color: '#737373',
  },
  userLocation: {
    marginTop: 8,
    fontSize: 13,
    color: '#737373',
  },

  editDetailsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  container: {
    marginTop: -24,
  },
  resumeContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    gap: 48,
  },
  detailsHeading: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  menuIcon: {
    height: 24,
    width: 24,
  },
  detailsContent: {
    fontSize: 13,
    color: "#a6a6a6",
    textAlign: "justify",
    verticalAlign: "bottom",
  },
  experienceContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  logoContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  logo: {
    margin: 8,
    height: 32,
    width: 32,
  },
  containerPrimaryHeading: {
    fontSize: 13,
    fontWeight: "bold",
  },
  containerSecondaryHeading: {
    marginTop: 4,
    fontSize: 13,
  },
  containerTertiaryHeading: {
    marginTop: 4,
    fontSize: 13,
    color: "#737373",
  },
  sideLine: {
    width: 2,
    flex: 1,
    marginLeft: 24,
    marginTop: 8,
    backgroundColor: "#f5f5f5",
  },
  addEntryContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 8,
  },
  certificationContainer: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: 12,
    gap: 16,
    alignItems: "center",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: 9,
    marginTop: 16,
  },
});
