import { View } from 'react-native';
import Loader from '@/components/general/Loader';
import React from 'react';
import { useUserStore } from '@/zustand/stores';
import ErrorMessage from '@/components/messsages/Error';
import { Wizard, useWizard } from 'react-use-wizard';
import Layout from '@/components/auth/Layout';
import OtpValidator from '@/components/form/OtpValidator';
import PasswordScreen from '@/components/auth/forgot_password/PassswordScreen';
import { useStore } from '@/zustand/auth/stores'
import protectedApi from '@/helpers/axios';
import { popUpStore } from '@/zustand/accountCentre';
import { useRouter } from 'expo-router';

function SendOtp() {
  const [error, setError] = React.useState('');
  const email = useUserStore(state => state.email);
  const wizard = useWizard();
  const { setStore } = useStore(state => state);

  React.useEffect(() => {
    async function sendOtp() {
      try {
        await protectedApi.put('/accounts/resend_otp/', { email, otp_for: 'forgot_password' });
      } catch (error: any) {
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else if (error.response.data.non_field_errors) {
            setError(error.response.data.non_field_errors[0]);
          } else {
            setError('Something went wrong. Please try again later');
          }
        } else {
          setError('Something went wrong. Please try again later');
        }
      }
    }
    sendOtp();
  }, [email]);

  function nextStep({ refresh, access }: { refresh: string, access: string }) {
    setStore({ refresh, access })
    wizard.nextStep();
  }

  return (
    <Layout
      title='Verify Your Email'
      secondaryText="We've sent a verification code to your email"
    >
      {error ? <ErrorMessage message={error} status='error' /> : null}
      <OtpValidator
        otpFor='forgot_password'
        email={email || ''}
        nextStep={nextStep}
      />
    </Layout>
  );
}

export default function ForgotPassword() {
  const [screen, setScreen] = React.useState('email');
  const router = useRouter();
  const email = useUserStore(state => state.email)
  const { setPopUp } = popUpStore(state => state)

  React.useEffect(() => {
    if (screen === 'success') {
      setPopUp({
        visible: true,
        title: "You're All Set!",
        body: "Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team."
      })
      router.dismiss(2);
    }
  }, [screen])

  return (
    <Wizard>
      <SendOtp />
      <PasswordScreen email={email || ''} setScreen={setScreen} />
    </Wizard>
  );
}
