import PageLayout from '@/components/general/PageLayout';
import { View } from 'react-native';
import ModuleCard from '@/components/home/courses/ModuleCard';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import protectedApi from '@/helpers/axios';
import Loading from '@/components/general/Loading';

const categoryMapping = {
  'additional': 'Additional Resources',
  'super_set': 'Super Set',
}

type CategoryMapping = keyof typeof categoryMapping;


export default function FullStackAi() {
  const { id } = useGlobalSearchParams();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await protectedApi.get(`/home/courses/${id}/`);
        setData(response.data);
      } catch (error: any) {
        console.error('Error fetching course data:', error.response.data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])

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
              />
            ))
          }
        </View>
      </PageLayout>
    )
  )
}
