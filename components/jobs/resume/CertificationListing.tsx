import { Dimensions, Image, Pressable, Text, View } from 'react-native'
import { styles } from '@/app/(protected)/jobs/resume/update/index';

const { width } = Dimensions.get('window')
type CertificationProps = {
  id: number,
  title: string,
  company: string,
  link: string,
}


export default function OtherCertificationsListing({ certification, onPress = () => { } }: { certification: CertificationProps, onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {
        ({ pressed }) => (
          <View style={[styles.certificationContainer, pressed && { borderColor: '#006dff' }]}>
            <View style={styles.logoContainer}>
              <Image source={require('@/assets/images/jobs/otherCertifications.png')} style={styles.logo} />
            </View>
            <View style={{ width: width - 128, gap: 8 }}>
              <Text numberOfLines={1} style={{ fontSize: 13 }}>{certification.title}</Text>
              <Text numberOfLines={1} style={{ fontSize: 11, color: '#00bf53' }}>Certified by {certification.company}</Text>
            </View>
          </View>
        )
      }
    </Pressable>
  )
}
