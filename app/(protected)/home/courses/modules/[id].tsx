import PageLayout from '@/components/general/PageLayout';
import { View } from 'react-native';
import ModuleCard from '@/components/home/courses/ModuleCard';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import protectedApi from '@/helpers/axios';
import Loading from '@/components/general/Loading';
import errorHandler from '@/helpers/general/errorHandler';
import { useFocusEffect } from 'expo-router';

export default function FullStackAi() {
  const { id } = useGlobalSearchParams();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          const response = await protectedApi.get(`/home/courses/${id}/`);
          setData(response.data);
        } catch (error: any) {
          errorHandler(error);
          console.error('Error fetching course data:', error.response.data);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [])
  )

  const router = useRouter();
  return (
    loading ? <Loading /> : (
      <PageLayout
        headerTitle={data?.title}
      >
        <View style={{ gap: 16 }}>
          {
            data?.modules.map((module: any, index: any) => (
              <ModuleCard
                title={module.title}
                subTitle={module.subTitle}
                key={index}
                pointsCount={module.points}
                onPress={() => router.push(`/(protected)/home/courses/lesson/${module.lesson_id[0]}`)}
                userPoints={module.user_points}
                locked={index === 0 ? false : data.modules[index - 1].user_points >= data.modules[index - 1].points ? false : true}
                available={module.available}
              />
            ))
          }
        </View>
      </PageLayout>
    )
  )
}
