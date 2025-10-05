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
            onPress={() => router.push('/profile/edit/picture')}
          />
          <SectionOption
            title='Profile Background'
            subTitle='Personalize your background image.'
            onPress={() => router.push('/profile/edit/background')}
          />
          <SectionOption
            title='Name'
            subTitle='Update your display name.'
            onPress={() => router.push('/profile/edit/name')}
          />
          <SectionOption
            title='Username'
            subTitle='Update your unique handle.'
            onPress={() => router.push('/profile/edit/username')}
          />
        </Section>
        <Section
          title='Personal Details'
        >
          <SectionOption
            title='Gender'
            subTitle='Set your identity.'
            onPress={() => router.push('/profile/edit/gender')}
          />
          <SectionOption
            title='Birthday'
            subTitle='Mark your birth date.'
            onPress={() => router.push('/profile/edit/birthday')}
          />
          <SectionOption
            title='Location'
            subTitle='Update your current place.'
            onPress={() => router.push('/profile/edit/location')}
          />
        </Section>
        <Section
          title='Contact Links'
        >
          <SectionOption
            title='Phone'
            subTitle='Add your mobile number.'
            onPress={() => router.push('/profile/edit/phone')}
          />
          <SectionOption
            title='WhatsApp'
            subTitle='Connect your WhatsApp.'
            onPress={() => router.push('/profile/edit/whatsapp')}
          />
          <SectionOption
            title='GitHub'
            subTitle='Link your GitHub profile.'
            onPress={() => router.push('/profile/edit/github')}
          />
          <SectionOption
            title='Website'
            subTitle='Add your personal website.'
            onPress={() => router.push('/profile/edit/website')}
          />
        </Section>
      </SectionContainer>
    </Layout>

  )
}
