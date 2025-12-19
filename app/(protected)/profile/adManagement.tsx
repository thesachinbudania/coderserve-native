import Layout from '@/components/general/PageLayout';
import { Section, SectionOption, SectionContainer } from '@/components/general/OptionsSection';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react';


export default function App() {
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
