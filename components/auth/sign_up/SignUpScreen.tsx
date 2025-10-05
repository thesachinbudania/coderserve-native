import AuthLayout from '../Layout';
import FieldHeading from '@/components/form/FieldHeading';
import { View, Text, StyleSheet } from 'react-native';
import FormInput from '@/components/form/FormInput';
import React from 'react';
import PasswordField from '@/components/form/PasswordField';
import DefaultButton from '@/components/buttons/DefaultButton';
import Checkbox from '@/components/form/Checkbox';
import SmallTextButton from '../../../components/buttons/SmallTextButton';
import { useWizard } from 'react-use-wizard';
import ErrorMessage from '@/components/messsages/Error';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { api } from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';
import { useStore } from '@/zustand/auth/stores';

const formSchema = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required' }),
  last_name: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain both uppercase and lowercase characters' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  terms_accepted: zod.boolean()
});

type FormData = zod.infer<typeof formSchema>;

export default function SignUpScreen() {
  const { watch, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      terms_accepted: true,
    },
    resolver: zodResolver(formSchema),
  })
  const { email, first_name, last_name, password, terms_accepted } = watch();
  const wizard = useWizard();
  const router = useRouter();
  const setStore = useStore(state => state.setStore)

  // states for taking care of errors in password
  const insufficientLength = password.length < 8;
  const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
  const noNumber = !/[0-9]/.test(password);
  const hasSC = !/[^A-Za-z0-9]/.test(password);

  const signUp: SubmitHandler<FormData> = async (data) => {
    await api.post('/sign_up/', data).then(res => {
      setStore({ email: email })
      wizard.nextStep();
    }).catch(error => {
      handleApiError(error, setError)
    })
  }

  // function to check if all the fields are filled and the checkbox is checked
  function isFormValid() {
    return first_name && last_name && email && password && terms_accepted && !insufficientLength && !casingError && !noNumber && !hasSC;
  }

  return (
    <AuthLayout title='Create account' secondaryText="Let's create an Account for you">
      <View>
        <FieldHeading>First Name</FieldHeading>
        <Controller
          control={control}
          name='first_name'
          render={
            ({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                placeholder="John"
                value={value}
                onChangeText={onChange}
                autocomplete={'name'}
                error={error?.message}
              />
            )
          }
        />
      </View>
      <View>
        <FieldHeading>Last Name</FieldHeading>
        <Controller
          control={control}
          name='last_name'
          render={
            ({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                placeholder="Doe"
                value={value}
                onChangeText={onChange}
                autocomplete={'name'}
                error={error?.message}
              />
            )
          }
        />
      </View>
      <View>
        <FieldHeading>Email</FieldHeading>
        <Controller
          control={control}
          name='email'
          render={
            ({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autocomplete={'email'}
                error={error?.message}
              />
            )
          }
        />
      </View>
      <View>
        <FieldHeading>Password</FieldHeading>
        <Controller
          control={control}
          name='password'
          render={
            ({ field: { onChange, value } }) => (
              <PasswordField
                value={value}
                onChangeText={onChange}
              />
            )
          }
        />
        {
          password != '' && (<View style={{ marginTop: 8 }}>
            <ErrorMessage message='At least 8 characters' status={insufficientLength ? 'error' : 'success'} />
            <ErrorMessage message='Contains both uppercase and lowercase letters' status={casingError ? 'error' : 'success'} />
            <ErrorMessage message='Includes number' status={noNumber ? 'error' : 'success'} />
            <ErrorMessage message='Contains at least one special character (e.g., !, @, #)' status={hasSC ? 'error' : 'success'} />
          </View>

          )
        }
      </View>
      <View>
        {errors.root?.message && (
          <View style={{ marginBottom: 8 }}>
            <ErrorMessage message={errors.root?.message} />
          </View>
        )}
        <Controller
          control={control}
          name='terms_accepted'
          render={
            ({ field: { onChange, value } }) => (
              <Checkbox
                state={value}
                setState={onChange}
              >
                <View style={{ maxWidth: '90%', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={styles.termsText}>By signing up, you agree to our </Text>
                  <SmallTextButton
                    underline={true}
                    title={'Terms & Conditions'}
                  />
                  <Text style={styles.termsText}> and </Text>
                  <SmallTextButton
                    underline={true}
                    title={'Privacy Policy'}
                  />
                </View>

              </Checkbox>
            )
          }
        />
      </View>
      <DefaultButton
        title='Sign Up'
        onPress={handleSubmit(signUp)}
        loading={isSubmitting}
        disabled={!isFormValid()}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#a6a6a6' }}>Already have an account? </Text>
        <SmallTextButton
          underline={true}
          title={'Sign In'}
          onPress={() => router.back()}
        />
      </View>

    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  termsText: {
    fontSize: 13,
    color: '#a6a6a6',
  }
})

