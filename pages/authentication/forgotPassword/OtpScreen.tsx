import OtpValidator from '../components/form/OtpValidator';
import AuthLayout from '../Layout';
import { setTokenState } from '../signUp/signUpSlice';
import { useDispatch } from 'react-redux';

export default function OtpScreen({ setScreen, email }: { setScreen: React.Dispatch<React.SetStateAction<string>>, email: string; }) {
	const dispatch = useDispatch();

	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		dispatch(setTokenState({ refresh, access }));
		setScreen('password')
	}

	return (
		<AuthLayout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				nextStep={nextStep}
				email={email}
				otpFor='forgot_password'
			/>
		</AuthLayout>
	)
}
