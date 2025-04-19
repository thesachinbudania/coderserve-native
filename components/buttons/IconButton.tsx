import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function IconButton({ children, onPress = () => { }, square = false }: { children: React.ReactNode, onPress?: () => void, square?: boolean }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<View style={[styles.menuIconContainer, pressed && { backgroundColor: '#d9d9d9' }, square && {
						borderRadius: 8,
						height: 45,
						width: 45,
						justifyContent: 'center',
						alignItems: 'center',
					}]}>
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
