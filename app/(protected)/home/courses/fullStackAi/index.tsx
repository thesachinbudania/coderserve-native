import PageLayout from '@/components/general/PageLayout';
import { View } from 'react-native';
import ModuleCard from '@/components/home/courses/ModuleCard';
import { useRouter } from 'expo-router';


export default function FullStackAi() {
  const router = useRouter();
  return (
    <PageLayout
      headerTitle='Introduction to AI'
    >
      <View style={{ gap: 16 }}>
        <ModuleCard
          title='Introduction to AI'
          subTitle='Additional Resources'
          pointsCount={100}
          onPress={() => router.push('/(protected)/home/courses/fullStackAi/introduction')}
        />
        <ModuleCard
          title='Python'
          subTitle='Super Set'
          pointsCount={4000}
          locked
        />
      </View>
    </PageLayout>
  )
}
