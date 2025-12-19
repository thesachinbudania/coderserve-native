import { Stack } from 'expo-router';
import { View } from 'react-native';
import { PortalProvider } from '@gorhom/portal';


export default function Layout() {
  return (
    <PortalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
      </Stack>
    </PortalProvider>
  )
}
