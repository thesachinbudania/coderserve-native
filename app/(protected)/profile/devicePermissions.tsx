import Layout from '@/components/general/PageLayout';
import { Section, SectionOption, SectionContainer } from '@/components/general/OptionsSection';
import React from 'react';


export default function ProfileContent() {
	return (
		<Layout
			headerTitle='Device Permissions'
		>
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
		</Layout>
	)
}
