import Header from '../Header';
import { Dimensions, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function Layout({ headerTitle, children, defaultBack = true, flex1 = true, showHeader = true, customBack = () => { } }: { headerTitle: string, defaultBack?: boolean, flex1?: boolean, showHeader?: boolean, customBack?: () => void, children: React.ReactNode }) {
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
			<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='always'>
				<TouchableWithoutFeedback
					onPress={() => {
						Keyboard.dismiss();
					}}
					style={{ flex: 1 }}
				>
					{
						flex1 ? (
							<View style={{ flex: 1 }}>
								{children}
							</View>
						) : (
							<>
								{children}
							</>
						)
					}
				</TouchableWithoutFeedback>
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
