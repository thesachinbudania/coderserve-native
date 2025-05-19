import AuthLayout from '@/components/auth/Layout';
import PasswordField from "@/components/form/PasswordField";
import FieldHeading from "@/components/form/FieldHeading";
import { View, StyleSheet, Text } from 'react-native';
import DefaultButton from '@/components/buttons/DefaultButton';
import React from 'react';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import FormInput from '@/components/form/FormInput';
import TimedError from '@/components/messsages/TimedError';
import { useUserStore, useTokensStore } from '@/zustand/stores';
import DeviceInfo from 'react-native-device-info';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { api } from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
	email_or_username: zod.string().min(1, 'Email/Username is required'),
	password: zod.string(),
	deviceName: zod.string(),
})

type FormData = zod.infer<typeof formSchema>


export default function SignIn() {
	const [errorKey, setErrorKey] = React.useState(0);
	const device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();
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

	const signIn: SubmitHandler<FormData> = async (data) => {
		await api.post('/login/', data).then((response) => {
			const data = response.data
			setUser({
				username: data.username,
				email: data.email,
				first_name: data.first_name,
				last_name: data.last_name,
				profile_image: data.profile_image,
				background_pattern_code: data.background_pattern_code,
				background_type: data.background_type,
				background_image: data.background_image,
				country: data.country,
				city: data.city,
				state: data.state,
				date_joined: data.date_joined,
				gitHub: data.gitHub,
				dobDate: data.dobDate,
				dobMonth: data.dobMonth,
				dobYear: data.dobYear,
				website: data.website,
				mobileCountryCode: data.mobileCountryCode,
				mobileNumber: data.mobileNumber,
				whatsappCountryCode: data.whatsappCountryCode,
				whatsappNumber: data.whatsappNumber
			})
			setTokens({ refresh: data.token.refresh, access: data.token.access });
			router.replace('/')
		}).catch(error => {
			handleApiError(error, setError)
		})
	}

	return (
		<AuthLayout title="Welcome back" secondaryText="Sign in to your account">
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
			<TimedError messageKey={errorKey} message={errors.root?.message || ''} />
			<DefaultButton
				title={'Sign In'}
				disabled={!(formState.email_or_username && formState.password)}
				loading={isSubmitting}
				onPress={handleSubmit(signIn)}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ fontSize: 13, color: '#737373' }}>Don't have an account? </Text>
				<SmallTextButton
					underline={true}
					title={'Sign Up'}
					onPress={() => router.push('/(sign_up)/1')}
				/>
			</View>
		</AuthLayout>
	)
}

const styles = StyleSheet.create({
	forgotPasswordView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 8,
	}
})
