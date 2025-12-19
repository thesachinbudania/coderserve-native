import React from 'react';
import { Image, View } from 'react-native';
import { BlurView } from 'expo-blur';
export default function FullWidthImage({ imageUrl }: { imageUrl: string }) {
  return (
    <View style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
      <Image source={{ uri: imageUrl }} style={{ borderRadius: 8, width: '100%', height: 144, objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
      <BlurView style={{ position: 'absolute', top: 0, left: 0, height: 144, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8 }} />
      <Image source={{ uri: imageUrl }} style={{ borderRadius: 8, width: '100%', height: 144, objectFit: 'contain' }} />
    </View>
  );
}
