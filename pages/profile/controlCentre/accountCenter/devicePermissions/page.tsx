import { BackHandler, StyleSheet, ScrollView, View } from 'react-native'
import Header from '../../Header';
import { Section, SectionOption, SectionContainer } from '../../OptionsSection';
import { useNavigation } from '@react-navigation/native';
import React from 'react';


export default function ProfileContent() {
	const navigation = useNavigation();

	const handleBackButtonPress = () => {
		navigation.goBack();
		return true;
	};
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackButtonPress,
		);

		return () => backHandler.remove();
	}, []);
	return (
		<>
			<Header
				onBackPress={() => { navigation.goBack() }}
				title='Device Permissions'
			/>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
				<View style={styles.body}>
					<SectionContainer>
						<Section>
							<SectionOption
								title='Camera'
								subTitle='Not allowed'
							/>
							<SectionOption
								title='Contacts'
								subTitle='Not allowed'
							/>
							<SectionOption
								title='Location Services'
								subTitle='Not allowed'
							/>
							<SectionOption
								title='Microphone'
								subTitle='Not allowed'
							/>
							<SectionOption
								title='Notifications'
								subTitle='Not allowed'
							/>
							<SectionOption
								title='Photos and Videos'
								subTitle='Not allowed'
							/>
						</Section>
					</SectionContainer>
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	body: {
		paddingHorizontal: 16,
		paddingTop: 24,
		marginTop: 57,
		backgroundColor: 'white',
		flex: 1,
	}
})
