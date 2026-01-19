import { View, Text } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import BlueButton from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';

export default function ProfileVisitors() {
  const router = useRouter();

  return (
    <PageLayout headerTitle='Profile Visitors'>
      <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', lineHeight: 15 }}>Gain insights with Pro</Text>
        <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 14 }}>
          Upgrade to Pro to access your profile visitor list and stay ahead with valuable networking opportunities.
        </Text>
        w       <View style={{ width: '100%', marginTop: 30 }}>
          <BlueButton
            title='Unlock Now'
            onPress={() => router.push('/(freeRoutes)/goPro')} />
        </View>
      </View>
    </PageLayout>
  )
}
