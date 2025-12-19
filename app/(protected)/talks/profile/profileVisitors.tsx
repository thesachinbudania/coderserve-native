import { View, Text } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import BlueButton from '@/components/buttons/BlueButton';

export default function ProfileVisitors() {
  return (
    <PageLayout headerTitle='Profile Visitors'>
      <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Gain insights with Pro</Text>
        <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 16 }}>
          Upgrade to Pro to access your profile visitor list and stay ahead with valuable networking opportunities.
        </Text>
        <View style={{ width: '100%', marginTop: 32 }}>
          <BlueButton title='Unlock Now' />
        </View>
      </View>
    </PageLayout>
  )
}
