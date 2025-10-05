import { Stack } from 'expo-router';
import { PortalProvider } from '@gorhom/portal';
import { Provider } from 'react-native-paper';

export default function Layout() {
  return (
    <PortalProvider>
      <Provider>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </PortalProvider>
  )
}
