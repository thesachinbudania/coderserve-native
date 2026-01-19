import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import ImageLoader from '@/components/ImageLoader';
import React from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import ListPageLayout from '@/components/general/ListPageLayout';



export const UserListing = ({ user }: { user: any }) => {
  const router = useRouter();
  return (
    <Pressable
      style={userStyles.container}
      onPress={() => {
        router.push('/(freeRoutes)/profile/userProfile/' + user.username);
      }}
    >
      <View>
        <ImageLoader
          size={54}
          uri={user.profile_image}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={userStyles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={userStyles.username}>@{user.username}</Text>
      </View>
    </Pressable>
  )
}

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingVertical: 8
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 15
  },
  username: {
    fontSize: 12,
    color: '#737373',
    lineHeight: 12
  },
})


export default function FollowersList() {
  const { username } = useGlobalSearchParams();

  const { combinedData, initialLoading, refreshing, handleEndReached, handleRefresh, isLoading, setFilteredData, searchQuery, setSearchQuery, filteredData } = useFetchData({ url: `/api/accounts/followers_list/${username}/`, allowSearch: true });

  React.useEffect(() => {
    if (searchQuery === '') {
      setFilteredData(combinedData);
    }
    else {
      const filtered = combinedData.filter((item) => {
        const fullName = `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase();
        const usernameStr = (item.username || '').toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || usernameStr.includes(searchQuery.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, combinedData]);

  return (
    <ListPageLayout
      headerTitle='Followers'
    >
      {
        filteredData.length === 0 && !isLoading && !initialLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, marginTop: -57 }}>
            <Image source={require('@/assets/images/stars.png')} style={{ width: 112, height: 120, marginBottom: 30 }} />
            <Text style={{ color: '#a6a6a6', textAlign: 'center', fontSize: 11 }}>
              {searchQuery ? 'No users match your search.' : "It looks like you don't have any followers yet. Once yyou start gaining them, their profile will appear here. Start sharing useful content to build yoyur network."}
            </Text>
          </View>
        ) :
          <DataList
            data={filteredData}
            RenderItem={({ item }) => <UserListing user={item} />}
            initialLoading={initialLoading}
            refreshing={refreshing}
            allowSearch={true}
            onSearchChange={setSearchQuery}
            onEndReached={handleEndReached}
            onRefresh={handleRefresh}
            gap={0}
          />
      }
    </ListPageLayout>
  );
}

