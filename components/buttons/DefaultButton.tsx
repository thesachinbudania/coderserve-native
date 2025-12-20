import { ActivityIndicator, Pressable, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function DefaultButton({ title, disabled = false, onPress = () => { }, loading = false }: { loading?: boolean, title: string, disabled?: boolean, onPress?: () => void }) {
	return (
		<Pressable onPress={() => {
			if (!disabled) {
				Haptics.selectionAsync();
				onPress();

			}
		}} key={loading.toString()}>
			{
				({ pressed }) => (
					<LinearGradient
						colors={disabled ? ['#f4f4f4', '#f4f4f4'] : ((pressed || loading) ? ['#3a3939', '#000000'] : ['#2381ff', '#004aad'])}
						start={{ x: 0, y: 1 }}
						end={{ x: 1, y: 0 }}
						style={styles.graident}
					>
						<View>
							{
								loading ? <ActivityIndicator color='white' /> : (
									<Text style={[styles.text, disabled && { color: '#d9d9d9' }]}>{title}</Text>
								)
							}
						</View>
					</LinearGradient>

				)
			}
		</Pressable>
	)
}


const styles = StyleSheet.create({
	graident: {
		width: '100%',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		height: 45,
	},
	text: {
		fontSize: 14,
		fontWeight: 'bold',
		color: 'white',
	}
})
