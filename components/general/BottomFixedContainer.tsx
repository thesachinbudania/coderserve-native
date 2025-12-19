import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function BottomFixedSingleButton({ children }: { children?: React.ReactNode }) {
  const {bottom} = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f5f5f5',bottom: 0, paddingBottom: bottom > 16 ? bottom : 16, left: 0, right: 0, width: '100%', padding: 16 }} >
      {children}
    </View>
  )
}
