import { Image } from 'react-native';

export default function ProjectsIcon({ focused }: { focused: boolean }) {
  return (
    <Image
      source={focused ? require('@/assets/images/bottomBar/projectsActive.png') : require('@/assets/images/bottomBar/projects.png')}
      style={{ width: 24, height: 24 }}
    />
  )
}
