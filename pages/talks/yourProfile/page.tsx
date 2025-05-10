import { Header } from '../../jobs/resume/page';
import React from 'react';
import { Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import BackgroundImageLoader from '../../profile/BackgroundImageLoader';
import BackgroundMapping from '../../profile/assets/Background/backgroundMapping';
import BlueButton from '../../../components/buttons/BlueButton';
import ImageLoader from '../../../components/ImageLoader';
import { ProfileButton } from '../../profile/home/page';
import Tabs from '../../profile/home/Tabs';
import { PortalHost } from '@gorhom/portal';


export default function YourProfile() {
  const menuRef = React.useRef(null);
  const user = useSelector((state: RootState) => state.user);


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
      <Header
        title='Your Profile'
        menuRef={menuRef}
      />
      <ScrollView contentContainerStyle={{ paddingTop: 57 }}>
        {
          user.backgroundType === 'default' ?
            // @ts-ignore
            <Image source={BackgroundMapping[user.backgroundCode]} style={styles.bgImage} /> :
            user.backgroundImage &&
            <BackgroundImageLoader size={164} uri={user.backgroundImage} />

        }
        <View style={styles.body}>
          <View style={styles.profileRow}>
            {user.profilePicture &&
              <ImageLoader
                size={96}
                uri={user.profilePicture}
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
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
          <View style={styles.buttonContainer}>
            <BlueButton
              title="Share Profile"
              onPress={shareProfileAsync}
            />
          </View>
        </View>
        <View>
          <Tabs
            hostName='tabsContentTalks'
          />
        </View>
        <PortalHost name='tabsContentTalks' />
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
