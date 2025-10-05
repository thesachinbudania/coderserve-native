import { BackHandler, Text, StyleSheet, View } from 'react-native';
import Layout from '@/components/auth/Layout';
import React from 'react';
import FieldHeading from '@/components/form/FieldHeading';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorText from '@/components/messsages/Error';
import VerifyCurrentEmail from '@/components/profile/updateEmail/VerifyCurrentEmail';
import SetNewEmail from '@/components/profile/updateEmail/NewEmail';
import { Wizard, useWizard } from 'react-use-wizard';
import { useUserStore } from '@/zustand/stores';
import NewEmailVerification from '@/components/profile/updateEmail/NewEmailVerification';
import { useNavigation } from '@react-navigation/native';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const emailSchema = zod.object({
  email: zod.string().email('Invalid email address').nullish(),
  otp_for: zod.literal('change_email'),

});

type FormData = zod.infer<typeof emailSchema>;

function UpdateEmail() {
  const { nextStep } = useWizard();
  const email = useUserStore((state) => state.email);
  const { handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      email: email,
      otp_for: 'change_email',
    },
    resolver: zodResolver(emailSchema),
  })

  const sendOtpRequest: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/resend_otp/', data).then(() => {
      nextStep();
    }).catch((error) => {
      handleApiError(error, setError);
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0d0d0d' }}>
      <Layout
        title='Update Email'
        secondaryText='Your Current Email Address'
      >
        <View style={styles.fieldContainer}>
          <FieldHeading>Email</FieldHeading>
          <View style={styles.emailInput}>
            <Text>{email}</Text>
          </View>
          {errors.email?.message && <ErrorText message={errors.email.message}></ErrorText>}
          {errors.root?.message && <ErrorText message={errors.root.message}></ErrorText>}
        </View>
        <View style={{ gap: 16 }}>
          <BlueButton
            title='Continue'
            onPress={handleSubmit(sendOtpRequest)}
            loading={isSubmitting}
          />
          <Text style={styles.infoText}>Once you click Continue, a verification code will be sent to your current email address to confirm your request to change your email. If you no longer have access to your registered email, please click here</Text>
        </View>
      </Layout>
    </View>
  )
}


const styles = StyleSheet.create({
  fieldContainer: {
    gap: 8,
  },
  emailInput: {
    height: 45,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'justify',
  }
})


export default function EmailUpdateScreens() {
  const [newEmail, setNewEmail] = React.useState('');
  const navigation = useNavigation();
  const handleBackButtonPress = () => {
    navigation.goBack();
    return true;
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <>
      <Wizard>
        <UpdateEmail />
        <VerifyCurrentEmail />
        <SetNewEmail setNewEmail={setNewEmail} />
        <NewEmailVerification newEmail={newEmail} />
      </Wizard>
    </>
  )
}
