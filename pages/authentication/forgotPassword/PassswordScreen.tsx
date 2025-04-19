import AuthLayout from '../Layout';
import { View } from 'react-native';
import FieldHeading from '../components/form/FieldHeading';
import PasswordField from '../../../components/form/PasswordField';
import React from 'react'
import BlueButton from '../../../components/buttons/BlueButton';
import ErrorMessage from '../../../components/messsages/Error';
import { useSaveNewPasswordMutation } from '../apiSlice';

export default function PasswordScreen({ email, setScreen }: { email: string, setScreen: React.Dispatch<React.SetStateAction<string>> }) {
	const [password, setPassword] = React.useState('');
	const [confirmPass, setConfirmPass] = React.useState('');

	// states for taking care of errors in password
	const insufficientLength = password.length < 8;
	const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
	const noNumber = !/[0-9]/.test(password);
	const hasSC = !/[^A-Za-z0-9]/.test(password);

	const [savePassword, { isLoading }] = useSaveNewPasswordMutation();

	const [error, setError] = React.useState('');

	React.useEffect(() => {
		setError('');
	}, [password, confirmPass])

	function isFormValid() {
		return !insufficientLength && !casingError && !noNumber && !hasSC && password === confirmPass;
	}

	async function submit() {
		const data = {
			email: email,
			password: password,
		}
		try {
			await savePassword(data).unwrap();
			setScreen('success')
		}
		catch (error: any) {
			setError('Something went wrong! Please try again.')
		}
	}
	return (
		<AuthLayout
			title='Reset Password'
			secondaryText='Time to set your new password.'
		>
			<View>
				<FieldHeading>New Password</FieldHeading>
				<PasswordField
					value={password}
					onChangeText={setPassword}
				/>				{
					error === '' && password != '' && (<View style={{ marginTop: 8 }}>
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
					error === '' && confirmPass != '' && (
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

			</View>
			<BlueButton
				title='Continue'
				disabled={!isFormValid()}
				loading={isLoading}
				onPress={submit}
			/>
		</AuthLayout>
	)
}
