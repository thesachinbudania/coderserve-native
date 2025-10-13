import DataWrapper from '@/components/general/DataWrapper';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import ImageLoader from '@/components/ImageLoader';
import React from 'react';
import { useFetch } from '@/helpers/useFetch';
import { apiUrl } from '@/constants/env';
import BottomName from '@/components/profile/home/BottomName';
import { useGlobalSearchParams } from 'expo-router';


const UserListing = ({ user }: { user: any }) => {
  return (
    <View style={userStyles.container}>
      <ImageLoader
        size={48}
        uri={user.profile_image}
      />
      <View>
        <Text style={userStyles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={userStyles.username}>@{user.username}</Text>
      </View>
    </View>
  )
}

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  username: {
    fontSize: 13,
    color: '#737373',
    marginTop: 4,
  },
})


export default function FollowingList() {
  const { username } = useGlobalSearchParams();

  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(`${apiUrl}/api/accounts/followers_list/${username}/`);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isPaginating, setIsPaginating] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, isLoading, refetch } = useFetch(nextPage || '');

  React.useEffect(() => {
    if (data) {
      if (refreshing) {
        setCombinedData([]);
        setRefreshing(false);
      }
      setCombinedData(prev => [...prev, ...data.results]);
      setNextPage(data.next);
      setIsPaginating(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [data]);

  const handleEndReached = () => {
    if (!isPaginating && nextPage && !initialLoading) {
      setIsPaginating(true);
      refetch();
    }
  };

  return (
    <DataWrapper
      header='Followers'
      isLoading={initialLoading}
    >
      {
        combinedData.length === 0 && !isLoading && !initialLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, marginTop: -57 }}>
            <Image source={require('@/assets/images/stars.png')} style={{ width: 128, height: 128, marginBottom: 32 }} />
            <Text style={{ color: '#a6a6a6', textAlign: 'center', fontSize: 11 }}>It looks like you don't have any followers yet. Once you start gaining them, their profiles will appear here. Start sharing useful content to build your network.</Text>
          </View>
        ) :

          <FlatList
            data={combinedData}
            renderItem={({ item }) => <UserListing user={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingTop: 24 }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onRefresh={() => {
              setRefreshing(true);
              refetch(`${apiUrl}/api/accounts/followers_list/${username}/`);
            }}
            refreshing={refreshing}
            ListFooterComponent={
              <>
                {isLoading || nextPage ? (
                  <View style={{ width: '100%', height: 128, marginBottom: 77, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='small' color='#202020' />
                  </View>
                ) : (
                  <View style={{ marginBottom: 77 }}>
                    <BottomName />
                  </View>
                )}
              </>
            }
          />
      }

    </DataWrapper>
  );
}
