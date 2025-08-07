import { ActivityIndicator, Image, Text, View } from 'react-native';
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
    </PageLayout>
  )
}
