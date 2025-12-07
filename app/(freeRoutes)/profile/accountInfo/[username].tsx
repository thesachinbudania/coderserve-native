import { ActivityIndicator, Pressable, Image, Text, View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import PageLayout from '@/components/general/PageLayout';
import protectedApi from '@/helpers/axios';
import React from 'react';
import ImageLoader from '@/components/ImageLoader';
import { apiUrl } from '@/constants/env';
import AnimatedTopTabs from '@/components/general/TopTabs';
import { useRouter } from 'expo-router';
import { useAccountInfoStore } from '@/zustand/talks/accountInfoStore';
import { toWords } from 'number-to-words';
import { useUserStore } from '@/zustand/stores';

function Content({ content, pressable = true, onPress = () => { } }: { content?: string, pressable?: boolean, onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [{ padding: 16, borderWidth: 1, borderColor: "#f5f5f5", borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between' }, pressed && pressable && { backgroundColor: '#f5f5f5' }]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 11, color: "#737373" }}>{content}</Text>
      {
        pressable && (
          <Image source={require("@/assets/images/arrows/right.png")} style={{ width: 12, height: 12, tintColor: "#737373" }} />
        )
      }
    </Pressable>
  )
}

function numberRepresentation(num: number) {
  const text = toWords(num);
  switch (num) {
    case 1:
      return 'once';
    case 2:
      return 'twice';
    case 3:
      return 'thrice';
    default:
      return text + ' times';
  }
}

function AccountInfo({ fullName, joined, isFollowing, votedPostsCount, comments_count, comments_mentions, username_changes_count }: { fullName?: string, joined?: string, isFollowing?: boolean, votedPostsCount?: number, comments_count?: number, comments_mentions?: number, username_changes_count?: number }) {
  const router = useRouter();
  return (
    <View style={{ gap: 16 }}>
      <Content
        content={`${fullName} joined in ${joined}.`}
        pressable={false}
      />
      <Content
        content={isFollowing ? `${fullName} is following you.` : `${fullName} isn't following you.`}
        pressable={false}
      />
      <Content
        content={votedPostsCount ? `${fullName} has voted on ${toWords(votedPostsCount)} of your ${votedPostsCount > 1 ? 'posts' : 'post'}.` : `${fullName} hasn't voted on any of your posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/0')}
      />
      <Content
        content={comments_count ? `${fullName} has commented on ${toWords(comments_count)} of your ${comments_count > 1 ? 'posts' : 'post'}.` : `${fullName} hasn't commented on any of your posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/1')}
      />
      <Content
        content={comments_mentions ? `${fullName} has tagged you in ${toWords(comments_mentions)} ${comments_mentions > 1 ? 'posts' : 'post'}.` : `${fullName} hasn't tagged you in any posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/2')}
      />
      <Content
        content={username_changes_count ? `${fullName} has changed their username ${numberRepresentation(username_changes_count)} before.` : `${fullName} hasn't changed their username before.`}
        onPress={() => router.push('/(freeRoutes)/profile/formerUsernames/0')}
      />
    </View>
  )
}


function SelfAccountInfo({ fullName, joined, isFollowing, votedPostsCount, comments_count, comments_mentions, username_changes_count }: { fullName?: string, joined?: string, isFollowing?: boolean, votedPostsCount?: number, comments_count?: number, comments_mentions?: number, username_changes_count?: number }) {
  const router = useRouter();
  return (
    <View style={{ gap: 16 }}>
      <Content content={`You joined in ${joined}.`} pressable={false} />
      <Content content={isFollowing ? `You are following ${fullName}` : `You aren't following ${fullName}`} pressable={false} />
      <Content
        content={votedPostsCount ? `You have voted on ${toWords(votedPostsCount)} of ${fullName}'s ${votedPostsCount > 1 ? 'posts' : 'post'}.` : `You haven't voted on any of ${fullName}'s posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/3')}
      />
      <Content
        content={comments_count ? `You have commented on ${toWords(comments_count)} of ${fullName}'s ${comments_count > 1 ? 'posts' : 'post'}.` : `You haven't commented on any of ${fullName}'s posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/4')}
      />
      <Content
        content={comments_mentions ? `You have tagged ${fullName} in ${toWords(comments_mentions)} ${comments_mentions > 1 ? 'posts' : 'post'}.` : `You haven't tagged ${fullName} in any posts.`}
        onPress={() => router.push('/(freeRoutes)/profile/detailedAccountInfo/5')}
      />
      <Content
        content={username_changes_count ? `You have changed your username ${numberRepresentation(username_changes_count)} before.` : `You haven't changed your username before.`}
        onPress={() => router.push('/(freeRoutes)/profile/formerUsernames/1')}
      />
    </View>
  )
}



export default function UserProfile() {
  const { username } = useGlobalSearchParams();
  const [userData, setUserData] = React.useState<any>(null);
  const { setAccountInfo } = useAccountInfoStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [tabIndex, setTabIndex] = React.useState(0);
  const { first_name, last_name, profile_image } = useUserStore();

  React.useEffect(() => {
    protectedApi.get(`/accounts/account_info/${username}/`).then((res) => {
      setUserData(res.data);
      setAccountInfo({
        commentedPosts: res.data.commented_posts,
        your_commentedPosts: res.data.your_commented_posts,
        votedPosts: res.data.voted_posts,
        your_votedPosts: res.data.your_voted_posts,
        commentMentionedPosts: res.data.comment_mentioned_posts,
        your_commentMentionedPosts: res.data.your_comment_mentioned_posts,
        usernameChanges: res.data.username_changes,
        your_usernameChanges: res.data.your_username_changes,
        fullName: `${res.data.first_name} ${res.data.last_name}`
      })
      setIsLoading(false);
    })
  }, [])


  return (
    <PageLayout
      headerTitle='Account Info'
    >
      {
        isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <View style={{ alignItems: 'center' }}>
              <ImageLoader size={90} uri={tabIndex === 0 ? apiUrl + userData?.profile_image : profile_image ? profile_image : apiUrl + 'media/images/default.png'} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 12 }}>{tabIndex === 0 ? userData?.first_name : first_name} {tabIndex === 0 ? userData?.last_name : last_name}</Text>
            </View>
            <View style={{ marginTop: 48, marginHorizontal: -16 }}>
              <AnimatedTopTabs
                setIndex={setTabIndex}
                tabs={[
                  {
                    name: 'Account User', content: <AccountInfo
                      fullName={`${userData?.first_name} ${userData?.last_name}`}
                      joined={userData?.account_age}
                      isFollowing={userData?.is_following}
                      votedPostsCount={userData?.voted_posts_count}
                      comments_count={userData?.comments_count}
                      comments_mentions={userData?.comment_mentioned_posts.length}
                      username_changes_count={userData?.username_changes.length}
                    />
                  },
                  {
                    name: 'You', content: <SelfAccountInfo
                      fullName={`${userData?.first_name} ${userData?.last_name}`}
                      joined={userData?.current_user_account_age}
                      isFollowing={userData?.you_following}
                      votedPostsCount={userData?.your_voted_posts_count}
                      comments_count={userData?.your_comments_count}
                      comments_mentions={userData?.your_comment_mentioned_posts.length}
                      username_changes_count={userData?.your_username_changes.length}
                    />
                  },
                ]}
              />
            </View>
          </>
        )
      }
    </PageLayout>
  )
}
