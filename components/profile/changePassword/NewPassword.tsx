import Layout from '@/components/auth/Layout';
import FieldHeading from '@/components/form/FieldHeading';
import PasswordField from '@/components/form/PasswordField';
import { View } from 'react-native';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import { useUserStore } from '@/zustand/stores';
import { useTokensStore } from '@/zustand/stores';
import protectedApi from '@/helpers/axios';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { popUpStore } from '@/zustand/accountCentre';
import { useRouter } from 'expo-router';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  email: zod.string().email('Something went wrong on our side! Please report the porblem to support.'),
  current_password: zod.string(),
  new_password: zod.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character (e.g., !, @, #)' })
    .regex(/^(?!.*\b(first_name)\b).+$/i, { message: "Don't use your name in the password" }),
})

type FormData = zod.infer<typeof formSchema>


export default function NewPasswordScreen({ currentPassword }: { currentPassword: string }) {
  const { email, first_name } = useUserStore();
  const { handleSubmit, watch, setError: setFormError, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      email: email || '',
      current_password: currentPassword,
      new_password: ''
    },
    resolver: zodResolver(formSchema)
  })
  const { setTokens } = useTokensStore(state => state)
  const { setPopUp } = popUpStore(state => state)
  const { new_password: password } = watch();
  const [confirmPass, setConfirmPass] = React.useState('');
  // states for taking care of errors in password
  const insufficientLength = password.length < 8;
  const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
  const noNumber = !/[0-9]/.test(password);
  const hasSC = !/[^A-Za-z0-9]/.test(password);
  const containsName = password.toLowerCase().includes(first_name?.toLowerCase() || '');

  const [error, setError] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    setError('');
  }, [password, confirmPass]);

  function isFormValid() {
    return !insufficientLength && !casingError && !noNumber && !hasSC && !containsName && password === confirmPass;
  }

  const savePassword: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/change_password/', data).then((response) => {
      const access = response.data.access_token;
      const refresh = response.data.refresh_token;
      setTokens({ access, refresh });
      setPopUp({
        visible: true,
        title: "You're all set!",
        body: "Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team.",
      })
      router.back();
    }).catch((error) => {
      handleApiError(error, setFormError)
    })
  }

  return (
    <Layout
      title='Reset Password'
      secondaryText='Time to set your new password'
    >
      <View>
        <FieldHeading>New Password</FieldHeading>
        <Controller
          control={control}
          name='new_password'
          render={({ field: { value, onChange } }) => (
            <PasswordField
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {
          password != '' && error === '' && (<View style={{ marginTop: 8 }}>
            <ErrorMessage message='At least 8 characters' status={insufficientLength ? 'error' : 'success'} />
            <ErrorMessage message='Contains both uppercase and lowercase letters' status={casingError ? 'error' : 'success'} />
            <ErrorMessage message='Includes number' status={noNumber ? 'error' : 'success'} />
            <ErrorMessage message='Contains at least one special character (e.g., !, @, #)' status={hasSC ? 'error' : 'success'} />
            <ErrorMessage message="Don't use your name in the password" status={containsName ? 'error' : 'success'} />
          </View>

          )
        }
      </View>
      <View>
        <FieldHeading>Re-enter New Password</FieldHeading>
        <PasswordField
          value={confirmPass}
          onChangeText={setConfirmPass}
        />
        {
          confirmPass != '' && error === '' && (
            <View style={{ marginTop: 8 }}>
              <ErrorMessage
                message={password != confirmPass ? "Your passwords don't match" : 'Great! Your passwords match'}
                status={password != confirmPass ? 'error' : 'success'}
              />
            </View>
          )
        }
        {
          error != '' && (
            <View style={{ marginTop: 8 }}>
              <ErrorMessage message={error} />
            </View>
          )
        }
        {errors.root?.message && (
          <View style={{ marginTop: 8 }}>
            <ErrorMessage message={errors.root.message} />
          </View>
        )}
      </View>
      <BlueButton
        title='Save'
        disabled={!isFormValid()}
        loading={isSubmitting}
        onPress={handleSubmit(savePassword)}
      />
    </Layout>
  )
}
