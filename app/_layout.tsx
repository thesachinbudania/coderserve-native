import { Stack } from 'expo-router';
import { PortalProvider } from '@gorhom/portal';
import { Provider } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import { Image, View, Text } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';

function NoInternet() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16 }}>
      <Image source={require('@/assets/images/noInternet.png')} style={{ height: 180, width: 193 }} />
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>No Internet Connection</Text>
      <Text style={{ fontSize: 13, color: "#737373", marginTop: 16, textAlign: 'center' }}>Please turn on your mobile data or connect to Wi-Fi to continue exploring Coder Serve.</Text>
      <View style={{ width: '100%', marginTop: 32 }}>
        <BlueButton title="Refresh" />
      </View>
    </View>
  )
}

export default function Layout() {
  const netInfo = useNetInfo();
  if (!netInfo.isConnected) {
    return <NoInternet />
  }
  return (
    <PortalProvider>
      <Provider>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </PortalProvider>
  )
}
