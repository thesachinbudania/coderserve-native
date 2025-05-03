import { Image, StyleSheet } from 'react-native'
import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = {
  border?: number;
  size: number;
  uri: string;
}

export default function ImageLoader({ border = 2, size, uri }: Props) {
  const [imageLoading, setImageLoading] = React.useState(true)
  return (
    <>
      <Image
        source={{ uri: uri }}
        style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : border, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
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
    borderColor: '#f5f5f5',
  },
})
