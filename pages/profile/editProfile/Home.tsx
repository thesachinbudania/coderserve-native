import Layout from '../controlCentre/accountCenter/PageLayout';
import { Section, SectionOption, SectionContainer } from '../controlCentre/OptionsSection';
import { NavigationProp } from '../Page';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import React from 'react';

export default function Home() {
	const navigation = useNavigation<NavigationProp>();
	React.useEffect(() => {
		navigation.getParent()?.setOptions({
			tabBarStyle:
				{ display: 'none' }
		});
		return () => navigation.getParent()?.setOptions({
			tabBarStyle: {
				display: 'flex',
				height: 54,
				marginBottom: 0,
				paddingBottom: 0,
			}
		});
	}, [])


	return <Layout
		headerTitle='Edit Profile'
	>
		<View style={{ paddingBottom: 48 }}>
			<SectionContainer>
				<Section
					title='Identity Customization'
				>
					<SectionOption
						title='Profile Image'
						subTitle='Add your display photo.'
						onPress={() => navigation.navigate('EditProfileImage')}
					/>
					<SectionOption
						title='Profile Background'
						subTitle='Personalize your background image.'
					/>
					<SectionOption
						title='Name'
						subTitle='Update your display name.'
					/>
					<SectionOption
						title='Username'
						subTitle='Update your unique handle.'
						onPress={() => navigation.navigate('EditProfileUsername')}
					/>
				</Section>
				<Section
					title='Personal Details'
				>
					<SectionOption
						title='Gender'
						subTitle='Set your identity.'
					/>
					<SectionOption
						title='Birthday'
						subTitle='Mark your birth date.'
					/>
					<SectionOption
						title='Location'
						subTitle='Update your current place.'
					/>
				</Section>
				<Section
					title='Contact Links'
				>
					<SectionOption
						title='Phone'
						subTitle='Add your mobile number.'
					/>
					<SectionOption
						title='WhatsApp'
						subTitle='Connect your WhatsApp.'
					/>
					<SectionOption
						title='GitHub'
						subTitle='Link your GitHub profile.'
					/>
					<SectionOption
						title='Website'
						subTitle='Add your personal website.'
					/>
				</Section>
			</SectionContainer>
		</View>
	</Layout>
}
