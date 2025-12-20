import { StyleSheet, Text } from 'react-native';

export default function Message({ message, status = 'error' }: { message: string, status?: 'error' | 'success' }) {
	if (!message) return null;
	return <Text style={[styles.message, status === 'success' && { color: '#00bf63' }]}>{message}</Text>
}

const styles = StyleSheet.create({
	message: {
		color: '#ff5757',
		fontSize: 12,
		textAlign: 'justify'
	}
})
