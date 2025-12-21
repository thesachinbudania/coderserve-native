import React from 'react';
import { useFetch } from '../useFetch';
import { apiUrl } from '@/constants/env';
import { ActivityIndicator, Platform, FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import SearchBar from '@/components/form/SearchBar';



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
  isPaginating = false
}: {
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
}) {
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
        }}
      >
        <ActivityIndicator size="large" color={'#202020'} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        allowSearch ? (
          <View style={{ marginBottom: 50 - gap }}>
            <SearchBar onChangeText={onSearchChange} />
          </View>
        ) : undefined
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
        minHeight: 400
      }}
      ListFooterComponent={isPaginating && !refreshing ? (
        <ActivityIndicator style={{ marginVertical: 32 }} color={'#202020'} />
      ) : null}
    />
  );
}

export function useFetchData({
  url,
  gap = 16,
  refreshOnFocus = true,
  allowSearch = false
}: {
  url: string;
  gap?: number;
  paddingTop?: number;
  refreshOnFocus?: boolean;
  allowSearch?: boolean;
}) {
  const [allData, setAllData] = React.useState<any[]>([]);
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(`${apiUrl}${url}`);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isPaginating, setIsPaginating] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState(combinedData);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, isLoading, refetch } = useFetch(nextPage || '');

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

      setNextPage(data.next);
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
    setNextPage(`${apiUrl}${url}`);
    refetch(`${apiUrl}${url}`);
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