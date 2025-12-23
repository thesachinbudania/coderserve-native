import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function IconButton({ children, onPress = () => { }, dark = false }: { children: React.ReactNode, onPress?: () => void, dark?: boolean }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<View style={[styles.menuIconContainer, dark && { backgroundColor: '#111111' }, pressed && { backgroundColor: dark ? '#202020' : '#d9d9d9' }]}>
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
