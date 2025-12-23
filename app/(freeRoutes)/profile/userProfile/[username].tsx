import { ActivityIndicator, Dimensions, Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import IconButton from '@/components/buttons/IconButton';
import { Profile } from '@/app/(protected)/profile/index';
import BlueButton from '@/components/buttons/BlueButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResumeDetails } from '@/app/(protected)/jobs/resume';
import AnimatedTopTabs from '@/components/general/TopTabs';
import PostsTab from '@/components/profile/home/PostsTab';
import BottomName from '@/components/profile/home/BottomName';
import { useLocalSearchParams } from 'expo-router';
import protectedApi from '@/helpers/axios';
import React from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import BottomDrawer from '@/components/BottomDrawer';
import { MenuButton } from '@/app/(protected)/jobs';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import UnorderedList from '@/components/general/UnorderedList';
import { LearningStreak } from '@/components/talks/home/ProfileContent';
import { Header } from '@/app/(protected)/jobs/resume';
import { Portal } from 'react-native-paper';

const { height } = Dimensions.get('window');

export default function UserProfile() {
  // states
  const { username } = useLocalSearchParams();
  const [userData, setUserData] = React.useState<any>(null);
  const [userResume, setUserResume] = React.useState<any>(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [muted, setIsMuted] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [isFollower, setIsFollower] = React.useState(false);
  const router = useRouter();
  const { username: currentUsername } = useUserStore(state => state);
  const [blocked, setIsBlocked] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [canView, setCanView] = React.useState(false);


  // function to share profile
  async function shareProfileAsync() {
    try {
      await Share.share({
        message: 'https://coderserve.com/profile/userProfile/' + encodeURIComponent(userData.username || ''),
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }

  // function to fetch user data and resume data
  function fetchData() {
    setIsLoading(true);
    protectedApi.get(`/accounts/user_profile/${username}/`).then((res) => {
      setUserData(res.data);
      setCanView(res.data.can_view_profile);
      protectedApi.get(`/jobs/user_resume/${username}/`).then((resumeRes) => {
        setUserResume(resumeRes.data);
        protectedApi.get('/accounts/verify_following/' + username + '/').then((followRes) => {
          setIsFollowing(followRes.data.is_following)
          setRequestSent(followRes.data.request_sent);
          setIsMuted(res.data.is_muted);
          setIsBlocked(res.data.is_blocked);
          setIsFollower(res.data.is_follower);
          setIsLoading(false);
        })
      })
    })
  }

  React.useEffect(() => {
    if (currentUsername === username) {
      router.replace('/profile')
      return;
    }
    fetchData();
  }, [])


  // loading states for page and follow button
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);


  // function to follow/unfollow user
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


  // function to mute/unmute user
  const manageMute = () => {
    protectedApi.put(`/accounts/manage_mute/${username}/`).then((res) => {
      setIsMuted(res.data.is_muted);
    }).catch(err => console.log(err.response.data, 'erroring here'))
  }

  // function to block/unblock user
  const manageBlock = () => {
    protectedApi.put(`/accounts/block_user/${username}/`).then((res) => {
      fetchData();
    }).catch(err => console.log(err.response.data, 'erroring here'))
  }

  // function to remove follower
  const removeFollower = () => {
    protectedApi.put(`/accounts/remove_follower/${username}/`).then(() => {
      fetchData();
    }).catch(err => console.log(err.response.data, 'erroring here'))
  }

  // refs for bottom sheets
  const menuRef = React.useRef<any>(null);
  const followMenuRef = React.useRef<any>(null);
  const muteRef = React.useRef<any>(null);
  const blockDrawerRef = React.useRef<any>(null);
  const unblockRef = React.useRef<any>(null);
  const unfollowRef = React.useRef<any>(null);
  const removeFollowerRef = React.useRef<any>(null);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 57 }}>
      {isLoading && (
        <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={'#202020'} />
        </View>
      )}
      {
        !isLoading && (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{ flex: 1, backgroundColor: 'white' }}
          >
            <Portal>
              <BottomDrawer
                sheetRef={blockDrawerRef}
                draggableIconHeight={0}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 8 }}>What Happens When You Block Someone?</Text>
                  <Text style={{ fontSize: 13, color: "#737373", textAlign: 'left', marginTop: 8, marginBottom: 16 }}>Blocking gives you full control over your experience. When you block a user:</Text>
                  <UnorderedList
                    items={["You won't see their profile, posts, followers, or following list - and they can't see yours.", "If you were following each other, both follow connections are removed."]}
                    gap={16}
                  />
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>No Interactions Allowed</Text>
                  <UnorderedList items={[
                    "Their posts will no longer appear in your feed or search, and yours will be hidden from them.",
                    'Messaging is disabled, and any existing chat will be closed on your side with the message: "You blocked this user."',
                    "The blocked user won't be notified. However, they can still send up to 5 final replies to your last message - but you won't see them unless you unblock.",
                    'After those 5 replies, the conversation will be permanently locked for them with the message: "Chat Closed". Your profile picture will be hidden, and your name will appear as "Unknown User" in the chat.'
                  ]}
                    gap={16}
                  />
                  <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title="Cancel"
                        onPress={() => {
                          blockDrawerRef.current?.close();
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title="Block"
                        onPress={manageBlock}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={unfollowRef}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Unfollow this user?</Text>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>You'll stop seeing their posts in your feed and messaging will be disabled. You can follow them again anytime.</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title='Cancel'
                        onPress={() => unfollowRef?.current.close()}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title={'Unfollow'}
                        onPress={() => {
                          unfollowRef?.current.close();
                          manageFollow();
                        }}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={unblockRef}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Do you want to unblock this user?</Text>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>Once unblocked, this user will be able to view your profile and interact with yours posts again.</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title='Cancel'
                        onPress={() => unblockRef?.current.close()}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title={'Unblock'}
                        onPress={() => {
                          unblockRef?.current.close();
                          manageBlock();
                        }}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={muteRef}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>{muted ? 'Unmute' : 'Mute'} this user?</Text>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>{muted ? 'Their posts will start appearing in your feed again. You can mute them anytime from your settings.' : "You won't see any more posts from this user in your feed. You can unmute them anytime from your settings."}</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title='Cancel'
                        onPress={() => muteRef?.current.close()}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title={muted ? 'Unmute' : 'Mute'}
                        onPress={() => {
                          muteRef?.current.close();
                          manageMute();
                        }}
                        loading={isFollowLoading}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={removeFollowerRef}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Remove this follower?</Text>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>If you remove this user, they'll no longer follow you or see your updates in their feed. This action won't notify them.</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title='Cancel'
                        onPress={() => removeFollowerRef?.current.close()}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title='Remove'
                        onPress={() => {
                          removeFollowerRef?.current.close();
                          removeFollower();
                        }}
                        loading={isFollowLoading}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={followMenuRef}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 16 }}>Remove Follow Request?</Text>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: "#737373", marginBottom: 24 }}>Are you sure you want to cancel this follow request? The user won't be notified.</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 / 2 }}>
                      <GreyBgButton
                        title='Cancel'
                        onPress={() => followMenuRef?.current.close()}
                      />
                    </View>
                    <View style={{ flex: 1 / 2 }}>
                      <BlueButton
                        title='Remove'
                        onPress={() => {
                          followMenuRef?.current.close();
                          manageFollow();
                        }}
                        loading={isFollowLoading}
                      />
                    </View>
                  </View>
                </View>
              </BottomDrawer>
              <BottomDrawer
                sheetRef={menuRef}
                draggableIconHeight={0}
              >
                <View style={[styles.menuContainer, { paddingHorizontal: 16 }]}>
                  {
                    !blocked && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          router.push('/(freeRoutes)/profile/accountInfo/' + username);
                        }}
                      >
                        <Text style={styles.menuButtonHeading}>Account Info</Text>
                        <Text style={styles.menuButtonText}>
                          Access key details and insights about user account.
                        </Text>
                      </MenuButton>
                    )
                  }
                  {
                    isFollower && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          setTimeout(() => {
                            removeFollowerRef?.current.open();
                          }, 300)
                        }}
                      >
                        <Text style={styles.menuButtonHeading}>Remove Follower</Text>
                        <Text style={styles.menuButtonText}>
                          Remove this user from your followers list.
                        </Text>
                      </MenuButton>
                    )
                  }
                  {
                    requestSent && !blocked && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          setTimeout(() => {
                            followMenuRef?.current.open();
                          }, 300)
                        }}
                      >
                        <Text style={styles.menuButtonHeading}>Remove Request</Text>
                        <Text style={styles.menuButtonText}>
                          Cancel the follow request sent to this user.
                        </Text>
                      </MenuButton>
                    )
                  }
                  {
                    isFollowing && !blocked && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          setTimeout(() => {
                            unfollowRef?.current.open();
                          }, 300)
                        }}
                      >
                        <Text style={styles.menuButtonHeading}>Unfollow</Text>
                        <Text style={styles.menuButtonText}>
                          Remove this user from your following list.
                        </Text>
                      </MenuButton>
                    )
                  }
                  {
                    !blocked && (isFollowing || requestSent) && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          setTimeout(() => {
                            shareProfileAsync();
                          }, 300)
                        }}
                      >
                        <Text style={styles.menuButtonHeading}>Share Profile</Text>
                        <Text style={styles.menuButtonText}>
                          Easily share this profile with other using a direct link.
                        </Text>
                      </MenuButton>
                    )
                  }
                  {
                    !blocked && (
                      <MenuButton
                        onPress={() => {
                          menuRef?.current.close();
                          setTimeout(() => {
                            muteRef?.current.open();
                          }, 300)
                        }}
                      >
                        <Text
                          style={[styles.menuButtonHeading]}
                        >
                          {muted ? 'Unmute' : 'Mute'}
                        </Text>
                        <Text style={[styles.menuButtonText]}>
                          {muted ? 'See posts from this user again in your feed.' : 'Hide posts from this user in your feed.'}
                        </Text>
                      </MenuButton>
                    )
                  }
                  <MenuButton
                    onPress={() => {
                      if (!blocked) {
                        menuRef?.current.close();
                        setTimeout(() => {
                          blockDrawerRef?.current.open();
                        }, 300)
                      }
                      else {
                        menuRef?.current.close();
                        setTimeout(() => {
                          unblockRef?.current?.open();
                        }, 300)
                      }
                    }}
                  >
                    <Text
                      style={[styles.menuButtonHeading]}
                    >
                      {blocked ? 'Unblock' : 'Block'}
                    </Text>
                    <Text style={[styles.menuButtonText]}>
                      {blocked ? 'Allow this user to interact with you again.' : 'Restrict this user from interacting with you.'}
                    </Text>
                  </MenuButton>
                  <MenuButton >
                    <Text
                      style={[styles.menuButtonHeading]}
                    >
                      Report
                    </Text>
                    <Text style={[styles.menuButtonText]}>
                      Flag this profile to our support team for review.
                    </Text>
                  </MenuButton>
                </View>
              </BottomDrawer>
            </Portal>
            <Header
              menuRef={menuRef}
            />
            <View style={{ marginHorizontal: -16 }}>
              <Profile user={userData} onPostPress={() => setIndex(1)} />
            </View>
            <View style={styles.buttonContainer}>
              <View style={{ flex: 1 }}>
                {
                  userData?.is_blocked || (!requestSent && !isFollowing) ? (
                    <BlueButton
                      title={userData.is_blocked ? 'Unblock' : 'Follow'}
                      onPress={userData.is_blocked ? () => { unblockRef?.current.open() } : manageFollow}
                      loading={isFollowLoading}
                    />
                  ) : isFollowing ? <BlueButton
                    title="Message"
                    onPress={() => {
                      setIsFollowLoading(true);
                      protectedApi.post('/home/conversations/', { 'participants': [userData.id] }).then((res) => {
                        setIsFollowLoading(false);
                        router.push('/(freeRoutes)/messages/chat/' + res.data.id);
                      }).catch((err) => {
                        console.error(err.response.data);
                        setIsFollowLoading(false);
                      });
                    }}
                    loading={isFollowLoading}
                  /> : <GreyBgButton
                    title={"Requested"}
                    onPress={requestSent ? () => { followMenuRef.current?.open() } : manageFollow}
                    loading={isFollowLoading}
                  />
                }
              </View>
              {
                userData?.background_pattern_code != 0 && !requestSent && !isFollowing && (
                  <IconButton
                    square
                    onPress={shareProfileAsync}
                  >
                    <Image source={require('@/assets/images/jobs/share.png')} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  </IconButton>
                )
              }
            </View>
            {
              userData?.is_blocked ? (
                <View style={{ flex: 1, height: height - 431, alignItems: 'center' }}>
                  <View style={{ borderWidth: 2, borderColor: "black", borderRadius: 64, marginTop: 128 }}>
                    <Image source={require('@/assets/images/talks/lock.png')} style={{ width: 32, height: 32, objectFit: 'contain', margin: 24 }} />
                  </View>
                  <Text style={{ fontSize: 19, fontWeight: 'bold', marginTop: 16 }}>You've blocked this account</Text>
                  <Text style={{ fontSize: 13, color: "#a6a6a6", marginTop: 4 }}>Unblock to view their profile and interact again.</Text>
                </View>
              ) : userData.background_pattern_code == 0 ? null : (
                canView ?
                  <>
                    <View style={{ marginHorizontal: -16, marginTop: 32 }}>
                      <AnimatedTopTabs
                        tabs={[
                          {
                            name: 'Profile', content: <View style={{ marginTop: -48 }}><ResumeDetails
                              jobsState={userResume}
                              userState={userData}
                              showLess
                            />
                              <LearningStreak />
                              <BottomName />
                            </View>
                          },
                          {
                            name: 'Posts', content:
                              <>
                                <PostsTab editable={false} username={
                                  userData.username
                                } />
                              </>
                          },
                        ]}
                        index={index}
                        setIndex={setIndex}
                      />
                    </View>
                  </> :
                  <PostsTab canView={canView} editable={false} username={userData.username} />
              )
            }

          </ScrollView>
        )
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  header: {
    backgroundColor: 'white',
    top: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    paddingVertical: 8,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    marginTop: 32,
    flexDirection: 'row',
    gap: 16,
  }
})
