import { Image, StyleSheet } from 'react-native'
import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';

export default function BackgroundImageLoader({ size, uri }: { size: number, uri: string }) {
	const [imageLoading, setImageLoading] = React.useState(true)
	return (
		<>
			<Image
				source={{ uri: uri }}
				style={[{ height: imageLoading ? 0 : size, width: '100%' }]}
				onLoad={() => setImageLoading(false)}
			/>
			<Skeleton
				isLoading={imageLoading}
				layout={[{ height: size, width: '100%' }]}
				containerStyle={{ padding: 0 }}
			>
			</Skeleton>
		</>

	)
}



