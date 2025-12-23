import { useEffect, useState } from 'react';
import protectedApi from './axios';
import errorHandler from "@/helpers/general/errorHandler";

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
      const response = await protectedApi.get(uri || url, { baseURL: '' });
      setData(response.data);
    } catch (err: any) {
      errorHandler(err);
      console.log('Error fetching data:', err);
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
