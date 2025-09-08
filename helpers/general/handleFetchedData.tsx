import React from 'react';
import { useFetch } from '../useFetch';
import { apiUrl } from '@/constants/env';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function useFetchData({ url, RenderItem, allowSearch = false }: { url: string, RenderItem?: ({ item }: { item: any }) => React.JSX.Element, allowSearch?: boolean }) {
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(`${apiUrl}${url}`);
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

  const handleRefresh = () => {
    setRefreshing(true);
    refetch(`${apiUrl}${url}`);
  }

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh()
    }, [url])
  );

  const RenderData = () => {
    return (
      <>
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
              renderItem={RenderItem}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              contentContainerStyle={{ gap: 16 }}
            />
          )
        }
      </>)
  }
  return { combinedData, initialLoading, refreshing, handleEndReached, isLoading, handleRefresh, RenderData };

}
