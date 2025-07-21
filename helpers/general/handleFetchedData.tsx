import React from 'react';
import { useFetch } from '../useFetch';
import { apiUrl } from '@/constants/env';

export default function useFetchData({ url }: { url: string }) {
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

  return { combinedData, initialLoading, refreshing, handleEndReached, isLoading, handleRefresh };

}
