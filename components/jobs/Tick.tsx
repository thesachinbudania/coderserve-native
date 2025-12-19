import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';


export default function Checkbox({ onPress = () => { }, title }: { onPress?: ({ state }: { state: boolean }) => void, title: string }) {
	const [state, setState] = React.useState(false);
	const handleCheckboxChange = () => {
		setState(!state);
		onPress({ state });
	};

	return (
		<TouchableOpacity
			onPress={handleCheckboxChange}
		>
			<View style={styles.container}>
				<View style={[styles.checkbox, state && { borderColor: '#006dff' }]}>
					{state && (
						<Image source={require('@/components/form/assets/check.png')} style={{ height: 10, width: 10 }} />
					)}
				</View>
				<Text style={[{ fontSize: 13 }, state && { color: '#006dff' }]}>{title}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	checkbox: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 18,
		width: 18,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: 'black',
	}
})
