import { Section, SectionOption, SectionContainer } from '../controlCentre/OptionsSection';
import { NavigationProp } from '../Page';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import OptionsLayout from '../OptionsLayout';

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


	return (
		<OptionsLayout
			title='Edit Profile'
		>
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
						onPress={() => navigation.navigate('EditProfileBackground')}
					/>
					<SectionOption
						title='Name'
						subTitle='Update your display name.'
						onPress={() => navigation.navigate('EditProfileName')}
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
						onPress={() => navigation.navigate('EditProfileGender')}
					/>
					<SectionOption
						title='Birthday'
						subTitle='Mark your birth date.'
						onPress={() => navigation.navigate('EditProfileBirthDate')}
					/>
					<SectionOption
						title='Location'
						subTitle='Update your current place.'
						onPress={() => navigation.navigate('EditProfileLocation')}
					/>
				</Section>
				<Section
					title='Contact Links'
				>
					<SectionOption
						title='Phone'
						subTitle='Add your mobile number.'
						onPress={() => navigation.navigate('EditProfilePhone')}
					/>
					<SectionOption
						title='WhatsApp'
						subTitle='Connect your WhatsApp.'
						onPress={() => navigation.navigate('EditProfileWhatsapp')}
					/>
					<SectionOption
						title='GitHub'
						subTitle='Link your GitHub profile.'
						onPress={() => navigation.navigate('EditProfileGithub')}
					/>
					<SectionOption
						title='Website'
						subTitle='Add your personal website.'
						onPress={() => navigation.navigate('EditProfileWebsite')}
					/>
				</Section>
			</SectionContainer>
		</OptionsLayout>

	)
}
