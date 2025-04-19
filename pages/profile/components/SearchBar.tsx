import { Image, TextInput, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';


export default function SearchBar({ onChangeText, isFocused, setIsFocused, placeholder = null }: { onChangeText: React.Dispatch<React.SetStateAction<string>>, isFocused: boolean, placeholder?: string | null, setIsFocused: React.Dispatch<React.SetStateAction<boolean>> }) {
	const [text, setText] = React.useState('');
	const inputRef = React.useRef<TextInput>(null);

	const handleFocus = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}

	React.useEffect(() => {
		onChangeText(text);
	}, [text]);

	return (
		<TouchableWithoutFeedback onPress={handleFocus}>
			<View
				style={[styles.container,]}
			>
				{(!placeholder || isFocused) && (
					<Image source={require('./assets/searchIcon.png')} style={styles.searchIcon} />
				)}
				<TextInput
					ref={inputRef}
					style={[styles.input, placeholder && !isFocused && { paddingLeft: 12 }, { borderColor: isFocused ? '#eeeeee' : 'black' }, isFocused && { borderWidth: 0, borderColor: '#eeeeee', borderBottomWidth: 1, borderRadius: 0, height: 62 }]}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={!isFocused && placeholder ? placeholder : 'Search'}
					value={text}
					onChangeText={setText}
					placeholderTextColor={!isFocused && placeholder ? '#cbe1ff' : '#d9d9d9'}
				/>
			</View >
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: 8,
		height: 45,
		paddingLeft: 43,
		fontSize: 15,
		flexDirection: 'row',
		gap: 8,
		backgroundColor: 'white'
	},
	searchIcon: {
		height: 20,
		width: 20,
		position: 'absolute',
		left: 12,
		zIndex: 1
	},
	container: {
		justifyContent: 'center',
	}
})
