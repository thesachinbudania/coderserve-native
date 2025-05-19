import { Image, StyleSheet, Text, View } from 'react-native';

export default function LockedButton({ unlockDate }: { unlockDate: string }) {
	return (
		<View style={{ gap: 32 }}>
			<View style={styles.disabledButton}>
				<Image source={require('@/assets/images/lock.png')} style={styles.lockIcon} />
			</View>
			<Text style={{ textAlign: 'center', color: '#737373', fontSize: 11 }}>You can update your name after {unlockDate}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	disabledButton: {
		backgroundColor: '#a8b8c8',
		height: 45,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
	},
	lockIcon: {
		width: 20,
		height: 20,
	}

})
