import { Image } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { componentsMap } from '@/components/home/courses/Components';
import type { ComponentName } from '@/components/home/courses/Components';
import React from 'react';
import { useGlobalSearchParams } from 'expo-router';
import protectedApi from '@/helpers/axios';
import Loading from '@/components/general/Loading';


export default function Introduction() {
  const [data, setData] = React.useState<any>(null);
  console.log(data)
  const [loading, setLoading] = React.useState(true);
  const { id } = useGlobalSearchParams();

  const [unlockedIndex, setUnlockedIndex] = React.useState(0);
  const renderNext = () => {
    if (!data || !data.content || data.content.length === 0) {
      return;
    }
    const currentIndex = unlockedIndex;
    let nextIndex = data.content.length;

    for (let i = currentIndex + 1; i < data.content.length; i++) {
      if (data.content[i].component === 'quiz') {
        nextIndex = i;
        break;
      }
    }
    setUnlockedIndex(nextIndex);
  };

  React.useEffect(() => {
    renderNext();
  }, [data])

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await protectedApi.get(`/home/lessons/${id}/`);
        setData(response.data);
      } catch (error: any) {
        console.error('Error fetching course data:', error.response.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    loading ? <Loading /> :
      <PageLayout headerTitle="Introduction to AI">
        <Image source={{ uri: data.image }} style={{ marginHorizontal: 'auto', objectFit: 'contain', width: 256, height: 256 }} />
        {
          data?.content.slice(0, unlockedIndex + 1).map((item: any, index: number) => {
            const { component, ...props } = item;
            const Component = componentsMap[component as ComponentName];
            if (component === 'quiz') {
              return (
                <Component
                  key={index}
                  {...props}
                  renderNext={renderNext}
                />
              );
            }
            return <Component key={index} {...props} />;
          })
        }
      </PageLayout>
  );
}
