import { Text, StyleSheet, View } from 'react-native';
import Layout from '@/components/auth/Layout';
import FormInput from '@/components/form/FormInput';
import FieldHeading from '@/components/form/FieldHeading';
import BlueButton from '@/components/buttons/BlueButton';
import React from 'react';
import { useUserStore } from '@/zustand/stores';
import ErrorText from '@/components/messsages/Error';
import { useWizard } from 'react-use-wizard';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';


const formSchema = zod.object({
  temp_email: zod.string().email('Invalid email address.')
})

type FormData = zod.infer<typeof formSchema>

export default function NewEmail({ setNewEmail }: { setNewEmail: React.Dispatch<React.SetStateAction<string>> }) {
  const { control, setError, watch, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      temp_email: '',
    },
    resolver: zodResolver(formSchema)
  })
  const wizard = useWizard();
  const { temp_email } = watch();

  const sendVerificationEmail: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/change_email_send_otp/', data).then(() => {
      setNewEmail(temp_email);
      wizard.nextStep();
    }).catch((error) => {
      handleApiError(error, setError)
    })
  }

  return (
    <Layout
      title='Update Email'
      secondaryText='Enter Your New Email Address'
    >
      <View>
        <FieldHeading>
          Email
        </FieldHeading>
        <Controller
          control={control}
          name={'temp_email'}
          render={({ field: { onChange, value } }) => (
            <FormInput
              placeholder='example@gmail.com'
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.temp_email?.message && <View style={{ marginTop: 8 }}><ErrorText message={errors.temp_email.message}></ErrorText></View>}
        {errors.root?.message && <View style={{ marginTop: 8 }}><ErrorText message={errors.root.message}></ErrorText></View>}
      </View>
      <View style={{ gap: 16 }}>
        <BlueButton
          title='Continue'
          disabled={temp_email === '' || !temp_email.includes('@') || !temp_email.includes('.')}
          onPress={handleSubmit(sendVerificationEmail)}
          loading={isSubmitting}
        />
        <Text style={styles.infoText}>Once you click Continue, a verification code will be sent to your new email address to complete your request to change your email.</Text>
      </View>
    </Layout>
  )
}



const styles = StyleSheet.create({
  infoText: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'justify'
  }
})
