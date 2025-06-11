import { StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import { Section, SectionOption, SectionContainer } from '@/components/general/OptionsSection';
import { useUserStore } from '@/zustand/stores';
import React from 'react';
import PopUp from '@/components/messsages/PopUp';
import BlueButton from '@/components/buttons/BlueButton';
import ImageLoader from '@/components/ImageLoader';
import { useRouter } from 'expo-router';
import { popUpStore } from '@/zustand/accountCentre';

function PopUpMessage({ setVisible, title, body }: { body: string, title: string, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <>
      <Text style={styles.popUpeading}>{title}</Text>
      <Text style={styles.popUpBody}>{body}</Text>
      <BlueButton
        title='Okay'
        onPress={() => setVisible(false)}
      />
    </>

  )
}


export default function AccountCenter() {
  const user = useUserStore(state => state);
  const { visible: popUpVisible, title, body, hidePopUp } = popUpStore(state => state);
  const dateJoined = user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
  const router = useRouter();
  return (
    <Layout
      headerTitle='Account Center'
    >
      <PopUp visible={popUpVisible} setVisible={hidePopUp} >
        <PopUpMessage title={typeof title === 'string' ? title : ''} body={typeof body === 'string' ? body : ''} setVisible={hidePopUp} />
      </PopUp>
      <View style={styles.avatarContainer}>
        {user.profile_image &&
          <ImageLoader
            size={128}
            uri={user.profile_image}
          />
        }
        <Text style={styles.userId}>A0000007521</Text>
        <Text style={styles.joinDate}>Member since {dateJoined}</Text>
      </View>
      <SectionContainer>
        <Section>
          <SectionOption
            title='Update Email'
            subTitle='Change email address associated with your account.'
            onPress={() => router.push('/profile/updateEmail')}
          />
          <SectionOption
            title='Update Password'
            subTitle='Change your account password.'
            onPress={() => router.push('/profile/changePassword')}
          />
          <SectionOption
            title='Go Pro'
            subTitle='Subsribe to or manage your pro membership.'
          />
          <SectionOption
            title='Ad Management'
            subTitle='Customize the ads you see.'
            onPress={() => router.push('/profile/adManagement')}
          />
          <SectionOption
            title='Account Status'
            subTitle="Check your account's current status."
            onPress={() => router.push('/profile/accountStatus')} />
          <SectionOption
            title='Device Permissions'
            subTitle='Control app and device permissions'
            onPress={() => router.push('/profile/devicePermissions')}
          />
          <SectionOption
            title='Login Activity'
            subTitle='View your login history, devices and locations.'
            onPress={() => router.push('/profile/loginHistory')}
          />
        </Section>
      </SectionContainer>
    </Layout>
  )
}


const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    marginTop: -24,
  },
  userId: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
  },
  joinDate: {
    fontSize: 13,
    color: '#a6a6a6',
    marginTop: 8,
  },
  popUpeading: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  popUpBody: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    color: '#737373',
  }
})
