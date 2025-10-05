import AuthLayout from '../Layout';
import { View } from 'react-native';
import FieldHeading from '@/components/form/FieldHeading';
import PasswordField from '@/components/form/PasswordField';
import React from 'react'
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import secureApi from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
	email: zod.string().email(),
	password: zod.string()
		.min(8, { message: 'Password must be at least 8 characters long' })
		.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
		.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
		.regex(/[0-9]/, { message: 'Password must contain at least one number' })
		.regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character (e.g., !, @, #)' }),
})

type FormData = zod.infer<typeof formSchema>;

export default function PasswordScreen({ email, setScreen }: { email: string, setScreen: React.Dispatch<React.SetStateAction<string>> }) {
	const { control, setError, watch, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
		defaultValues: {
			email: email,
			password: '',
		},
		resolver: zodResolver(formSchema),
	})

	const { password } = watch();
	const [confirmPass, setConfirmPass] = React.useState('');

	// states for taking care of errors in password
	const insufficientLength = password.length < 8;
	const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
	const noNumber = !/[0-9]/.test(password);
	const hasSC = !/[^A-Za-z0-9]/.test(password);

	function isFormValid() {
		return !insufficientLength && !casingError && !noNumber && !hasSC && password === confirmPass;
	}

	const savePassword: SubmitHandler<FormData> = async (data) => {
		await secureApi.put(`/forgot_password_save_password/${data.email}/`, {
			password: data.password
		}).then(() => {
			setScreen('success')
		}).catch(error => {
			handleApiError(error, setError)
		})
	}

	return (
		<AuthLayout
			title='Reset Password'
			secondaryText='Time to set your new password.'
		>
			<View>
				<FieldHeading>New Password</FieldHeading>
				<Controller
					control={control}
					name='password'
					render={({ field: { onChange, value } }) => (
						<PasswordField
							value={value}
							onChangeText={onChange}
						/>
					)}
				/>
				{
					!errors.root && password != '' && (<View style={{ marginTop: 8 }}>
						<ErrorMessage message='At least 8 characters' status={insufficientLength ? 'error' : 'success'} />
						<ErrorMessage message='Contains both uppercase and lowercase letters' status={casingError ? 'error' : 'success'} />
						<ErrorMessage message='Includes number' status={noNumber ? 'error' : 'success'} />
						<ErrorMessage message='Contains at least one special character (e.g., !, @, #)' status={hasSC ? 'error' : 'success'} />
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
					!errors.root && confirmPass != '' && (
						<View style={{ marginTop: 8 }}>
							<ErrorMessage
								message={password != confirmPass ? "Your passwords don't match" : 'Great! Your passwords match'}
								status={password != confirmPass ? 'error' : 'success'}
							/>
						</View>
					)
				}
				{
					errors.root?.message && (
						<View style={{ marginTop: 8 }}>
							<ErrorMessage message={errors.root.message} />
						</View>
					)
				}

			</View>
			<BlueButton
				title='Continue'
				disabled={!isFormValid()}
				loading={isSubmitting}
				onPress={handleSubmit(savePassword)}
			/>
		</AuthLayout>
	)
}
