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
        const response = await protectedApi.get(`/home/specializations/${id}/`);
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
            data?.courses.map((course: any, index: any) => (
              <ModuleCard
                title={course.title}
                subTitle={categoryMapping[course.category as CategoryMapping]}
                key={index}
                pointsCount={course.points}
                onPress={course.type === 'lesson' ? () => router.push(`/(protected)/home/courses/lesson/${course.lesson_id}`) : () => router.push(`/(protected)/home/courses/modules/${course.id}`)}
              />
            ))
          }
        </View>
      </PageLayout>
    )
  )
}
