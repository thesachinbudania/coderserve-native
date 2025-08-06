import { Text, View, Image, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import FloatingButton from '@/components/buttons/FlotingButton';
import { useRouter } from 'expo-router';

export default function Messages() {
  const router = useRouter()
  return (
    <>
      <PageLayout
        headerTitle='Messages'
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('@/assets/images/messages.png')} style={{ height: 128, width: 128, objectFit: 'contain' }}></Image>
          <Text style={[styles.emptyText, { marginTop: 32 }]}>Private chats with people you follow - and those who follow you - will show up here.</Text>
          <Text style={styles.emptyText}>Start a converstion and stay connected!</Text>
        </View>
      </PageLayout>
      <FloatingButton
        onPress={() => router.push('/(freeRoutes)/messages/recipients')}
      />
    </>
  )
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 11,
    color: '#a6a6a6',
    textAlign: 'center',
  }
})
