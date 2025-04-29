import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';


export default function SmallTextButton({ underline = false, title, onPress = () => { }, style = {} }: { style?: any, underline?: boolean, title: string, onPress?: () => void }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<Text style={[styles.text, style, underline && { textDecorationLine: 'underline' }, pressed && { color: '#006dff' }]}>{title}</Text>
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
