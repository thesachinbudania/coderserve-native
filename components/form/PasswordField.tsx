import { TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';


export default function FormInput({ value, onChangeText }: { value: string, onChangeText: React.Dispatch<React.SetStateAction<string>> }) {
	const [isFocused, setIsFocused] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	return (
		<View style={{ position: 'relative' }}>
			<TextInput
				style={[styles.input, isFocused && { borderColor: '#006dff' }]}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder={'• • • • • • • • • •'}
				placeholderTextColor="#cbe1ff"
				autoComplete="new-password"
				secureTextEntry={!showPassword}
				value={value}
				onChangeText={onChangeText}
				cursorColor="black"
			/>
			<TouchableOpacity style={styles.inputTouch} onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setShowPassword(prev => !prev);
			}}>
				<Image source={showPassword ? require('./assets/eye.png') : require('./assets/eyeDash.png')} style={{ height: 24, width: 24 }} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 8,
		paddingLeft: 12,
		height: 45,
		marginTop: 8,
		fontSize: 15,
		width: '100%'
	},
	formView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: 'black',
		borderRadius: 8,
		padding: 15,
		marginTop: 8,
	},
	inputTouch: {
		position: 'absolute',
		right: 15,
		top: 4,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	}

})
