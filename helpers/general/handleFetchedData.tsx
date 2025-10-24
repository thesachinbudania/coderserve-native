import React from 'react';
import { useFetch } from '../useFetch';
import { apiUrl } from '@/constants/env';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function useFetchData({
  url,
  RenderItem,
  gap = 16,
  paddingTop = 0,
  refreshOnFocus = true,
}: {
  url: string;
  RenderItem?: ({ item, index }: { item: any, index: number }) => React.JSX.Element;
  gap?: number;
  paddingTop?: number;
  refreshOnFocus?: boolean;
}) {
  // Raw API data (unfiltered)
  const [allData, setAllData] = React.useState<any[]>([]);
  // Derived + filtered data
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(
    `${apiUrl}${url}`
  );
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isPaginating, setIsPaginating] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState(combinedData);

  // Fetch hook
  const { data, isLoading, refetch } = useFetch(nextPage || '');

  // When new data comes in
  React.useEffect(() => {
    if (data) {
      if (refreshing) {
        setAllData([]);
        setRefreshing(false);
      }

      // Deduplicate by `id`
      setAllData((prev) => {
        const merged = [...prev, ...data.results];
        const unique = merged.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return unique;
      });

      setNextPage(data.next);
      setIsPaginating(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [data]);

  // When the requested URL changes (e.g. switching tabs/filters), reset and fetch the new feed
  React.useEffect(() => {
    // clear accumulated data and reset pagination state
    setAllData([]);
    setCombinedData([]);
    setFilteredData([]);
    setNextPage(`${apiUrl}${url}`);
    // trigger a refetch for the new URL
    refetch(`${apiUrl}${url}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Update combinedData based on search
  React.useEffect(() => {
    setCombinedData(allData);
    setFilteredData(allData)
  }, [allData]);

  // Pagination
  const handleEndReached = () => {
    if (!isPaginating && nextPage && !initialLoading) {
      setIsPaginating(true);
      refetch();
    }
  };

  // Pull-to-refresh
  const handleRefresh = () => {
    setAllData([]);
    setRefreshing(true);
    refetch(`${apiUrl}${url}`);
  };

  // Refresh on focus (optional)
  if (refreshOnFocus) {
    useFocusEffect(
      React.useCallback(() => {
        handleRefresh();
      }, [url])
    );
  }

  // Render UI
  const RenderData = () => {
    return (
      <>
        {initialLoading && (
          <View
            style={{
              width: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <ActivityIndicator size="large" color="#202020" />
          </View>
        )}

        {!initialLoading && !isLoading && combinedData.length > 0 && (
          <>

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={RenderItem}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              contentContainerStyle={{ gap: gap }}
            />
          </>
        )}
      </>
    );
  };

  return {
    combinedData,
    initialLoading,
    refreshing,
    handleEndReached,
    isLoading,
    handleRefresh,
    RenderData,
    setFilteredData
  };
}
