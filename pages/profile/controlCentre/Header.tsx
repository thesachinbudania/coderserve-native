import { Platform, Image, View, StyleSheet, Text } from 'react-native';
import IconButton from '../components/IconButton';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export default function Header({ fixedHeader = false, onBackPress, title }: { fixedHeader?: boolean, onBackPress: () => void, title: string }) {
	const { top } = useSafeAreaInsets();
	const isFocused = useIsFocused();
	return (
		fixedHeader ?
			isFocused &&
			<Portal>
				<View style={[styles.header, Platform.OS === 'ios' && { marginTop: top - 16, }]}>
					<IconButton onPress={() => {
						onBackPress()
					}}>
						<Image style={styles.menuIcon} source={require('./assets/Back.png')} />
					</IconButton>
					<Text style={styles.headerTitle}>{title}</Text>
				</View>
			</Portal> :
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
		zIndex: 100,
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
