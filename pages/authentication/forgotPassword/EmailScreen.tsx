import { Text, View } from 'react-native';
import AuthLayout from '../Layout';
import FieldHeading from '../components/form/FieldHeading';
import FormInput from '../../../components/form/FormInput';
import React from 'react';
import BlueButton from '../../../components/buttons/BlueButton';
import { useSendForgotPasswordOtpMutation } from '../apiSlice';

export default function EmailScreen({ email, setEmail, setScreen }: { email: string, setEmail: React.Dispatch<React.SetStateAction<string>>, setScreen: React.Dispatch<React.SetStateAction<string>> }) {
	const [sendForgotPasswordOtp, { isLoading }] = useSendForgotPasswordOtpMutation();
	const [error, setError] = React.useState('');

	async function sendOtp() {
		try {
			await sendForgotPasswordOtp(email).unwrap();
			setScreen('otp');
		}
		catch (error: any) {
			if (error.data) {
				if (error.data.message) {
					setError(error.data.message)
				}
				else {
					setError(error.data);
				}
			}
			else {
				console.log(error)
				setError('Something went wrong. Please try again later');
			}
		}
	}

	return (
		<AuthLayout
			title='Forgot Password'
			secondaryText='Enter your registered email'
		>
			<View>
				<FieldHeading>Email</FieldHeading>
				<FormInput
					placeholder='example@gmail.com'
					value={email}
					onChangeText={setEmail}
				/>
			</View>
			{error != '' &&
				<Text style={{ color: '#ff4c4c', textAlign: 'center', fontSize: 13 }}>{error}</Text>
			}
			<BlueButton
				title='Continue'
				disabled={!email}
				loading={isLoading}
				onPress={sendOtp}
			/>
		</AuthLayout>
	)
}
