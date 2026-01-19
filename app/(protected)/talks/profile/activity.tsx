import { View, Text } from 'react-native';
import DefaultButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import ListPageLayout from '@/components/general/ListPageLayout';
import React from 'react';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import { formatTime, formatDateShort } from '@/helpers/helpers';
import LineGraph from '@/components/home/LineGraph';



export default function Activity() {
  const { refreshing, handleEndReached, handleRefresh, combinedData, initialLoading, isLoading, isPaginating } = useFetchData({
    url: '/api/talks/activities/', allowSearch: false
  });
  const router = useRouter();

  const RenderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 16, backgroundColor: '#202020' }} />
          {
            index !== combinedData.length - 1 && (
              <View style={{ flex: 1, backgroundColor: '#f5f5f5', width: 1 }} />
            )
          }
        </View>
        <View style={{ paddingBottom: 48, marginTop: -4, gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Text style={{ fontSize: 13, lineHeight: 13 }}>You {item.action}{item.action === 'commented' && ' on '} Post</Text>
            <SmallTextButton
              onPress={() => router.push('/(freeRoutes)/talks/viewPost/' + item.related_post.id)}
              title={`#${String(item.related_post.id).padStart(12, "0")}`} style={{ textDecorationLine: "underline", fontSize: 13, lineHeight: 13 }}></SmallTextButton>
          </View>
          {
            item.action === 'commented' && (
              <Text style={{ fontSize: 13, color: "#737373", lineHeight: 13 }}>"{item.related_comment.content}"</Text>
            )
          }
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 11, color: "#a6a6a6", lineHeight: 11 }}>{formatTime(item.timestamp)}</Text>
            <Text style={{ fontSize: 11, color: "#a6a6a6", lineHeight: 11 }}>{formatDateShort(item.timestamp)}</Text>
          </View>
        </View>
      </View>
    )
  }
  return (
    <ListPageLayout headerTitle='Your Activity' flex1>
      {
        combinedData.length > 0 || isLoading || initialLoading || refreshing ? (
          <DataList
            data={combinedData}
            RenderItem={RenderItem}
            refreshing={refreshing}
            onEndReached={handleEndReached}
            onRefresh={handleRefresh}
            initialLoading={initialLoading}
            allowSearch={false}
            onSearchChange={() => { }}
            gap={0}
            isPaginating={isPaginating}
          />
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

    </ListPageLayout>
  )
}
