import { Section, SectionOption, SectionContainer } from '@/components/general/OptionsSection';
import React from 'react';
import Layout from '@/components/general/PageLayout';
import { useRouter } from 'expo-router';

export default function Home() {
	const router = useRouter();
	return (
		<Layout
			headerTitle='Edit Profile'
		>
			<SectionContainer>
				<Section
					title='Identity Customization'
				>
					<SectionOption
						title='Profile Image'
						subTitle='Add your display photo.'
						onPress={() => router.push('/editProfile/image')}
					/>
					<SectionOption
						title='Profile Background'
						subTitle='Personalize your background image.' onPress={() => router.push('/editProfile/background')}
					/>
					<SectionOption
						title='Name'
						subTitle='Update your display name.'
						onPress={() => router.push('/editProfile/name')}
					/>
					<SectionOption
						title='Username'
						subTitle='Update your unique handle.'
						onPress={() => router.push('/editProfile/username')}
					/>
				</Section>
				<Section
					title='Personal Details'
				>
					<SectionOption
						title='Gender'
						subTitle='Set your identity.'
						onPress={() => router.push('/editProfile/gender')}
					/>
					<SectionOption
						title='Birthday'
						subTitle='Mark your birth date.'
						onPress={() => router.push('/editProfile/birthday')}
					/>
					<SectionOption
						title='Location'
						subTitle='Update your current place.'
						onPress={() => router.push('/editProfile/location')}
					/>
				</Section>
				<Section
					title='Contact Links'
				>
					<SectionOption
						title='Phone'
						subTitle='Add your mobile number.'
						onPress={() => router.push('/editProfile/phone')}
					/>
					<SectionOption
						title='WhatsApp'
						subTitle='Connect your WhatsApp.'
						onPress={() => router.push('/editProfile/whatsapp')}
					/>
					<SectionOption
						title='GitHub'
						subTitle='Link your GitHub profile.'
						onPress={() => router.push('/editProfile/github')}
					/>
					<SectionOption
						title='Website'
						subTitle='Add your personal website.'
						onPress={() => router.push('/editProfile/website')}
					/>
				</Section>
			</SectionContainer>
		</Layout>

	)
}
