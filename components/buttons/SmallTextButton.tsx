import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';


export default function SmallTextButton({ underline = false, title, onPress = () => { }, style = {}, underlineOnPress = false, onPressColor = '#006dff' }: { style?: any, underline?: boolean, title: string, onPress?: () => void, underlineOnPress?: boolean, onPressColor?: string }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<Text style={[styles.text, style, underline && { textDecorationLine: 'underline' }, pressed && { color: onPressColor }, underlineOnPress && pressed && { textDecorationLine: 'underline' }]}>{title}</Text>
				)
			}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 13,
	}
})
