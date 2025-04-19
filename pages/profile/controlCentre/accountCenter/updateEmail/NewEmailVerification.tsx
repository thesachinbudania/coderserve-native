import Layout from '../../../../authentication/Layout';
import OtpValidator from '../../../../authentication/components/form/OtpValidator';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useChangeEmailSaveEmailMutation } from '../../../apiSlice';
import ErrorMessage from '../../../../../components/messsages/Error';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../../app/userSlice';
import React from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import type { NavigationProp } from '../../../Page';


export default function VerifyCurrentEmail({ newEmail }: { newEmail: string }) {
	const email = useSelector((state: RootState) => state.user.email);
	const [changeEmailSaveEmail] = useChangeEmailSaveEmailMutation();
	const [error, setError] = React.useState('');
	const dispatch = useDispatch();
	const navigation = useNavigation<NavigationProp>();

	async function saveEmail() {
		try {
			await changeEmailSaveEmail({ email }).unwrap();
			dispatch(setUser({ email: newEmail }));
			const popBackAction = StackActions.replace('AccountCenter', {
				screen: 'Home',
				params: {
					popUpVisible: true,
					title: 'Success',
					body: 'Your email address has been updated. Thank you for keeping your information current.'
				}
			})
			navigation.dispatch(popBackAction)
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
			<OtpValidator
				email={email ? email : ''}
				otpFor='new_email_verification'
				nextStep={() => { saveEmail() }}
			/>
			<ErrorMessage message={error} />
		</Layout>
	)
}
