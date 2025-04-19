import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';


export default function Checkbox({ children, state, setState }: { children: React.ReactNode, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>> }) {

	const handleCheckboxChange = () => {
		setState(!state);
	};

	return (
		<TouchableOpacity
			onPress={handleCheckboxChange}
		>
			<View style={styles.container}>
				<View style={styles.checkbox}>
					{state && (
						<Image source={require('./assets/check.png')} style={{ height: 12, width: 12 }} />
					)}
				</View>
				{children}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 8,
	},
	checkbox: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 18,
		width: 18,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: 'black',
	}
})
