import { Text, View, Image } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { useGlobalSearchParams } from 'expo-router';

export default function CourseUnavailable() {
  const { courseName } = useGlobalSearchParams();
  return (
    <PageLayout
      headerTitle={courseName ? `${courseName}` : "Course Unavailable"}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/images/stars.png')} style={{ height: 120, width: 120, objectFit: 'contain' }} />
        <Text style={{ fontSize: 11, color: "#a6a6a6", textAlign: 'center', marginTop: 32 }}>This course is still cooking! We're working on this course right now. It'll be available soon - fresh, clear, and worth the wait.</Text>
      </View>
    </PageLayout>

  );
}
