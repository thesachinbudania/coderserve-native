import OtpValidator from '@/components/form/OtpValidator';
import AuthLayout from '@/components/auth/Layout';
import { useStore } from '@/zustand/auth/stores';

export default function OtpScreen({ setScreen, email }: { setScreen: React.Dispatch<React.SetStateAction<string>>, email: string; }) {
	const { setStore } = useStore((state) => state);

	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		setStore({ refresh, access });
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
