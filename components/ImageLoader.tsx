import { Pressable, Image, StyleSheet } from 'react-native'
import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';
import ImageViewing from 'react-native-image-viewing';

type Props = {
  border?: number;
  size: number;
  uri: string;
  viewable?: boolean;
}

export default function ImageLoader({ border = 2, size, uri, viewable = false}: Props) {
  const [imageLoading, setImageLoading] = React.useState(true)
  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  return (
    <>
    {
      viewable ? (
<Pressable
        onPress={() => {
          if (viewable) {
            setImageViewVisible(true);
          }
        }}
      >
 <Image
        source={{ uri: uri }}
        style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : border, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
        onLoad={() => setImageLoading(false)}
      />     
      </Pressable>
      ) : (
<Image
        source={{ uri: uri }}
        style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : border, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
        onLoad={() => setImageLoading(false)}
      />
      )
    }
      
      <Skeleton
        isLoading={imageLoading}
        layout={[{ width: size, height: size, borderRadius: 100 }]}
        containerStyle={{ padding: 0 }}
      >
      </Skeleton>
      {
        viewable && !imageLoading && (
          <ImageViewing
            images={[{ uri: uri }]}
            imageIndex={0}
            visible={imageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />
        )
      }
    </>

  )
}


const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 100,
    borderColor: '#f5f5f5',
  },
})
