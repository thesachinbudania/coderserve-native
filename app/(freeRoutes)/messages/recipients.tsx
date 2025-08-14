import { ActivityIndicator, Image, Text, View, FlatList } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import protectedApi from '@/helpers/axios';
import React from 'react';
import useFetchData from '@/helpers/general/handleFetchedData';

export default function Recipients() {
  React.useEffect(() => {
    protectedApi.get('/home/mutualfollowers_list/').then((res) => {
      console.log(res.data);
    })
  }, [])
  const { isLoading, initialLoading, refreshing, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: '/api/home/mutualfollowers_list/' });
  return (
    <PageLayout
      headerTitle='Recipients'
    >
      {
        !initialLoading && !isLoading && combinedData.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('@/assets/images/stars.png')} style={{ width: 128, height: 128 }} />
            <Text style={{ marginTop: 32, textAlign: 'center', fontSize: 11, color: '#a6a6a6' }}>Follow someone or gain followers to unlock conversations. Your first chat could lead to something amazing!</Text>
          </View>
        )
      }
      {
        initialLoading && (
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='#202020' />
          </View>
        )
      }
      {
        !initialLoading && !isLoading && combinedData.length > 0 && (
          <FlatList
            data={combinedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ color: '#737373', marginTop: 4 }}>{item.username}</Text>
              </View>
            )}
            onEndReached={handleEndReached}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )
      }
    </PageLayout>
  )
}
