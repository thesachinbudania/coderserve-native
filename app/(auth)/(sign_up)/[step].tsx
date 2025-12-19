import OtpPage from '@/components/auth/sign_up/OtpPage';
import ChooseUsernameScreen from '@/components/auth/sign_up/profileDetails/ChooseUsername';
import ProfileImageScreen from '@/components/auth/sign_up/profileDetails/ProfileImage';
import LocationSelectPage from '@/components/auth/sign_up/profileDetails/Location';
import SignUpScreen from '@/components/auth/sign_up/SignUpScreen';
import { Wizard, useWizard } from 'react-use-wizard';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';


export default function Page() {
  const { step: screen } = useLocalSearchParams();
  return (
    <Wizard>
      <Controller step={typeof screen === 'string' ? Number(screen) : 1} />
      <SignUpScreen />
      <OtpPage />
      <ProfileImageScreen />
      <ChooseUsernameScreen />
      <LocationSelectPage />
    </Wizard>

  )
}

const Controller = ({ step }: { step: number }) => {
  const { goToStep } = useWizard();

  React.useEffect(() => {
    goToStep(step);
  }, [step]);

  return null; // invisible controller
};
