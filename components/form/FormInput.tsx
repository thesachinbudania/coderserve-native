import { TextInput, StyleSheet } from 'react-native';
import React from 'react';

type AutoCompleteOptions =
	| 'off'
	| 'email'
	| 'name'
	| 'username'
	| 'password'
	| 'postal-code'
	| 'tel'
	| 'street-address';

type KeyboardOptions = 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'number-pad';

export default function FormInput({ disabled = false, light = false, placeholder, value, topMargin = true, onChangeText, autocomplete = 'off', keyboardType = 'default' }: { autocomplete?: AutoCompleteOptions, disabled?: boolean, light?: boolean, placeholder: string, keyboardType?: KeyboardOptions, value: string, onChangeText: React.Dispatch<React.SetStateAction<string>>, topMargin?: boolean }) {
	const [isFocused, setIsFocused] = React.useState(false);
	return (
		<TextInput
			style={[styles.input, isFocused && { borderColor: '#006dff' }, light && { color: 'white', borderColor: '#545454' }, !topMargin && { marginTop: 0 }, disabled && { borderWidth: 0, backgroundColor: '#f4f4f4' }]}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			placeholder={placeholder}
			placeholderTextColor={light ? '#a6a6a6' : "#cbe1ff"}
			autoComplete={autocomplete}
			value={value}
			onChangeText={onChangeText}
			cursorColor="black"
			autoCapitalize="none"
			keyboardType={keyboardType}
			editable={!disabled}
		/>
	)
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 8,
		height: 45,
		marginTop: 8,
		fontSize: 15,
		paddingLeft: 12,
	}
})
