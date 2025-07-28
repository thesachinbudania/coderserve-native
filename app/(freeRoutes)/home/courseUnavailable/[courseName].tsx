import { Text, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { useGlobalSearchParams } from 'expo-router';

export default function CourseUnavailable() {
  const { courseName } = useGlobalSearchParams();
  return (
    <PageLayout
      headerTitle={courseName ? `${courseName}` : "Course Unavailable"}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 11, color: "#a6a6a6" }}>This course is still cooking! We're working on this course right now.</Text>
        <Text style={{ fontSize: 11, color: "#a6a6a6" }}>It'll be available soon - fresh, clear, and worth the wait.</Text>
      </View>
    </PageLayout>

  );
}
