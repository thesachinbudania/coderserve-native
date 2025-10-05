import { View } from 'react-native';


export default function BottomFixedSingleButton({ children }: { children?: React.ReactNode }) {
  return (
    <View style={{ position: 'absolute', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eeeeee', bottom: 0, left: 0, right: 0, width: '100%', padding: 16 }} >
      {children}
    </View>
  )
}
