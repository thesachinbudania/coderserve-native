import { View, StyleSheet, Text } from 'react-native';
import AuthLayout from '@/components/auth/Layout';
import DefaultButton from '@/components/buttons/DefaultButton';
import DeviceInfo from 'react-native-device-info';
import FieldHeading from "@/components/form/FieldHeading";
import FormInput from '@/components/form/FormInput';
import handleApiError from '@/helpers/apiErrorHandler';
import PasswordField from "@/components/form/PasswordField";
import protectedApi from '@/helpers/axios';
import React from 'react';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import TimedError from '@/components/messsages/TimedError';
import { useJobsState } from "@/zustand/jobsStore";
import { useRouter } from 'expo-router';
import { useTokensStore, useUserStore } from '@/zustand/stores';
import { api } from '@/helpers/auth/axios';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for login form validation
const formSchema = zod.object({
  email_or_username: zod.string().min(1, 'Email/Username is required'),
  password: zod.string(),
  deviceName: zod.string(),
})

type FormData = zod.infer<typeof formSchema>


export default function SignIn() {
  // Local error key for TimedError
  const [errorKey, setErrorKey] = React.useState(0);
  // Device info for login
  const device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();
  // React Hook Form setup
  const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      email_or_username: '',
      password: '',
      deviceName: device
    },
    resolver: zodResolver(formSchema),
  })
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setTokens = useTokensStore((state) => state.setTokens);
  const formState = watch();
  const { setJobsState } = useJobsState();

  /**
   * Handles sign-in form submission.
   * On success, sets user/tokens in Zustand, fetches resume, and redirects.
   * On error, displays API error.
   */
  const signIn: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await api.post('/login/', data);
      setUser(response.data);
      setTokens({ refresh: response.data.token.refresh, access: response.data.token.access });
      const resumeState = await protectedApi.get('/jobs/resume/update_resume/');
      setJobsState(resumeState.data);
      router.replace('/');
    } catch (error) {
      handleApiError(error, setError);
      setErrorKey(prev => prev + 1);
    }
  };

  return (
    <AuthLayout title="Welcome Back" secondaryText="Sign in to your Account">
      <View>
        <FieldHeading>Email/Username</FieldHeading>
        <Controller
          control={control}
          name='email_or_username'
          render={({ field: { onChange, value } }) => (
            <FormInput
              placeholder="example@gmail.com"
              value={value}
              onChangeText={onChange}
            />
          )}
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
        <View style={styles.forgotPasswordView}>
          <SmallTextButton title={'Forgot password?'} onPress={() => router.push('/(auth)/forgot_password')} />
        </View>
      </View>
  {/* Error message for failed login */}
  <TimedError messageKey={errorKey} message={errors.root?.message || ''} />
      <DefaultButton
        title={'Sign In'}
        disabled={!(formState.email_or_username && formState.password)}
        loading={isSubmitting}
        onPress={handleSubmit(signIn)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#a6a6a6' }}>Don't have an account? </Text>
        <SmallTextButton
          underline={true}
          title={'Sign Up'}
          onPress={() => router.push('/(sign_up)/1')}
        />
      </View>
    </AuthLayout>
  )
}

// Styles for forgot password button
const styles = StyleSheet.create({
  forgotPasswordView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  }
})
