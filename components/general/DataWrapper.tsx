import Header from '@/components/general/Header';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from "react-native";
export default function DataWrapper({ children, header, isLoading = false, containerStyle }: { children: React.ReactNode, header: string, isLoading?: boolean, containerStyle?: object }) {
  const router = useRouter();
  return (
    isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    ) : (
      <>
        <Header
          title={header}
          onBackPress={() => { router.back() }}
        />
        <View style={[{ flex: 1, backgroundColor: 'white', marginTop: 57 }, containerStyle]}>
          {children}
        </View>
      </>
    )
  );
}
