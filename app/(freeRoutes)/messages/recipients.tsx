import { ActivityIndicator, Image, Text, View, FlatList, Pressable } from 'react-native';
import ListPageLayout from '@/components/general/ListPageLayout';
import protectedApi from '@/helpers/axios';
import React from 'react';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import ImageLoader from '@/components/ImageLoader';
import { useRouter } from 'expo-router';
import errorHandler from '@/helpers/general/errorHandler';

export default function Recipients() {
  const router = useRouter();
  const { isLoading, initialLoading, refreshing, searchQuery, setSearchQuery, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: '/api/home/mutualfollowers_list/', allowSearch: true });
  const [isInitiating, setIsInitiating] = React.useState(false);
  function handleInitiateChat(id: number) {
    if (isInitiating) return;
    setIsInitiating(true);
    protectedApi.post('/home/conversations/', { 'participants': [id] }).then((res) => {
      setIsInitiating(false);
      router.push('/(freeRoutes)/messages/chat/' + res.data.id);
    }).catch((err) => {
      errorHandler(err);
      console.error(err.response.data);
      setIsInitiating(false);
    });
  }

  const [filteredData, setFilteredData] = React.useState(combinedData);
  React.useEffect(() => {
    if (searchQuery === '') {
      setFilteredData(combinedData);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = combinedData.filter((item) =>
        item.first_name.toLowerCase().includes(lowercasedQuery) ||
        item.last_name.toLowerCase().includes(lowercasedQuery) ||
        item.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, combinedData]);
  return (
    <ListPageLayout
      headerTitle='Recipients'
    >
      {
        initialLoading || isInitiating ? (
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color={'#202020'} />
          </View>
        ) : (
          combinedData.length > 0 || initialLoading || isLoading || refreshing ?
            <DataList
              data={filteredData}
              RenderItem={({ item }) => (
                <UserProfileCard item={item} handleInitiateChat={handleInitiateChat} ></UserProfileCard>
              )}
              initialLoading={initialLoading}
              refreshing={refreshing}
              allowSearch={true}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
              onSearchChange={setSearchQuery}
              gap={0}
            /> :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16, marginTop: -57 }}>
              <Image source={require('@/assets/images/stars.png')} style={{ width: 128, height: 128, objectFit: 'contain' }} />
              <Text style={{ marginTop: 28, textAlign: 'center', fontSize: 11, color: '#a6a6a6' }}>Follow someone or gain followers to unlock conversations. Your first chat could lead to something amazing!</Text>
            </View>
        )
      }
    </ListPageLayout >
  )
}

function UserProfileCard({ item, handleInitiateChat }: { item: any, handleInitiateChat: (id: number) => void }) {
  return (
    <Pressable
      style={{ flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 8 }}
      onPress={() => handleInitiateChat(item.id)}
    >
      <View>
        <ImageLoader size={54} uri={item.profile_image} />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15, lineHeight: 15 }}>{item.first_name} {item.last_name}</Text>
        <Text style={{ fontSize: 12, color: '#737373', lineHeight: 12 }}>@{item.username}</Text>
      </View>
    </Pressable>
  )
}