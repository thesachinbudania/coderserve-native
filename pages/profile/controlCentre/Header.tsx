import { Image, View, StyleSheet, Text } from 'react-native';
import IconButton from '../components/IconButton';

export default function Header({ onBackPress, title }: { onBackPress: () => void, title: string }) {
	return (
		<View style={styles.header}>
			<IconButton onPress={() => {
				onBackPress()
			}}>
				<Image style={styles.menuIcon} source={require('./assets/Back.png')} />
			</IconButton>
			<Text style={styles.headerTitle}>{title}</Text>
		</View>
	)
}


const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		alignItems: 'center',
		gap: 8,
		position: 'absolute',
		top: 0,
		zIndex: 10,
		width: '100%'
	},
	menuIcon: {
		width: 20,
		height: 20,
		margin: 2,
	},
	headerTitle: {
		fontSize: 15,
		fontWeight: 'bold',
	},

})
