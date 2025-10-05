import { View, Image, Text } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { useGlobalSearchParams } from 'expo-router';
import { useAccountInfoStore } from '@/zustand/talks/accountInfoStore';
import { formatDateTime } from '@/helpers/timeAgo';
import { number } from 'zod';

export default function DetailedInfo() {
  const { index } = useGlobalSearchParams();
  const { fullName, usernameChanges, your_usernameChanges } = useAccountInfoStore();
  const data = index === '0' ? usernameChanges : your_usernameChanges;
  const noDataText = [
    `${fullName} hasn't changed the username before.`,
    `You haven't changed your username before.`,
  ]

  return <PageLayout
    headerTitle='Former Usernames'
    bottomPadding={false}
  >
    {
      data.length > 0 ? (
        <View style={{ gap: 16 }}>
          {
            data.map((item, idx) => {
              const { date } = formatDateTime(item.changed_at);
              return (
                <View key={idx} style={{ padding: 16, borderWidth: 1, borderRadius: 12, borderColor: "#f5f5f5" }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>@{item.username}</Text>
                  <Text style={{ fontSize: 11, color: "#a6a6a6", marginTop: 4 }}>{date}</Text>
                </View>
              )
            })
          }
        </View>
      ) : (
        <View style={{ paddingTop: 256, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('@/assets/images/stars.png')} style={{ width: 112, height: 112, }} />
          <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 24, textAlign: 'center' }}>{noDataText[Number(index)]}</Text>
        </View>
      )
    }

  </PageLayout>
}
