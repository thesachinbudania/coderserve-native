import { StyleSheet, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import BlueButton from '@/components/buttons/BlueButton';
import NoBgButton from '@/components/buttons/NoBgButton';
import React from 'react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { api } from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  otp: zod.string().length(6, { message: 'OTP must be 6 digits' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  otp_for: zod.string(),
});

type FormData = zod.infer<typeof formSchema>;

export default function OtpValidator({ email, otpFor, nextStep }: { email: string, otpFor: string, nextStep: ({ refresh, access }: { refresh: string, access: string }) => void | (() => void) }) {
  const { control, setError, watch, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      otp: '',
      email: email,
      otp_for: otpFor,
    },
    resolver: zodResolver(formSchema),
  })

  const { otp } = watch();

  const verifyOtp: SubmitHandler<FormData> = async (data) => {
    await api.put('/otp_validator/', data).then(res => {
      nextStep({ refresh: res.data.token.refresh, access: res.data.token.access });
    }
    ).catch(error => {
      handleApiError(error, setError)
    })
  }

  // state to keep track of verify button blockage
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  React.useEffect(() => {
    if (otp.length === 6) {
      setIsButtonDisabled(false);
    }
    else {
      setIsButtonDisabled(true);
    }
  }, [otp]);

  // resend code timer function
  const [isResending, setIsResending] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(60);
  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  async function resendOtp() {
    setIsResending(true);
    await api.put('/resend_otp/', { email: email, otp_for: otpFor }).then(() => {
      setResendTimer(60);
      setIsResending(false);
    }).catch(error => {
      handleApiError(error, setError)
      setIsResending(false);
    })
  }

  return (
    <View
      style={{ gap: 48 }}
    >
      <Controller
        control={control}
        name='otp'
        render={({ field: { onChange } }) => (
          <>
            <View style={{ maxWidth: 350, alignSelf: 'center' }}>
              <OtpInput
                focusColor='#006dff'
                theme={{
                  pinCodeContainerStyle: styles.otpContainer,
                  pinCodeTextStyle: styles.otpText,
                }}
                onTextChange={(text) => onChange(text)}
              /></View>
            {
              errors.root?.message && (
                <Text style={styles.errorText}>{errors.root.message}</Text>
              )
            }
          </>
        )}
      />

      <View style={styles.buttonContainer}>
        <BlueButton
          title='Verify'
          disabled={isButtonDisabled}
          onPress={handleSubmit(verifyOtp)}
          loading={isSubmitting}
        />
        <NoBgButton
          title='Resend code'
          loading={isResending}
          onPress={resendOtp}
          disabled={resendTimer > 0}

        />
        {
          resendTimer > 0 && (
            <Text style={{ fontSize: 12 }}>Resend code will be available in {resendTimer} seconds</Text>
          )
        }
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  otpContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderColor: 'back',
  },
  otpText: {
    fontWeight: 'bold',
    fontSize: 27,
  },
  buttonContainer: {
    gap: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#ff4c4c',
    textAlign: 'center',
  }
})
