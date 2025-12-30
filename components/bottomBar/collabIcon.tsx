import { Image } from 'react-native';

export default function CollabIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/collabActive.png') : require('@/assets/images/bottomBar/collab.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}