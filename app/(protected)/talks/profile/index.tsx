import { Header } from '@/app/(protected)/jobs/resume/index';
import React from 'react';
import { Platform, Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import BlueButton from '@/components/buttons/BlueButton';
import ImageLoader from '@/components/ImageLoader';
import ProfileButton from '@/components/general/ProfileButton';
import Tabs from '@/components/profile/home/Tabs';
import { useUserStore } from '@/zustand/stores';
import { useIsFocused } from '@react-navigation/native';
import { MenuButton } from '@/app/(protected)/jobs/index';
import { useRouter } from 'expo-router';
import BottomSheet from '@/components/messsages/BottomSheet';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TopSection() {
  return (
    <>
    </>
  )
}


export default function YourProfile() {
  const menuRef = React.useRef<any>(null);
  const user = useUserStore(state => state);
  const focused = useIsFocused();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/profile/' + user.username,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {
        focused && <Header
          title='Your Profile'
          menuRef={menuRef}
        />
      }
      <ScrollView contentContainerStyle={{ paddingTop: Platform.OS === 'ios' ? top + 57 : 57, backgroundColor: 'white' }}>
        {
          user.background_type === 'default' ?
            // @ts-ignore
            <Image source={BackgroundMapping[user.background_pattern_code]} style={styles.bgImage} /> :
            user.background_image &&
            <BackgroundImageLoader size={164} uri={user.background_image} />

        }
        <View style={styles.body}>
          <View style={styles.profileRow}>
            {user.profile_image &&
              <ImageLoader
                size={96}
                uri={user.profile_image}
              />}
            <View style={styles.countRow}>
              <ProfileButton
                count={0}
                title="Posts"
                onPress={() => setIndex(1)}
              />
              <ProfileButton
                count={user.followers || 0}
                title="Followers"
                onPress={() => router.push('/(freeRoutes)/profile/followersList/' + user.username)}
              />
              <ProfileButton
                count={user.following || 0}
                title="Following"
                onPress={() => router.push('/(freeRoutes)/profile/followingList/' + user.username)}
              />
            </View>
          </View>
          <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
          <Text style={{color: "#004aad", marginTop: 8, fontSize: 13, fontWeight: "bold"}}>Ranked #50</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
          <View style={styles.buttonContainer}>
            <BlueButton
              title="Share Profile"
              onPress={shareProfileAsync}
            />
          </View>
        </View>
        <View >
          <Tabs
            setScrollEnabled={() => { }}
            index={index}
            setIndex={setIndex}
          />
        </View>
        <Portal>
          <BottomSheet
            menuRef={menuRef}
            height={392}>
            <View style={styles.menuContainer}>
              <MenuButton
                onPress={() => {
                  menuRef.current?.close();
                  router.push('/(protected)/talks/profile/update')
                }}
              >
                <Text style={styles.menuButtonHeading}>Update Profile</Text>
                <Text style={styles.menuButtonText}>
                  Add/remove profile details.
                </Text>
              </MenuButton>
              <MenuButton
                onPress={() => {
                  menuRef.current?.close();
                  router.push('/(protected)/talks/profile/profileVisitors')
                }}
              >
                <Text style={styles.menuButtonHeading}>Profile Visitors</Text>
                <Text style={styles.menuButtonText}>
                  See who viewed your profile.
                </Text>
              </MenuButton>
              <MenuButton onPress={() => {
                menuRef.current?.close();
                router.push('/(protected)/talks/profile/activity')
              }}>
                <Text style={styles.menuButtonHeading}>Your Activity</Text>
                <Text style={styles.menuButtonText}>
                  View your engagement history.
                </Text>
              </MenuButton>
              <MenuButton dark>
                <Text
                  style={[styles.menuButtonHeading, { color: "white" }]}
                >
                  Go Pro
                </Text>
                <Text style={[styles.menuButtonText, { color: "#a6a6a6" }]}>
                  Unlock exclusive features and enhance profile visibility.
                </Text>
              </MenuButton>
            </View>
          </BottomSheet>
        </Portal>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: 164,
  },
  body: {
    marginHorizontal: 16,
  },
  profileImg: {
    width: 96,
    height: 96,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f5f5f5',
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
  countText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  countBox: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    gap: 6,
    borderRadius: 8,
  },
  countHeading: {
    fontSize: 11,
    color: '#737373',
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
  buttonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  menuContainer: {
    gap: 16,
  },
  menuButtonHeading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  menuButtonText: {
    fontSize: 12,
    color: "#a6a6a6",
    marginTop: 8,
  },
})
