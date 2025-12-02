import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
export default function DataWrapper({ children, header, isLoading = false, containerStyle }: { children: React.ReactNode, header: string, isLoading?: boolean, containerStyle?: object }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title={header}
          onBackPress={() => { router.back() }}
          fixedHeader
        />
        <View style={[{ flex: 1, backgroundColor: 'white', marginTop: 57 }, containerStyle]}>
          {children}
        </View>
      </SafeAreaView>
    )
  );
}
