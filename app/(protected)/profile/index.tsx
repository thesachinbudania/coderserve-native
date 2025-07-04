import * as React from 'react';
import { Dimensions, Image, Pressable, ScrollView, View, Text, Share, StyleSheet } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import IconButton from '@/components/profile/IconButton';
import Tabs from '@/components/profile/home/Tabs';
import { useUserStore } from '@/zustand/stores';
import ImageLoader from '@/components/ImageLoader';
import { PortalHost } from '@gorhom/portal';
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabPressScrollToTop } from '@/helpers/hooks/useTabBarScrollToTop';


export function ProfileButton({ count, onPress = () => { }, title }: { count: number, onPress?: () => void, title: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.countBox, pressed && { backgroundColor: '#f4f4f4' }]}
      onPress={onPress}
    >
      <Text style={styles.countText}>{count}</Text>
      <Text style={styles.countHeading}>{title}</Text>
    </Pressable>

  )
}

export const Profile = ({ user }: { user: any }) => {
  const router = useRouter();
  return (
    <>
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
            />
            <ProfileButton
              count={user.followers || 0}
              title="Followers"
              onPress={() => router.push(`/(freeRoutes)/profile/followersList/${user.username}`)}
            />
            <ProfileButton
              count={user.following || 0}
              title="Following"
              onPress={() => router.push(`/(freeRoutes)/profile/followingList/${user.username}`)}
            />
          </View>
        </View>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
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

  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/profile/userProfile/' + encodeURIComponent(user.username || ''),
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: 'white', paddingTop: top }}
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
        <IconButton>
          <Image source={require('@/assets/images/profile/home/notifications.png')} style={styles.menuIcon} />
        </IconButton>
        <IconButton onPress={() => router.push('/profile/controlCenter')}>
          <Image source={require('@/assets/images/profile/home/menu.png')} style={styles.menuIcon} />
        </IconButton>
      </View>
      <Profile user={user} />
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
          />
        </View>
      </View>
      <View >
      </View>
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
