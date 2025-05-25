import Layout from '@/components/auth/Layout';
import OtpValidator from '@/components/form/OtpValidator';
import { useUserStore } from '@/zustand/stores';
import ErrorMessage from '@/components/messsages/Error';
import React from 'react';
import { useRouter } from 'expo-router';
import { popUpStore } from '@/zustand/accountCentre';
import protectedApi from '@/helpers/axios';
import FullScreenActivity from '@/components/FullScreenActivity';


export default function VerifyCurrentEmail({ newEmail }: { newEmail: string }) {
  const email = useUserStore(state => state.email);
  const setUser = useUserStore(state => state.setUser)
  const [error, setError] = React.useState('');
  const router = useRouter();
  const { setPopUp } = popUpStore(state => state)
  const [isLoading, setIsLoading] = React.useState(false)

  async function saveEmail() {
    try {
      setIsLoading(true)
      await protectedApi.put('/accounts/change_email_save_email/')
      setUser({ email: newEmail })
      setPopUp({
        visible: true,
        title: 'Success',
        body: 'Your email address has been updated. Thank you for keeping your information current.'
      })
      router.back();
    }
    catch {
      setIsLoading(false)
      setError('Something went wrong. Please try again');
    }
  }

  return (
    <>
      {
        isLoading ? <FullScreenActivity /> : (
          <Layout
            title='Verify Your Email'
            secondaryText="We've sent a verification code to your email"
          >
            <OtpValidator
              email={email ? email : ''}
              otpFor='new_email_verification'
              nextStep={() => { saveEmail() }}
            />
            <ErrorMessage message={error} />
          </Layout>
        )
      }
    </>
  )
}
