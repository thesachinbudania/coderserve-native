import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function TimedError({
	message,
	messageKey,
}: { message: string, messageKey: number }) {
	const [visible, setVisible] = useState(false);
	const widthAnim = useRef(new Animated.Value(100)).current;

	useEffect(() => {
		if (message) {
			setVisible(true);

			// Reset the bar width
			widthAnim.setValue(100);

			// Start shrinking animation
			Animated.timing(widthAnim, {
				toValue: 0,
				duration: 5000,
				useNativeDriver: false, // We're animating width, so false
			}).start(() => setVisible(false));
		}
	}, [message, messageKey]);

	return (
		visible && message ? (
			<View style={styles.container}>
				<Text style={styles.message}>{message}</Text>
				<Animated.View style={[styles.bar, {
					width: widthAnim.interpolate({
						inputRange: [0, 100],
						outputRange: ['0%', '100%'],
					})
				}]} />
			</View>
		) : null
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff5f5',
		paddingVertical: 10,
		marginBottom: 20,
		alignItems: 'center',
	},
	message: {
		color: '#f87171',
		fontSize: 14,
	},
	bar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		height: 2,
		backgroundColor: '#f87171',
	},
});
