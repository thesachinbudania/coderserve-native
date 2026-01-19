import * as React from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, View, Text, Share, StyleSheet } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import IconButton from '@/components/buttons/IconButton';
import Tabs from '@/components/profile/home/Tabs';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabPressScrollToTop } from '@/helpers/hooks/useTabBarScrollToTop';
import syncUser from '@/helpers/general/syncUser';
import { useFocusEffect } from 'expo-router';
import { useNotificationsUnreadStore } from '@/zustand/stores';
import { apiUrl } from '@/constants/env';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import BottomDrawer from '@/components/BottomDrawer';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import protectedApi from '@/helpers/axios';
import errorHandler from '@/helpers/general/errorHandler';


export function ProfileButton({ count, onPress = () => { }, title, disabled = false }: { count: number, disabled?: boolean, onPress?: () => void, title: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.countBox, pressed && !disabled && { backgroundColor: '#f4f4f4' }]}
      onPress={disabled ? () => { } : onPress}
    >
      <Text style={styles.countText}>{count}</Text>
      <Text style={styles.countHeading}>{title}</Text>
    </Pressable>

  )
}

export const Profile = ({ user, onPostPress, fetchData = () => { } }: { user: any, onPostPress?: () => void, fetchData?: () => void }) => {
  const router = useRouter();
  const followRequestId = user.pending_follow_request;
  const followMenuRef = React.useRef<any>(null);
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = React.useState(false);
  const handleAccept = async () => {
    setIsFollowLoading(true);
    try {
      await protectedApi.post(`/accounts/accept_follow_request/${followRequestId}/`);
      fetchData();
    } catch (error: any) {
      errorHandler(error);
      console.error('Error accepting follow request:', error);
    } finally {
      followMenuRef?.current.close();
      setIsFollowLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclineLoading(true);
    try {
      await protectedApi.post(`/accounts/decline_follow_request/${followRequestId}/`);
      fetchData();
    } catch (error: any) {
      errorHandler(error);
      console.error('Error declining follow request:', error);
    } finally {
      followMenuRef?.current.close();
      setIsDeclineLoading(false);
    }
  };

  return (
    <>
      <BottomDrawer
        sheetRef={followMenuRef}
        draggableIconHeight={0}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 14, lineHeight: 15 }}>Follow Request</Text>
          <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 30 }}>George would like to follow your journey and see your updates. Do you want to accept or decline this request?</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title='Decline'
                onPress={() => handleDecline()}
                loading={isDeclineLoading}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title='Accept'
                onPress={() => {
                  handleAccept();
                }}
                loading={isFollowLoading}
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
      <View style={{ marginTop: 6 }}>
        {
          followRequestId && <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#202020" }}>
            <Text style={{ color: "white", fontSize: 13, }}>{user.first_name} sent you a follow request. Would you like to accept or decline?{' '}
              <SmallTextButton
                style={{ fontSize: 13, color: 'white', textDecorationLine: 'underline', lineHeight: 13, marginBottom: -3 }}
                title='Click here'
                onPressColor='#38b6ff'
                onPress={() => followMenuRef?.current.open()}
              ></SmallTextButton></Text>
          </View>
        }
        {
          user.background_type === 'default' ?
            user.background_pattern_code == 0 ? (
              <View style={[styles.bgImage, { backgroundColor: '#202020', justifyContent: 'center', alignItems: 'center' }]} >
                <Text style={{ fontSize: 11, color: "#545454" }}>Unavailable</Text>
              </View>
            ) :
              // @ts-ignore
              <Image source={BackgroundMapping[user.background_pattern_code]} style={styles.bgImage} /> :
            user.background_image &&
            <BackgroundImageLoader size={164} uri={user.background_image} />

        }
      </View>
      <View style={styles.body}>
        <View style={styles.profileRow}>
          {user.profile_image &&
            <ImageLoader
              size={90}
              uri={user.background_pattern_code == 0 ? apiUrl + '/media/profile_images/default_profile_image.png' : user.profile_image}
              viewable
            />}
          <View style={styles.countRow}>
            <ProfileButton
              count={user.posts || 0}
              title="Posts"
              onPress={onPostPress}
              disabled={user.background_pattern_code === 0}
            />
            <ProfileButton
              count={user.followers || 0}
              title="Followers"
              onPress={() => router.push(`/(freeRoutes)/profile/followersList/${user.username}`)}
              disabled={user.background_pattern_code === 0}
            />
            <ProfileButton
              count={user.following || 0}
              title="Following"
              onPress={() => router.push(`/(freeRoutes)/profile/followingList/${user.username}`)}
              disabled={user.background_pattern_code === 0}
            />
          </View>
        </View>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        {user.background_pattern_code == 0 ? null : <>
          <Text style={{ fontSize: 13, color: "#004aad", fontWeight: 'bold', marginTop: 8, lineHeight: 13 }}>Ranked #59</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {
            user.can_view_profile &&
            <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
          }
        </>}
      </View>
    </>
  )
}


const width = Dimensions.get('window').width;

export default function ProfileHome() {
  const user = useUserStore(state => state);
  const isScrolling = React.useState(false);
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const scrollRef = React.useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  useTabPressScrollToTop(scrollRef, 'profile')
  const [index, setIndex] = React.useState(0);

  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      syncUser().then().catch(() => console.log('error syncing user')).finally(() => setLoading(false));
    }, []))

  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/profile/userProfile/' + encodeURIComponent(user.username || ''),
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }

  const { account, journey, job_alerts, follow_requests, upvotes, downvotes, comments, replies, tags, support } = useNotificationsUnreadStore();

  return (
    <ScrollView
      contentContainerStyle={[{ backgroundColor: 'white', paddingTop: top }, loading && { flex: 1 }]}
      nestedScrollEnabled
      onScroll={(e) => {
        if (e.nativeEvent.contentOffset.y > 0) {
          isScrolling[1](true);
        } else {
          isScrolling[1](false);
        }
      }}
      ref={scrollRef}
    >

      <View style={styles.header}>
        <IconButton
          onPress={() => router.push('/(freeRoutes)/notifications')}
          unread={account + journey + job_alerts + follow_requests + upvotes + downvotes + comments + replies + tags + support > 0}
        >
          <Image
            source={require("@/assets/images/profile/home/notifications.png")}
            style={{ width: 24, height: 24 }}
          />
        </IconButton>
        <IconButton onPress={() => router.push('/profile/controlCenter')}>
          <Image source={require('@/assets/images/profile/home/menu.png')} style={styles.menuIcon} />
        </IconButton>
      </View>
      {
        loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <ActivityIndicator size="large" color={'#202020'} />
          </View>
        ) : <>
          <Profile user={user} onPostPress={() => setIndex(1)} />
          <View style={styles.body}>
            <View style={styles.buttonContainer}>
              <View style={{ width: (width - 32) * 0.5 - 8 }}>
                <BlueButton
                  title="Edit Profile"
                  onPress={() => router.push('/profile/edit')}
                />
              </View>
              <View style={{ width: (width - 32) * 0.5 - 8 }}>
                <BlueButton
                  title="Share Profile"
                  onPress={shareProfileAsync}
                />
              </View>
            </View>
            <View style={{ marginHorizontal: -16 }}>
              <Tabs
                setScrollEnabled={setScrollEnabled}
                profileEditable={true}
                index={index}
                setIndex={setIndex}
              />
            </View>
          </View>
          <View >
          </View>
        </>
      }

    </ScrollView>
  )
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    top: 0,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
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
    marginTop: -24
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
    lineHeight: 21
  },
  username: {
    marginTop: 8,
    fontSize: 13,
    color: '#737373',
    lineHeight: 13,
  },
  userLocation: {
    marginTop: 8,
    fontSize: 13,
    color: '#737373',
    lineHeight: 13,
  },
  buttonContainer: {
    marginTop: 32,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  headerContainer: {
    shadowColor: '#fff',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    paddingTop: 16,
  },
  topBarIndicator: {
    height: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'black',
  },
  indicatorContainer: {
    justifyContent: 'center', // Ensure the indicator is centered
    marginHorizontal: 16,
  },
  topBarLabel: {
    fontWeight: 'bold',
    paddingTop: 8,
    fontSize: 13,
  },

});
