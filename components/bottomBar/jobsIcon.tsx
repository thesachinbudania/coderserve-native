import { Image } from 'react-native';

export default function JobsIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/jobsActive.png') : require('@/assets/images/bottomBar/jobs.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}
