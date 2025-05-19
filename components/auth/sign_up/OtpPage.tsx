import AuthLayout from '@/components/auth/Layout';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import OtpValidator from '@/components/form/OtpValidator';
import { useStore } from '@/zustand/auth/stores';



export default function OtpPage() {
	const wizard = useWizard();
	const { email, setStore } = useStore(state => state);

	function nextStep({ refresh, access }: { refresh: string, access: string }) {
		console.log(refresh, access)
		setStore({ refresh, access });
		wizard.nextStep();
	}
	return (
		<AuthLayout
			title='Verify Your Email'
			secondaryText="We've sent a verification code to your email"
		>
			<OtpValidator
				email={email ? email : 'null'}
				otpFor='account_verification'
				nextStep={nextStep}
			/>
		</AuthLayout>
	)
}


