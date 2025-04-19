import { ActivityIndicator, View } from 'react-native';
import { useSendForgotPasswordOtpMutation } from '../../../../authentication/apiSlice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../app/store';
import ErrorMessage from '../../../../../components/messsages/Error';
import { Wizard, useWizard } from 'react-use-wizard';
import Layout from '../../../../authentication/Layout';
import OtpValidator from '../../../../authentication/components/form/OtpValidator';
import PasswordScreen from '../../../../authentication/forgotPassword/PassswordScreen';
import { useNavigation, StackActions } from '@react-navigation/native';
import { NavigationProp } from '../../../Page';
import { setTokenState } from '../../../../authentication/signUp/signUpSlice';

function SendOtp() {
	const [sendForgotPasswordOtp, { isLoading }] = useSendForgotPasswordOtpMutation();
	const [error, setError] = React.useState('');
	const email = useSelector((state: RootState) => state.user.email);
	const wizard = useWizard();
	React.useEffect(() => {
		sendOtp();
	}, []);
	async function sendOtp() {
		try {
			await sendForgotPasswordOtp(email).unwrap();
			wizard.nextStep();
		}
		catch (error: any) {
			if (error.data) {
				if (error.data.message) {
					setError(error.data.message);
				}
				else {
					setError(error.data);
				}
			}
			else {
				setError('Something went wrong. Please try again later');
			}
		}
	}

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			{error != '' ?
				<ErrorMessage message={error} /> :
				<ActivityIndicator size='large' color='black' />
			}
		</View>
	);
}

function VerifyOtp() {
	const wizard = useWizard();
	const dispatch = useDispatch();
	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		dispatch(setTokenState({ refresh, access }));
		wizard.nextStep();
	}
	return (
		<Layout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				otpFor='forgot_password'
				email={useSelector((state: RootState) => state.user.email) || ''}
				nextStep={nextStep}
			/>
		</Layout>
	);
}

export default function ForgotPassword() {
	const [screen, setScreen] = React.useState('email');
	const email = useSelector((state: RootState) => state.user.email) || '';
	const navigation = useNavigation<NavigationProp>();
	React.useEffect(() => {
		if (screen === 'success') {
			const navigateAction = StackActions.replace('AccountCenter', {
				screen: 'Home',
				params: {
					popUpVisible: true,
					title: "You're All Set!",
					body: "Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team."
				}
			});
			navigation.dispatch(navigateAction)

		}
	}, [screen])

	return (
		<Wizard>
			<SendOtp />
			<VerifyOtp />
			<PasswordScreen email={email} setScreen={setScreen} />
		</Wizard>
	);
}
