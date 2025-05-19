import Layout from '@/components/auth/Layout';
import OtpValidator from '@/components/form/OtpValidator';
import { useSelector } from 'react-redux';
import { RootState } from '@/appHelpers/store';
import { useChangeEmailSaveEmailMutation } from '@/helpers/profile/apiSlice';
import ErrorMessage from '@/components/messsages/Error';
import { useDispatch } from 'react-redux';
import { setUser } from '@/appHelpers/userSlice';
import React from 'react';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';


export default function VerifyCurrentEmail({ newEmail }: { newEmail: string }) {
	const email = useSelector((state: RootState) => state.user.email);
	const [changeEmailSaveEmail] = useChangeEmailSaveEmailMutation();
	const [error, setError] = React.useState('');
	const dispatch = useDispatch();
	const router = useRouter();

	async function saveEmail() {
		try {
			router.back();
			router.setParams({
				popUpVisible: 'true',
				title: 'Success',
				body: 'Your email address has been updated. Thank you for keeping your information current.'

			})
		}
		catch {
			setError('Something went wrong. Please try again');
		}
	}

	return (
		<Layout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<Button onPress={saveEmail} mode='contained'>
				Press
			</Button>
			<OtpValidator
				email={email ? email : ''}
				otpFor='new_email_verification'
				nextStep={() => { saveEmail() }}
			/>
			<ErrorMessage message={error} />
		</Layout>
	)
}
