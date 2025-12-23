import OtpValidator from '@/components/form/OtpValidator';
import AuthLayout from '@/components/auth/Layout';
import { useStore } from '@/zustand/auth/stores';
import { useTokensStore } from '@/zustand/stores';
import syncUser from '@/helpers/general/syncUser';

export default function OtpScreen({ setScreen, email }: { setScreen: React.Dispatch<React.SetStateAction<string>>, email: string; }) {
	const { setStore } = useStore((state) => state);
	const { setTokens } = useTokensStore((state) => state);

	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		setTokens({ refresh, access });
		setStore({ refresh, access });
		setScreen('password')
		syncUser();
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
