import { ActivityIndicator, Image, Text, View, FlatList, Pressable } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import protectedApi from '@/helpers/axios';
import React from 'react';
import useFetchData from '@/helpers/general/handleFetchedData';
import ImageLoader from '@/components/ImageLoader';
import { useRouter } from 'expo-router';
import SearchBar from '@/components/form/SearchBar';

export default function Recipients() {
  const router = useRouter();
  React.useEffect(() => {
    protectedApi.get('/home/mutualfollowers_list/').then((res) => {
    })
  }, [])
  const { isLoading, initialLoading, refreshing, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: '/api/home/mutualfollowers_list/' });
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

  const [searchQuery, setSearchQuery] = React.useState('');
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
        initialLoading || isInitiating && (
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='#202020' />
          </View>
        )
      }
      {
        !isInitiating && !initialLoading && !isLoading && combinedData.length > 0 && (
          <>
            <View style={{ marginBottom: 52 }}>
              <SearchBar
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
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
              )}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              contentContainerStyle={{ gap: 16 }}
            />
          </>
        )
      }
    </PageLayout>
  )
}
