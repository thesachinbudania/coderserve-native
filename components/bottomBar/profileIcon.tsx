import { Image } from 'react-native';

export default function ProfileIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/profileActive.png') : require('@/assets/images/bottomBar/profile.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}
