import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#202020' }}>
      <StatusBar backgroundColor={'#202020'} barStyle={'light-content'} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}
