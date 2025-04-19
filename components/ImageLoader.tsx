import { Image, StyleSheet } from 'react-native'
import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';

export default function ImageLoader({ size, uri }: { size: number, uri: string }) {
  const [imageLoading, setImageLoading] = React.useState(true)
  return (
    <>
      <Image
        source={{ uri: uri }}
        style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : 2, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
        onLoad={() => setImageLoading(false)}
      />
      <Skeleton
        isLoading={imageLoading}
        layout={[{ width: size, height: size, borderRadius: 100 }]}
        containerStyle={{ padding: 0 }}
      >
      </Skeleton>
    </>

  )
}


const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
})
