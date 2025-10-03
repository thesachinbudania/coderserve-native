import { View, Text } from 'react-native';
import DefaultButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import PageLayout from '@/components/general/PageLayout';
import React from 'react';
import useFetchData from '@/helpers/general/handleFetchedData';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import { formatTime, formatDate } from '@/helpers/helpers';

export default function Activity() {
  const router = useRouter();
  const { RenderData, combinedData, initialLoading, isLoading } = useFetchData({
    url: '/api/talks/activities/', RenderItem: ({ item, index }: { item: any, index: number }) => {
      console.log(item);
      return (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 16, backgroundColor: '#202020' }} />
            {
              index !== combinedData.length - 1 && (
                <View style={{ flex: 1, backgroundColor: '#f5f5f5', width: 3 }} />
              )
            }
          </View>
          <View style={{ paddingBottom: 48, marginTop: -4, gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Text style={{ fontSize: 13 }}>You {item.action}{item.action === 'commented' && ' on '} Post</Text>
              <SmallTextButton title={`#${String(item.related_post.id).padStart(12, "0")}`} style={{ textDecorationLine: "underline", fontSize: 13 }}></SmallTextButton>
            </View>
            {
              item.action === 'commented' && (
                <Text style={{ fontSize: 13, color: "#737373" }}>"{item.related_comment.content}"</Text>
              )
            }
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ fontSize: 11, color: "#a6a6a6" }}>{formatTime(item.timestamp)}</Text>
              <Text style={{ fontSize: 11, color: "#a6a6a6" }}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
        </View>
      )
    }, gap: 0,
    paddingTop: 24
  });
  return (
    <PageLayout headerTitle='Your Activity' >
      {
        combinedData.length > 0 || isLoading || initialLoading ? (
          <RenderData />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>No Activity Yet</Text>
            <Text style={{ fontSize: 13, color: '#737373', marginTop: 4, textAlign: 'center' }}>Once you start to explore posts, leave comments, and share your thoughts, your interactions will be captured here - building a timeline of your journey.</Text>
            <View style={{ width: '100%', marginTop: 32 }}>
              <DefaultButton
                title='Okay'
                onPress={() => router.back()}
              />
            </View>
          </View>
        )
      }

    </PageLayout>
  )
}
