import { Image } from 'react-native';

export default function HomeIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/homeActive.png') : require('@/assets/images/bottomBar/home.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}
