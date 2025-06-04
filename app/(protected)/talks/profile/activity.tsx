import PageLayout from '@/components/general/PageLayout';
import { View, Text } from 'react-native';
import DefaultButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';

export default function Activity() {
  const router = useRouter();
  return (
    <PageLayout headerTitle='Your Activity'>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>No Activity Yet</Text>
        <Text style={{ fontSize: 13, color: '#737373', marginTop: 4, textAlign: 'center' }}>Once you start to explore posts, leave comments, and share your thoughts, your interactions will be captured here - building a timeline of your journey.</Text>
        <View style={{ width: '100%', marginTop: 32 }}>
          <DefaultButton
            title='Okay'
            onPress={() => router.back()}
          />
        </View>
      </View>
    </PageLayout>
  )
}
