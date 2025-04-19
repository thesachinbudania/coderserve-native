import Layout from '../PageLayout';
import { Section, SectionOption, SectionContainer } from '../../OptionsSection';
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';


export default function App() {
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
		<Layout
			headerTitle='Ad Management'
		>
			<SectionContainer>
				<View>
					<Text style={styles.sectionHeading}>Ad Activity</Text>
					<Section>
						<SectionOption
							title='Ads Watched'
							subTitle="See a history of the ads you've watched."
						/>
						<SectionOption
							title='Ads Interacted With'
							subTitle='Check the ads you’ve engaged with.'
						/>
						<SectionOption
							title='Advertisers'
							subTitle='Browse the advertisers whose ads you’ve seen.'
						/>
					</Section>
				</View>
				<View>
					<Text style={styles.sectionHeading}>How We Curate Your Ads</Text>
					<Section>
						<SectionOption
							title='Enhancing Your Ad Experience'
							subTitle='Ads tailored using your profile details.'
						/>
						<SectionOption
							title='Audience-Based Advertising'
							subTitle='Ads based matched on your interactions.'
						/>
					</Section>
				</View>
			</SectionContainer>
		</Layout>
	)
}

const styles = StyleSheet.create({
	sectionHeading: {
		fontSize: 11,
		color: '#a6a6a6',
		marginBottom: 8,
	}
})
