import { StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import React from 'react';
import { SectionContainer, Section, SectionOption } from '@/components/general/OptionsSection';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';

export default function Page() {
  const { dobDate, dobMonth, dobYear } = useUserStore(state => state);
  const router = useRouter();
  return (
    <Layout
      headerTitle='Birthday'
    >
      <Text style={styles.heading}>Celebrate Your Journey</Text>
      <Text style={styles.content}>
        Sharing your birthday helps us craft a personalized experience just for you - unlocking birthday surprises, exclusive offers, and content that celebrates your special day, all while keeping your information secure.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, the birthday information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
      </Text>

      <View style={{ marginTop: 32 }}>
        <SectionContainer>
          <Section>
            <SectionOption
              title='Your Birthdate'
              subTitle={dobDate && dobMonth && dobYear ? `${dobDate} ${dobMonth} ${dobYear}` : '-'}
              onPress={() => router.push('/(freeRoutes)/profile/selectDate')}
            />
          </Section>
        </SectionContainer>
      </View>
    </Layout>
  )
}


const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'justify',
  }
})
