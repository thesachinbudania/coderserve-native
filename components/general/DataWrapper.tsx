import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from "react-native";
export default function DataWrapper({ children, isLoading = false }: { children: React.ReactNode, isLoading?: boolean }) {
  const router = useRouter();
  return (
    isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    ) : (
      <>
        <Header
          title='Data'
          onBackPress={() => { router.back() }}
        />
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 57 }}>
          {children}
        </View>
      </>
    )
  );
}
