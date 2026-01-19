import { Text, View, Image } from 'react-native';
import React from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import ListPageLayout from '@/components/general/ListPageLayout';
import { UserListing } from '../followersList/[username]';



export default function FollowingList() {
  const { username } = useGlobalSearchParams();

  const { combinedData, initialLoading, refreshing, handleEndReached, handleRefresh, isLoading, setFilteredData, searchQuery, setSearchQuery, filteredData } = useFetchData({ url: `/api/accounts/following_list/${username}/`, allowSearch: true });

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
      headerTitle='Following'
    >
      {
        filteredData.length === 0 && !isLoading && !initialLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, marginTop: -57 }}>
            <Image source={require('@/assets/images/stars.png')} style={{ width: 112, height: 120, marginBottom: 30 }} />
            <Text style={{ color: '#a6a6a6', textAlign: 'center', fontSize: 11 }}>
              {searchQuery ? 'No users match your search.' : "It looks like you're not following anyone yet. Once you follow someone, their profiles will appear here. Start exploring and connect with interesting profiles to build your network."}
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
