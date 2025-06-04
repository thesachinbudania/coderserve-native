import { Header } from '@/app/(protected)/jobs/resume/index';
import React from 'react';
import { Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import BlueButton from '@/components/buttons/BlueButton';
import ImageLoader from '@/components/ImageLoader';
import ProfileButton from '@/components/general/ProfileButton';
import Tabs from '@/components/talks/home/Tabs';
import { PortalHost } from '@gorhom/portal';
import { useUserStore } from '@/zustand/stores';
import { useIsFocused } from '@react-navigation/native';
import Menu, { MenuButton } from '@/components/jobs/Menu';
import { useRouter } from 'expo-router';

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
    <>
      {
        focused && <Header
          title='Your Profile'
          menuRef={menuRef}
        />
      }
      <ScrollView contentContainerStyle={{ paddingTop: 57, backgroundColor: 'white' }}>
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
                count={0}
                title="Followers"
              />
              <ProfileButton
                count={0}
                title="Following"
              />
            </View>
          </View>
          <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
          <View style={styles.buttonContainer}>
            <BlueButton
              title="Share Profile"
              onPress={shareProfileAsync}
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <Tabs
            hostName='tabsContentTalks'
          />
        </View>
        <PortalHost name='tabsContentTalks' />
        <Menu
          menuRef={menuRef}>
          <MenuButton
            heading='Update Profile'
            text='Add/remove profile details.'
            onPress={() => {
              menuRef?.current.close();
              router.push('/(protected)/talks/profile/update')
            }}
          />
          <MenuButton
            heading='Profile Visitors'
            text='Find users with similar backgrounds.'
            onPress={() => { }}
          />
          <MenuButton
            heading='Your Activity'
            text='View your engagement history.'
            onPress={() => {
              menuRef?.current.close();
              router.push('/(protected)/talks/profile/activity')
            }}
          />
          <MenuButton
            heading='Go Pro'
            text='Unlock exclusive features and enhance profile visibility.'
            dark
            onPress={() => { }}
          />
        </Menu>
      </ScrollView>
    </>
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
})
