import { StyleSheet, Text } from 'react-native';

export default function Note({ note }: { note: string }) {
	return (
		<Text style={styles.heading}>Note: <Text style={styles.note}>{note}</Text></Text>
	)
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 11,
		fontWeight: 'bold',
		color: '#737373',
		textAlign: 'justify'
	},
	note: {
		fontWeight: 'normal',
	}
})
