import Header from '../Header';
import { Dimensions, Pressable, Keyboard, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function Layout({ headerTitle, children, defaultBack = true, showHeader = true, customBack = () => { } }: { headerTitle: string, defaultBack?: boolean, showHeader?: boolean, customBack?: () => void, children: React.ReactNode }) {
	const navigation = useNavigation();
	return (
		<>
			{showHeader && (
				<Header
					title={headerTitle}
					onBackPress={defaultBack ? () => {
						console.log('back triggered 2')
						navigation.goBack()
					} : customBack}
				/>

			)}
			<ScrollView contentContainerStyle={styles.content}>
				<Pressable
					onPress={() => Keyboard.dismiss()}
				>
					{children}
				</Pressable>
			</ScrollView>
		</>
	)
}


const styles = StyleSheet.create({
	content: {
		marginTop: 57,
		paddingHorizontal: 16,
		paddingTop: 24,
		backgroundColor: 'white',
		minHeight: height - 114,
	}
})
