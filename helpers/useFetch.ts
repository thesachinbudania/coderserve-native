import { useEffect, useState } from 'react';
import protectedApi from './axios';

interface UseFetchResult<T> {
  data: any;
  isLoading: boolean;
  error: string | null;
  refetch: (uri?: string) => Promise<void>;
}

export const useFetch = <T = unknown>(
  url: string,
  autoStart: boolean = true
): UseFetchResult<T> => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(autoStart);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (uri?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(url, 'this is from inside use fetch')
      const response = await protectedApi.get(uri || url, { baseURL: '' });
      setData(response.data);
    } catch (err) {
      setError('Something went wrong! Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoStart) {
      fetchData();
    }
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};
