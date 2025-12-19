import Layout from '@/components/auth/Layout';
import OtpValidator from '@/components/form/OtpValidator';
import { useUserStore } from '@/zustand/stores';
import { useWizard } from 'react-use-wizard';

export default function VerifyCurrentEmail() {
	const email = useUserStore((state) => state.email);
	const wizard = useWizard();
	return (
		<Layout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				email={email ? email : ''}
				otpFor='change_email'
				nextStep={() => { wizard.nextStep() }}
			/>
		</Layout>
	)
}
