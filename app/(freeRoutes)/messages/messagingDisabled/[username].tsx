import { Text, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import { useGlobalSearchParams } from 'expo-router';
import UnorderedList from '@/components/general/UnorderedList';
import BottomName from '@/components/profile/home/BottomName';


export default function Screen() {
  const { username } = useGlobalSearchParams();
  return (
    <PageLayout headerTitle='Messaging Disabled'>
      <Text style={{ fontSize: 12, color: "#737373", padding: 16, backgroundColor: "#f5f5f5", borderRadius: 12, lineHeight: 12 }}>{username} isn't following you</Text>
      <Text style={{ fontSize: 12, color: "#737373", padding: 16, backgroundColor: "#f5f5f5", borderRadius: 12, marginTop: 16, lineHeight: 12 }}>You aren't following {username}</Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 42 }}>Why Can't You Message Anymore?</Text>
      <Text style={{ fontSize: 13, color: "#737373", marginTop: 4, textAlign: "justify" }}>
        To keep conversations meaningful and secure, messaging is only allowed between users who are connected.
      </Text>
      <Text style={{ fontSize: 13, color: "#737373", marginTop: 12 }}>Here's how it works:</Text>
      <UnorderedList
        items={[
          'You can message someone if you follow them or they follow you.',
          'If neither of you is following the other, the conversation will be closed and messaging disabled.',
          'If you unfollow someone after sending a message, and they aren’t following you either, the chat will close - but the recipient can still send up to 5 replies to your last message before the thread fully locks.',
          'This helps avoid unwanted conversations while still allowing space for respectful closure.'
        ]}
        gap={14}
        textStyle={{ fontSize: 13, color: "#737373", textAlign: "justify" }}
      />
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 44 }}>Want To Resume the Chat?</Text>
      <Text style={{ fontSize: 13, color: "#737373", marginTop: 4, textAlign: 'justify' }}>To reopen a closed conversation, at least one user needs to follow the other again. Once a follow connection is restored, messaging between both users will be re-enabled.</Text>
      <View style={{ marginBottom: -64 }}>
        <BottomName />
      </View>
    </PageLayout>
  )
}
