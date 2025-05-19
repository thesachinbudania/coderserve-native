import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function IconButton({ children, onPress = () => { } }: { children: React.ReactNode, onPress?: () => void }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<View style={[styles.menuIconContainer, pressed && { backgroundColor: '#d9d9d9' }]}>
						{children}
					</View>
				)
			}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	menuIconContainer: {
		backgroundColor: '#f5f5f5',
		padding: 8,
		borderRadius: 44,
	},
})
