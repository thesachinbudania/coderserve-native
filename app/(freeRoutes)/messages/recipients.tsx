import { ActivityIndicator, Image, Text, View, FlatList, Pressable } from 'react-native';
import ListPageLayout from '@/components/general/ListPageLayout';
import protectedApi from '@/helpers/axios';
import React from 'react';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import ImageLoader from '@/components/ImageLoader';
import { useRouter } from 'expo-router';

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
            /> :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('@/assets/images/stars.png')} style={{ width: 128, height: 128 }} />
              <Text style={{ marginTop: 32, textAlign: 'center', fontSize: 11, color: '#a6a6a6' }}>Follow someone or gain followers to unlock conversations. Your first chat could lead to something amazing!</Text>
            </View>
        )
      }
    </ListPageLayout >
  )
}

function UserProfileCard({ item, handleInitiateChat }: { item: any, handleInitiateChat: (id: number) => void }) {
  return (
    <Pressable
      style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
      onPress={() => handleInitiateChat(item.id)}
    >
      <ImageLoader size={48} uri={item.profile_image} />
      <View style={{ gap: 4 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.first_name} {item.last_name}</Text>
        <Text style={{ fontSize: 13, color: '#737373' }}>@{item.username}</Text>
      </View>
    </Pressable>
  )
}