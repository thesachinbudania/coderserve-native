import { ActivityIndicator, Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import IconButton from '@/components/buttons/IconButton';
import { Profile } from '@/app/(protected)/profile/index';
import BlueButton from '@/components/buttons/BlueButton';
import { ResumeDetails } from '@/app/(protected)/jobs/resume';
import AnimatedTopTabs from '@/components/general/TopTabs';
import PostsTab from '@/components/profile/home/PostsTab';
import BottomName from '@/components/profile/home/BottomName';
import { useLocalSearchParams } from 'expo-router';
import protectedApi from '@/helpers/axios';
import React from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';

export default function UserProfile() {
  const { username } = useLocalSearchParams();
  const [userData, setUserData] = React.useState<any>(null);
  const [userResume, setUserResume] = React.useState<any>(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  console.log(requestSent, 'request sent')
  const router = useRouter();
  const { username: currentUsername } = useUserStore(state => state);
  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/profile/userProfile/' + encodeURIComponent(userData.username || ''),
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }
  React.useEffect(() => {
    if (currentUsername === username) {
      router.replace('/profile')
      return;
    }
    protectedApi.get(`/accounts/user_profile/${username}/`).then((res) => {
      setUserData(res.data);
      protectedApi.get(`/jobs/user_resume/${username}/`).then((resumeRes) => {
        setUserResume(resumeRes.data);
        protectedApi.get('/accounts/verify_following/' + username + '/').then((followRes) => {
          setIsFollowing(followRes.data.is_following)
          setRequestSent(followRes.data.request_sent);
          setIsLoading(false);
        })
      })
    })
  }, [])
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);
  const manageFollow = () => {
    setIsFollowLoading(true);
    protectedApi.put(`/accounts/manage_follow/${username}/`).then(() => {
      protectedApi.get('/accounts/verify_following/' + username + '/').then((followRes) => {
        setIsFollowing(followRes.data.is_following)
        setRequestSent(followRes.data.request_sent);
        setIsFollowLoading(false);
      })
    }).catch(err => console.log(err.response.data, 'erroring here'))
  }
  return (
    <>
      {isLoading && (
        <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color='#202020' />
        </View>
      )}
      {
        !isLoading && (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{ flex: 1, backgroundColor: 'white' }}
          >
            <View style={styles.header}>
              <IconButton
                onPress={() => router.back()}
              >
                <Image
                  source={require('@/assets/images/Back.png')}
                  style={{ width: 24, height: 24 }}
                />
              </IconButton>
              <IconButton>
                <Image
                  source={require('@/assets/images/profile/home/menu.png')}
                  style={{ width: 24, height: 24 }}
                />
              </IconButton>
            </View>
            <View style={{ marginHorizontal: -16 }}>
              <Profile user={userData} />
            </View>
            <View style={styles.buttonContainer}>
              <View style={{ flex: 1 }}>
                <BlueButton
                  title={isFollowing ? 'Unfollow' : requestSent ? 'Requested' : 'Follow'}
                  onPress={manageFollow}
                  loading={isFollowLoading}
                />
              </View>
              <IconButton
                square
                onPress={shareProfileAsync}
              >
                <Image source={require('@/assets/images/jobs/share.png')} style={{ width: 24, height: 24, objectFit: 'contain' }} />
              </IconButton>
            </View>
            <View style={{ marginHorizontal: -16, marginTop: 32 }}>
              <AnimatedTopTabs
                tabs={[
                  { name: 'Profile', content: <View style={{ marginTop: -48 }}><ResumeDetails jobsState={userResume} userState={userData} /></View> },
                  { name: 'Posts', content: <PostsTab /> },
                ]}
              />
            </View>
            <BottomName />
          </ScrollView>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    top: 0,
    width: '100%',
    zIndex: 1,
    paddingVertical: 8,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    marginTop: 32,
    flexDirection: 'row',
    gap: 16,
  }
})
