import React from 'react';
import { useFetch } from '../useFetch';
import { apiUrl } from '@/constants/env';
import { ActivityIndicator, Platform, FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import SearchBar from '@/components/form/SearchBar';

type DataListProps = {
  data: any[];
  RenderItem: ({ item, index }: { item: any; index: number }) => React.JSX.Element;
  initialLoading: boolean;
  isPaginating?: boolean;
  refreshing: boolean;
  gap?: number;
  allowSearch: boolean;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  onEndReached: () => void;
  onRefresh: () => void;
  customHeader?: JSX.Element;
  noData?: JSX.Element;
}

export function DataList({
  data,
  RenderItem,
  initialLoading,
  refreshing,
  gap = 16,
  allowSearch,
  onSearchChange,
  onEndReached,
  onRefresh,
  isPaginating = false,
  customHeader,
  noData
}: DataListProps) {
  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [])
  );

  if (initialLoading) {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}
      >
        <ActivityIndicator size="large" color={'#202020'} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        allowSearch ? (
          <View style={{ marginBottom: 48 - gap }}>
            <SearchBar onChangeText={onSearchChange} />
          </View>
        ) : customHeader ? customHeader : undefined
      }
      renderItem={RenderItem}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentContainerStyle={{
        gap,
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 128 : 64,
        minHeight: 400,
        flexGrow: 1,
      }}
      ListFooterComponent={isPaginating && !refreshing ? (
        <ActivityIndicator style={{ marginVertical: 32 }} color={'#202020'} />
      ) : null}
      ListEmptyComponent={noData}
    />
  );
}

export function useFetchData({
  url,
  gap = 16,
  refreshOnFocus = true,
  allowSearch = false
}: {
  url: string | null;
  gap?: number;
  paddingTop?: number;
  refreshOnFocus?: boolean;
  allowSearch?: boolean;
}) {
  const [allData, setAllData] = React.useState<any[]>([]);
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(url ? `${apiUrl}${url}` : null);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isPaginating, setIsPaginating] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState(combinedData);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, isLoading, refetch } = useFetch(nextPage || '', !!url);

  React.useEffect(() => {
    if (data) {
      if (refreshing) {
        setAllData([]);
        setRefreshing(false);
      }

      setAllData((prev) => {
        const merged = [...prev, ...data.results];
        const unique = merged.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return unique;
      });

      // Construct next page URL using the current base URL + query params from backend response
      // This fixes issues where backend might return a next link pointing to a different endpoint (e.g. trending vs custom)
      if (data.next) {
        try {
          // Extract query parameters from data.next (e.g. ?page=2 or ?limit=10&offset=10)
          const nextUrlParts = data.next.split('?');
          if (nextUrlParts.length > 1) {
            const queryParams = nextUrlParts[1];
            // Use the client-side URL path (base) to ensure we stay on the correct endpoint (e.g. preferences/posts/)
            // We assume the server's 'next' link contains all necessary accumulated query state (search, filter, page)
            if (url) {
              const clientUrlBase = url.split('?')[0];
              setNextPage(`${apiUrl}${clientUrlBase}?${queryParams}`);
            } else {
              setNextPage(data.next);
            }
          } else {
            // Fallback if no query params found (unlikely for pagination)
            setNextPage(data.next);
          }
        } catch (e) {
          setNextPage(data.next);
        }
      } else {
        setNextPage(null);
      }

      setIsPaginating(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [data]);

  React.useEffect(() => {
    setAllData([]);
    setCombinedData([]);
    setFilteredData([]);
    if (url) {
      const resetUrl = `${apiUrl}${url}`;
      setNextPage(resetUrl);
      refetch(resetUrl);
    } else {
      setNextPage(null);
    }
  }, [url]);

  React.useEffect(() => {
    setCombinedData(allData);
    setFilteredData(allData);
  }, [allData]);

  const handleEndReached = () => {
    if (!isPaginating && nextPage && !initialLoading) {
      setIsPaginating(true);
      refetch();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refetch(`${apiUrl}${url}`);
  };

  return {
    combinedData,
    filteredData,
    initialLoading,
    refreshing,
    isPaginating,
    isLoading,
    searchQuery,
    setFilteredData,
    setSearchQuery,
    handleEndReached,
    handleRefresh,
    gap,
    allowSearch,
  };
}