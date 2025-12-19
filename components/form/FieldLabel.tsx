import { Text, StyleSheet } from 'react-native';

export default function FieldLabel({ label }: { label: string }) {
	return (
		<Text style={styles.label}>{label}</Text>
	)
}

const styles = StyleSheet.create({
	label: {
		fontSize: 11,
		color: '#737373',
	}
})


