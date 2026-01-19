import { View, Image, Text } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { useAccountInfoStore } from '@/zustand/talks/accountInfoStore';
import { useGlobalSearchParams } from 'expo-router';
import { Post } from '@/app/(protected)/talks';

const titles = ['Votes', 'Commments', 'Tags', 'Votes', 'Comments', 'Tags'];
export default function DetailedInfo() {
  const { index, forSelf } = useGlobalSearchParams();
  const { username, fullName, commentedPosts, your_commentedPosts, votedPosts, your_votedPosts, commentMentionedPosts, your_commentMentionedPosts } = useAccountInfoStore();
  const data = [votedPosts, commentedPosts, commentMentionedPosts, your_votedPosts, your_commentedPosts, your_commentMentionedPosts];
  const noDataText = [
    `${fullName} hasn't voted on any of your posts.`,
    `${fullName} hasn't commented on any of your posts.`,
    `${fullName} hasn't tagged you in any posts.`,
    `You haven't voted on any of ${fullName}'s posts.`,
    `You haven't commented on any of ${fullName}'s posts.`,
    `You haven't tagged ${fullName} in any posts.`,
  ]

  return <PageLayout
    headerTitle={titles[Number(index)]}
    bottomPadding={false}
    flex1
  >
    {
      data[Number(index)]?.length > 0 ? (
        <View style={{ flex: 1, marginHorizontal: -16, backgroundColor: "#fff", marginTop: -24 }}>
          {data[Number(index)]?.map((post: any) => (
            <>
              <Post
                key={post.id}
                data={post}
                detailedPostUsername={forSelf ? null : username}
              />
              <View style={{ width: '100%', height: 8, backgroundColor: '#f5f5f5' }} />
            </>
          ))}
        </View>
      ) :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('@/assets/images/stars.png')} style={{ width: 112, height: 120, objectFit: 'contain' }} />
          <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 30, textAlign: 'center' }}>{noDataText[Number(index)]}</Text>
        </View>
    }
  </PageLayout>
}
