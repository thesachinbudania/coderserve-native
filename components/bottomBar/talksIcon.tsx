import { Image } from 'react-native';

export default function TalksIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/talksActive.png') : require('@/assets/images/bottomBar/talks.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}
