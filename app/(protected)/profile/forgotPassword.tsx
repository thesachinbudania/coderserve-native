import { ActivityIndicator, View } from 'react-native';
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
  React.useEffect(() => {
    sendOtp();
  }, []);
  async function sendOtp() {
    protectedApi.put('/accounts/resend_otp/', { email, otp_for: 'forgot_password' }).then(() => wizard.nextStep()).catch((error) => {
      if (error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        }
        else {
          setError(error.response.data.non_field_errors[0]);
        }
      }
      else {
        setError('Something went wrong. Please try again later');
      }
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {error != '' ?
        <ErrorMessage message={error} /> :
        <ActivityIndicator size='large'/>
      }
    </View>
  );
}

function VerifyOtp() {
  const wizard = useWizard();
  const { setStore } = useStore(state => state)
  function nextStep({ refresh, access }: { refresh: string, access: string }) {
    setStore({ refresh, access })
    wizard.nextStep();
  }
  return (
    <Layout
      title='Verify Your Email'
      secondaryText="We've sent a verification code to your email"
    >
      <OtpValidator
        otpFor='forgot_password'
        email={useUserStore(state => state.email) || ''}
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
        title: "Your're All Set!",
        body: "Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team."
      })
      router.dismiss(2);
    }
  }, [screen])

  return (
    <Wizard>
      <SendOtp />
      <VerifyOtp />
      <PasswordScreen email={email || ''} setScreen={setScreen} />
    </Wizard>
  );
}
