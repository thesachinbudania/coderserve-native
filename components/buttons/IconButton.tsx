import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function IconButton({ children, onPress = () => { }, square = false, unread = false }: { children: React.ReactNode, onPress?: () => void, square?: boolean, unread?: boolean }) {
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
						{unread && <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', zIndex: 1 }} />}
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
